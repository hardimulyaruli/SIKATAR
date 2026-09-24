import React from 'react';
import { createPortal } from 'react-dom';
import { FiTrash2, FiX, FiAlertTriangle, FiFileText, FiUpload } from 'react-icons/fi';
import { useRequestDeletionForm } from '@/Hooks/useRequestDeletionForm';

/**
 * RequestDeletionModal allows an operator to submit an authorization request
 * to delete and archive an employee, requiring official Headmaster Letter upload.
 * Single Responsibility: Modal presentation with state delegated to useRequestDeletionForm.
 */
export default function RequestDeletionModal({ employee, onClose }) {
    const { data, setData, processing, errors, submit: handleSubmit } = useRequestDeletionForm(employee, onClose);

    if (!employee) return null;

    const modalMarkup = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200/80 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-2xs">
                            <FiTrash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 text-base tracking-tight">Ajukan Penghapusan Pegawai</h3>
                            <p className="text-xs text-zinc-500">Kirim permohonan otorisasi penghapusan ke Admin/Dinas</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Notice */}
                <div className="mt-4 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex items-start gap-3">
                    <FiAlertTriangle className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-zinc-600 leading-relaxed">
                        <span className="font-semibold text-zinc-900">Ketentuan Penghapusan:</span> Wajib menyertakan scan <strong className="text-zinc-900">Surat Perintah dari Kepala Sekolah</strong>. Setelah disetujui, data pegawai akan dipindahkan ke <strong className="text-zinc-900">Arsip Pegawai</strong> dan tidak hilang permanen.
                    </div>
                </div>

                {/* Employee Target Summary */}
                <div className="mt-4 p-3.5 bg-zinc-50/70 rounded-2xl border border-zinc-200/70 text-xs">
                    <p className="text-zinc-400 font-medium">Pegawai yang akan dihapus:</p>
                    <div className="flex items-center justify-between mt-1">
                        <p className="font-bold text-zinc-900 text-sm">{employee.name}</p>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                            {employee.status_pegawai || 'PNS'}
                        </span>
                    </div>
                    <p className="text-zinc-500 font-mono mt-0.5">NIP: {employee.nip || '-'}</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Surat Perintah File Upload */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-900 mb-1">
                            <FiFileText className="inline w-3.5 h-3.5 mr-1 text-zinc-700" />
                            Surat Perintah Kepala Sekolah <span className="text-zinc-400">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            onChange={(e) => setData('surat_perintah', e.target.files[0])}
                            className="w-full text-xs text-zinc-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-800 hover:file:bg-zinc-200 border border-zinc-200 rounded-xl p-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                        <p className="text-[11px] text-zinc-400 mt-1">Format: PDF, JPG, PNG (Maks. 5MB)</p>
                        {errors.surat_perintah && <p className="text-xs text-rose-600 mt-1">{errors.surat_perintah}</p>}
                    </div>

                    {/* Reason Input */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-900 mb-1">
                            Alasan Penghapusan Pegawai <span className="text-zinc-400">*</span>
                        </label>
                        <textarea
                            rows="3"
                            required
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder="Contoh: Pensiun per tanggal..., Mutasi ke sekolah lain, Mengundurkan diri, dsb."
                            className="w-full text-xs rounded-2xl border border-zinc-200 p-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 resize-none"
                        />
                        {errors.reason && <p className="text-xs text-rose-600 mt-1">{errors.reason}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-all shadow-xs active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
                        >
                            <FiUpload className="w-3.5 h-3.5" />
                            <span>{processing ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
}
