import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiCheckCircle, FiAlertCircle, FiX, FiSend, FiXCircle } from 'react-icons/fi';

export default function RevisionFeedbackModal({ isOpen, onClose, onSubmit }) {
    if (!isOpen) return null;

    const todayStr = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const [adminNotes, setAdminNotes] = useState('');
    const [officialNumber, setOfficialNumber] = useState('');
    const [receivedDate, setReceivedDate] = useState(todayStr);
    const [receivedByName, setReceivedByName] = useState('H. DEDI SUPRIADI, S.Pd., M.M.');
    const [receivedByTitle, setReceivedByTitle] = useState('Pengolah Data Kepegawaian Disdik KBB');
    const [receivedByNip, setReceivedByNip] = useState('19780512 200604 1 005');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            status: 'approved',
            admin_notes: adminNotes,
            official_letter_number: officialNumber,
            received_date: receivedDate,
            received_by_name: receivedByName,
            received_by_title: receivedByTitle,
            received_by_nip: receivedByNip,
        });
    };

    const modalMarkup = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
                    <h3 className="font-bold text-zinc-950 text-lg flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200/90">
                            <FiCheckCircle className="w-5 h-5 stroke-[2.5]" />
                        </span>
                        <span>Penerimaan & Verifikasi Surat Disdik KBB</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg border border-transparent hover:border-zinc-200 transition-all cursor-pointer"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                    <div className="p-4 bg-zinc-100/70 border border-zinc-200/90 rounded-xl space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-950 flex items-center gap-1.5 border-b border-zinc-200/80 pb-1.5">
                            <span>Data Penerimaan Resmi & Nomor Terbit Surat:</span>
                        </p>

                        <div>
                            <label className="block text-[11px] font-bold text-zinc-800 mb-0.5">
                                Nomor Surat Resmi Disdik (Opsional):
                            </label>
                            <input
                                type="text"
                                value={officialNumber}
                                onChange={(e) => setOfficialNumber(e.target.value)}
                                placeholder={`Contoh: 421.2/084-Disdik/VIII/${new Date().getFullYear()} (Kosongkan untuk otomatis)`}
                                className="w-full px-3 py-1.5 bg-white/90 border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-0.5">Tanggal Diterima</label>
                                <input
                                    type="text"
                                    value={receivedDate}
                                    onChange={(e) => setReceivedDate(e.target.value)}
                                    placeholder="8 Agustus 2026"
                                    className="w-full px-2.5 py-1.5 bg-white/90 border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-0.5">Jabatan Penerima</label>
                                <input
                                    type="text"
                                    value={receivedByTitle}
                                    onChange={(e) => setReceivedByTitle(e.target.value)}
                                    placeholder="Pengolah Data Kepegawaian Disdik KBB"
                                    className="w-full px-2.5 py-1.5 bg-white/90 border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-0.5">Nama Lengkap & Gelar Penerima</label>
                                <input
                                    type="text"
                                    value={receivedByName}
                                    onChange={(e) => setReceivedByName(e.target.value)}
                                    placeholder="H. DEDI SUPRIADI, S.Pd., M.M."
                                    className="w-full px-2.5 py-1.5 bg-white/90 border border-zinc-300 rounded-lg text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-0.5">NIP Penerima</label>
                                <input
                                    type="text"
                                    value={receivedByNip}
                                    onChange={(e) => setReceivedByNip(e.target.value)}
                                    placeholder="19780512 200604 1 005"
                                    className="w-full px-2.5 py-1.5 bg-white/90 border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                            Catatan Disdik (Opsional):
                        </label>
                        <textarea
                            rows={3}
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Tuliskan catatan verifikasi opsional..."
                            className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                        />
                    </div>

                    <div className="pt-3 border-t border-zinc-200 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-zinc-800 bg-white/70 hover:bg-zinc-100 rounded-xl border border-zinc-300/80 backdrop-blur-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-zinc-900/90 hover:bg-black rounded-xl border border-zinc-800 backdrop-blur-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                        >
                            <FiSend className="w-3.5 h-3.5" />
                            <span>Terima & Terbitkan Surat</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
}
