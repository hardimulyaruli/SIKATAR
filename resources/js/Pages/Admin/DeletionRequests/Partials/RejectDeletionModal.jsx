import React from 'react';
import { FiX } from 'react-icons/fi';
import { useDeletionDecisionForm } from '@/Hooks/useDeletionDecisionForm';

/**
 * RejectDeletionModal handles admin rejection of an employee deletion request.
 * Single Responsibility: Modal presentation with state delegated to useDeletionDecisionForm.
 */
export default function RejectDeletionModal({ request, onClose }) {
    const { data, setData, processing, errors, submit: handleSubmit } = useDeletionDecisionForm({
        request,
        action: 'reject',
        onSuccessCallback: onClose,
    });

    if (!request) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-base">Tolak Pengajuan Penghapusan</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="my-4 p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 leading-relaxed">
                    Pengajuan penghapusan untuk pegawai <strong>{request.employee?.name}</strong> akan ditolak dan pegawai tetap berstatus aktif.
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Alasan Penolakan <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            rows="3"
                            required
                            value={data.admin_notes}
                            onChange={(e) => setData('admin_notes', e.target.value)}
                            placeholder="Contoh: Surat Perintah belum ditandatangani oleh Kepala Sekolah, atau alasan tidak sesuai."
                            className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        {errors.admin_notes && (
                            <p className="text-xs text-rose-500 mt-1">{errors.admin_notes}</p>
                        )}
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            <FiX className="w-4 h-4" />
                            <span>{processing ? 'Menolak...' : 'Tolak Pengajuan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
