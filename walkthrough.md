# Walkthrough: Full Application Refactoring (SRP, Modularity & Dedicated State Hooks)

Sistem SIKATAR kini telah selesai direfaktor secara komprehensif pada **seluruh modul antarmuka dan manajemen state**, memenuhi seluruh prinsip:
1. **Single Responsibility Principle (SRP)** pada setiap komponen UI.
2. **Pemisahan UI ke `Partials/`**.
3. **Pemisahan Logika & Manajemen State ke 15 Custom Hooks Terisolasi** di `resources/js/Hooks/`.

---

## 1. Daftar 15 Custom Hooks Manajemen State (`resources/js/Hooks/`)

| Nama Hook | Tanggung Jawab & Fitur Utama | Digunakan Pada |
| :--- | :--- | :--- |
| `useEmployeeForm.js` | Mengelola form state data pegawai, validasi, upload pasfoto, auto-lookup NIP, dan pengiriman Create/Edit (Operator & Admin). | `Operator/Employees/Create`, `Admin/Employees/Create`, `Operator/Employees/Edit`, `Admin/Employees/Edit` |
| `useEmployeeAuthorization.js` | Mengelola state gate otorisasi Surat Perintah Kepala Sekolah untuk izin edit data pegawai. | `Operator/Employees/Edit` |
| `useEmployeeDeleteModal.js` | Mengelola state target pegawai dan visibilitas modal permohonan hapus/arsip. | `Operator/Employees/Index` |
| `useRequestDeletionForm.js` | Mengelola form upload surat perintah dan alasan penghapusan pegawai oleh operator. | `Partials/RequestDeletionModal` |
| `useDeletionModals.js` | Mengelola state target permohonan dan visibilitas modal Approve/Reject oleh Admin. | `Admin/DeletionRequests/Index` |
| `useDeletionDecisionForm.js` | Mengelola form catatan/alasan review admin serta submit PATCH status persetujuan. | `Partials/ApproveDeletionModal`, `Partials/RejectDeletionModal` |
| `useSchoolProfileForm.js` | Mengelola state form profil sekolah, auto-extract ttd basah, preview logo kop, dan cap resmi. | `Operator/Profile/Edit` |
| `useCreateSchoolForm.js` | Mengelola state pendaftaran sekolah baru & akun operator default beserta lookup NIP. | `Partials/CreateSchoolModal` |
| `useApplicationCreate.js` | Mengelola state penyusunan surat, pemilihan template 2024, baris multi-pemohon dinamis, dan live preview. | `Operator/Applications/Create` |
| `useApplicationDecision.js` | Mengelola state modal review, status target, dan update status verifikasi Disdik. | `Admin/Applications/Show` |
| `useApplicationRevision.js` | Mengelola form revisi berkas pengajuan dan resubmisi surat oleh operator. | `Operator/Applications/Show` |
| `useApplicationSignatures.js` | Mengelola mode ttd basah & stempel, pemotretan kamera, dan studio transparansi otomatis. | `Operator/Applications/Create`, `useApplicationCreate` |
| `useAsyncTable.js` | Mengelola pencarian ter-debounce, pagination promise, filter dropdown, dan indikator loading spinner lokal. | Seluruh 7 file `Index.jsx` |
| `useEmployeeLookup.js` | Sanitasi NIP 18 digit, pencarian lokal database, dan fallback API remote. | Form pegawai, profil, pendaftaran sekolah, dan aplikasi |
| `useModalState.js` | State generic buka/tutup modal secara deklaratif. | `Admin/Schools/Index` |

---

## 2. Struktur Komponen Halaman yang Bersih (SRP)

Semua halaman kini hanya bertindak sebagai **presenter/orkestrator deklaratif** sederhana:
- **`Operator/Applications/Create.jsx`**: Dari sebelumnya 846 baris, seluruh state dipindahkan ke `useApplicationCreate.js`. Halaman kini hanya merender layout dan passing props ke sub-komponen `ClassificationTemplatePicker`, `ApplicantsMultiInput`, `SignatureSelectorSection`, dan `LiveLetterPreview`.
- **`Operator/Profile/Edit.jsx`**: Seluruh state form, preview aset logo, stempel, dan ekstraksi ttd dipindahkan ke `useSchoolProfileForm.js`.
- **`Operator/Employees/Edit.jsx`** & **`Admin/Employees/Edit.jsx`**: Logika otorisasi dan form dipindahkan ke `useEmployeeAuthorization.js` dan `useEmployeeForm.js`.
- **`Admin/Applications/Show.jsx`** & **`Operator/Applications/Show.jsx`**: Logika status approval dan form revisi dipisahkan ke `useApplicationDecision.js` dan `useApplicationRevision.js`.
- **`Admin/DeletionRequests/Index.jsx`** & **`Admin/Schools/Index.jsx`**: Modal state dipisahkan ke `useDeletionModals.js` dan `useModalState.js`.

---

## 3. Hasil Validasi & Kompilasi

Kompilasi produksi Vite dijalankan dan berhasil 100% tanpa error:
```bash
npm run build
```
```
✓ built in 1.81s
```
Semua chunk komponen dan custom hook ter-bundle secara modular dan efisien.
