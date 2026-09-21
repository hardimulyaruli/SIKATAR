import React from 'react';
import { useForm } from '@inertiajs/react';
import { FiTrash2, FiX, FiAlertTriangle, FiFileText, FiUpload } from 'react-icons/fi';

/**
 * RequestDeletionModal allows an operator to submit an authorization request
 * to delete and archive an employee, requiring official Headmaster Letter upload.
 * Single Responsibility: File attachment, reason inputs, and deletion request submission.
 */
export default function RequestDeletionModal({ employee, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        surat_perintah: null,
        reason: '',
    });

    if (!employee) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/operator/employees/${employee.id}/request-deletion`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                            <FiTrash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-base">Ajukan Penghapusan Pegawai</h3>
                            <p className="text-xs text-slate-500">Kirim permohonan penghapusan ke Admin/Dinas</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Notice */}
                <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                    <FiAlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800 leading-relaxed">
                        <span className="font-bold">Ketentuan Penghapusan:</span> Wajib menyertakan scan <strong>Surat Perintah dari Kepala Sekolah</strong>. Setelah disetujui, data pegawai akan dipindahkan ke <strong>Arsip Pegawai</strong> dan tidak hilang permanen.
                    </div>
                </div>

                {/* Employee Target Summary */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <p className="text-slate-500 font-medium">Pegawai yang akan dihapus:</p>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{employee.name}</p>
                    <p className="text-slate-500 font-mono mt-0.5">NIP: {employee.nip || '-'}</p>
                    <p className="text-slate-600 mt-0.5">Status: {employee.status_pegawai}</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Surat Perintah File Upload */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            <FiFileText className="inline w-3.5 h-3.5 mr-1 text-rose-500" />
                            Surat Perintah Kepala Sekolah <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            onChange={(e) => setData('surat_perintah', e.target.files[0])}
                            className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 border border-slate-200 rounded-xl p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Format: PDF, JPG, PNG (Maks. 5MB)</p>
                        {errors.surat_perintah && <p className="text-xs text-rose-500 mt-1">{errors.surat_perintah}</p>}
                    </div>

                    {/* Reason Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Alasan Penghapusan Pegawai <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            rows="3"
                            required
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder="Contoh: Pensiun per tanggal..., Mutasi ke sekolah lain, Mengundurkan diri, dsb."
                            className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                        {errors.reason && <p className="text-xs text-rose-500 mt-1">{errors.reason}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            <FiUpload className="w-3.5 h-3.5" />
                            <span>{processing ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
