import React from 'react';
import GlassCard from '@/Components/UI/GlassCard';
import { FiUser } from 'react-icons/fi';

/**
 * SchoolOperatorAccountsTable renders tabular operator credentials associated with a school.
 * Single Responsibility: Presenting the operator user accounts for a specific school.
 */
export default function SchoolOperatorAccountsTable({ users = [] }) {
    return (
        <div className="mb-8">
            <GlassCard
                header={
                    <h3 className="font-bold text-slate-900 text-sm">
                        Akun Operator Login ({users?.length || 0})
                    </h3>
                }
            >
                <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                <th className="py-3 px-4">Nama Operator</th>
                                <th className="py-3 px-4">Email Login</th>
                                <th className="py-3 px-4">Role / Hak Akses</th>
                                <th className="py-3 px-4">Tanggal Dibuat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                                            <FiUser className="w-4 h-4 text-zinc-800" />
                                            <span>{u.name}</span>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-slate-700">{u.email}</td>
                                        <td className="py-3 px-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-white border border-zinc-900 shadow-2xs">
                                                Operator Sekolah
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-500">
                                            {u.created_at
                                                ? new Date(u.created_at).toLocaleDateString('id-ID', {
                                                      day: 'numeric',
                                                      month: 'short',
                                                      year: 'numeric',
                                                  })
                                                : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center text-slate-400 italic">
                                        Belum ada akun operator untuk sekolah ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
