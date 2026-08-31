import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import { Link, router } from '@inertiajs/react';
import { FiUsers, FiEye, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export default function EmployeesIndex({ employees, schools, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [schoolId, setSchoolId] = useState(filters.school_id || '');

    const handleSearch = (val) => {
        setSearch(val);
        router.get('/admin/employees', { search: val, school_id: schoolId }, { preserveState: true, replace: true });
    };

    const handleSchoolFilter = (val) => {
        setSchoolId(val);
        router.get('/admin/employees', { search, school_id: val }, { preserveState: true, replace: true });
    };

    const schoolOptions = schools.map(s => ({ label: s.name, value: s.id }));

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pegawai ini?')) {
            router.delete(`/admin/employees/${id}`);
        }
    };

    return (
        <AdminLayout>
            <PageHeader
                title="Manajemen Data Kepegawaian"
                subtitle="Kelola seluruh data profil pegawai (PNS/CPNS/Non-ASN) dari semua sekolah di Kabupaten Bandung Barat."
            />

            <div className="mb-6 flex justify-end">
                <Link
                    href="/admin/employees/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Tambah Pegawai Baru</span>
                </Link>
            </div>

            <GlassCard>
                <SearchFilter
                    search={search}
                    onSearchChange={handleSearch}
                    filter={schoolId}
                    onFilterChange={handleSchoolFilter}
                    filterOptions={schoolOptions}
                    placeholder="Cari nama pegawai, NIP..."
                />

                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 mt-4">
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
                            {employees.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">
                                        Data pegawai tidak ditemukan.
                                    </td>
                                </tr>
                            ) : employees.data.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                            <FiUsers className="w-4 h-4 text-indigo-500 shrink-0" />
                                            <span>{emp.name}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">NIP: {emp.nip || '-'}</div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                            emp.status_pegawai === 'PNS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            emp.status_pegawai === 'CPNS' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            emp.status_pegawai === 'PPPK' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            'bg-slate-100 text-slate-700 border-slate-200'
                                        }`}>
                                            {emp.status_pegawai}
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="font-semibold text-slate-800">{emp.school?.name || '-'}</div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="text-slate-600 line-clamp-1">{emp.contact || '-'}</div>
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/employees/${emp.id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                                                title="Detail"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/employees/${emp.id}/edit`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors"
                                                title="Edit"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                                                title="Hapus"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={employees.links} />
            </GlassCard>
        </AdminLayout>
    );
}
