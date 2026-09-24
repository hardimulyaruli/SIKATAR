import React from 'react';
import { Link } from '@inertiajs/react';
import { FiHome, FiEye, FiPhone, FiMail } from 'react-icons/fi';

/**
 * SchoolTable component renders the school list table rows and action links.
 * Single Responsibility: Present tabular list of schools and handle navigation to details.
 */
export default function SchoolTable({ schools = [] }) {
    if (schools.length === 0) {
        return (
            <div className="py-12 text-center text-slate-500 text-xs">
                Data sekolah tidak ditemukan.
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                    <th className="py-3.5 px-4">NPSN & Nama Sekolah</th>
                    <th className="py-3.5 px-4">Jenjang & Akreditasi</th>
                    <th className="py-3.5 px-4">Kepala Sekolah</th>
                    <th className="py-3.5 px-4">Kontak / Alamat</th>
                    <th className="py-3.5 px-4 text-center">Operator & Pengajuan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
                {schools.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                <FiHome className="w-4 h-4 text-zinc-900 shrink-0" />
                                <span>{sc.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                NPSN: {sc.npsn}
                            </div>
                        </td>

                        <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-900 border border-zinc-200/90 shadow-2xs">
                                {sc.jenjang} • Akreditasi {sc.status_akreditasi}
                            </span>
                        </td>

                        <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{sc.headmaster_name || '-'}</div>
                            <div className="text-[10px] text-slate-400">NIP: {sc.headmaster_nip || '-'}</div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                            <div className="text-slate-600 line-clamp-1">{sc.address || '-'}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                                {sc.phone && (
                                    <span className="flex items-center gap-0.5" title="Telepon Sekolah">
                                        <FiPhone className="w-3 h-3 shrink-0" /> {sc.phone}
                                    </span>
                                )}
                                {sc.email && (
                                    <span className="flex items-center gap-0.5" title="Email Resmi Sekolah">
                                        <FiMail className="w-3 h-3 shrink-0" /> {sc.email.replace(/^operator\./i, '')}
                                    </span>
                                )}
                            </div>
                        </td>

                        <td className="py-3.5 px-4 text-center space-y-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-white border border-zinc-900 shadow-2xs">
                                {sc.users_count || 0} Akun Operator
                            </span>
                            <div className="text-[10px] text-slate-500 font-semibold">
                                {sc.letter_applications_count || 0} Pengajuan Surat
                            </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                            <Link
                                href={`/admin/schools/${sc.id}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-900 bg-white/70 hover:bg-zinc-900 hover:text-white backdrop-blur-xl border border-zinc-300/80 shadow-2xs active:scale-95 transition-all cursor-pointer"
                            >
                                <FiEye className="w-3.5 h-3.5" />
                                <span>Detail Profil</span>
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
