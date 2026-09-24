import React from 'react';
import { createPortal } from 'react-dom';
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

    const modalMarkup = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <h3 className="font-bold text-zinc-900 text-base">Tolak Pengajuan Penghapusan</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all cursor-pointer"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="my-4 p-3.5 bg-zinc-100/90 rounded-xl border border-zinc-200 text-xs text-zinc-800 leading-relaxed font-medium">
                    Pengajuan penghapusan untuk pegawai <strong className="text-zinc-950">{request.employee?.name}</strong> akan ditolak dan pegawai tetap berstatus aktif.
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Alasan Penolakan <span className="text-zinc-950">*</span>
                        </label>
                        <textarea
                            rows="3"
                            required
                            value={data.admin_notes}
                            onChange={(e) => setData('admin_notes', e.target.value)}
                            placeholder="Contoh: Surat Perintah belum ditandatangani oleh Kepala Sekolah, atau alasan tidak sesuai."
                            className="w-full text-xs rounded-xl border border-zinc-300 bg-white/70 p-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                        />
                        {errors.admin_notes && (
                            <p className="text-xs text-zinc-950 font-bold mt-1">{errors.admin_notes}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold rounded-xl text-zinc-800 bg-white/70 hover:bg-zinc-100 border border-zinc-300/80 backdrop-blur-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900/90 hover:bg-black text-white text-xs font-bold rounded-xl border border-zinc-800 backdrop-blur-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            <FiX className="w-4 h-4 stroke-[2.5]" />
                            <span>{processing ? 'Menolak...' : 'Tolak Pengajuan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
}
