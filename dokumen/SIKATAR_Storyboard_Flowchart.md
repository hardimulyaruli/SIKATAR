# SIKATAR — Storyboard & Diagram Alur Aplikasi
## Sistem Informasi Korespondensi & Administrasi Tata Surat
### Dinas Pendidikan Kabupaten Bandung Barat

> **Dokumen Referensi untuk Pembuatan Diagram di Microsoft Visio**
> Versi: 1.0 | Tanggal: 26 Agustus 2026

---

## Daftar Isi

1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Aktor / Pengguna Sistem](#2-aktor--pengguna-sistem)
3. [Diagram Alur Utama (Main Flowchart)](#3-diagram-alur-utama-main-flowchart)
4. [Alur Autentikasi & Routing](#4-alur-autentikasi--routing)
5. [Alur Operator Sekolah](#5-alur-operator-sekolah)
6. [Alur Admin Disdik KBB](#6-alur-admin-disdik-kbb)
7. [Siklus Hidup Status Pengajuan (State Diagram)](#7-siklus-hidup-status-pengajuan-state-diagram)
8. [Entity Relationship Diagram (ERD)](#8-entity-relationship-diagram-erd)
9. [Storyboard Per Halaman](#9-storyboard-per-halaman)
10. [Panduan Shape Visio](#10-panduan-shape-visio)

---

## 1. Gambaran Umum Sistem

**SIKATAR** adalah aplikasi web berbasis **Laravel 12 + Inertia.js + React** yang digunakan oleh **Dinas Pendidikan (Disdik) Kabupaten Bandung Barat** untuk mengelola surat-menyurat resmi antar sekolah dan dinas pendidikan.

### Fitur Utama:
| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | Pengajuan Surat | Operator sekolah membuat dan mengirimkan surat pengantar resmi ke Disdik |
| 2 | Live Letter Preview | Preview surat real-time saat pengisian form |
| 3 | Verifikasi & Approval | Admin Disdik memverifikasi, menyetujui, menolak, atau meminta revisi surat |
| 4 | Penomoran Otomatis | Sistem menghasilkan nomor surat resmi otomatis berdasarkan kode klasifikasi |
| 5 | Profil Sekolah & Kop Surat | Operator mengatur identitas sekolah dan logo kop surat |
| 6 | Manajemen Sekolah | Admin melihat daftar dan detail seluruh sekolah terdaftar |
| 7 | Dashboard Ringkasan | Statistik dan ringkasan untuk kedua role pengguna |

### Tech Stack:
- **Backend:** Laravel 12 (PHP)
- **Frontend:** React (via Inertia.js)
- **Styling:** TailwindCSS (Material Design 3 tokens)
- **Database:** SQLite
- **Auth:** Laravel Breeze

---

## 2. Aktor / Pengguna Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                        AKTOR SISTEM                             │
├───────────────────────┬─────────────────────────────────────────┤
│   OPERATOR SEKOLAH    │          ADMIN DISDIK KBB               │
│   (role: operator)    │          (role: admin)                   │
├───────────────────────┼─────────────────────────────────────────┤
│ • Operator/staff      │ • Petugas verifikasi Dinas              │
│   sekolah di KBB      │   Pendidikan KBB                        │
│ • Terhubung ke 1      │ • Memiliki akses ke seluruh             │
│   entitas sekolah     │   pengajuan dari semua sekolah          │
│ • Membuat & mengelola │ • Memverifikasi, menyetujui,            │
│   pengajuan surat     │   merevisi, atau menolak surat          │
│ • Mengatur profil &   │ • Menerbitkan nomor surat resmi         │
│   kop surat sekolah   │ • Melihat data seluruh sekolah          │
└───────────────────────┴─────────────────────────────────────────┘
```

---

## 3. Diagram Alur Utama (Main Flowchart)

> **Instruksi Visio:** Gunakan template *Basic Flowchart* atau *Cross-Functional Flowchart* dengan 3 swimlane (Sistem, Operator, Admin).

```
                          ┌─────────────┐
                          │   START     │
                          │ (Buka App)  │
                          └──────┬──────┘
                                 │
                                 ▼
                       ┌─────────────────┐
                       │  Halaman Welcome │
                       │   (Landing Page) │
                       └────────┬────────┘
                                │
                        ┌───────┴───────┐
                        │ Sudah Login?  │
                        └───┬───────┬───┘
                        Ya  │       │ Tidak
                            │       ▼
                            │  ┌────────────┐
                            │  │ Login /    │
                            │  │ Register   │
                            │  └─────┬──────┘
                            │        │
                            │   ┌────┴────┐
                            │   │ Valid?  │
                            │   └──┬───┬──┘
                            │   Ya │   │ Tidak → Kembali ke Login
                            │      │
                            ▼      ▼
                     ┌──────────────────┐
                     │  Cek Role User   │
                     └───┬──────────┬───┘
                         │          │
               ┌─────────┘          └──────────┐
               ▼                               ▼
    ┌─────────────────────┐         ┌──────────────────────┐
    │  OPERATOR SEKOLAH   │         │   ADMIN DISDIK KBB   │
    │  /operator/dashboard│         │  /admin/dashboard     │
    └─────────┬───────────┘         └──────────┬───────────┘
              │                                │
    ┌─────────┴──────────┐           ┌─────────┴──────────┐
    │ • Dashboard        │           │ • Dashboard        │
    │ • Buat Surat       │           │ • Daftar Pengajuan │
    │ • Arsip Surat      │           │ • Verifikasi Surat │
    │ • Detail Surat     │           │ • Data Sekolah     │
    │ • Edit Profil      │           │ • Detail Sekolah   │
    │ • Revisi Surat     │           └────────────────────┘
    └────────────────────┘
```

---

## 4. Alur Autentikasi & Routing

> **Instruksi Visio:** Gunakan shape *Decision Diamond* untuk percabangan dan *Process Rectangle* untuk halaman.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     ALUR AUTENTIKASI & ROUTING                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User mengakses URL "/"                                                 │
│          │                                                               │
│          ▼                                                               │
│   ◇ Auth::check() ── Tidak ──▶ Render Welcome Page (Landing)            │
│          │                        │                                      │
│         Ya                   [Login] [Register]                          │
│          │                        │                                      │
│          ▼                        ▼                                      │
│   ◇ user->role ──────────── POST /login ───── Validasi                  │
│     │           │                                │                       │
│  "admin"    "operator"                     ◇ Berhasil?                   │
│     │           │                          │         │                   │
│     ▼           ▼                         Ya       Tidak                 │
│  Redirect    Redirect                      │         │                   │
│  /admin/     /operator/              Redirect    Error msg              │
│  dashboard   dashboard              /dashboard   Kembali                │
│                                          │                              │
│                                          ▼                              │
│                                   ◇ user->role                          │
│                                   │           │                         │
│                                "admin"    "operator"                    │
│                                   │           │                         │
│                                   ▼           ▼                         │
│                              /admin/      /operator/                    │
│                              dashboard    dashboard                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Halaman Auth yang tersedia:
  ┌───────────────────────────┐
  │ • /login (Login)          │
  │ • /register (Register)    │
  │ • /forgot-password        │
  │ • /reset-password         │
  │ • /verify-email           │
  │ • /confirm-password       │
  └───────────────────────────┘
```

---

## 5. Alur Operator Sekolah

> **Instruksi Visio:** Gunakan *Cross-Functional Flowchart* dengan swimlane "Operator" dan "Sistem".

### 5.1 Alur Keseluruhan Operator

```
┌───────────────────────────────────────────────────────────────────────────┐
│                      ALUR OPERATOR SEKOLAH                               │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌──────────────────────┐                                               │
│   │  Operator Dashboard  │◀────────────────────────────────────┐         │
│   │  /operator/dashboard │                                     │         │
│   └──────┬───────────────┘                                     │         │
│          │                                                     │         │
│   ┌──────┼────────────────┬──────────────────┐                │         │
│   │      │                │                  │                │         │
│   ▼      ▼                ▼                  ▼                │         │
│ [Buat  [Arsip           [Edit            [Lihat              │         │
│ Surat] Surat]           Profil]          Status              │         │
│   │      │                │              Network]            │         │
│   │      │                │                                   │         │
│   ▼      ▼                ▼                                   │         │
│ /operator/  /operator/   /operator/                           │         │
│ applications applications profile                             │         │
│ /create     (Index)      (Edit)                               │         │
│   │          │                │                               │         │
│   │          │                ▼                               │         │
│   │          │         ┌────────────────┐                    │         │
│   │          │         │ Form Edit:     │                    │         │
│   │          │         │ • Nama Sekolah │                    │         │
│   │          │         │ • NPSN         │                    │         │
│   │          │         │ • Jenjang      │                    │         │
│   │          │         │ • Akreditasi   │                    │         │
│   │          │         │ • Alamat       │                    │         │
│   │          │         │ • Telepon      │                    │         │
│   │          │         │ • Email        │                    │         │
│   │          │         │ • Kepsek       │                    │         │
│   │          │         │ • NIP Kepsek   │                    │         │
│   │          │         │ • Logo Kop     │                    │         │
│   │          │         └───────┬────────┘                    │         │
│   │          │                 │ POST /operator/profile       │         │
│   │          │                 ▼                              │         │
│   │          │           ◇ Valid? ── Ya ──▶ Profil Tersimpan ─┘         │
│   │          │              │                                           │
│   │          │           Tidak ──▶ Tampilkan Error                      │
│   │          │                                                          │
│   │          ▼                                                          │
│   │   ┌──────────────────┐                                              │
│   │   │ Daftar Surat     │                                              │
│   │   │ (Filter & Search)│                                              │
│   │   │ • Status Badge   │                                              │
│   │   │ • Pagination     │                                              │
│   │   └───────┬──────────┘                                              │
│   │           │ Klik Detail                                             │
│   │           ▼                                                          │
│   │   ┌──────────────────────────────────┐                              │
│   │   │ Detail Surat                     │                              │
│   │   │ /operator/applications/{id}      │                              │
│   │   │                                  │                              │
│   │   │ ◇ Status = revision_requested?   │                              │
│   │   │   │           │                  │                              │
│   │   │  Ya         Tidak                │                              │
│   │   │   │           │                  │                              │
│   │   │   ▼           ▼                  │                              │
│   │   │ [Form Edit  [Tampilan            │                              │
│   │   │  + Banner   Read-Only            │                              │
│   │   │  Revisi]    + Preview]           │                              │
│   │   │   │                              │                              │
│   │   │   │ PUT /operator/applications/  │                              │
│   │   │   │     {id}                     │                              │
│   │   │   ▼                              │                              │
│   │   │ Status → "submitted" ────────────┘                              │
│   │   │ (Dikirim ulang ke Admin)                                        │
│   │   └──────────────────────────────────┘                              │
│   │                                                                      │
│   ▼                                                                      │
│  (Lihat Diagram 5.2 — Alur Pembuatan Surat)                            │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Alur Pembuatan Surat Baru (Detail)

```
┌───────────────────────────────────────────────────────────────────────────┐
│              ALUR PEMBUATAN SURAT BARU (OPERATOR)                        │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌────────────────────┐                                                 │
│   │  Klik "Buat Surat" │                                                │
│   │  (New Entry)       │                                                 │
│   └─────────┬──────────┘                                                 │
│             │                                                             │
│             ▼                                                             │
│   ┌─────────────────────────────────────────────────────────────┐        │
│   │        HALAMAN CREATE (Split Screen)                        │        │
│   │  ┌──────────────────────┬──────────────────────────┐       │        │
│   │  │   FORM (50%)         │   LIVE PREVIEW (50%)     │       │        │
│   │  │                      │                          │       │        │
│   │  │  ① Pilih Template    │   📄 Preview Surat      │       │        │
│   │  │     Surat            │      Real-time           │       │        │
│   │  │     ▼                │                          │       │        │
│   │  │  ② Pilih Kode        │   • Kop Surat Sekolah   │       │        │
│   │  │     Klasifikasi      │   • Nomor Surat (Draft)  │       │        │
│   │  │     ▼                │   • Perihal              │       │        │
│   │  │  ③ Isi Tujuan Surat  │   • Tujuan               │       │        │
│   │  │     (Recipient)      │   • Isi/Body Surat       │       │        │
│   │  │     ▼                │   • Tanda Tangan         │       │        │
│   │  │  ④ Isi Perihal       │   • Tembusan             │       │        │
│   │  │     (Subject)        │                          │       │        │
│   │  │     ▼                │   [Berubah real-time     │       │        │
│   │  │  ⑤ Isi Parameter     │    saat form diisi]      │       │        │
│   │  │     Khusus           │                          │       │        │
│   │  │     (Jika ada)       │                          │       │        │
│   │  │     ▼                │                          │       │        │
│   │  │  ⑥ Isi Narasi/       │                          │       │        │
│   │  │     Body Surat       │                          │       │        │
│   │  │     ▼                │                          │       │        │
│   │  │  ⑦ [Kirim Pengajuan] │                          │       │        │
│   │  │                      │                          │       │        │
│   │  └──────────┬───────────┴──────────────────────────┘       │        │
│   └─────────────┼───────────────────────────────────────────────┘        │
│                 │                                                         │
│                 ▼                                                         │
│       POST /operator/applications                                        │
│                 │                                                         │
│          ┌──────┴──────┐                                                 │
│          │  Validasi   │                                                 │
│          └──┬───────┬──┘                                                 │
│          Valid   Tidak Valid                                              │
│             │       │                                                     │
│             │       ▼                                                     │
│             │   Tampilkan Error                                          │
│             │   (Kembali ke Form)                                        │
│             │                                                             │
│             ▼                                                             │
│    ┌─────────────────────────────┐                                       │
│    │ Data Tersimpan:             │                                       │
│    │ • application_number: AUTO  │                                       │
│    │   (APP-YYYYMMDD-XXXX)      │                                       │
│    │ • status: "submitted"      │                                       │
│    │ • school_id: auto (user)   │                                       │
│    │ • user_id: auto (auth)     │                                       │
│    └────────────┬────────────────┘                                       │
│                 │                                                         │
│                 ▼                                                         │
│       Redirect ke Detail Surat                                           │
│       /operator/applications/{id}                                        │
│       + Flash "Berhasil dikirim"                                         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Alur Admin Disdik KBB

> **Instruksi Visio:** Gunakan *Cross-Functional Flowchart* dengan swimlane "Admin" dan "Sistem".

### 6.1 Alur Keseluruhan Admin

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        ALUR ADMIN DISDIK KBB                             │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌──────────────────────┐                                               │
│   │   Admin Dashboard    │◀──────────────────────────────────┐          │
│   │  /admin/dashboard    │                                    │          │
│   │                      │                                    │          │
│   │  Menampilkan:        │                                    │          │
│   │  • Total Dispatches  │                                    │          │
│   │  • Pending Review    │                                    │          │
│   │  • Total Sekolah     │                                    │          │
│   │  • Tabel Pengajuan   │                                    │          │
│   │  • Sidebar Sekolah   │                                    │          │
│   └──────┬───────────────┘                                    │          │
│          │                                                    │          │
│   ┌──────┼─────────────────┬──────────────────┐              │          │
│   │      │                 │                  │              │          │
│   ▼      ▼                 ▼                  ▼              │          │
│ [Verifikasi  [Daftar     [Daftar           [Detail          │          │
│  Surat]      Pengajuan]   Sekolah]          Sekolah]        │          │
│   │            │             │                │              │          │
│   │            ▼             ▼                ▼              │          │
│   │     /admin/        /admin/          /admin/              │          │
│   │     applications   schools          schools/{id}         │          │
│   │     (Index)        (Index)          (Show)               │          │
│   │        │               │                │                │          │
│   │        │               │                ▼                │          │
│   │        │               │        ┌──────────────┐        │          │
│   │        │               │        │ Detail Info: │        │          │
│   │        │               │        │ • NPSN       │        │          │
│   │        │               │        │ • Jenjang    │        │          │
│   │        │               │        │ • Akreditasi │        │          │
│   │        │               │        │ • Alamat     │        │          │
│   │        │               │        │ • Kepsek     │        │          │
│   │        │               │        └──────┬───────┘        │          │
│   │        │               │               │                │          │
│   │        │               └───────────────┘                │          │
│   │        │                                                 │          │
│   │        │  Filter: search, status                         │          │
│   │        │  Pagination: 10/halaman                         │          │
│   │        │                                                 │          │
│   │        │ Klik pengajuan                                  │          │
│   │        ▼                                                 │          │
│   └──▶┌────────────────────────────────────────┐            │          │
│       │  HALAMAN VERIFIKASI SURAT              │            │          │
│       │  /admin/applications/{id}              │            │          │
│       │                                        │            │          │
│       │  ┌─────────────────┬───────────────┐   │            │          │
│       │  │ Panel Keputusan │ Letter Preview│   │            │          │
│       │  │    (42%)        │    (58%)      │   │            │          │
│       │  │                 │               │   │            │          │
│       │  │ • Status        │  📄 Preview   │   │            │          │
│       │  │ • Sekolah       │     Surat     │   │            │          │
│       │  │ • Perihal       │     Full      │   │            │          │
│       │  │ • Catatan       │     Fidelity  │   │            │          │
│       │  │                 │               │   │            │          │
│       │  │ ┌─────────────┐ │               │   │            │          │
│       │  │ │[✓ Setujui]  │ │               │   │            │          │
│       │  │ │[✎ Revisi]   │ │               │   │            │          │
│       │  │ │[✗ Tolak]    │ │               │   │            │          │
│       │  │ └──────┬──────┘ │               │   │            │          │
│       │  └────────┼────────┴───────────────┘   │            │          │
│       └───────────┼────────────────────────────┘            │          │
│                   │                                          │          │
│                   ▼                                          │          │
│       ┌───────────────────────┐                              │          │
│       │  MODAL VERIFIKASI     │                              │          │
│       │  (RevisionFeedback)   │                              │          │
│       │                       │                              │          │
│       │  ◇ Pilih Keputusan:   │                              │          │
│       │  ┌─────┬──────┬─────┐ │                              │          │
│       │  │ ✓   │  ✎   │ ✗   │ │                              │          │
│       │  │Setu-│Beri  │Tolak│ │                              │          │
│       │  │jui  │Revisi│     │ │                              │          │
│       │  └──┬──┴──┬───┴──┬──┘ │                              │          │
│       │     │     │      │    │                              │          │
│       └─────┼─────┼──────┼────┘                              │          │
│             │     │      │                                   │          │
│     ┌───────┘     │      └────────┐                          │          │
│     ▼             ▼               ▼                          │          │
│  ┌──────────┐ ┌──────────┐  ┌──────────┐                    │          │
│  │APPROVED  │ │REVISION  │  │REJECTED  │                    │          │
│  │          │ │REQUESTED │  │          │                    │          │
│  │Input:    │ │          │  │Input:    │                    │          │
│  │• No.Surat│ │Input:    │  │• Alasan  │                    │          │
│  │  (opsio- │ │• Catatan │  │  Penolak-│                    │          │
│  │  nal/    │ │  Revisi  │  │  an      │                    │          │
│  │  otomatis│ │  (wajib) │  │  (wajib) │                    │          │
│  │• Tgl     │ │          │  │          │                    │          │
│  │  Diterima│ │          │  │          │                    │          │
│  │• Nama    │ │          │  │          │                    │          │
│  │  Penerima│ │          │  │          │                    │          │
│  │• Jabatan │ │          │  │          │                    │          │
│  │• NIP     │ │          │  │          │                    │          │
│  └────┬─────┘ └────┬─────┘  └────┬─────┘                    │          │
│       │            │             │                           │          │
│       └────────────┼─────────────┘                           │          │
│                    │                                         │          │
│                    ▼                                         │          │
│         PATCH /admin/applications/{id}/status                │          │
│                    │                                         │          │
│                    ▼                                         │          │
│         Status Pengajuan Diperbarui ─────────────────────────┘          │
│         + Flash Message "Berhasil"                                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Siklus Hidup Status Pengajuan (State Diagram)

> **Instruksi Visio:** Gunakan template *UML State Diagram* atau buat manual dengan rounded rectangle untuk state dan panah berlabel untuk transisi.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  STATE DIAGRAM - STATUS PENGAJUAN                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    ╔═══════════════╗                                    │
│                    ║   SUBMITTED   ║◀──────────────────────────┐       │
│                    ║  (Terkirim)   ║                            │       │
│                    ╚═══════╤═══════╝                            │       │
│                            │                                    │       │
│                    Admin membuka &                               │       │
│                    mereview surat                                │       │
│                            │                                    │       │
│                            ▼                                    │       │
│                    ╔═══════════════╗                            │       │
│                    ║ UNDER_REVIEW  ║                            │       │
│                    ║ (Sedang       ║                            │       │
│                    ║  Diperiksa)   ║                            │       │
│                    ╚═══════╤═══════╝                            │       │
│                            │                                    │       │
│              ┌─────────────┼─────────────┐                     │       │
│              │             │             │                     │       │
│              ▼             ▼             ▼                     │       │
│     ╔══════════════╗ ╔═══════════╗ ╔══════════════════╗       │       │
│     ║   APPROVED   ║ ║ REJECTED  ║ ║    REVISION      ║       │       │
│     ║  (Disetujui) ║ ║ (Ditolak) ║ ║    REQUESTED     ║       │       │
│     ║              ║ ║           ║ ║ (Perlu Revisi)   ║       │       │
│     ║ • No. Surat  ║ ║ • Alasan  ║ ║                  ║       │       │
│     ║   Resmi      ║ ║   Tolak   ║ ║ • Catatan Revisi ║       │       │
│     ║   Terbit     ║ ║           ║ ║   dari Admin     ║       │       │
│     ║ • approved_  ║ ║           ║ ║                  ║       │       │
│     ║   at diisi   ║ ║           ║ ║                  ║       │       │
│     ╚══════════════╝ ╚═══════════╝ ╚════════╤═════════╝       │       │
│        [FINAL]         [FINAL]              │                  │       │
│                                    Operator mengedit           │       │
│                                    & mengirim ulang            │       │
│                                    (PUT /operator/             │       │
│                                     applications/{id})        │       │
│                                              │                 │       │
│                                              └─────────────────┘       │
│                                        Status kembali ke               │
│                                        "submitted"                     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  Catatan: Status tersedia dalam validasi:                               │
│  submitted | under_review | revision_requested | approved | rejected    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Entity Relationship Diagram (ERD)

> **Instruksi Visio:** Gunakan template *Database Model Diagram* atau *Entity Relationship*.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ENTITY RELATIONSHIP DIAGRAM                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┐          ┌────────────────────────────────┐  │
│  │       schools         │          │         users                  │  │
│  ├──────────────────────┤          ├────────────────────────────────┤  │
│  │ PK  id               │──┐      │ PK  id                        │  │
│  │     npsn              │  │  ┌──▶│ FK  school_id → schools.id    │  │
│  │     name              │  │  │   │     name                      │  │
│  │     jenjang           │  │  │   │     email                     │  │
│  │     status_akreditasi │  ├──┘   │     password                  │  │
│  │     address           │  │      │     role (admin|operator)     │  │
│  │     phone             │  │      │     email_verified_at         │  │
│  │     email             │  │      │     remember_token            │  │
│  │     headmaster_name   │  │      │     created_at                │  │
│  │     headmaster_nip    │  │      │     updated_at                │  │
│  │     logo_kop_path     │  │      └────────────────────────────────┘  │
│  │     created_at        │  │                    │                     │
│  │     updated_at        │  │                    │ 1:N (user_id)       │
│  └──────────────────────┘  │                    │                     │
│             │               │                    │                     │
│             │ 1:N           │                    │                     │
│             │ (school_id)   │                    │                     │
│             │               │                    │                     │
│             ▼               │                    ▼                     │
│  ┌──────────────────────────┴────────────────────────────────────────┐ │
│  │                   letter_applications                             │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ PK  id                                                           │ │
│  │     application_number  (VARCHAR, unique: APP-YYYYMMDD-XXXX)     │ │
│  │ FK  school_id           → schools.id                             │ │
│  │ FK  user_id             → users.id                               │ │
│  │     template_code       (VARCHAR, kode template surat)           │ │
│  │     letter_name         (VARCHAR, nama jenis surat)              │ │
│  │     subject             (VARCHAR, perihal surat)                 │ │
│  │     recipient           (VARCHAR, tujuan/kepada)                 │ │
│  │     body_content        (TEXT, isi narasi surat)                 │ │
│  │     form_data_json      (JSON, parameter khusus + data penerima) │ │
│  │     status              (ENUM: submitted, under_review,          │ │
│  │                          revision_requested, approved, rejected) │ │
│  │     admin_notes         (TEXT, nullable, catatan dari admin)     │ │
│  │     official_letter_number (VARCHAR, nullable, nomor resmi)      │ │
│  │     approved_at         (DATETIME, nullable)                     │ │
│  │     created_at                                                    │ │
│  │     updated_at                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                   letter_templates                                │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ PK  id                                                           │  │
│  │     code                  (VARCHAR, kode unik template)          │  │
│  │     classification_code   (VARCHAR, kode klasifikasi surat)      │  │
│  │     name                  (VARCHAR, nama template)               │  │
│  │     category              (VARCHAR, kategori surat)              │  │
│  │     description           (TEXT, deskripsi)                      │  │
│  │     default_subject       (VARCHAR, perihal default)             │  │
│  │     default_body_template (TEXT, body template default)          │  │
│  │     required_fields_json  (JSON, field tambahan yang diperlukan) │  │
│  │     created_at                                                    │  │
│  │     updated_at                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Relasi:                                                                │
│  • schools 1 ──── N users           (Satu sekolah punya banyak user)   │
│  • schools 1 ──── N letter_applications (Satu sekolah punya banyak    │
│                                          pengajuan)                    │
│  • users   1 ──── N letter_applications (Satu user membuat banyak     │
│                                          pengajuan)                    │
│  • letter_templates (standalone, direferensi via template_code)        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Storyboard Per Halaman

> **Instruksi Visio:** Gunakan kotak besar untuk mewakili setiap halaman/layar. Gambarkan wireframe sederhana di dalam kotak.

---

### 9.1 Halaman Welcome / Landing Page

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 01: Welcome Page (/)                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [Logo Laravel]               [Login]  [Register]       │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │                                                          │    │
│  │              SELAMAT DATANG DI SIKATAR                   │    │
│  │     Sistem Informasi Korespondensi & Administrasi       │    │
│  │              Tata Surat Disdik KBB                      │    │
│  │                                                          │    │
│  │         [Masuk ke Dashboard →]                           │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Navigasi:                                                       │
│  • Jika sudah login → redirect ke dashboard sesuai role         │
│  • Jika belum → tampilkan tombol Login & Register               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Halaman Login

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 02: Login (/login)                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │                      LOG IN                              │    │
│  │                                                          │    │
│  │    Email:     [________________________]                 │    │
│  │    Password:  [________________________]                 │    │
│  │                                                          │    │
│  │    [✓] Remember me                                       │    │
│  │                                                          │    │
│  │    [Forgot password?]              [Log in →]            │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Aksi:                                                           │
│  • POST /login                                                   │
│  • Berhasil → redirect ke /dashboard → /admin atau /operator    │
│  • Gagal → tampilkan pesan error di form                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 Dashboard Operator

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 03: Operator Dashboard (/operator/dashboard)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┬──────────────────────────────────────────────┐    │
│  │          │  [Tanggal Hari Ini]                           │    │
│  │ SIDEBAR  │  Ringkasan Disdik KBB    [+ New Entry Surat] │    │
│  │          │                                               │    │
│  │ • Dashb  │  ┌──────────┬──────────┬──────────┐          │    │
│  │ • Buat   │  │ Total    │ Pending  │ Status   │          │    │
│  │   Surat  │  │ Surat    │ Review   │ Sekolah  │          │    │
│  │ • Arsip  │  │ Diajukan │ Disdik   │ [Nama]   │          │    │
│  │ • Profil │  │   12     │    3     │ NPSN:... │          │    │
│  │          │  └──────────┴──────────┴──────────┘          │    │
│  │          │                                               │    │
│  │          │  ┌───────────────────┬────────────────┐      │    │
│  │          │  │ Riwayat Pengajuan │ Quick Actions  │      │    │
│  │          │  │ Terbaru (8 col)   │ (4 col)        │      │    │
│  │          │  │                   │                │      │    │
│  │          │  │ • Item surat 1    │ → Buat Surat   │      │    │
│  │          │  │   [badge status]  │ → Edit Profil  │      │    │
│  │          │  │ • Item surat 2    │ → Arsip Surat  │      │    │
│  │          │  │   [badge status]  │                │      │    │
│  │          │  │ [Lihat Semua →]   │ Network Status │      │    │
│  │          │  └───────────────────┴────────────────┘      │    │
│  └──────────┴──────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.4 Form Buat Surat (Operator)

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 04: Buat Surat (/operator/applications/create)          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┬──────────────────────────────────────────────┐    │
│  │          │                                               │    │
│  │ SIDEBAR  │  ┌────────────────┬────────────────────┐     │    │
│  │          │  │  FORM (50%)    │  LIVE PREVIEW (50%) │     │    │
│  │          │  │                │                     │     │    │
│  │          │  │ Form Pengajuan │   ┌─────────────┐  │     │    │
│  │          │  │ Surat Pengantar│   │  ┌───┐      │  │     │    │
│  │          │  │                │   │  │KOP│      │  │     │    │
│  │          │  │ Template:      │   │  │   │      │  │     │    │
│  │          │  │ [▼ Dropdown]   │   │  └───┘      │  │     │    │
│  │          │  │                │   │             │  │     │    │
│  │          │  │ Kode Klasifi-  │   │  No: DRAFT  │  │     │    │
│  │          │  │ kasi:          │   │  Perihal:.. │  │     │    │
│  │          │  │ [▼ Dropdown]   │   │  Kepada:..  │  │     │    │
│  │          │  │                │   │             │  │     │    │
│  │          │  │ Tujuan Surat:  │   │  [Isi Body] │  │     │    │
│  │          │  │ [__________]   │   │             │  │     │    │
│  │          │  │                │   │  TTD        │  │     │    │
│  │          │  │ Perihal:       │   │  Kepsek     │  │     │    │
│  │          │  │ [__________]   │   │             │  │     │    │
│  │          │  │                │   │  Tembusan   │  │     │    │
│  │          │  │ Parameter      │   └─────────────┘  │     │    │
│  │          │  │ Khusus: [...]  │                     │     │    │
│  │          │  │                │  (Berubah real-time │     │    │
│  │          │  │ Narasi/Body:   │   saat form diisi)  │     │    │
│  │          │  │ [textarea]     │                     │     │    │
│  │          │  │                │                     │     │    │
│  │          │  │ [Kirim Surat →]│                     │     │    │
│  │          │  └────────────────┴────────────────────┘     │    │
│  └──────────┴──────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.5 Daftar Pengajuan (Operator/Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 05: Daftar Pengajuan (/operator/applications atau       │
│                                /admin/applications)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┬──────────────────────────────────────────────┐    │
│  │          │                                               │    │
│  │ SIDEBAR  │  Daftar Pengajuan Surat                      │    │
│  │          │                                               │    │
│  │          │  ┌──────────────────────────────────────┐     │    │
│  │          │  │ [🔍 Cari...]    [▼ Filter Status]    │     │    │
│  │          │  └──────────────────────────────────────┘     │    │
│  │          │                                               │    │
│  │          │  ┌──────────────────────────────────────┐     │    │
│  │          │  │ No. │ Perihal  │ Sekolah │ Status │ →│     │    │
│  │          │  ├─────┼──────────┼─────────┼────────┼──┤     │    │
│  │          │  │ 001 │ Kenaikan │ SDN 1   │🟡Pend. │ →│     │    │
│  │          │  │ 002 │ Mutasi   │ SDN 2   │🟢Appr. │ →│     │    │
│  │          │  │ 003 │ Izin     │ SMP 1   │🔴Rej.  │ →│     │    │
│  │          │  │ 004 │ Pangkat  │ SDN 3   │🟠Rev.  │ →│     │    │
│  │          │  └──────────────────────────────────────┘     │    │
│  │          │                                               │    │
│  │          │  [← Prev]  Hal. 1 dari 5  [Next →]           │    │
│  │          │                                               │    │
│  └──────────┴──────────────────────────────────────────────┘    │
│                                                                  │
│  Klik baris → redirect ke halaman detail/show                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.6 Detail & Verifikasi Surat (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 06: Verifikasi Surat (/admin/applications/{id})         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┬──────────────────────────────────────────────┐    │
│  │          │  [← Kembali]                                  │    │
│  │ SIDEBAR  │  Pemeriksaan Application #APP-20260808-A1B2   │    │
│  │          │  Verifikasi Surat Masuk                       │    │
│  │          │                                               │    │
│  │          │  ┌──────────────────┬──────────────────┐     │    │
│  │          │  │ PANEL KEPUTUSAN  │  LETTER PREVIEW   │     │    │
│  │          │  │ (5 col)          │  (7 col)          │     │    │
│  │          │  │                  │                   │     │    │
│  │          │  │ Status: 🟡       │   ┌───────────┐  │     │    │
│  │          │  │ Submitted        │   │           │  │     │    │
│  │          │  │                  │   │  PREVIEW  │  │     │    │
│  │          │  │ Sekolah:         │   │  SURAT    │  │     │    │
│  │          │  │ SDN 1 Padalarang │   │  RESMI    │  │     │    │
│  │          │  │ NPSN: 20201001   │   │  (Full    │  │     │    │
│  │          │  │                  │   │  Fidelity)│  │     │    │
│  │          │  │ Perihal:         │   │           │  │     │    │
│  │          │  │ Kenaikan Pangkat │   │           │  │     │    │
│  │          │  │                  │   │           │  │     │    │
│  │          │  │ ┌──────────────┐ │   │           │  │     │    │
│  │          │  │ │[✓ Setujui & ││   │           │  │     │    │
│  │          │  │ │ Terbitkan No]││   └───────────┘  │     │    │
│  │          │  │ │[✎ Beri      ││                   │     │    │
│  │          │  │ │ Catatan Rev.]││                   │     │    │
│  │          │  │ │[✗ Tolak     ││                   │     │    │
│  │          │  │ │ Application] ││                   │     │    │
│  │          │  │ └──────────────┘ │                   │     │    │
│  │          │  └──────────────────┴──────────────────┘     │    │
│  └──────────┴──────────────────────────────────────────────┘    │
│                                                                  │
│  Klik tombol aksi → Buka Modal Verifikasi (Screen 07)           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.7 Modal Verifikasi (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 07: Modal Verifikasi (Overlay)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ╔══════════════════════════════════════════════════╗    │    │
│  │  ║  Verifikasi & Pemeriksaan Disdik KBB      [✕]   ║    │    │
│  │  ╠══════════════════════════════════════════════════╣    │    │
│  │  ║                                                  ║    │    │
│  │  ║  Keputusan Verifikasi:                           ║    │    │
│  │  ║  ┌──────────┬──────────┬──────────┐              ║    │    │
│  │  ║  │ ✓ Setujui│ ✎ Revisi │ ✗ Tolak  │              ║    │    │
│  │  ║  └──────────┴──────────┴──────────┘              ║    │    │
│  │  ║                                                  ║    │    │
│  │  ║  [Jika Setujui:]                                 ║    │    │
│  │  ║  Data Penerimaan Resmi:                          ║    │    │
│  │  ║  • Nomor Surat Resmi: [_________] (opsional)     ║    │    │
│  │  ║  • Tgl Diterima: [_________]                     ║    │    │
│  │  ║  • Jabatan Penerima: [_________]                 ║    │    │
│  │  ║  • Nama Penerima: [_________]                    ║    │    │
│  │  ║  • NIP Penerima: [_________]                     ║    │    │
│  │  ║                                                  ║    │    │
│  │  ║  Catatan / Alasan:                               ║    │    │
│  │  ║  [textarea__________________________]            ║    │    │
│  │  ║                                                  ║    │    │
│  │  ║               [Batal]  [Simpan Keputusan →]      ║    │    │
│  │  ╚══════════════════════════════════════════════════╝    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Aksi: PATCH /admin/applications/{id}/status                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.8 Detail Surat + Revisi (Operator)

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 08: Detail Surat Operator (/operator/applications/{id}) │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┬──────────────────────────────────────────────┐    │
│  │          │  [← Kembali ke Archive]                       │    │
│  │ SIDEBAR  │  Application #APP-20260808-A1B2               │    │
│  │          │  Detail & Status Surat                        │    │
│  │          │                                               │    │
│  │          │  [Jika status = revision_requested:]          │    │
│  │          │  ┌──────────────────────────────────────┐     │    │
│  │          │  │ ⚠️ CATATAN REVISI DARI ADMIN DISDIK: │     │    │
│  │          │  │ "Mohon lengkapi lampiran berkas..."   │     │    │
│  │          │  │ Silakan perbaiki dan Kirim Ulang.     │     │    │
│  │          │  └──────────────────────────────────────┘     │    │
│  │          │                                               │    │
│  │          │  ┌────────────────┬─────────────────────┐    │    │
│  │          │  │ INFO & FORM    │  LETTER PREVIEW      │    │    │
│  │          │  │ REVISI (5 col) │  (7 col)             │    │    │
│  │          │  │                │                      │    │    │
│  │          │  │ Status: 🟠 Rev│   ┌──────────────┐   │    │    │
│  │          │  │ No: APP-...   │   │              │   │    │    │
│  │          │  │               │   │   PREVIEW    │   │    │    │
│  │          │  │ [Form Edit:]  │   │   SURAT      │   │    │    │
│  │          │  │ Recipient:    │   │   REALTIME   │   │    │    │
│  │          │  │ [__________]  │   │              │   │    │    │
│  │          │  │ Subject:      │   │              │   │    │    │
│  │          │  │ [__________]  │   └──────────────┘   │    │    │
│  │          │  │ Body:         │                      │    │    │
│  │          │  │ [textarea]    │                      │    │    │
│  │          │  │               │                      │    │    │
│  │          │  │ [Kirim Ulang  │                      │    │    │
│  │          │  │  Perbaikan →] │                      │    │    │
│  │          │  └────────────────┴─────────────────────┘    │    │
│  └──────────┴──────────────────────────────────────────────┘    │
│                                                                  │
│  Aksi: PUT /operator/applications/{id}                          │
│  Setelah submit → status kembali ke "submitted"                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.9 Dashboard Admin

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 09: Admin Dashboard (/admin/dashboard)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┬──────────────────────────────────────────────┐    │
│  │          │  [Tanggal Hari Ini]                           │    │
│  │ SIDEBAR  │  Ringkasan Verifikasi   [Verifikasi Masuk →] │    │
│  │          │                                               │    │
│  │ • Dashb  │  ┌──────────┬──────────┬──────────┐          │    │
│  │ • Daftar │  │ Total    │ Pending  │ Total    │          │    │
│  │   Surat  │  │ Dispatch │ Review   │ Sekolah  │          │    │
│  │ • Data   │  │ Masuk    │ Disdik   │ KBB      │          │    │
│  │  Sekolah │  │   45     │    8     │ 120      │          │    │
│  │          │  └──────────┴──────────┴──────────┘          │    │
│  │          │                                               │    │
│  │          │  ┌───────────────────┬────────────────┐      │    │
│  │          │  │ Daftar Pengajuan  │ Faculty &      │      │    │
│  │          │  │ Perlu Tindakan    │ Schools        │      │    │
│  │          │  │ (8 col)           │ (4 col)        │      │    │
│  │          │  │                   │                │      │    │
│  │          │  │ [Tabel Aplikasi   │ SDN 1 [cnt]   │      │    │
│  │          │  │  dengan status,   │ SDN 2 [cnt]   │      │    │
│  │          │  │  sekolah, dll]    │ SMP 1 [cnt]   │      │    │
│  │          │  │                   │ [View All]    │      │    │
│  │          │  │ [Semua Pengajuan→]│                │      │    │
│  │          │  └───────────────────┴────────────────┘      │    │
│  └──────────┴──────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.10 Edit Profil Sekolah (Operator)

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 10: Edit Profil (/operator/profile)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┬──────────────────────────────────────────────┐    │
│  │          │                                               │    │
│  │ SIDEBAR  │  Profil & Kop Surat Sekolah                  │    │
│  │          │                                               │    │
│  │          │  ┌───────────────────────────────────┐        │    │
│  │          │  │  Informasi Sekolah                │        │    │
│  │          │  │                                   │        │    │
│  │          │  │  Nama Sekolah: [______________]   │        │    │
│  │          │  │  NPSN:         [______________]   │        │    │
│  │          │  │  Jenjang:      [▼ SD/SMP/SMA]     │        │    │
│  │          │  │  Akreditasi:   [▼ A/B/C]          │        │    │
│  │          │  │  Alamat:       [______________]   │        │    │
│  │          │  │  Telepon:      [______________]   │        │    │
│  │          │  │  Email:        [______________]   │        │    │
│  │          │  └───────────────────────────────────┘        │    │
│  │          │                                               │    │
│  │          │  ┌───────────────────────────────────┐        │    │
│  │          │  │  Data Kepala Sekolah              │        │    │
│  │          │  │                                   │        │    │
│  │          │  │  Nama Kepsek: [______________]    │        │    │
│  │          │  │  NIP Kepsek:  [______________]    │        │    │
│  │          │  └───────────────────────────────────┘        │    │
│  │          │                                               │    │
│  │          │  ┌───────────────────────────────────┐        │    │
│  │          │  │  Logo Kop Surat                   │        │    │
│  │          │  │  [Preview Logo]  [📁 Upload]      │        │    │
│  │          │  └───────────────────────────────────┘        │    │
│  │          │                                               │    │
│  │          │             [💾 Simpan Perubahan]              │    │
│  │          │                                               │    │
│  └──────────┴──────────────────────────────────────────────┘    │
│                                                                  │
│  Aksi: POST /operator/profile (multipart, termasuk logo)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Panduan Shape Visio

> Gunakan tabel referensi ini saat membuat diagram di Microsoft Visio.

### 10.1 Shape untuk Flowchart

| Shape | Bentuk | Kegunaan |
|-------|--------|----------|
| **Terminator** | Rounded Rectangle (⬭) | Start / End |
| **Process** | Rectangle (▬) | Halaman / Proses / Aksi |
| **Decision** | Diamond (◇) | Percabangan / Kondisi |
| **Data / I/O** | Parallelogram (▱) | Input form / Output data |
| **Document** | Wavy-bottom Rectangle | Surat / Dokumen |
| **Database** | Cylinder | Database / Penyimpanan |
| **Connector** | Arrow (→) | Alur / Arah proses |
| **Off-Page Ref** | Pentagon | Referensi ke diagram lain |

### 10.2 Kode Warna yang Disarankan

| Elemen | Warna | Hex Code |
|--------|-------|----------|
| Operator Sekolah | Biru Muda | `#DBEAFE` |
| Admin Disdik KBB | Hijau Muda | `#D1FAE5` |
| Sistem / Proses | Abu-abu | `#F3F4F6` |
| Error / Tolak | Merah Muda | `#FEE2E2` |
| Berhasil / Setuju | Hijau | `#10B981` |
| Revisi / Warning | Kuning | `#FEF3C7` |
| Primary / Header | Hitam/Gelap | `#1C1B1F` |
| Submitted | Biru | `#3B82F6` |
| Under Review | Ungu | `#8B5CF6` |
| Approved | Hijau | `#059669` |
| Revision Requested | Oranye | `#F59E0B` |
| Rejected | Merah | `#EF4444` |

### 10.3 Tips Pembuatan di Visio

1. **Template yang Disarankan:**
   - `Basic Flowchart` → Untuk alur umum
   - `Cross-Functional Flowchart` → Untuk swimlane per aktor
   - `UML State Diagram` → Untuk siklus status
   - `Database Model Diagram` → Untuk ERD
   - `Wireframe` → Untuk storyboard UI

2. **Swimlane:** Buat 3 swimlane: **Operator**, **Sistem**, **Admin**

3. **Layer:** Pisahkan diagram menjadi beberapa halaman Visio:
   - Halaman 1: **Diagram Alur Utama** (Section 3)
   - Halaman 2: **Alur Autentikasi** (Section 4)
   - Halaman 3: **Alur Operator** (Section 5)
   - Halaman 4: **Alur Admin** (Section 6)
   - Halaman 5: **State Diagram Status** (Section 7)
   - Halaman 6: **ERD Database** (Section 8)
   - Halaman 7-16: **Storyboard Layar** (Section 9, 1 layar per halaman)

4. **Penomoran:** Gunakan format `SCREEN-XX` untuk setiap layar storyboard

---

## Ringkasan Sitemap Aplikasi

```
SIKATAR
├── / (Welcome / Landing Page)
├── /login
├── /register
├── /forgot-password
├── /reset-password
├── /verify-email
├── /confirm-password
├── /dashboard (redirect berdasarkan role)
│
├── /admin/ (Admin Disdik KBB)
│   ├── dashboard
│   ├── applications (Index - Daftar semua pengajuan)
│   ├── applications/{id} (Show - Detail & Verifikasi)
│   ├── applications/{id}/status [PATCH] (Update status)
│   ├── schools (Index - Daftar sekolah)
│   └── schools/{id} (Show - Detail sekolah)
│
├── /operator/ (Operator Sekolah)
│   ├── dashboard
│   ├── applications (Index - Daftar pengajuan sekolah)
│   ├── applications/create (Form buat surat baru)
│   ├── applications [POST] (Simpan surat baru)
│   ├── applications/{id} (Show - Detail & Revisi surat)
│   ├── applications/{id} [PUT] (Update/Resubmit surat)
│   ├── profile (Edit profil sekolah)
│   └── profile [POST] (Simpan profil)
│
└── /profile (Edit profil user - umum)
    ├── [PATCH] (Update profil)
    └── [DELETE] (Hapus akun)
```

---

> **Catatan:** Dokumen ini dirancang sebagai **referensi lengkap** untuk pembuatan diagram di Microsoft Visio. Setiap section dapat dikonversi menjadi satu halaman diagram terpisah di file Visio.
