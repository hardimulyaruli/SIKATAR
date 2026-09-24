<?php

namespace App\Services;

use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DukService
{
    /**
     * Map Kode Golongan ke Nama Pangkat Resmi PNS BKN
     */
    public static function getPangkatNama(?string $golongan): string
    {
        if (empty($golongan)) return '-';
        $clean = trim($golongan);

        $map = [
            'IV/e' => 'Pembina Utama, IV/e',
            'IV/d' => 'Pembina Utama Madya, IV/d',
            'IV/c' => 'Pembina Utama Muda, IV/c',
            'IV/b' => 'Pembina Tk.I, IV/b',
            'IV/a' => 'Pembina, IV/a',
            'III/d' => 'Penata Tk.I, III/d',
            'III/c' => 'Penata, III/c',
            'III/b' => 'Penata Muda Tk.I, III/b',
            'III/a' => 'Penata Muda, III/a',
            'II/d'  => 'Pengatur Tk.I, II/d',
            'II/c'  => 'Pengatur, II/c',
            'II/b'  => 'Pengatur Muda Tk.I, II/b',
            'II/a'  => 'Pengatur Muda, II/a',
            'I/d'   => 'Juru Tk.I, I/d',
            'I/c'   => 'Juru, I/c',
            'I/b'   => 'Juru Muda Tk.I, I/b',
            'I/a'   => 'Juru Muda, I/a',
        ];

        return $map[$clean] ?? $clean;
    }

    /**
     * Bobot hierarki Golongan Ruang BKN (semakin besar semakin tinggi)
     */
    public static function getGolonganWeight(?string $golongan): int
    {
        if (empty($golongan)) return 0;
        $clean = trim($golongan);

        $weights = [
            'IV/e' => 17,
            'IV/d' => 16,
            'IV/c' => 15,
            'IV/b' => 14,
            'IV/a' => 13,
            'III/d' => 12,
            'III/c' => 11,
            'III/b' => 10,
            'III/a' => 9,
            'II/d'  => 8,
            'II/c'  => 7,
            'II/b'  => 6,
            'II/a'  => 5,
            'I/d'   => 4,
            'I/c'   => 3,
            'I/b'   => 2,
            'I/a'   => 1,
        ];

        return $weights[$clean] ?? 0;
    }

    /**
     * Hitung Masa Kerja dari TMT CPNS sampai sekarang
     */
    public static function calculateMasaKerja(?string $cpnsDate): array
    {
        if (empty($cpnsDate) || $cpnsDate === '1900-01-01' || $cpnsDate < '1950-01-01') {
            return ['years' => 0, 'months' => 0, 'formatted' => 'M.K: 0 Thn 0 Bln'];
        }

        try {
            $startDate = Carbon::parse($cpnsDate);
            $now = Carbon::now();
            if ($startDate->isFuture()) {
                return ['years' => 0, 'months' => 0, 'formatted' => 'M.K: 0 Thn 0 Bln'];
            }
            $diff = $startDate->diff($now);
            $years = $diff->y;
            $months = $diff->m;
            return [
                'years' => $years,
                'months' => $months,
                'formatted' => "M.K: {$years} Thn {$months} Bln"
            ];
        } catch (\Exception $e) {
            return ['years' => 0, 'months' => 0, 'formatted' => 'M.K: 0 Thn 0 Bln'];
        }
    }

    /**
     * Hitung Usia dari Tanggal Lahir
     */
    public static function calculateUsia(?string $dob): array
    {
        if (empty($dob) || $dob === '1900-01-01' || $dob < '1920-01-01') {
            return ['age' => 0, 'formatted' => 'Usia: -'];
        }

        try {
            $birth = Carbon::parse($dob);
            $age = $birth->age;
            return [
                'age' => $age,
                'formatted' => "Usia: {$age} Tahun"
            ];
        } catch (\Exception $e) {
            return ['age' => 0, 'formatted' => 'Usia: -'];
        }
    }

    /**
     * Reset / Hitung ulang urutan DUK resmi berdasarkan aturan BKN
     */
    public function resetBknOrder(?int $schoolId = null): void
    {
        @ini_set('memory_limit', '1024M');
        @set_time_limit(300);

        $query = DB::table('employees')
            ->select('employees.id', 'employees.nip', 'employees.name', 'employees.cpns_date', 'employees.date_of_birth')
            ->where('employees.status_pegawai', 'PNS')
            ->whereNull('employees.deleted_at');

        if ($schoolId) {
            $query->where('employees.school_id', $schoolId);
        }

        $pnsEmployees = $query->get();
        if ($pnsEmployees->isEmpty()) return;

        $empIds = $pnsEmployees->pluck('id')->all();

        // Ambil riwayat jabatan terbaru per pegawai
        $jobs = DB::table('employee_job_histories')
            ->whereIn('employee_id', $empIds)
            ->orderBy('is_active', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->groupBy('employee_id')
            ->map(fn($g) => $g->first());

        // Ambil pendidikan terbaru per pegawai
        $edus = DB::table('employee_educations')
            ->whereIn('employee_id', $empIds)
            ->orderBy('tahun_lulus', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->groupBy('employee_id')
            ->map(fn($g) => $g->first());

        $eduWeightMap = [
            'S3' => 8,
            'S2' => 7,
            'S1' => 6,
            'D4' => 6,
            'D3' => 5,
            'D2' => 4,
            'D1' => 3,
            'SMA' => 2,
            'SMP' => 1,
            'SD'  => 0,
        ];

        // Sort collection strictly by BKN Seniority Rules
        $sorted = $pnsEmployees->sort(function ($a, $b) use ($jobs, $edus, $eduWeightMap) {
            $jobA = $jobs->get($a->id);
            $jobB = $jobs->get($b->id);

            // 1. Bobot Golongan (Tertinggi lebih dulu)
            $golA = self::getGolonganWeight($jobA->pangkat_golongan ?? null);
            $golB = self::getGolonganWeight($jobB->pangkat_golongan ?? null);
            if ($golA !== $golB) {
                return $golB <=> $golA;
            }

            // 2. TMT Golongan (Terlama / Lebih awal lebih dulu)
            $tmtA = ($jobA && !empty($jobA->tanggal_mulai) && $jobA->tanggal_mulai > '1950-01-01') ? $jobA->tanggal_mulai : '9999-12-31';
            $tmtB = ($jobB && !empty($jobB->tanggal_mulai) && $jobB->tanggal_mulai > '1950-01-01') ? $jobB->tanggal_mulai : '9999-12-31';
            if ($tmtA !== $tmtB) {
                return strcmp($tmtA, $tmtB);
            }

            // 3. TMT CPNS (Terlama / Lebih awal lebih dulu)
            $cpnsA = ($a->cpns_date && $a->cpns_date > '1950-01-01') ? $a->cpns_date : '9999-12-31';
            $cpnsB = ($b->cpns_date && $b->cpns_date > '1950-01-01') ? $b->cpns_date : '9999-12-31';
            if ($cpnsA !== $cpnsB) {
                return strcmp($cpnsA, $cpnsB);
            }

            // 4. Jenjang Pendidikan (Tertinggi lebih dulu)
            $eduA = $edus->get($a->id);
            $eduB = $edus->get($b->id);
            $wEduA = 0;
            $wEduB = 0;
            if ($eduA && !empty($eduA->jenjang)) {
                foreach ($eduWeightMap as $k => $w) {
                    if (stripos($eduA->jenjang, $k) !== false) { $wEduA = $w; break; }
                }
            }
            if ($eduB && !empty($eduB->jenjang)) {
                foreach ($eduWeightMap as $k => $w) {
                    if (stripos($eduB->jenjang, $k) !== false) { $wEduB = $w; break; }
                }
            }
            if ($wEduA !== $wEduB) {
                return $wEduB <=> $wEduA;
            }

            // 5. Usia / Tanggal Lahir (Tertua lebih dulu)
            $dobA = ($a->date_of_birth && $a->date_of_birth > '1920-01-01') ? $a->date_of_birth : '9999-12-31';
            $dobB = ($b->date_of_birth && $b->date_of_birth > '1920-01-01') ? $b->date_of_birth : '9999-12-31';
            if ($dobA !== $dobB) {
                return strcmp($dobA, $dobB);
            }

            return strcmp($a->name, $b->name);
        })->values();

        // Update duk_order secara batch dalam satu database transaction
        DB::transaction(function () use ($sorted) {
            $order = 1;
            foreach ($sorted as $item) {
                DB::table('employees')->where('id', $item->id)->update(['duk_order' => $order++]);
            }
        });
    }

    /**
     * Tukar urutan DUK (Naik atau Turun)
     */
    public function swapOrder(int $employeeId, string $direction, ?int $schoolId = null): bool
    {
        $current = DB::table('employees')
            ->where('id', $employeeId)
            ->where('status_pegawai', 'PNS')
            ->first();

        if (!$current) return false;

        // Jika duk_order masih null, pastikan resetBknOrder sudah diinisialisasi
        if ($current->duk_order === null) {
            $this->resetBknOrder($schoolId);
            $current = DB::table('employees')->where('id', $employeeId)->first();
            if (!$current || $current->duk_order === null) return false;
        }

        $query = DB::table('employees')
            ->where('status_pegawai', 'PNS')
            ->whereNull('deleted_at');

        if ($schoolId) {
            $query->where('school_id', $schoolId);
        }

        if ($direction === 'up') {
            $target = $query->where('duk_order', '<', $current->duk_order)
                ->orderBy('duk_order', 'desc')
                ->first();
        } else {
            $target = $query->where('duk_order', '>', $current->duk_order)
                ->orderBy('duk_order', 'asc')
                ->first();
        }

        if (!$target) return false;

        $tempOrder = $current->duk_order;
        DB::table('employees')->where('id', $current->id)->update(['duk_order' => $target->duk_order]);
        DB::table('employees')->where('id', $target->id)->update(['duk_order' => $tempOrder]);

        return true;
    }

    /**
     * Unduh Rekap DUK PNS ke format Excel (.xlsx)
     */
    public function exportExcel(array $filters = [], ?int $schoolId = null): BinaryFileResponse
    {
        @ini_set('memory_limit', '1024M');
        @set_time_limit(300);

        // Jika ada duk_order yang masih null, inisialisasi urutan BKN
        $hasNullDuk = DB::table('employees')->where('status_pegawai', 'PNS')->whereNull('duk_order')->exists();
        if ($hasNullDuk) {
            $this->resetBknOrder($schoolId);
        }

        $query = DB::table('employees')
            ->leftJoin('schools', 'employees.school_id', '=', 'schools.id')
            ->select([
                'employees.id',
                'employees.name',
                'employees.nip',
                'employees.place_of_birth',
                'employees.date_of_birth',
                'employees.cpns_date',
                'employees.pns_date',
                'employees.duk_order',
                'schools.name as school_name',
            ])
            ->where('employees.status_pegawai', 'PNS')
            ->whereNull('employees.deleted_at');

        if ($schoolId) {
            $query->where('employees.school_id', $schoolId);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('employees.name', 'like', "%{$search}%")
                  ->orWhere('employees.nip', 'like', "%{$search}%")
                  ->orWhere('schools.name', 'like', "%{$search}%");
            });
        }

        $employees = $query->orderBy('employees.duk_order', 'asc')
                           ->orderBy('employees.id', 'asc')
                           ->get();

        $empIds = $employees->pluck('id')->all();

        $jobs = DB::table('employee_job_histories')
            ->whereIn('employee_id', $empIds)
            ->orderBy('is_active', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->groupBy('employee_id')
            ->map(fn($g) => $g->first());

        $edus = DB::table('employee_educations')
            ->whereIn('employee_id', $empIds)
            ->orderBy('tahun_lulus', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->groupBy('employee_id')
            ->map(fn($g) => $g->first());

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('DUK PNS');

        // Document Properties
        $spreadsheet->getProperties()
            ->setCreator('SIKATAR - Dinas Pendidikan Kabupaten Bandung Barat')
            ->setTitle('Daftar Urut Kepangkatan (DUK) PNS')
            ->setSubject('DUK PNS');

        // Kop Laporan
        $sheet->setCellValue('A1', 'PEMERINTAH KABUPATEN BANDUNG BARAT');
        $sheet->setCellValue('A2', 'DINAS PENDIDIKAN - SISTEM INFORMASI KEPEGAWAIAN (SIKATAR)');
        $sheet->setCellValue('A3', 'DAFTAR URUT KEPANGKATAN (DUK) PEGAWAI NEGERI SIPIL (PNS)');

        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(13)->getColor()->setRGB('18181B');
        $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(11)->getColor()->setRGB('52525B');
        $sheet->getStyle('A3')->getFont()->setBold(true)->setSize(12)->getColor()->setRGB('09090B');

        $downloadDate = Carbon::now('Asia/Jakarta')->translatedFormat('d F Y, H:i') . ' WIB';
        $sheet->setCellValue('A5', 'Waktu Pengunduhan :');
        $sheet->setCellValue('B5', $downloadDate);
        $sheet->setCellValue('A6', 'Total Pegawai DUK  :');
        $sheet->setCellValue('B6', count($employees) . ' Orang PNS');

        $sheet->getStyle('A5:A6')->getFont()->setBold(true)->setSize(9)->getColor()->setRGB('71717A');
        $sheet->getStyle('B5:B6')->getFont()->setBold(true)->setSize(9)->getColor()->setRGB('18181B');

        // Header Table
        $headers = [
            'NO.',
            'NAMA PEGAWAI',
            'NIP',
            'GOLONGAN / RUANG',
            'TMT GOLONGAN',
            'JABATAN',
            'TMT JABATAN',
            'MASA KERJA TAHUN',
            'MASA KERJA BULAN',
            'USIA',
            'PENDIDIKAN TERAKHIR',
            'TAHUN LULUS',
            'DIKLAT',
            'UNIT KERJA / SEKOLAH',
        ];

        $sheet->fromArray($headers, null, 'A8');
        $sheet->getStyle('A8:N8')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 10],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '18181B']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '27272A']]],
        ]);
        $sheet->getRowDimension(8)->setRowHeight(28);

        // Data Rows
        $rowsData = [];
        $counter = 1;
        foreach ($employees as $emp) {
            $job = $jobs->get($emp->id);
            $edu = $edus->get($emp->id);

            $golonganPangkat = self::getPangkatNama($job->pangkat_golongan ?? null);
            $tmtGolongan = ($job && !empty($job->tanggal_mulai) && $job->tanggal_mulai > '1950-01-01') 
                ? Carbon::parse($job->tanggal_mulai)->translatedFormat('d F Y') 
                : '-';

            $jabatan = ($job && !empty($job->jabatan)) ? strtoupper($job->jabatan) : '-';
            $tmtJabatan = ($job && !empty($job->tanggal_mulai) && $job->tanggal_mulai > '1950-01-01') 
                ? Carbon::parse($job->tanggal_mulai)->translatedFormat('d F Y') 
                : '-';

            $mk = self::calculateMasaKerja($emp->cpns_date);
            $usia = self::calculateUsia($emp->date_of_birth);

            $pendidikanStr = $edu ? ($edu->jenjang . (!empty($edu->jurusan) ? " - {$edu->jurusan}" : '')) : '-';
            $tahunLulus = $edu->tahun_lulus ?? '-';

            $nipStr = $emp->nip ? " " . $emp->nip : '-';

            $rowsData[] = [
                $counter++,
                $emp->name,
                $nipStr,
                $golonganPangkat,
                $tmtGolongan,
                $jabatan,
                $tmtJabatan,
                $mk['years'] . ' Thn',
                $mk['months'] . ' Bln',
                $usia['age'] . ' Tahun',
                $pendidikanStr,
                $tahunLulus,
                '-', // Diklat
                $emp->school_name ?? '-',
            ];
        }

        if (!empty($rowsData)) {
            $sheet->fromArray($rowsData, null, 'A9');
        }

        $lastRow = max(8 + count($rowsData), 8);

        if ($lastRow >= 9) {
            $sheet->getStyle("A9:N{$lastRow}")->applyFromArray([
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);

            $sheet->getStyle("A9:A{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("B9:B{$lastRow}")->getFont()->setBold(true);
            $sheet->getStyle("C9:E{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("G9:J{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("L9:M{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        }

        $colWidths = [
            'A' => 6,
            'B' => 32,
            'C' => 24,
            'D' => 24,
            'E' => 18,
            'F' => 32,
            'G' => 18,
            'H' => 12,
            'I' => 12,
            'L' => 12,
            'K' => 30,
            'L' => 12,
            'M' => 10,
            'N' => 32,
        ];
        foreach ($colWidths as $c => $w) {
            $sheet->getColumnDimension($c)->setWidth($w);
        }

        $sheet->freezePane('A9');
        $sheet->setAutoFilter("A8:N{$lastRow}");

        $timestamp = date('Ymd_His');
        $filename = "DUK_PNS_Disdik_KBB_{$timestamp}.xlsx";

        $tempFile = tempnam(sys_get_temp_dir(), 'duk_pns_');
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

    /**
     * Parsing tanggal dari cell Excel (mendukung format DD/MM/YYYY, YYYY-MM-DD, atau numeric serial)
     */
    public static function parseExcelDate($value): ?string
    {
        if (empty($value)) return null;

        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        if (is_numeric($value)) {
            try {
                $dt = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value);
                return $dt->format('Y-m-d');
            } catch (\Exception $e) {}
        }

        $str = trim((string)$value);
        if (empty($str)) return null;

        // Format DD/MM/YYYY atau DD-MM-YYYY
        if (preg_match('/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/', $str, $m)) {
            return sprintf('%04d-%02d-%02d', (int)$m[3], (int)$m[2], (int)$m[1]);
        }

        // Format YYYY-MM-DD
        if (preg_match('/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/', $str, $m)) {
            return sprintf('%04d-%02d-%02d', (int)$m[1], (int)$m[2], (int)$m[3]);
        }

        try {
            return Carbon::parse($str)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Ekstraksi kode golongan standar dari input string
     */
    public static function parseGolongan($value): ?string
    {
        if (empty($value)) return null;
        $str = trim((string)$value);
        if (preg_match('/(IV\/[a-e]|III\/[a-d]|II\/[a-d]|I\/[a-d])/i', $str, $m)) {
            return strtoupper($m[1]);
        }
        return $str;
    }

    /**
     * Normalisasi jenjang pendidikan
     */
    public static function parseJenjang($value): string
    {
        if (empty($value)) return '-';
        $str = strtoupper(trim((string)$value));
        $str = str_replace('-', '', $str);
        if (str_contains($str, 'S3')) return 'S3';
        if (str_contains($str, 'S2')) return 'S2';
        if (str_contains($str, 'S1')) return 'S1';
        if (str_contains($str, 'D4')) return 'D4';
        if (str_contains($str, 'D3')) return 'D3';
        if (str_contains($str, 'D2')) return 'D2';
        if (str_contains($str, 'D1')) return 'D1';
        if (str_contains($str, 'SMA') || str_contains($str, 'SMK') || str_contains($str, 'SLTA')) return 'SMA';
        if (str_contains($str, 'SMP') || str_contains($str, 'SLTP')) return 'SMP';
        if (str_contains($str, 'SD')) return 'SD';
        return (string)$value;
    }

    /**
     * Import Data PNS secara Upsert dari file Excel sesuai template
     */
    public function importExcel(\Illuminate\Http\UploadedFile $file): array
    {
        @ini_set('memory_limit', '1024M');
        @set_time_limit(300);

        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $highestRow = $sheet->getHighestRow();

        $addedCount = 0;
        $updatedCount = 0;
        $schools = DB::table('schools')->select('id', 'name')->get();

        DB::transaction(function () use ($sheet, $highestRow, $schools, &$addedCount, &$updatedCount) {
            for ($r = 2; $r <= $highestRow; $r++) {
                $nipRaw = trim((string)$sheet->getCell([1, $r])->getValue());
                if (empty($nipRaw)) continue;

                $cleanNip = preg_replace('/[^0-9]/', '', $nipRaw);
                if (empty($cleanNip)) $cleanNip = $nipRaw;

                $rawNama = trim((string)$sheet->getCell([2, $r])->getValue());
                if (empty($rawNama)) continue;

                $gelarDepan = trim((string)$sheet->getCell([3, $r])->getValue());
                $gelarBelakang = trim((string)$sheet->getCell([4, $r])->getValue());

                // Gabungkan nama lengkap dan gelar
                $fullName = $rawNama;
                if (!empty($gelarDepan) && stripos($fullName, $gelarDepan) === false) {
                    $fullName = $gelarDepan . ' ' . $fullName;
                }
                if (!empty($gelarBelakang) && stripos($fullName, $gelarBelakang) === false) {
                    $fullName = $fullName . ', ' . $gelarBelakang;
                }

                $golongan = self::parseGolongan($sheet->getCell([5, $r])->getValue());
                $tmtGolongan = self::parseExcelDate($sheet->getCell([6, $r])->getValue());
                $jabatan = trim((string)$sheet->getCell([7, $r])->getValue());
                $tmtJabatan = self::parseExcelDate($sheet->getCell([8, $r])->getValue());

                $mkThn = (int)$sheet->getCell([9, $r])->getValue();
                $mkBln = (int)$sheet->getCell([10, $r])->getValue();

                $diklat = trim((string)$sheet->getCell([11, $r])->getValue());
                $tahunDiklat = trim((string)$sheet->getCell([12, $r])->getValue());

                $jenjang = self::parseJenjang($sheet->getCell([13, $r])->getValue());
                $thnLulus = (int)$sheet->getCell([14, $r])->getValue();

                $tglLahir = self::parseExcelDate($sheet->getCell([15, $r])->getValue());
                $alamat = trim((string)$sheet->getCell([16, $r])->getValue());
                $unitKerja = trim((string)$sheet->getCell([17, $r])->getValue());

                // Cocokkan unit kerja ke sekolah bila ada
                $matchedSchoolId = null;
                if (!empty($unitKerja)) {
                    foreach ($schools as $sch) {
                        if (stripos($sch->name, $unitKerja) !== false || stripos($unitKerja, $sch->name) !== false) {
                            $matchedSchoolId = $sch->id;
                            break;
                        }
                    }
                }

                // Hitung perkiraan cpns_date dari Masa Kerja
                $calculatedCpns = null;
                if ($mkThn > 0 || $mkBln > 0) {
                    $calculatedCpns = Carbon::now()->subYears($mkThn)->subMonths($mkBln)->startOfMonth()->toDateString();
                }

                $existing = DB::table('employees')
                    ->where(function ($q) use ($cleanNip, $nipRaw) {
                        $q->where('nip', $cleanNip)->orWhere('nip', $nipRaw);
                    })
                    ->first();

                if ($existing) {
                    $updateData = [
                        'name' => $fullName,
                        'status_pegawai' => 'PNS',
                        'updated_at' => now(),
                    ];
                    if ($tglLahir) $updateData['date_of_birth'] = $tglLahir;
                    if ($alamat) $updateData['address'] = $alamat;
                    if ($matchedSchoolId) $updateData['school_id'] = $matchedSchoolId;
                    if ($calculatedCpns && empty($existing->cpns_date)) $updateData['cpns_date'] = $calculatedCpns;

                    DB::table('employees')->where('id', $existing->id)->update($updateData);
                    $employeeId = $existing->id;
                    $updatedCount++;
                } else {
                    $employeeId = DB::table('employees')->insertGetId([
                        'nip' => $cleanNip,
                        'name' => $fullName,
                        'date_of_birth' => $tglLahir,
                        'address' => $alamat,
                        'status_pegawai' => 'PNS',
                        'school_id' => $matchedSchoolId,
                        'cpns_date' => $calculatedCpns,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $addedCount++;
                }

                // Update / Insert riwayat jabatan aktif
                if (!empty($jabatan) || !empty($golongan)) {
                    $activeJob = DB::table('employee_job_histories')
                        ->where('employee_id', $employeeId)
                        ->where('is_active', true)
                        ->orderBy('id', 'desc')
                        ->first();

                    if ($activeJob) {
                        DB::table('employee_job_histories')->where('id', $activeJob->id)->update([
                            'jabatan' => !empty($jabatan) ? $jabatan : $activeJob->jabatan,
                            'pangkat_golongan' => !empty($golongan) ? $golongan : $activeJob->pangkat_golongan,
                            'unit_kerja' => !empty($unitKerja) ? $unitKerja : $activeJob->unit_kerja,
                            'tanggal_mulai' => $tmtJabatan ?: ($tmtGolongan ?: $activeJob->tanggal_mulai),
                            'updated_at' => now(),
                        ]);
                    } else {
                        DB::table('employee_job_histories')->insert([
                            'employee_id' => $employeeId,
                            'jabatan' => !empty($jabatan) ? $jabatan : 'Staf Pegawai',
                            'pangkat_golongan' => $golongan,
                            'unit_kerja' => $unitKerja,
                            'tanggal_mulai' => $tmtJabatan ?: ($tmtGolongan ?: now()->toDateString()),
                            'is_active' => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }

                // Update / Insert riwayat pendidikan
                if (!empty($jenjang) && $jenjang !== '-') {
                    $activeEdu = DB::table('employee_educations')
                        ->where('employee_id', $employeeId)
                        ->orderBy('tahun_lulus', 'desc')
                        ->first();

                    if ($activeEdu) {
                        DB::table('employee_educations')->where('id', $activeEdu->id)->update([
                            'jenjang' => $jenjang,
                            'tahun_lulus' => $thnLulus ?: $activeEdu->tahun_lulus,
                            'updated_at' => now(),
                        ]);
                    } else {
                        DB::table('employee_educations')->insert([
                            'employee_id' => $employeeId,
                            'jenjang' => $jenjang,
                            'nama_institusi' => '-',
                            'tahun_lulus' => $thnLulus ?: date('Y'),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        });

        // Hitung ulang urutan DUK otomatis pasca-import
        $this->resetBknOrder();

        return [
            'total' => $addedCount + $updatedCount,
            'added' => $addedCount,
            'updated' => $updatedCount,
        ];
    }

    /**
     * Statistik ringkas untuk tab Dashboard DUK PNS
     */
    public function getDashboardStats(): array
    {
        $totalPns = DB::table('employees')
            ->where('status_pegawai', 'PNS')
            ->whereNull('deleted_at')
            ->count();

        $golonganCounts = DB::table('employee_job_histories')
            ->join('employees', 'employee_job_histories.employee_id', '=', 'employees.id')
            ->where('employees.status_pegawai', 'PNS')
            ->whereNull('employees.deleted_at')
            ->where('employee_job_histories.is_active', true)
            ->select('employee_job_histories.pangkat_golongan', DB::raw('count(*) as count'))
            ->groupBy('employee_job_histories.pangkat_golongan')
            ->pluck('count', 'pangkat_golongan')
            ->all();

        $gol4 = 0; $gol3 = 0; $gol2 = 0; $gol1 = 0;
        foreach ($golonganCounts as $gol => $cnt) {
            if (!$gol) continue;
            if (str_starts_with($gol, 'IV')) $gol4 += $cnt;
            elseif (str_starts_with($gol, 'III')) $gol3 += $cnt;
            elseif (str_starts_with($gol, 'II')) $gol2 += $cnt;
            elseif (str_starts_with($gol, 'I')) $gol1 += $cnt;
        }

        return [
            'total_pns' => $totalPns,
            'golongan_iv' => $gol4,
            'golongan_iii' => $gol3,
            'golongan_ii' => $gol2,
            'golongan_i' => $gol1,
        ];
    }
}
