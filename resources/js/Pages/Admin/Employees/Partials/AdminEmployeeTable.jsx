import React from 'react';
import { Link } from '@inertiajs/react';
import { FiUsers, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

/**
 * AdminEmployeeTable renders the employee listing rows and action triggers.
 * Single Responsibility: Tabular presentation of employee profiles and dispatching actions.
 */
export default function AdminEmployeeTable({ employees = [], onDelete, canModify = true }) {
    if (employees.length === 0) {
        return (
            <div className="py-12 text-center text-slate-500 text-xs">
                Data pegawai tidak ditemukan.
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                    <th className="py-3.5 px-4">Profil Pegawai</th>
                    <th className="py-3.5 px-4">Status Kepegawaian</th>
                    <th className="py-3.5 px-4">Unit Kerja (Sekolah)</th>
                    <th className="py-3.5 px-4">Kontak</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
                {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                <FiUsers className="w-4 h-4 text-zinc-800 shrink-0" />
                                <span>{emp.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                NIP: {emp.nip || '-'}
                            </div>
                        </td>

                        <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                emp.status_pegawai === 'PNS' ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs' :
                                emp.status_pegawai === 'CPNS' ? 'bg-zinc-700 text-white border-zinc-700 shadow-2xs' :
                                emp.status_pegawai === 'PPPK' ? 'bg-zinc-200 text-zinc-900 border-zinc-300 shadow-2xs' :
                                'bg-zinc-100 text-zinc-700 border-zinc-200'
                            }`}>
                                {emp.status_pegawai}
                            </span>
                        </td>

                        <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{emp.school?.name || '-'}</div>
                            <div className="text-[10px] text-slate-400">NPSN: {emp.school?.npsn || '-'}</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                            <div>{emp.phone_number || '-'}</div>
                            <div className="text-[10px] text-slate-400">{emp.email || '-'}</div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                                <Link
                                    href={`/admin/employees/${emp.id}`}
                                    className="p-2 text-zinc-900 hover:text-white bg-white/70 hover:bg-zinc-900 backdrop-blur-xl border border-zinc-200/90 hover:border-zinc-900 rounded-xl shadow-2xs active:scale-95 transition-all cursor-pointer"
                                    title="Detail Pegawai"
                                >
                                    <FiEye className="w-4 h-4" />
                                </Link>
                                {canModify && (
                                    <>
                                        <Link
                                            href={`/admin/employees/${emp.id}/edit`}
                                            className="p-2 text-zinc-900 hover:text-white bg-white/70 hover:bg-zinc-900 backdrop-blur-xl border border-zinc-200/90 hover:border-zinc-900 rounded-xl shadow-2xs active:scale-95 transition-all cursor-pointer"
                                            title="Edit Pegawai"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(emp.id)}
                                            className="p-2 text-zinc-900 hover:text-white bg-white/70 hover:bg-zinc-900 backdrop-blur-xl border border-zinc-200/90 hover:border-zinc-900 rounded-xl shadow-2xs active:scale-95 transition-all cursor-pointer"
                                            title="Hapus Pegawai"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
