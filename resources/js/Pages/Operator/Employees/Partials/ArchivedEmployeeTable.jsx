import React from 'react';
import { FiArchive, FiCalendar, FiFileText, FiClock } from 'react-icons/fi';
import { getImageUrl } from '@/Utils/url';

/**
 * ArchivedEmployeeTable renders records of archived/deactivated school employees.
 * Single Responsibility: Presenting archived employee profiles, archive reasons, and official order documents.
 */
export default function ArchivedEmployeeTable({ employees = [] }) {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (employees.length === 0) {
        return (
            <div className="py-12 text-center text-zinc-500 text-xs">
                Tidak ada data pegawai yang diarsipkan.
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-zinc-50/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200/80">
                    <th className="py-3.5 px-4">Profil Pegawai</th>
                    <th className="py-3.5 px-4">Status Kepegawaian</th>
                    <th className="py-3.5 px-4">Tanggal Diarsipkan</th>
                    <th className="py-3.5 px-4">Alasan Diarsipkan</th>
                    <th className="py-3.5 px-4 text-right">Keterangan / Berkas</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
                {employees.map((emp) => {
                    const approvedRequest =
                        emp.deletion_requests?.find((r) => r.status === 'approved') ||
                        emp.deletion_requests?.[0];

                    const isPension = emp.archived_reason && emp.archived_reason.toLowerCase().includes('pensiun');

                    return (
                        <tr key={emp.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                                <div className="font-bold text-zinc-900 flex items-center gap-2">
                                    <FiArchive className="w-4 h-4 text-zinc-400 shrink-0" />
                                    <span>{emp.name}</span>
                                </div>
                                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                    NIP: {emp.nip || '-'}
                                </div>
                            </td>

                            <td className="py-3.5 px-4">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                                    {emp.status_pegawai}
                                </span>
                            </td>

                            <td className="py-3.5 px-4 text-zinc-600">
                                <div className="flex items-center gap-1.5 font-medium text-[11px]">
                                    <FiCalendar className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>{formatDate(emp.deleted_at)}</span>
                                </div>
                            </td>

                            <td className="py-3.5 px-4">
                                {isPension ? (
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                                            <FiClock className="w-3 h-3 text-amber-600" />
                                            <span>Pensiun (BUP 60 Th)</span>
                                        </span>
                                        <span className="text-[11px] text-zinc-600">{emp.archived_reason}</span>
                                    </div>
                                ) : (
                                    <div className="text-zinc-700 font-medium max-w-md line-clamp-2">
                                        {emp.archived_reason || approvedRequest?.reason || '-'}
                                    </div>
                                )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                                {approvedRequest?.document_path ? (
                                    <a
                                        href={getImageUrl(approvedRequest.document_path)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-black transition-colors text-xs font-semibold shadow-2xs"
                                        title="Lihat Surat Perintah Kepala Sekolah"
                                    >
                                        <FiFileText className="w-3.5 h-3.5" />
                                        <span>Surat Perintah</span>
                                    </a>
                                ) : isPension ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
                                        <span>Otomatis Batas Usia Pensiun</span>
                                    </span>
                                ) : (
                                    <span className="text-xs text-zinc-400 italic">Tidak ada surat</span>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
