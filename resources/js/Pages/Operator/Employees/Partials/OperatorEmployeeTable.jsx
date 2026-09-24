import React from 'react';
import { Link } from '@inertiajs/react';
import { FiUsers, FiEye, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';

/**
 * OperatorEmployeeTable renders tabular records of the operator school's active employees.
 * Single Responsibility: Presenting active employee list and dispatching deletion request modals.
 */
export default function OperatorEmployeeTable({ employees = [] }) {
    if (employees.length === 0) {
        return (
            <div className="py-12 text-center text-zinc-500 text-xs">
                Data pegawai tidak ditemukan.
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-zinc-50/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200/80">
                    <th className="py-3.5 px-4">Profil Pegawai</th>
                    <th className="py-3.5 px-4">Status Kepegawaian</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Kontak</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
                {employees.map((emp) => {
                    const hasPendingDelete = emp.deletion_requests && emp.deletion_requests.length > 0;
                    
                    // Cek apakah pegawai memasuki tahun terakhir sebelum pensiun (59 tahun)
                    let isApproachingPension = false;
                    let currentAge = null;
                    if (emp.date_of_birth) {
                        const dob = new Date(emp.date_of_birth);
                        const now = new Date();
                        const ageYears = (now - dob) / (1000 * 60 * 60 * 24 * 365.25);
                        if (ageYears >= 59 && ageYears < 60) {
                            isApproachingPension = true;
                            currentAge = Math.floor(ageYears);
                        }
                    }

                    return (
                        <tr key={emp.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                                <div className="font-bold text-zinc-900 flex items-center gap-2">
                                    <FiUsers className="w-4 h-4 text-zinc-400 shrink-0" />
                                    <span>{emp.name}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                    <span className="text-[10px] text-zinc-500 font-mono">
                                        NIP: {emp.nip || '-'}
                                    </span>
                                    {isApproachingPension && (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                                            <FiClock className="w-2.5 h-2.5 text-amber-600" />
                                            <span>Mendekati Pensiun ({currentAge} th)</span>
                                        </span>
                                    )}
                                </div>
                            </td>

                            <td className="py-3.5 px-4">
                                <span className="text-xs font-semibold text-zinc-700">
                                    {emp.status_pegawai}
                                </span>
                            </td>

                            <td className="py-3.5 px-4">
                                {hasPendingDelete ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                                        <FiClock className="w-3 h-3" />
                                        <span>Menunggu Persetujuan</span>
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-medium text-zinc-500">
                                        Aktif
                                    </span>
                                )}
                            </td>

                            <td className="py-3.5 px-4 text-zinc-600">
                                <div>{emp.contact || '-'}</div>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    <Link
                                        href={`/operator/employees/${emp.id}`}
                                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                        title="Detail Pegawai"
                                    >
                                        <FiEye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/operator/employees/${emp.id}/edit`}
                                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                        title="Edit Pegawai"
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                    </Link>
                                    {hasPendingDelete ? (
                                        <button
                                            disabled
                                            className="p-2 text-zinc-300 rounded-lg cursor-not-allowed"
                                            title="Permohonan penghapusan sedang diproses"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <Link
                                            href={`/operator/employees/${emp.id}/delete`}
                                            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                                            title="Ajukan Penghapusan Pegawai"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

