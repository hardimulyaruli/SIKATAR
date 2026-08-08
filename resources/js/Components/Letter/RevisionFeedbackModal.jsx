import React, { useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX, FiSend, FiXCircle } from 'react-icons/fi';

export default function RevisionFeedbackModal({ isOpen, onClose, onSubmit, initialStatus = 'approved' }) {
    if (!isOpen) return null;

    const todayStr = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const [status, setStatus] = useState(initialStatus);
    const [adminNotes, setAdminNotes] = useState('');
    const [officialNumber, setOfficialNumber] = useState('');
    const [receivedDate, setReceivedDate] = useState(todayStr);
    const [receivedByName, setReceivedByName] = useState('H. DEDI SUPRIADI, S.Pd., M.M.');
    const [receivedByTitle, setReceivedByTitle] = useState('Pengolah Data Kepegawaian Disdik KBB');
    const [receivedByNip, setReceivedByNip] = useState('19780512 200604 1 005');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            status,
            admin_notes: adminNotes,
            official_letter_number: officialNumber,
            received_date: receivedDate,
            received_by_name: receivedByName,
            received_by_title: receivedByTitle,
            received_by_nip: receivedByNip,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                            <FiCheckCircle className="w-5 h-5" />
                        </span>
                        <span>Verifikasi & Pemeriksaan Disdik KBB</span>
                    </h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            Keputusan Verifikasi:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setStatus('approved')}
                                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                                    status === 'approved'
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                                <span>Setujui</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatus('revision_requested')}
                                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                                    status === 'revision_requested'
                                        ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <FiAlertCircle className="w-4 h-4 text-amber-600" />
                                <span>Beri Revisi</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatus('rejected')}
                                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                                    status === 'rejected'
                                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <FiXCircle className="w-4 h-4 text-rose-600" />
                                <span>Tolak</span>
                            </button>
                        </div>
                    </div>

                    {status === 'approved' && (
                        <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5 border-b border-blue-200/60 pb-1.5">
                                <span>Data Penerimaan Resmi & Nomor Terbit Surat:</span>
                            </p>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                                    Nomor Surat Resmi Disdik (Opsional):
                                </label>
                                <input
                                    type="text"
                                    value={officialNumber}
                                    onChange={(e) => setOfficialNumber(e.target.value)}
                                    placeholder="Contoh: 421.2/084-Disdik/VIII/2026 (Kosongkan untuk otomatis)"
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Tanggal Diterima</label>
                                    <input
                                        type="text"
                                        value={receivedDate}
                                        onChange={(e) => setReceivedDate(e.target.value)}
                                        placeholder="8 Agustus 2026"
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Jabatan Penerima</label>
                                    <input
                                        type="text"
                                        value={receivedByTitle}
                                        onChange={(e) => setReceivedByTitle(e.target.value)}
                                        placeholder="Pengolah Data Kepegawaian Disdik KBB"
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Nama Lengkap & Gelar Penerima</label>
                                    <input
                                        type="text"
                                        value={receivedByName}
                                        onChange={(e) => setReceivedByName(e.target.value)}
                                        placeholder="H. DEDI SUPRIADI, S.Pd., M.M."
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NIP Penerima</label>
                                    <input
                                        type="text"
                                        value={receivedByNip}
                                        onChange={(e) => setReceivedByNip(e.target.value)}
                                        placeholder="19780512 200604 1 005"
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            {status === 'revision_requested' ? 'Catatan Revisi Yang Harus Diperbaiki:' : 'Catatan / Alasan Pemeriksaan:'}
                        </label>
                        <textarea
                            rows={3}
                            required={status === 'revision_requested' || status === 'rejected'}
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder={status === 'revision_requested' ? 'Tuliskan catatan kelengkapan berkas atau instruksi revisi untuk sekolah...' : 'Tuliskan catatan opsional...'}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center gap-1.5"
                        >
                            <FiSend className="w-3.5 h-3.5" />
                            <span>Simpan Keputusan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
