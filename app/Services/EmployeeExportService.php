<?php

namespace App\Services;

use App\Models\School;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class EmployeeExportService
{
    /**
     * Generate an Excel spreadsheet rekap for employees with high performance.
     * Generates a temporary .xlsx file and returns a BinaryFileResponse with deleteFileAfterSend.
     *
     * @param array $filters Query filters (school_id, status_pegawai, search)
     * @param School|null $forcedSchool If provided, locks export to this school
     * @return BinaryFileResponse
     */
    public function export(array $filters = [], ?School $forcedSchool = null): BinaryFileResponse
    {
        // Tingkatkan memori dan execution time untuk menangani rekap se-KBB
        @ini_set('memory_limit', '1024M');
        @set_time_limit(300);

        // 1. Tentukan Sekolah Terpilih jika ada
        $selectedSchool = $forcedSchool;
        if (!$selectedSchool && !empty($filters['school_id'])) {
            $selectedSchool = School::find($filters['school_id']);
        }

        // 2. Query Data Utama Menggunakan DB Query Builder (100x Lebih Cepat & Hemat Memori)
        $query = DB::table('employees')
            ->leftJoin('schools', 'employees.school_id', '=', 'schools.id')
            ->select([
                'employees.id',
                'employees.school_id',
                'employees.name',
                'employees.nip',
                'employees.status_pegawai',
                'employees.place_of_birth',
                'employees.date_of_birth',
                'employees.contact',
                'employees.address',
                'employees.cpns_date',
                'employees.pns_date',
                'schools.name as school_name',
                'schools.npsn as school_npsn',
            ])
            ->whereNull('employees.deleted_at');

        if ($selectedSchool) {
            $query->where('employees.school_id', $selectedSchool->id);
        }

        if (!empty($filters['status_pegawai'])) {
            $query->where('employees.status_pegawai', $filters['status_pegawai']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('employees.name', 'like', "%{$search}%")
                  ->orWhere('employees.nip', 'like', "%{$search}%")
                  ->orWhere('schools.name', 'like', "%{$search}%");
            });
        }

        $employees = $query->orderBy('employees.school_id', 'asc')
                           ->orderBy('employees.name', 'asc')
                           ->get();

        $totalEmployees = $employees->count();

        // 3. Ambil Riwayat Jabatan Terakhir & Pendidikan Terakhir Secara Efisien (Key-By Employee ID)
        $empIds = $employees->pluck('id')->filter()->all();

        $latestJobsQuery = DB::table('employee_job_histories')
            ->orderBy('is_active', 'desc')
            ->orderBy('id', 'desc');

        $latestEdusQuery = DB::table('employee_educations')
            ->orderBy('tahun_lulus', 'desc')
            ->orderBy('id', 'desc');

        if ($selectedSchool && !empty($empIds)) {
            $latestJobsQuery->whereIn('employee_id', $empIds);
            $latestEdusQuery->whereIn('employee_id', $empIds);
        }

        $latestJobs = $latestJobsQuery->get()
            ->groupBy('employee_id')
            ->map(fn($group) => $group->first());

        $latestEdus = $latestEdusQuery->get()
            ->groupBy('employee_id')
            ->map(fn($group) => $group->first());

        // 4. Inisialisasi Spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Rekap Pegawai');

        // Document Metadata
        $spreadsheet->getProperties()
            ->setCreator('SIKATAR - Dinas Pendidikan Kabupaten Bandung Barat')
            ->setLastModifiedBy('SIKATAR')
            ->setTitle('Rekapitulasi Data Kepegawaian')
            ->setSubject('Data Kepegawaian');

        // 5. Kop Dokumen
        $sheet->setCellValue('A1', 'PEMERINTAH KABUPATEN BANDUNG BARAT');
        $sheet->setCellValue('A2', 'DINAS PENDIDIKAN - SISTEM INFORMASI KEPEGAWAIAN (SIKATAR)');
        $sheet->setCellValue('A3', 'REKAPITULASI DATA PROFIL KEPEGAWAIAN');

        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(13)->getColor()->setRGB('18181B');
        $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(11)->getColor()->setRGB('52525B');
        $sheet->getStyle('A3')->getFont()->setBold(true)->setSize(12)->getColor()->setRGB('09090B');

        // Info Metadata Baris Atas
        $schoolTitle = $selectedSchool 
            ? "{$selectedSchool->name} (NPSN: " . ($selectedSchool->npsn ?: '-') . ")" 
            : "Seluruh Sekolah di Lingkungan Kabupaten Bandung Barat";

        $statusTitle = !empty($filters['status_pegawai']) 
            ? $filters['status_pegawai'] 
            : "Semua Status (PNS, CPNS, PPPK, Honorer)";

        $downloadDate = Carbon::now('Asia/Jakarta')->translatedFormat('d F Y, H:i') . ' WIB';

        $sheet->setCellValue('A5', 'Unit Kerja / Sekolah :');
        $sheet->setCellValue('B5', $schoolTitle);
        $sheet->setCellValue('A6', 'Filter Status        :');
        $sheet->setCellValue('B6', $statusTitle);
        $sheet->setCellValue('A7', 'Waktu Pengunduhan    :');
        $sheet->setCellValue('B7', $downloadDate);
        $sheet->setCellValue('A8', 'Total Data Pegawai   :');
        $sheet->setCellValue('B8', $totalEmployees . ' Orang');

        $sheet->getStyle('A5:A8')->getFont()->setBold(true)->setSize(9)->getColor()->setRGB('71717A');
        $sheet->getStyle('B5:B8')->getFont()->setBold(true)->setSize(9)->getColor()->setRGB('18181B');

        // 6. Header Kolom Tabel
        $headerTitles = [
            'NO',
            'NAMA LENGKAP',
            'NIP / NI PPPK',
            'STATUS KEPEGAWAIAN',
            'UNIT KERJA / SEKOLAH',
            'NPSN',
            'JABATAN TERAKHIR',
            'PANGKAT / GOLONGAN',
            'PENDIDIKAN TERAKHIR',
            'TEMPAT LAHIR',
            'TANGGAL LAHIR',
            'USIA',
            'NO. KONTAK / HP',
            'ALAMAT LENGKAP',
            'TMT CPNS',
            'TMT PNS',
        ];

        $sheet->fromArray($headerTitles, null, 'A10');

        $sheet->getStyle('A10:P10')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 10,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '18181B'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '27272A'],
                ],
            ],
        ]);
        $sheet->getRowDimension(10)->setRowHeight(28);

        // 7. Format Rows Cepat
        $rowsData = [];
        $counter = 1;
        $nowYear = (int) date('Y');

        foreach ($employees as $emp) {
            $job = $latestJobs->get($emp->id);
            $edu = $latestEdus->get($emp->id);

            $jabatan = ($job && !empty($job->jabatan)) ? $job->jabatan : '-';
            $pangkat = ($job && !empty($job->pangkat_golongan)) ? $job->pangkat_golongan : '-';

            $eduStr = '-';
            if ($edu) {
                $eduParts = [];
                if (!empty($edu->jenjang) && $edu->jenjang !== 'null') $eduParts[] = $edu->jenjang;
                if (!empty($edu->jurusan) && $edu->jurusan !== 'null') $eduParts[] = $edu->jurusan;
                $eduStr = !empty($eduParts) ? implode(' - ', $eduParts) : '-';
            }

            $tglLahir = $emp->date_of_birth ? date('d-m-Y', strtotime($emp->date_of_birth)) : '-';
            $usia = '-';
            if ($emp->date_of_birth) {
                $birthYear = (int) substr($emp->date_of_birth, 0, 4);
                if ($birthYear > 1900) {
                    $usia = ($nowYear - $birthYear) . ' Thn';
                }
            }

            $tmtCpns = ($emp->cpns_date && $emp->cpns_date !== '1900-01-01' && $emp->cpns_date > '1950-01-01') ? date('d-m-Y', strtotime($emp->cpns_date)) : '-';
            $tmtPns = ($emp->pns_date && $emp->pns_date !== '1900-01-01' && $emp->pns_date > '1950-01-01') ? date('d-m-Y', strtotime($emp->pns_date)) : '-';

            // Prefix string spasi tipis agar Excel mendeteksi sebagai Text murni tanpa notasi ilmiah
            $nipStr = $emp->nip ? " " . $emp->nip : '-';
            $npsnStr = $emp->school_npsn ? " " . $emp->school_npsn : '-';
            $contactStr = $emp->contact ? " " . $emp->contact : '-';

            $rowsData[] = [
                $counter++,
                $emp->name,
                $nipStr,
                $emp->status_pegawai ?: '-',
                $emp->school_name ?? '-',
                $npsnStr,
                $jabatan,
                $pangkat,
                $eduStr,
                $emp->place_of_birth ?: '-',
                $tglLahir,
                $usia,
                $contactStr,
                $emp->address ?: '-',
                $tmtCpns,
                $tmtPns,
            ];
        }

        if (!empty($rowsData)) {
            $sheet->fromArray($rowsData, null, 'A11');
        }

        $lastRow = max(10 + count($rowsData), 10);

        // 8. Terapkan Borders & Alignment Sekaligus
        if ($lastRow >= 11) {
            $sheet->getStyle("A11:P{$lastRow}")->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'E2E8F0'],
                    ],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ]);

            $sheet->getStyle("A11:A{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("B11:B{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $sheet->getStyle("B11:B{$lastRow}")->getFont()->setBold(true);
            $sheet->getStyle("C11:D{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("E11:E{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $sheet->getStyle("F11:F{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("G11:G{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $sheet->getStyle("H11:H{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("I11:J{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $sheet->getStyle("K11:M{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("N11:N{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $sheet->getStyle("O11:P{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        }

        // 9. Lebar Kolom Tetap (Cepat)
        $columnWidths = [
            'A' => 7,
            'B' => 32,
            'C' => 24,
            'D' => 18,
            'E' => 34,
            'F' => 14,
            'G' => 28,
            'H' => 20,
            'I' => 36,
            'J' => 20,
            'K' => 16,
            'L' => 10,
            'M' => 18,
            'N' => 36,
            'O' => 16,
            'P' => 16,
        ];
        foreach ($columnWidths as $col => $width) {
            $sheet->getColumnDimension($col)->setWidth($width);
        }

        $sheet->freezePane('A11');
        $sheet->setAutoFilter("A10:P{$lastRow}");

        // 10. Simpan ke Temporary File dan Download secara Utuh (BinaryFileResponse)
        $schoolSlug = $selectedSchool ? Str::slug($selectedSchool->name) : 'Semua_Sekolah_KBB';
        $statusSlug = !empty($filters['status_pegawai']) ? '_' . $filters['status_pegawai'] : '';
        $timestamp = date('Ymd_His');
        $filename = "Rekap_Kepegawaian_{$schoolSlug}{$statusSlug}_{$timestamp}.xlsx";

        $tempFile = tempnam(sys_get_temp_dir(), 'sikatar_xlsx_');
        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ])->deleteFileAfterSend(true);
    }
}
