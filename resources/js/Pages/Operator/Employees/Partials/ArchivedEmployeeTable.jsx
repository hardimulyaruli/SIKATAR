import React from 'react';
import { FiArchive, FiCalendar, FiFileText, FiExternalLink } from 'react-icons/fi';
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
            <div className="py-12 text-center text-slate-500 text-xs">
                Tidak ada data pegawai yang diarsipkan.
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                    <th className="py-3.5 px-4">Profil Pegawai</th>
                    <th className="py-3.5 px-4">Status Kepegawaian</th>
                    <th className="py-3.5 px-4">Tanggal Diarsipkan</th>
                    <th className="py-3.5 px-4">Alasan Diarsipkan</th>
                    <th className="py-3.5 px-4 text-right">Surat Perintah</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
                {employees.map((emp) => {
                    const approvedRequest =
                        emp.deletion_requests?.find((r) => r.status === 'approved') ||
                        emp.deletion_requests?.[0];

                    return (
                        <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                    <FiArchive className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>{emp.name}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                    NIP: {emp.nip || '-'}
                                </div>
                            </td>

                            <td className="py-3.5 px-4">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    {emp.status_pegawai}
                                </span>
                            </td>

                            <td className="py-3.5 px-4 text-slate-600">
                                <div className="flex items-center gap-1.5 font-medium text-[11px]">
                                    <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{formatDate(emp.deleted_at)}</span>
                                </div>
                            </td>

                            <td className="py-3.5 px-4">
                                <div className="text-slate-700 font-medium max-w-md line-clamp-2">
                                    {emp.archived_reason || approvedRequest?.reason || '-'}
                                </div>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                                {approvedRequest?.document_path ? (
                                    <a
                                        href={getImageUrl(approvedRequest.document_path)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-xs font-semibold"
                                        title="Lihat Surat Perintah Kepala Sekolah"
                                    >
                                        <FiFileText className="w-3.5 h-3.5" />
                                        <span>Surat Perintah</span>
                                        <FiExternalLink className="w-3 h-3 ml-0.5" />
                                    </a>
                                ) : (
                                    <span className="text-slate-400 text-[11px] italic">-</span>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
