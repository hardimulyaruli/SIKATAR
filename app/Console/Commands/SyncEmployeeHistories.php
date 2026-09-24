<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use ZipArchive;

class SyncEmployeeHistories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'employees:sync-histories';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sinkronisasi riwayat jabatan, pangkat/golongan, dan pendidikan pegawai dari file Excel sumber';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        @ini_set('memory_limit', '1024M');
        @set_time_limit(600);

        $dir = base_path('dokumen/Data Pegawai Sekolah KBB/Permintaan data A firman');
        if (!is_dir($dir)) {
            $this->error("Direktori file Excel tidak ditemukan: {$dir}");
            return 1;
        }

        $files = glob($dir . '/*.xlsx');
        if (empty($files)) {
            $this->error("Tidak ada file Excel (.xlsx) di direktori: {$dir}");
            return 1;
        }

        $this->info("Memuat data pegawai & sekolah dari database...");

        $employees = DB::table('employees')
            ->select('id', 'school_id', 'nip', 'name', 'date_of_birth', 'cpns_date')
            ->whereNull('deleted_at')
            ->get();

        $empByNip = [];
        $empByNameSchool = [];

        foreach ($employees as $e) {
            if (!empty($e->nip)) {
                $cleanNip = preg_replace('/[^0-9]/', '', $e->nip);
                if (!empty($cleanNip)) {
                    $empByNip[$cleanNip] = $e;
                }
            }
            $normName = strtolower(trim(preg_replace('/[^a-zA-Z0-9]/', '', $e->name)));
            $empByNameSchool[$e->school_id . '_' . $normName] = $e;
        }

        $schoolsByNpsn = DB::table('schools')->pluck('id', 'npsn')->toArray();

        $this->info("Memproses " . count($files) . " file Excel sumber...");

        $seenEmpIds = [];
        $jobsToInsert = [];
        $edusToInsert = [];
        $now = now()->toDateTimeString();

        foreach ($files as $file) {
            $zip = new ZipArchive();
            if ($zip->open($file) !== TRUE) continue;

            $sharedStrings = [];
            $ssContent = $zip->getFromName('xl/sharedStrings.xml');
            if ($ssContent !== false) {
                $xml = @simplexml_load_string($ssContent);
                if ($xml) {
                    foreach ($xml->si as $si) {
                        if (isset($si->t)) {
                            $sharedStrings[] = (string)$si->t;
                        } else {
                            $text = '';
                            foreach ($si->r as $r) {
                                $text .= (string)$r->t;
                            }
                            $sharedStrings[] = $text;
                        }
                    }
                }
            }

            $sheetContent = $zip->getFromName('xl/worksheets/sheet1.xml');
            $xml = @simplexml_load_string($sheetContent);
            if (!$xml) { $zip->close(); continue; }

            $isFirst = true;
            foreach ($xml->sheetData->row as $row) {
                if ($isFirst) { $isFirst = false; continue; }

                $rowData = [];
                foreach ($row->c as $cell) {
                    $cellRef = (string)$cell['r'];
                    $col = preg_replace('/[0-9]/', '', $cellRef);
                    $type = (string)$cell['t'];
                    $val = '';
                    if (isset($cell->v)) {
                        $v = (string)$cell->v;
                        $val = ($type === 's') ? ($sharedStrings[(int)$v] ?? $v) : $v;
                    } elseif (isset($cell->is->t)) {
                        $val = (string)$cell->is->t;
                    }
                    $rowData[$col] = trim($val);
                }

                $nama = $rowData['A'] ?? '';
                if (empty($nama)) continue;

                $rawNip = $rowData['D'] ?? '';
                $cleanNip = preg_replace('/[^0-9]/', '', $rawNip);

                $npsn = preg_replace('/[^0-9]/', '', $rowData['J'] ?? '');
                $schoolId = $schoolsByNpsn[$npsn] ?? null;

                $targetEmp = null;
                if (!empty($cleanNip) && isset($empByNip[$cleanNip])) {
                    $targetEmp = $empByNip[$cleanNip];
                } elseif ($schoolId) {
                    $normName = strtolower(trim(preg_replace('/[^a-zA-Z0-9]/', '', $nama)));
                    $key = $schoolId . '_' . $normName;
                    if (isset($empByNameSchool[$key])) {
                        $targetEmp = $empByNameSchool[$key];
                    }
                }

                if (!$targetEmp || isset($seenEmpIds[$targetEmp->id])) {
                    continue;
                }
                $seenEmpIds[$targetEmp->id] = true;

                // 1. Jabatan & Pangkat
                $jabatan = !empty($rowData['S']) ? $rowData['S'] : (!empty($rowData['R']) ? $rowData['R'] : 'Tenaga Pendidik');
                $pangkat = (!empty($rowData['X']) && $rowData['X'] !== '-' && $rowData['X'] !== 'null') ? $rowData['X'] : null;
                $tmtPangkat = $rowData['Y'] ?? '';
                $tmtPengangkatan = $rowData['Q'] ?? '';

                $dateMulai = '2020-01-01';
                if (!empty($tmtPangkat) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $tmtPangkat) && $tmtPangkat > '1950-01-01') {
                    $dateMulai = $tmtPangkat;
                } elseif (!empty($tmtPengangkatan) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $tmtPengangkatan) && $tmtPengangkatan > '1950-01-01') {
                    $dateMulai = $tmtPengangkatan;
                } elseif (!empty($targetEmp->cpns_date)) {
                    $dateMulai = $targetEmp->cpns_date;
                }

                $jobsToInsert[] = [
                    'employee_id' => $targetEmp->id,
                    'jabatan' => $jabatan,
                    'pangkat_golongan' => $pangkat,
                    'unit_kerja' => $rowData['I'] ?? null,
                    'tanggal_mulai' => $dateMulai,
                    'tanggal_selesai' => null,
                    'is_active' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                // 2. Pendidikan
                $jenjang = (!empty($rowData['T']) && $rowData['T'] !== 'null') ? $rowData['T'] : 'S1';
                $jurusan = (!empty($rowData['U']) && $rowData['U'] !== 'null') ? $rowData['U'] : null;

                $gradYear = 2018;
                if (!empty($targetEmp->date_of_birth)) {
                    $bYear = (int) substr($targetEmp->date_of_birth, 0, 4);
                    if ($bYear > 1940) {
                        $offset = (stripos($jenjang, 'S1') !== false || stripos($jenjang, 'D4') !== false) ? 23 : ((stripos($jenjang, 'S2') !== false) ? 25 : 18);
                        $gradYear = min($bYear + $offset, 2024);
                    }
                }

                $namaInst = (stripos($jenjang, 'S1') !== false || stripos($jenjang, 'S2') !== false || stripos($jenjang, 'D3') !== false) 
                    ? 'Perguruan Tinggi' 
                    : 'SMA / SMK / MA';

                $edusToInsert[] = [
                    'employee_id' => $targetEmp->id,
                    'jenjang' => $jenjang,
                    'jurusan' => $jurusan,
                    'nama_institusi' => $namaInst,
                    'tahun_lulus' => $gradYear,
                    'no_ijazah' => null,
                    'document_path' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            $zip->close();
        }

        $this->info("Menyimpan " . count($jobsToInsert) . " data riwayat jabatan & pangkat...");
        DB::table('employee_job_histories')->truncate();
        foreach (array_chunk($jobsToInsert, 500) as $chunk) {
            DB::table('employee_job_histories')->insert($chunk);
        }

        $this->info("Menyimpan " . count($edusToInsert) . " data riwayat pendidikan...");
        DB::table('employee_educations')->truncate();
        foreach (array_chunk($edusToInsert, 500) as $chunk) {
            DB::table('employee_educations')->insert($chunk);
        }

        $this->info("✅ Berhasil menyinkronkan data jabatan, pangkat, dan pendidikan untuk " . count($jobsToInsert) . " pegawai!");

        return 0;
    }
}
