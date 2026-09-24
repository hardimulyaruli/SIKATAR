import React from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCheck } from 'react-icons/fi';
import { useDeletionDecisionForm } from '@/Hooks/useDeletionDecisionForm';

/**
 * ApproveDeletionModal handles admin approval of an employee deletion request.
 * Single Responsibility: Modal presentation with state delegated to useDeletionDecisionForm.
 */
export default function ApproveDeletionModal({ request, onClose }) {
    const { data, setData, processing, submit: handleSubmit } = useDeletionDecisionForm({
        request,
        action: 'approve',
        onSuccessCallback: onClose,
    });

    if (!request) return null;

    const modalMarkup = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <h3 className="font-bold text-zinc-900 text-base">Setujui Penghapusan Pegawai</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all cursor-pointer"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="my-4 p-3.5 bg-zinc-100/90 rounded-xl border border-zinc-200 text-xs text-zinc-800 leading-relaxed font-medium">
                    Data pegawai <strong className="text-zinc-950">{request.employee?.name}</strong> akan dipindahkan ke <strong className="text-zinc-950">Arsip Kepegawaian</strong> dan dinonaktifkan dari daftar aktif.
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Catatan Admin (Opsional)
                        </label>
                        <textarea
                            rows="3"
                            value={data.admin_notes}
                            onChange={(e) => setData('admin_notes', e.target.value)}
                            placeholder="Contoh: Pengajuan diverifikasi dan disetujui sesuai Surat Perintah KS."
                            className="w-full text-xs rounded-xl border border-zinc-300 bg-white/70 p-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                        />
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
                            <FiCheck className="w-4 h-4 stroke-[2.5]" />
                            <span>{processing ? 'Memproses...' : 'Setujui & Arsipkan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
}
