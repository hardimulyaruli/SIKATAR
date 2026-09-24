import React from 'react';
import { FiHome, FiUser, FiFileText, FiExternalLink, FiClock, FiCheckCircle, FiXCircle, FiCheck, FiX } from 'react-icons/fi';
import { getImageUrl } from '@/Utils/url';

/**
 * DeletionRequestTable renders tabular records of employee deletion requests.
 * Single Responsibility: Presenting deletion requests list and dispatching approval/rejection triggers.
 */
export default function DeletionRequestTable({ requests = [], onApprove, onReject }) {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (requests.length === 0) {
        return (
            <div className="py-12 text-center text-slate-500 text-xs">
                Tidak ada permohonan penghapusan pegawai.
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                    <th className="py-3.5 px-4">Sekolah & Pengaju</th>
                    <th className="py-3.5 px-4">Data Pegawai</th>
                    <th className="py-3.5 px-4">Surat Perintah KS</th>
                    <th className="py-3.5 px-4">Alasan Penghapusan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
                {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2 font-bold text-slate-900">
                                <FiHome className="w-4 h-4 text-zinc-900 shrink-0" />
                                <span>{req.school?.name || 'Sekolah'}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                                Pengaju: {req.user?.name || '-'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {formatDate(req.created_at)}
                            </div>
                        </td>

                        <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <FiUser className="w-3.5 h-3.5 text-zinc-800 shrink-0" />
                                <span>{req.employee?.name || 'Pegawai'}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                NIP: {req.employee?.nip || '-'}
                            </div>
                            <div className="mt-1">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                                    {req.employee?.status_pegawai || 'PNS'}
                                </span>
                            </div>
                        </td>

                        <td className="py-3.5 px-4">
                            {req.document_path ? (
                                <a
                                    href={getImageUrl(req.document_path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-zinc-900 text-zinc-900 hover:text-white backdrop-blur-xl border border-zinc-300 font-bold transition-all text-xs shadow-2xs active:scale-95 cursor-pointer"
                                >
                                    <FiFileText className="w-3.5 h-3.5" />
                                    <span className="line-clamp-1 max-w-[120px]">
                                        {req.document_name || 'Surat Perintah'}
                                    </span>
                                    <FiExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                            ) : (
                                <span className="text-slate-400 italic">-</span>
                            )}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-slate-700 line-clamp-3 leading-relaxed">
                                {req.reason}
                            </p>
                        </td>

                        <td className="py-3.5 px-4">
                            {req.status === 'pending' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-300">
                                    <FiClock className="w-3.5 h-3.5" />
                                    <span>Menunggu</span>
                                </span>
                            )}
                            {req.status === 'approved' && (
                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-900 text-white border border-zinc-900">
                                        <FiCheckCircle className="w-3.5 h-3.5" />
                                        <span>Diarsipkan</span>
                                    </span>
                                    {req.reviewed_at && (
                                        <div className="text-[10px] text-slate-400 mt-1">
                                            {formatDate(req.reviewed_at)}
                                        </div>
                                    )}
                                </div>
                            )}
                            {req.status === 'rejected' && (
                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-200 text-zinc-950 border border-zinc-400">
                                        <FiXCircle className="w-3.5 h-3.5" />
                                        <span>Ditolak</span>
                                    </span>
                                    {req.admin_notes && (
                                        <p className="text-[10px] text-zinc-600 mt-1 line-clamp-2 italic" title={req.admin_notes}>
                                            Alasan: {req.admin_notes}
                                        </p>
                                    )}
                                </div>
                            )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                            {req.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onApprove(req)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-black text-white font-bold backdrop-blur-xl border border-zinc-800 shadow-sm active:scale-95 transition-all text-xs cursor-pointer"
                                        title="Setujui & Arsipkan Pegawai"
                                    >
                                        <FiCheck className="w-3.5 h-3.5" />
                                        <span>Setujui</span>
                                    </button>
                                    <button
                                        onClick={() => onReject(req)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/70 hover:bg-zinc-100 text-zinc-900 font-bold backdrop-blur-xl border border-zinc-300 shadow-2xs active:scale-95 transition-all text-xs cursor-pointer"
                                        title="Tolak Pengajuan"
                                    >
                                        <FiX className="w-3.5 h-3.5" />
                                        <span>Tolak</span>
                                    </button>
                                </div>
                            ) : (
                                <span className="text-slate-400 text-xs font-mono">Selesai</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
