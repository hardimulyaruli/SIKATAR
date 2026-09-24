import React from 'react';
import { Link } from '@inertiajs/react';
import { FiArchive, FiPlus, FiDownload, FiClock } from 'react-icons/fi';

/**
 * EmployeeActionBar renders quick navigation buttons for Operator employee pages.
 * Single Responsibility: Present actions to view archive, pension reminders, export records, and create a new employee.
 */
export default function EmployeeActionBar({ approachingPensionCount = 0, onOpenRetirementModal }) {
    return (
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                    href="/operator/employees-archived"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl hover:bg-zinc-100 text-zinc-700 text-sm font-semibold rounded-xl transition-colors border border-zinc-200 shadow-xs"
                >
                    <FiArchive className="w-4 h-4 text-zinc-500" />
                    <span>Lihat Arsip Pegawai</span>
                </Link>

                {approachingPensionCount > 0 && (
                    <button
                        type="button"
                        onClick={onOpenRetirementModal}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 shadow-2xs transition-all active:scale-95 cursor-pointer animate-pulse"
                        title="Lihat Pengingat Masa Pensiun Pegawai (Tahun Terakhir)"
                    >
                        <FiClock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pengingat Pensiun ({approachingPensionCount})</span>
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2.5">
                <a
                    href="/operator/employees/export"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-zinc-900 text-sm font-semibold rounded-xl transition-all border border-zinc-200 shadow-2xs backdrop-blur-xl active:scale-95 cursor-pointer"
                    title="Export Rekapitulasi Data Pegawai Sekolah ke Excel (.xlsx)"
                >
                    <FiDownload className="w-4 h-4 text-zinc-700" />
                    <span>Export Excel</span>
                </a>

                <Link
                    href="/operator/employees/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/90 hover:bg-black text-white text-sm font-semibold rounded-xl transition-all border border-zinc-800 shadow-xs active:scale-95"
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Tambah Pegawai Baru</span>
                </Link>
            </div>
        </div>
    );
}
