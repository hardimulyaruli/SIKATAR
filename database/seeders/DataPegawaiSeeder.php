<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use ZipArchive;
use SimpleXMLElement;

class DataPegawaiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dir = base_path('dokumen/Data Pegawai Sekolah KBB/Permintaan data A firman');
        if (!is_dir($dir)) {
            $this->command->error("Folder data Excel tidak ditemukan di: {$dir}");
            return;
        }

        $files = glob($dir . '/*.xlsx');
        if (empty($files)) {
            $this->command->error("Tidak ada file .xlsx di folder: {$dir}");
            return;
        }

        $this->command->info("Memproses " . count($files) . " file Excel data pegawai KBB...");

        $schoolsData = []; // npsn => array data sekolah
        $rawEmployeeRows = [];
        $skippedPengawas = 0;
        $skippedNonSdSmp = 0;

        foreach ($files as $file) {
            $rows = $this->parseXlsx($file);
            if (!$rows || count($rows) <= 1) continue;

            // Baris pertama adalah header
            array_shift($rows);

            foreach ($rows as $r) {
                $vals = array_values($r);

                // Field mapping:
                // 0: Nama, 1: NIK, 2: NUPTK, 3: NIP, 4: L/P, 5: Tempat Lahir, 6: Tanggal Lahir,
                // 7: Status Tugas (Induk / Non Induk), 8: Tempat Tugas, 9: NPSN, 10: Kecamatan,
                // 12: Nomor HP, 14: Tanggal CPNS, 17: Jenis PTK, 22: Status Kepegawaian
                $nama = isset($vals[0]) ? trim($vals[0]) : '';
                if (empty($nama)) continue;

                $jenisPtk = isset($vals[17]) ? trim($vals[17]) : '';

                // Filter 1: Abaikan Pengawas
                if (strcasecmp($jenisPtk, 'Pengawas') === 0) {
                    $skippedPengawas++;
                    continue;
                }

                $tempatTugas = isset($vals[8]) ? trim($vals[8]) : '';

                // Filter 2: Hanya SD dan SMP
                $isSd = (bool)preg_match('/\bSD\b/i', $tempatTugas) || (bool)preg_match('/SEKOLAH DASAR/i', $tempatTugas);
                $isSmp = (bool)preg_match('/\bSMP\b/i', $tempatTugas) || (bool)preg_match('/SEKOLAH MENENGAH PERTAMA/i', $tempatTugas);

                if (!$isSd && !$isSmp) {
                    $skippedNonSdSmp++;
                    continue;
                }

                $jenjang = $isSd ? 'SD' : 'SMP';
                $npsn = isset($vals[9]) ? preg_replace('/[^0-9]/', '', trim($vals[9])) : '';
                $kecamatan = isset($vals[10]) ? trim($vals[10]) : '';

                if (empty($npsn)) {
                    $npsn = '99' . substr(abs(crc32($tempatTugas)), 0, 6);
                }

                if (!isset($schoolsData[$npsn])) {
                    $address = !empty($kecamatan) ? "Kecamatan {$kecamatan}, Kabupaten Bandung Barat" : "Kabupaten Bandung Barat";
                    $schoolsData[$npsn] = [
                        'npsn' => $npsn,
                        'name' => $tempatTugas,
                        'jenjang' => $jenjang,
                        'status_akreditasi' => 'A',
                        'address' => $address,
                        'phone' => null,
                        'email' => 'operator.' . $this->makeSchoolSlug($tempatTugas) . '@disdik.kbb.go.id',
                        'headmaster_name' => null,
                        'headmaster_nip' => null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                $nipRaw = isset($vals[3]) ? trim($vals[3]) : '';
                $nipClean = preg_replace('/[^0-9]/', '', $nipRaw);
                $nip = (!empty($nipClean) && strlen($nipClean) >= 8) ? $nipClean : null;

                if (strcasecmp($jenisPtk, 'Kepala Sekolah') === 0) {
                    $schoolsData[$npsn]['headmaster_name'] = $nama;
                    if ($nip) {
                        $schoolsData[$npsn]['headmaster_nip'] = $nip;
                    }
                }

                $statusKep = isset($vals[22]) ? trim($vals[22]) : '';
                if (strcasecmp($statusKep, 'PNS') === 0) {
                    $statusEnum = 'PNS';
                } elseif (strcasecmp($statusKep, 'CPNS') === 0) {
                    $statusEnum = 'CPNS';
                } elseif (stripos($statusKep, 'PPPK') !== false) {
                    $statusEnum = 'PPPK';
                } else {
                    $statusEnum = 'Honorer';
                }

                $dob = (isset($vals[6]) && preg_match('/^\d{4}-\d{2}-\d{2}$/', trim($vals[6]))) ? trim($vals[6]) : null;
                $cpnsDate = (isset($vals[14]) && preg_match('/^\d{4}-\d{2}-\d{2}$/', trim($vals[14]))) ? trim($vals[14]) : null;
                $statusTugas = isset($vals[7]) ? trim($vals[7]) : 'Induk';

                $rawEmployeeRows[] = [
                    'npsn' => $npsn,
                    'name' => $nama,
                    'nip' => $nip,
                    'place_of_birth' => isset($vals[5]) && !empty($vals[5]) ? trim($vals[5]) : null,
                    'date_of_birth' => $dob,
                    'address' => !empty($kecamatan) ? "Kec. {$kecamatan}" : null,
                    'contact' => isset($vals[12]) && !empty($vals[12]) ? trim($vals[12]) : null,
                    'status_pegawai' => $statusEnum,
                    'cpns_date' => $cpnsDate,
                    'pns_date' => ($statusEnum === 'PNS') ? $cpnsDate : null,
                    'status_tugas' => $statusTugas,
                ];
            }
        }

        $this->command->info("Menyiapkan insertion sekolah (" . count($schoolsData) . " sekolah)...");

        // Prioritaskan sekolah yang belum ada di DB
        $existingNpsns = School::pluck('id', 'npsn')->toArray();
        $schoolIdMap = $existingNpsns;

        $newSchoolsToInsert = [];
        foreach ($schoolsData as $npsn => $sData) {
            if (!isset($schoolIdMap[$npsn])) {
                $newSchoolsToInsert[] = $sData;
            } else {
                // Update headmaster info jika belum terisi
                if (!empty($sData['headmaster_name'])) {
                    School::where('npsn', $npsn)->update([
                        'headmaster_name' => $sData['headmaster_name'],
                        'headmaster_nip' => $sData['headmaster_nip'],
                    ]);
                }
            }
        }

        if (!empty($newSchoolsToInsert)) {
            foreach (array_chunk($newSchoolsToInsert, 200) as $chunk) {
                School::insert($chunk);
            }
            $schoolIdMap = School::pluck('id', 'npsn')->toArray();
        }

        // -------------------------------------------------------------
        // PEMBUATAN / UPDATE AKUN OPERATOR DENGAN FORMAT SINGKAT: operator.sdn1padalarang@disdik.kbb.go.id
        // -------------------------------------------------------------
        $this->command->info("Menyiapkan akun operator dengan format disingkat (sdn/smpn)...");

        $allSchoolsInDb = School::all();

        // Hitung frekuensi singkatan nama sekolah untuk mendeteksi nama sama antar kecamatan
        $slugCounts = [];
        foreach ($allSchoolsInDb as $s) {
            $slug = $this->makeSchoolSlug($s->name);
            if (!isset($slugCounts[$slug])) $slugCounts[$slug] = 0;
            $slugCounts[$slug]++;
        }

        $existingUserEmails = User::pluck('id', 'email')->toArray();
        $existingUserSchoolIds = User::whereNotNull('school_id')->pluck('id', 'school_id')->toArray();
        $hashedPassword = Hash::make('password');
        $usersToInsert = [];
        $now = now()->toDateTimeString();

        foreach ($allSchoolsInDb as $s) {
            $slug = $this->makeSchoolSlug($s->name);

            if ($slugCounts[$slug] > 1) {
                $kec = '';
                if (preg_match('/Kecamatan\s+([^,]+)/i', $s->address, $m)) {
                    $kec = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $m[1]));
                }
                $slug = $slug . $kec;
            }

            $email = "operator." . $slug . "@disdik.kbb.go.id";

            // Jika email bentrok, gunakan NPSN sebagai pembeda unik
            if (isset($existingUserEmails[$email]) && ($existingUserSchoolIds[$s->id] ?? null) === null) {
                $email = "operator." . $slug . $s->npsn . "@disdik.kbb.go.id";
            }

            // Update sekolah email
            $s->update(['email' => $email]);

            // Jika user operator untuk sekolah ini sudah ada, update emailnya ke format baru
            if (isset($existingUserSchoolIds[$s->id])) {
                $userId = $existingUserSchoolIds[$s->id];
                User::where('id', $userId)->update([
                    'name' => "Operator {$s->name}",
                    'email' => $email,
                ]);
            } else {
                // Jika belum ada user, tambahkan ke antrean insert
                $usersToInsert[] = [
                    'name' => "Operator {$s->name}",
                    'email' => $email,
                    'password' => $hashedPassword,
                    'role' => 'operator',
                    'school_id' => $s->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $existingUserEmails[$email] = true;
                $existingUserSchoolIds[$s->id] = true;
            }
        }

        if (!empty($usersToInsert)) {
            foreach (array_chunk($usersToInsert, 200) as $chunk) {
                User::insert($chunk);
            }
            $this->command->info("✅ Berhasil membuat " . count($usersToInsert) . " akun operator sekolah baru!");
        }

        // -------------------------------------------------------------
        // INSERTION PEGAWAI
        // -------------------------------------------------------------
        $this->command->info("Menyiapkan insertion pegawai (" . count($rawEmployeeRows) . " data)...");

        // Urutkan pegawai: Sekolah Induk lebih dulu agar NIP duplikat di Non-Induk ter-filter
        usort($rawEmployeeRows, function ($a, $b) {
            if ($a['status_tugas'] === $b['status_tugas']) return 0;
            return ($a['status_tugas'] === 'Induk') ? -1 : 1;
        });

        $existingNips = Employee::whereNotNull('nip')->pluck('nip')->toBase()->flip()->toArray();
        $employeesToInsert = [];

        foreach ($rawEmployeeRows as $emp) {
            $schoolId = $schoolIdMap[$emp['npsn']] ?? null;
            if (!$schoolId) continue;

            $nip = $emp['nip'];
            if ($nip !== null) {
                if (isset($existingNips[$nip])) {
                    continue; // Abaikan NIP duplikat yang sudah terdaftar
                }
                $existingNips[$nip] = true;
            }

            $employeesToInsert[] = [
                'school_id' => $schoolId,
                'nip' => $nip,
                'name' => $emp['name'],
                'place_of_birth' => $emp['place_of_birth'],
                'date_of_birth' => $emp['date_of_birth'],
                'address' => $emp['address'],
                'contact' => $emp['contact'],
                'photo_path' => null,
                'status_pegawai' => $emp['status_pegawai'],
                'cpns_date' => $emp['cpns_date'],
                'pns_date' => $emp['pns_date'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $totalEmployees = count($employeesToInsert);
        if ($totalEmployees > 0) {
            $this->command->info("Memasukkan {$totalEmployees} data pegawai ke database...");
            foreach (array_chunk($employeesToInsert, 500) as $chunk) {
                Employee::insert($chunk);
            }
        }

        $this->command->info("✅ Selesai! Email seluruh operator sekolah berhasil disingkat (sdn/smpn) ke domain @disdik.kbb.go.id");
    }

    /**
     * Menghasilkan slug singkat untuk email sekolah (SD Negeri -> sdn, SMP Negeri -> smpn)
     */
    private function makeSchoolSlug(string $schoolName): string
    {
        $name = strtolower($schoolName);
        $name = preg_replace('/\bsekolah\s+dasar\s+negeri\b/i', 'sdn', $name);
        $name = preg_replace('/\bsd\s+negeri\b/i', 'sdn', $name);
        $name = preg_replace('/\bsekolah\s+menengah\s+pertama\s+negeri\b/i', 'smpn', $name);
        $name = preg_replace('/\bsmp\s+negeri\b/i', 'smpn', $name);
        $name = preg_replace('/\bsekolah\s+dasar\b/i', 'sd', $name);
        $name = preg_replace('/\bsekolah\s+menengah\s+pertama\b/i', 'smp', $name);

        return preg_replace('/[^a-z0-9]/', '', $name);
    }

    /**
     * Helper parser XLSX dari file zip tanpa eksternal dependency
     */
    private function parseXlsx(string $filePath): array
    {
        $zip = new ZipArchive();
        if ($zip->open($filePath) !== TRUE) {
            return [];
        }

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
        if ($sheetContent === false) {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $name = $zip->getNameIndex($i);
                if (strpos($name, 'xl/worksheets/sheet') === 0) {
                    $sheetContent = $zip->getFromName($name);
                    break;
                }
            }
        }

        if ($sheetContent === false) {
            $zip->close();
            return [];
        }

        $xml = @simplexml_load_string($sheetContent);
        $rows = [];
        if ($xml && isset($xml->sheetData)) {
            foreach ($xml->sheetData->row as $row) {
                $rowData = [];
                foreach ($row->c as $cell) {
                    $cellRef = (string)$cell['r'];
                    $col = preg_replace('/[0-9]/', '', $cellRef);
                    $type = (string)$cell['t'];
                    $val = '';
                    if (isset($cell->v)) {
                        $v = (string)$cell->v;
                        if ($type === 's') {
                            $val = $sharedStrings[(int)$v] ?? $v;
                        } else {
                            $val = $v;
                        }
                    } elseif (isset($cell->is->t)) {
                        $val = (string)$cell->is->t;
                    }
                    $rowData[$col] = trim($val);
                }
                $rows[] = $rowData;
            }
        }

        $zip->close();
        return $rows;
    }
}
