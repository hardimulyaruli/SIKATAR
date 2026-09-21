import React from 'react';
import { Link } from '@inertiajs/react';
import { FiArchive, FiPlus } from 'react-icons/fi';

/**
 * EmployeeActionBar renders quick navigation buttons for Operator employee pages.
 * Single Responsibility: Present actions to view archive and create a new employee.
 */
export default function EmployeeActionBar() {
    return (
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
            <Link
                href="/operator/employees-archived"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors border border-slate-300 shadow-xs"
            >
                <FiArchive className="w-4 h-4 text-slate-600" />
                <span>Lihat Arsip Pegawai</span>
            </Link>

            <Link
                href="/operator/employees/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
            >
                <FiPlus className="w-4 h-4" />
                <span>Tambah Pegawai Baru</span>
            </Link>
        </div>
    );
}
