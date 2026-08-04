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
            'logo_kop_path' => null,
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
            'logo_kop_path' => null,
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

        // 3. Seed Letter Templates
        $t1 = LetterTemplate::create([
            'code' => 'REK-IZIN-OPS',
            'name' => 'Surat Rekomendasi Izin Operasional Sekolah',
            'category' => 'Legalitas',
            'description' => 'Permohonan rekomendasi perpanjangan / penerbitan izin operasional lembaga pendidikan.',
            'default_subject' => 'Permohonan Rekomendasi Izin Operasional Sekolah Tahun 2026',
            'default_body_template' => 'Bersama ini kami sampaikan permohonan rekomendasi izin operasional sekolah untuk SDN 1 Padalarang guna memenuhi persyaratan tata kelola kelayakan kelembagaan pendidikan di Kabupaten Bandung Barat.',
            'required_fields_json' => ['pemohon', 'nomor_sk_lama', 'tahun_ajaran'],
        ]);

        $t2 = LetterTemplate::create([
            'code' => 'KET-MUTASI-SISWA',
            'name' => 'Surat Keterangan Mutasi / Pindah Siswa',
            'category' => 'Kesiswaan',
            'description' => 'Surat permohonan pengesahan mutasi masuk atau keluar peserta didik antar sekolah.',
            'default_subject' => 'Permohonan Pengesahan Mutasi Peserta Didik an. Muhammad Rizky',
            'default_body_template' => 'Mengajukan permohonan pengesahan mutasi keluar peserta didik an. Muhammad Rizky (NISN: 0123456789) dari SDN 1 Padalarang menuju sekolah tujuan di luar wilayah dinas.',
            'required_fields_json' => ['nama_siswa', 'nisn', 'sekolah_tujuan'],
        ]);

        $t3 = LetterTemplate::create([
            'code' => 'BANTUAN-SARPRAS',
            'name' => 'Pengajuan Bantuan Sarana & Prasarana',
            'category' => 'Sarpras',
            'description' => 'Proposal & surat pengajuan bantuan renovasi gedung / alat laboratorium sekolah.',
            'default_subject' => 'Permohonan Bantuan Perbaikan Ruang Kelas Rusak Sedang',
            'default_body_template' => 'Mengajukan permohonan bantuan rehabilitasi 3 unit ruang kelas yang mengalami kerusakan atap dan struktur bangunan di SMPN 1 Ngamprah.',
            'required_fields_json' => ['jenis_bantuan', 'estimasi_anggaran', 'kondisi_fisik'],
        ]);

        // 4. Seed Applications
        LetterApplication::create([
            'application_number' => 'APP-20260804-001',
            'school_id' => $school1->id,
            'user_id' => $op1->id,
            'template_code' => 'REK-IZIN-OPS',
            'letter_name' => 'Surat Rekomendasi Izin Operasional Sekolah',
            'subject' => 'Permohonan Rekomendasi Izin Operasional Sekolah Tahun 2026',
            'recipient' => 'Kepala Dinas Pendidikan Kabupaten Bandung Barat',
            'body_content' => 'Bersama ini kami sampaikan permohonan rekomendasi izin operasional sekolah untuk SDN 1 Padalarang guna memenuhi persyaratan tata kelola kelayakan kelembagaan pendidikan di Kabupaten Bandung Barat.',
            'form_data_json' => ['pemohon' => 'Drs. H. Ahmad Fauzi', 'nomor_sk_lama' => '421.1/SK-102/2021', 'tahun_ajaran' => '2026/2027'],
            'status' => 'submitted',
            'admin_notes' => null,
            'official_letter_number' => null,
            'approved_at' => null,
        ]);

        LetterApplication::create([
            'application_number' => 'APP-20260804-002',
            'school_id' => $school2->id,
            'user_id' => $op2->id,
            'template_code' => 'BANTUAN-SARPRAS',
            'letter_name' => 'Pengajuan Bantuan Sarana & Prasarana',
            'subject' => 'Permohonan Bantuan Perbaikan Ruang Kelas Rusak Sedang',
            'recipient' => 'Kepala Bidang Pembinaan SMP Dinas Pendidikan KBB',
            'body_content' => 'Mengajukan permohonan bantuan rehabilitasi 3 unit ruang kelas yang mengalami kerusakan atap dan struktur bangunan di SMPN 1 Ngamprah.',
            'form_data_json' => ['jenis_bantuan' => 'Rehabilitasi Ruang Kelas', 'estimasi_anggaran' => 'Rp 150.000.000', 'kondisi_fisik' => 'Rusak Sedang'],
            'status' => 'revision_requested',
            'admin_notes' => 'Mohon lampirkan foto dokumentasi kondisi atap kelas dan Rencana Anggaran Biaya (RAB) yang ditandatangani Komite Sekolah.',
            'official_letter_number' => null,
            'approved_at' => null,
        ]);

        LetterApplication::create([
            'application_number' => 'APP-20260804-003',
            'school_id' => $school1->id,
            'user_id' => $op1->id,
            'template_code' => 'KET-MUTASI-SISWA',
            'letter_name' => 'Surat Keterangan Mutasi / Pindah Siswa',
            'subject' => 'Permohonan Pengesahan Mutasi Peserta Didik an. Muhammad Rizky',
            'recipient' => 'Kepala Bidang Pembinaan SD Disdik Bandung Barat',
            'body_content' => 'Mengajukan permohonan pengesahan mutasi keluar peserta didik an. Muhammad Rizky (NISN: 0123456789) dari SDN 1 Padalarang menuju SDN 3 Cimahi.',
            'form_data_json' => ['nama_siswa' => 'Muhammad Rizky', 'nisn' => '0123456789', 'sekolah_tujuan' => 'SDN 3 Cimahi'],
            'status' => 'approved',
            'admin_notes' => 'Berkas lengkap dan terverifikasi valid.',
            'official_letter_number' => '421.2/084-Disdik/VIII/2026',
            'approved_at' => now(),
        ]);
    }
}
