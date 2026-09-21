import React from 'react';
import GlassCard from '@/Components/UI/GlassCard';
import { FiShield, FiUser, FiFileText, FiCheckCircle, FiUpload, FiX } from 'react-icons/fi';
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
    return (
        <GlassCard>
            <div className="text-center pb-6 border-b border-slate-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 mb-4">
                    <FiShield className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Otorisasi Diperlukan</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                    Untuk mengedit data pegawai <span className="font-bold text-blue-700">{employee.name}</span>,
                    Anda harus mengunggah <span className="font-bold text-amber-700">Surat Perintah dari Kepala Sekolah</span> terlebih dahulu sebagai bukti otorisasi.
                </p>
            </div>

            {/* Employee Info Summary */}
            <div className="my-6 p-4 bg-blue-50/80 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-white rounded-lg border border-blue-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                        {employee.photo_path ? (
                            <img
                                src={getImageUrl(employee.photo_path)}
                                alt="Foto"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FiUser className="w-6 h-6 text-blue-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-blue-900 text-sm">{employee.name}</p>
                        <p className="text-xs text-blue-700 font-mono">{employee.nip || 'NIP belum diisi'}</p>
                        <p className="text-[11px] text-blue-600 mt-0.5">{employee.status_pegawai || 'PNS'}</p>
                    </div>
                </div>
            </div>

            {/* Upload Surat Perintah Form */}
            <form onSubmit={onAuthSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800">
                        <FiFileText className="inline w-4 h-4 mr-1 -mt-0.5 text-amber-600" />
                        Upload Surat Perintah Kepala Sekolah <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Unggah scan/foto Surat Perintah yang telah ditandatangani oleh Kepala Sekolah.
                        Format yang diperbolehkan: <span className="font-semibold">PDF, JPG, JPEG, PNG</span> (Maks. 5MB).
                    </p>
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                            authForm.data.surat_perintah
                                ? 'border-emerald-300 bg-emerald-50/50'
                                : 'border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                    >
                        {authForm.data.surat_perintah ? (
                            <div className="flex items-center justify-center gap-2 text-emerald-700">
                                <FiCheckCircle className="w-5 h-5" />
                                <span className="font-semibold text-sm">
                                    {authForm.data.surat_perintah.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => authForm.setData('surat_perintah', null)}
                                    className="ml-2 text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer"
                                >
                                    Hapus
                                </button>
                            </div>
                        ) : (
                            <>
                                <FiUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-600">Klik atau seret file ke sini</p>
                                <p className="text-xs text-slate-400 mt-1">PDF, JPG, JPEG, PNG (Maks. 5MB)</p>
                            </>
                        )}
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => authForm.setData('surat_perintah', e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    {authForm.errors.surat_perintah && (
                        <p className="text-red-500 text-xs mt-1">{authForm.errors.surat_perintah}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                        Keterangan / Catatan (Opsional)
                    </label>
                    <textarea
                        rows="2"
                        className="w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm"
                        value={authForm.data.notes}
                        onChange={(e) => authForm.setData('notes', e.target.value)}
                        placeholder="Contoh: Pembaruan ijazah terakhir / perubahan status kepegawaian..."
                    />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Link
                        href="/operator/employees"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        <FiX className="w-4 h-4" />
                        <span>Batal & Kembali</span>
                    </Link>
                    <button
                        type="submit"
                        disabled={authForm.processing || !authForm.data.surat_perintah}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                        <FiShield className="w-4 h-4" />
                        <span>{authForm.processing ? 'Mengunggah...' : 'Verifikasi & Buka Form Edit'}</span>
                    </button>
                </div>
            </form>
        </GlassCard>
    );
}
