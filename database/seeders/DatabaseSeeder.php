<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\User;
use App\Models\LetterTemplate;
use App\Models\LetterApplication;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Schools
        $school1 = School::create([
            'npsn' => '20201001',
            'name' => 'SD Negeri 1 Padalarang',
            'jenjang' => 'SD',
            'status_akreditasi' => 'A',
            'address' => 'Jl. Raya Padalarang No. 120, Padalarang, Bandung Barat',
            'phone' => '022-6805123',
            'email' => 'sdn1padalarang@disdik.kbb.go.id',
            'headmaster_name' => 'Drs. H. Ahmad Fauzi, M.Pd.',
            'headmaster_nip' => '19680512 199303 1 004',
            'logo_kop_path' => '/storage/logos/sdn1padalarang.svg',
        ]);

        $school2 = School::create([
            'npsn' => '20202005',
            'name' => 'SMP Negeri 1 Ngamprah',
            'jenjang' => 'SMP',
            'status_akreditasi' => 'A',
            'address' => 'Jl. Padasuka No. 45, Ngamprah, Bandung Barat',
            'phone' => '022-6864321',
            'email' => 'smpn1ngamprah@disdik.kbb.go.id',
            'headmaster_name' => 'Hj. Nenden Ratnasari, S.Pd., M.M.',
            'headmaster_nip' => '19720415 199802 2 003',
            'logo_kop_path' => '/storage/logos/smpn1ngamprah.svg',
        ]);

        $school3 = School::create([
            'npsn' => '20203010',
            'name' => 'SD Negeri 2 Lembang',
            'jenjang' => 'SD',
            'status_akreditasi' => 'B',
            'address' => 'Jl. Raya Lembang No. 88, Lembang, Bandung Barat',
            'phone' => '022-2786543',
            'email' => 'sdn2lembang@disdik.kbb.go.id',
            'headmaster_name' => 'Sutisna, S.Pd.',
            'headmaster_nip' => '19750918 200501 1 008',
            'logo_kop_path' => null,
        ]);

        // 2. Seed Users
        $admin = User::create([
            'name' => 'Admin Disdik KBB',
            'email' => 'admin@disdik.bandungbaratkab.go.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'school_id' => null,
        ]);

        $op1 = User::create([
            'name' => 'Operator SDN 1 Padalarang',
            'email' => 'operator.sdn1padalarang@disdik.bandungbaratkab.go.id',
            'password' => Hash::make('password'),
            'role' => 'operator',
            'school_id' => $school1->id,
        ]);

        $op2 = User::create([
            'name' => 'Operator SMPN 1 Ngamprah',
            'email' => 'operator.smpn1ngamprah@disdik.bandungbaratkab.go.id',
            'password' => Hash::make('password'),
            'role' => 'operator',
            'school_id' => $school2->id,
        ]);

        // 3. Seed Letter Templates with Official Classification Codes 2024
        $t1 = LetterTemplate::create([
            'code' => 'PENGANTAR-KENAIKAN-PANGKAT',
            'classification_code' => '800.1.3.2',
            'name' => 'Surat Pengantar Usul Kenaikan Pangkat',
            'category' => 'Kepegawaian',
            'description' => 'Surat pengantar pengusulan kenaikan pangkat Aparatur Sipil Negara (ASN / Guru) ke BKPSDM melalui Dinas Pendidikan Kabupaten Bandung Barat.',
            'default_subject' => 'Usulan Kenaikan Pangkat Pegawai Negeri Sipil / Aparatur Sipil Negara Periode 2026',
            'default_body_template' => 'Usulan Kenaikan Pangkat Periode Agustus 2026 Pegawai Negeri Sipil / Aparatur Sipil Negara',
            'required_fields_json' => ['nama_pegawai', 'nip', 'pangkat_golongan', 'jabatan', 'jumlah_berkas'],
        ]);

        $t2 = LetterTemplate::create([
            'code' => 'REK-IZIN-OPS',
            'classification_code' => '400.3.5',
            'name' => 'Surat Pengantar Izin Operasional Sekolah',
            'category' => 'Legalitas',
            'description' => 'Permohonan rekomendasi perpanjangan / penerbitan izin operasional lembaga pendidikan tingkat SD dan SMP.',
            'default_subject' => 'Permohonan Rekomendasi Izin Operasional Sekolah',
            'default_body_template' => 'Permohonan Rekomendasi Penerbitan / Perpanjangan Izin Operasional Lembaga Pendidikan Sekolah Dasar',
            'required_fields_json' => ['pemohon', 'nomor_sk_lama', 'tahun_ajaran', 'jumlah_berkas'],
        ]);

        $t3 = LetterTemplate::create([
            'code' => 'PENGANTAR-MUTASI-GURU',
            'classification_code' => '800.1.3.1',
            'name' => 'Surat Pengantar Pertimbangan Mutasi Guru',
            'category' => 'Kepegawaian',
            'description' => 'Surat pengantar pengajuan mutasi atau pertimbangan pindah tugas guru / tenaga kependidikan.',
            'default_subject' => 'Permohonan Pengesahan Pertimbangan Mutasi Guru / Tenaga Kependidikan',
            'default_body_template' => 'Berkas Permohonan Pertimbangan Pindah Tugas / Mutasi Guru Antar Sekolah / Sub-Unit Dinas',
            'required_fields_json' => ['nama_guru', 'nip', 'sekolah_tujuan', 'alasan_mutasi', 'jumlah_berkas'],
        ]);

        $t4 = LetterTemplate::create([
            'code' => 'BANTUAN-SARPRAS',
            'classification_code' => '400.3.13',
            'name' => 'Surat Pengantar Proposal Bantuan Sarpras',
            'category' => 'Sarpras',
            'description' => 'Proposal & pengajuan permohonan bantuan rehabilitasi fisik gedung / alat laboratorium sekolah.',
            'default_subject' => 'Permohonan Bantuan Perbaikan Sarana & Prasarana Ruang Kelas',
            'default_body_template' => 'Proposal Pengajuan Bantuan Perbaikan Ruang Kelas Rusak Sedang dan Sarana Penunjang Sekolah',
            'required_fields_json' => ['jenis_bantuan', 'estimasi_anggaran', 'kondisi_fisik', 'jumlah_berkas'],
        ]);

        $t5 = LetterTemplate::create([
            'code' => 'PENGANTAR-CUTI',
            'classification_code' => '800.1.11.2',
            'name' => 'Surat Pengantar Permohonan Cuti Pegawai',
            'category' => 'Kepegawaian',
            'description' => 'Surat pengantar permohonan cuti sakit, cuti bersalin, atau cuti alasan penting pegawai ASN.',
            'default_subject' => 'Permohonan Pengesahan Cuti Pegawai Negeri Sipil',
            'default_body_template' => 'Permohonan Pengesahan Cuti Sakit / Cuti Alasan Penting Pegawai Negeri Sipil',
            'required_fields_json' => ['nama_pegawai', 'nip', 'jenis_cuti', 'durasi_cuti', 'jumlah_berkas'],
        ]);

        $t6 = LetterTemplate::create([
            'code' => 'SERTIFIKASI-GURU',
            'classification_code' => '400.3.7.3',
            'name' => 'Surat Pengantar Berkas Sertifikasi Guru',
            'category' => 'Kepegawaian',
            'description' => 'Surat pengantar penyampaian berkas verifikasi sertifikasi dan pencairan tunjangan profesi guru.',
            'default_subject' => 'Pengantar Berkas Verifikasi Kelayakan Sertifikasi Guru',
            'default_body_template' => 'Berkas Verifikasi Portofolio dan Kelayakan Tunjangan Profesi / Sertifikasi Guru',
            'required_fields_json' => ['jumlah_guru_diusulkan', 'tahun_pencairan', 'jumlah_berkas'],
        ]);

        // 4. Seed Applications
        $sampleApplicants = [
            ['nama' => 'SUMIARSIH, S.Pd', 'nip' => '196904061998022003', 'gol_asal' => 'Pembina Tk.I, IV/b', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SMPN 1 Batujajar', 'kecamatan' => 'Batujajar'],
            ['nama' => 'MURTINI, S.Pd', 'nip' => '196801212006042005', 'gol_asal' => 'Penata Tk.I, III/d', 'jabatan' => 'Guru Ahli Muda', 'unit_kerja' => 'SDN 1 Margalaksana', 'kecamatan' => 'Padalarang'],
            ['nama' => 'ACIH SUARSIH, S.Pd.M.Pd', 'nip' => '196708051992032006', 'gol_asal' => 'Pembina Tk.I, IV/b', 'jabatan' => 'Pengawas Sekolah Ahli Madya', 'unit_kerja' => 'Dinas Pendidikan', 'kecamatan' => '-'],
            ['nama' => 'LELI YULIA GUNAWATI, S.Pd', 'nip' => '196907172008012010', 'gol_asal' => 'Penata Tk.I, III/d', 'jabatan' => 'Guru Ahli Muda', 'unit_kerja' => 'SDN 3 Kertajaya', 'kecamatan' => 'Padalarang'],
            ['nama' => 'RIKA INDRIANI SHOLIHAT, S.Pd., M.Pd', 'nip' => '198111222009012001', 'gol_asal' => 'Pembina, IV/a', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SMPN 5 Padalarang', 'kecamatan' => 'Padalarang'],
            ['nama' => 'SRI UNTARI, S.Pd', 'nip' => '196710071999032003', 'gol_asal' => 'Pembina Tk.I, IV/b', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SMPN 3 Ngamprah', 'kecamatan' => 'Ngamprah'],
            ['nama' => 'SOLIHIN, S.Pd.SD', 'nip' => '197104198008011005', 'gol_asal' => 'Penata Muda Tk.I, III/b', 'jabatan' => 'Guru Ahli Pertama', 'unit_kerja' => 'SDN Margaasih', 'kecamatan' => 'Cipatat'],
            ['nama' => 'SITI NURYANI, S.Pd', 'nip' => '198206282006042011', 'gol_asal' => 'Penata Tk.I, III/d', 'jabatan' => 'Guru Ahli Muda', 'unit_kerja' => 'SMPN 2 Batujajar', 'kecamatan' => 'Batujajar'],
            ['nama' => 'RAHAYU PURWANINGSIH, S.Pd', 'nip' => '197703092011012001', 'gol_asal' => 'Penata Tk.I, III/d', 'jabatan' => 'Guru Ahli Muda', 'unit_kerja' => 'SMPN 3 Ngamprah', 'kecamatan' => 'Ngamprah'],
            ['nama' => 'MUMUH SUPRIADI, S.Pd.I', 'nip' => '198011222014121002', 'gol_asal' => 'Penata, III/c', 'jabatan' => 'Guru Ahli Muda', 'unit_kerja' => 'SDN 1 Parigi', 'kecamatan' => 'Padalarang'],
            ['nama' => 'GUGUN GUMILANG', 'nip' => '197808272014121003', 'gol_asal' => 'Pengatur Muda, II/a', 'jabatan' => 'Guru Ahli Pertama', 'unit_kerja' => 'SDN 2 Langensari', 'kecamatan' => 'Lembang'],
            ['nama' => 'EVI LUTFIAH, S.Pd', 'nip' => '197709052014122002', 'gol_asal' => 'Penata Muda Tk.I, III/b', 'jabatan' => 'Guru Ahli Pertama', 'unit_kerja' => 'SDN 2 Gunung bentamh', 'kecamatan' => 'Padalarang'],
            ['nama' => 'DADANG HERMAWAN, S.Pd', 'nip' => '196905252007011010', 'gol_asal' => 'Penata, III/c', 'jabatan' => 'Guru Ahli Muda', 'unit_kerja' => 'SDN 2 Celak', 'kecamatan' => 'Gununghalu'],
            ['nama' => 'EUIS TITA ROHAYATI, S.Pd.I', 'nip' => '198401192014122002', 'gol_asal' => 'Penata, III/c', 'jabatan' => 'Guru Ahli Muda', 'unit_kerja' => 'SMPN 5 Gununghalu', 'kecamatan' => 'Gununghalu'],
            ['nama' => 'MAYA RAHAYU, S.Pd.SD', 'nip' => '198201122009012006', 'gol_asal' => 'Penata, III/c', 'jabatan' => 'Guru Ahli Muda', 'unit_kerja' => 'SDN Banyuresmi', 'kecamatan' => 'Cihampelas'],
            ['nama' => 'ETOS SUPARMAN, S.Pd', 'nip' => '196901062007011015', 'gol_asal' => 'Penata Tk. I, III/d', 'jabatan' => 'Guru Ahli Muda', 'unit_kerja' => 'SDN Cipicung', 'kecamatan' => 'Sindangkerta'],
            ['nama' => 'AGUS KUSWARA, S.Pd', 'nip' => '196707261989031005', 'gol_asal' => 'Pembina, IV/a', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SDN 5 Cililin', 'kecamatan' => 'Cililin'],
            ['nama' => 'AJI JEHAN FELLANI, S.Pd', 'nip' => '198012032009011007', 'gol_asal' => 'Pembina, IV/a', 'jabatan' => 'Pengawas Madya', 'unit_kerja' => 'Dinas Pendidikan', 'kecamatan' => '-'],
            ['nama' => 'SRI YUSRIN, S.Pd', 'nip' => '197005122008012013', 'gol_asal' => 'Pembina, IV/a', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SMPN 3 Sindangketa', 'kecamatan' => 'Sindangkerta'],
            ['nama' => 'YUNINGSIH, S.Pd', 'nip' => '197906162009022002', 'gol_asal' => 'Pembina, IV/a', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SMPN 1 Cililin', 'kecamatan' => 'Cililin'],
            ['nama' => 'AHMAD ZAKARIA, S.Pd', 'nip' => '197003221997021002', 'gol_asal' => 'Pembina Tk. I, IV/b', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SMPN 1 Sindangkerta', 'kecamatan' => 'Sindangkerta'],
            ['nama' => 'EUIS JUARIAH, S.Pd.SD', 'nip' => '196712141986102001', 'gol_asal' => 'Pembina Tk. I, IV/b', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SDN Selakopi', 'kecamatan' => 'Cihampelas'],
            ['nama' => 'EUIS NURAENI, S.Pd', 'nip' => '197003011991032004', 'gol_asal' => 'Pembina Tk. I, IV/b', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SDN Padamekar', 'kecamatan' => 'Cililin'],
            ['nama' => 'JAJAT, S.Pd', 'nip' => '197106081997021001', 'gol_asal' => 'Pembina Tk. I, IV/b', 'jabatan' => 'Guru Ahli Madya', 'unit_kerja' => 'SMPN 2 Cihampelas', 'kecamatan' => 'Cihampelas'],
        ];

        LetterApplication::create([
            'application_number' => 'APP-20260804-001',
            'school_id' => $school1->id,
            'user_id' => $op1->id,
            'template_code' => 'PENGANTAR-KENAIKAN-PANGKAT',
            'letter_name' => 'Surat Pengantar Usul Kenaikan Pangkat',
            'subject' => 'Usulan Kenaikan Pangkat Periode Agustus 2026 Pegawai Negeri Sipil/ Aparatur Sipil Negara, atas nama :',
            'recipient' => 'Kepala Badan Kepegawaian dan\nPengembangan Sumber Daya Manusia\nKabupaten Bandung Barat',
            'body_content' => 'Usulan Kenaikan Pangkat Periode Agustus 2026 Pegawai Negeri Sipil/ Aparatur Sipil Negara',
            'form_data_json' => [
                'nama_pegawai' => 'SUMIARSIH, S.Pd',
                'nip' => '196904061998022003',
                'pangkat_golongan' => 'Pembina Tk.I, IV/b',
                'jabatan' => 'Guru Ahli Madya',
                'unit_kerja' => 'SMPN 1 Batujajar',
                'jumlah_orang' => 55,
                'applicants' => $sampleApplicants,
            ],
            'status' => 'approved',
            'admin_notes' => 'Telah diverifikasi dan disetujui.',
            'official_letter_number' => '800.1.3.2/1071 - Sekre/2026',
            'approved_at' => now(),
        ]);

        LetterApplication::create([
            'application_number' => 'APP-20260804-002',
            'school_id' => $school2->id,
            'user_id' => $op2->id,
            'template_code' => 'BANTUAN-SARPRAS',
            'letter_name' => 'Surat Pengantar Proposal Bantuan Sarpras',
            'subject' => 'Permohonan Bantuan Perbaikan Ruang Kelas Rusak Sedang',
            'recipient' => 'Kepala Bidang Pembinaan SMP Dinas Pendidikan Kabupaten Bandung Barat',
            'body_content' => 'Proposal Pengajuan Bantuan Perbaikan 3 Ruang Kelas Rusak Sedang dan Sarana Penunjang Sekolah',
            'form_data_json' => [
                'jenis_bantuan' => 'Rehabilitasi Ruang Kelas',
                'estimasi_anggaran' => 'Rp 150.000.000',
                'kondisi_fisik' => 'Rusak Sedang',
                'jumlah_berkas' => '1 (Satu) Berkas'
            ],
            'status' => 'submitted',
            'admin_notes' => null,
            'official_letter_number' => null,
            'approved_at' => null,
        ]);

        LetterApplication::create([
            'application_number' => 'APP-20260804-003',
            'school_id' => $school1->id,
            'user_id' => $op1->id,
            'template_code' => 'PENGANTAR-MUTASI-GURU',
            'letter_name' => 'Surat Pengantar Pertimbangan Mutasi Guru',
            'subject' => 'Permohonan Pengesahan Pertimbangan Mutasi Guru / Tenaga Kependidikan',
            'recipient' => 'Kepala Dinas Pendidikan Kabupaten Bandung Barat',
            'body_content' => 'Berkas Permohonan Pertimbangan Pindah Tugas / Mutasi Guru an. Aceng Kurnia, S.Pd (NIP: 197805122006041005)',
            'form_data_json' => [
                'nama_guru' => 'Aceng Kurnia, S.Pd',
                'nip' => '19780512 200604 1 005',
                'sekolah_tujuan' => 'SMPN 2 Padalarang',
                'alasan_mutasi' => 'Mengikuti domisili keluarga',
                'jumlah_berkas' => '1 (Satu) Berkas'
            ],
            'status' => 'submitted',
            'admin_notes' => null,
            'official_letter_number' => null,
            'approved_at' => null,
        ]);
    }
}
