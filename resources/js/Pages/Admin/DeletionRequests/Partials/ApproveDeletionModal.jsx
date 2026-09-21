import React from 'react';
import { useForm } from '@inertiajs/react';
import { FiX, FiCheck } from 'react-icons/fi';

/**
 * ApproveDeletionModal handles admin approval of an employee deletion request.
 * Single Responsibility: Confirm approval, capture optional admin notes, and submit PATCH request.
 */
export default function ApproveDeletionModal({ request, onClose }) {
    const { data, setData, patch, processing, reset } = useForm({
        admin_notes: '',
    });

    if (!request) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(`/admin/deletion-requests/${request.id}/approve`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-base">Setujui Penghapusan Pegawai</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="my-4 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
                    Data pegawai <strong>{request.employee?.name}</strong> akan dipindahkan ke <strong>Arsip Kepegawaian</strong> dan dinonaktifkan dari daftar aktif.
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Catatan Admin (Opsional)
                        </label>
                        <textarea
                            rows="3"
                            value={data.admin_notes}
                            onChange={(e) => setData('admin_notes', e.target.value)}
                            placeholder="Contoh: Pengajuan diverifikasi dan disetujui sesuai Surat Perintah KS."
                            className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            <FiCheck className="w-4 h-4" />
                            <span>{processing ? 'Memproses...' : 'Setujui & Arsipkan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
