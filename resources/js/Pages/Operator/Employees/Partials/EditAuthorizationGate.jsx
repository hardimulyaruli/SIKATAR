import React, { useRef } from 'react';
import GlassCard from '@/Components/UI/GlassCard';
import { FiShield, FiUser, FiFileText, FiCheckCircle, FiUpload, FiX, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { Link } from '@inertiajs/react';
import { getImageUrl } from '@/Utils/url';

/**
 * EditAuthorizationGate presents a verification gate requiring operators
 * to upload an official Headmaster Letter before unlocking the employee profile editor.
 * Single Responsibility: Authorizing edit permission and uploading authorization document.
 */
export default function EditAuthorizationGate({
    employee,
    authForm,
    onAuthSubmit,
}) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        authForm.setData('surat_perintah', file);
    };

    const handleRemoveFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        authForm.setData('surat_perintah', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `(${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]})`;
    };

    return (
        <GlassCard className="rounded-3xl border border-zinc-200/80 shadow-xs bg-white/90">
            <div className="text-center pb-6 border-b border-zinc-100">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 text-white shadow-xs mb-3.5">
                    <FiShield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900">Otorisasi Diperlukan</h3>
                <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
                    Untuk mengedit data pegawai <span className="font-semibold text-zinc-900">{employee.name}</span>,
                    Anda harus mengunggah <span className="font-semibold text-zinc-900">Surat Perintah dari Kepala Sekolah</span> terlebih dahulu sebagai bukti otorisasi.
                </p>
            </div>

            {/* Employee Info Summary */}
            <div className="my-6 p-4 bg-zinc-50/80 rounded-2xl border border-zinc-200/70">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-14 bg-white rounded-xl border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                        {employee.photo_path ? (
                            <img
                                src={getImageUrl(employee.photo_path)}
                                alt="Foto"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FiUser className="w-6 h-6 text-zinc-400" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-zinc-900 text-sm truncate">{employee.name}</p>
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-zinc-200/80 text-zinc-700">
                                {employee.status_pegawai || 'PNS'}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{employee.nip || 'NIP belum diisi'}</p>
                    </div>
                </div>
            </div>

            {/* Upload Surat Perintah Form */}
            <form onSubmit={onAuthSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-900">
                        <FiFileText className="inline w-4 h-4 mr-1.5 -mt-0.5 text-zinc-700" />
                        Upload Surat Perintah Kepala Sekolah <span className="text-zinc-400">*</span>
                    </label>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Unggah scan/foto Surat Perintah yang telah ditandatangani oleh Kepala Sekolah.
                        Format yang diperbolehkan: <span className="font-medium text-zinc-700">PDF, JPG, JPEG, PNG</span> (Maks. 5MB).
                    </p>
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                            authForm.data.surat_perintah
                                ? 'border-zinc-300 bg-zinc-50/80'
                                : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-100/50'
                        }`}
                    >
                        {authForm.data.surat_perintah ? (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-1">
                                <div className="flex items-center gap-3 text-left min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                        <FiCheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="truncate">
                                        <p className="font-semibold text-sm text-zinc-900 truncate" title={authForm.data.surat_perintah.name}>
                                            {authForm.data.surat_perintah.name}
                                        </p>
                                        <p className="text-xs text-zinc-500 font-mono mt-0.5">
                                            {formatFileSize(authForm.data.surat_perintah.size)} &bull; Siap diverifikasi
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
                                    >
                                        <FiRefreshCw className="w-3.5 h-3.5 text-zinc-500" />
                                        <span>Ganti</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <FiTrash2 className="w-3.5 h-3.5" />
                                        <span>Hapus</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 mx-auto mb-2 flex items-center justify-center">
                                    <FiUpload className="w-5 h-5 text-zinc-600" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-800">Klik atau seret file ke sini</p>
                                <p className="text-xs text-zinc-400 mt-1">PDF, JPG, JPEG, PNG (Maks. 5MB)</p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className={authForm.data.surat_perintah ? 'hidden' : 'absolute inset-0 w-full h-full opacity-0 cursor-pointer'}
                        />
                    </div>
                    {authForm.errors.surat_perintah && (
                        <p className="text-rose-600 text-xs mt-1">{authForm.errors.surat_perintah}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-900">
                        Keterangan / Catatan <span className="text-xs font-normal text-zinc-400">(Opsional)</span>
                    </label>
                    <textarea
                        rows="3"
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all outline-none resize-none shadow-2xs"
                        value={authForm.data.notes}
                        onChange={(e) => authForm.setData('notes', e.target.value)}
                        placeholder="Contoh: Pembaruan ijazah terakhir / perubahan status kepegawaian..."
                    />
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-zinc-100">
                    <Link
                        href="/operator/employees"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                    >
                        <FiX className="w-4 h-4" />
                        <span>Batal &amp; Kembali</span>
                    </Link>
                    <button
                        type="submit"
                        disabled={authForm.processing || !authForm.data.surat_perintah}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl transition-all shadow-xs active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed"
                    >
                        <FiShield className="w-4 h-4" />
                        <span>{authForm.processing ? 'Mengunggah...' : 'Verifikasi & Buka Form Edit'}</span>
                    </button>
                </div>
            </form>
        </GlassCard>
    );
}
