import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import { Link, router } from '@inertiajs/react';
import { FiHome, FiEye, FiPhone, FiMail } from 'react-icons/fi';

export default function SchoolsIndex({ schools, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [jenjang, setJenjang] = useState(filters.jenjang || '');

    const handleSearch = (val) => {
        setSearch(val);
        router.get('/admin/schools', { search: val, jenjang }, { preserveState: true, replace: true });
    };

    const handleJenjangFilter = (val) => {
        setJenjang(val);
        router.get('/admin/schools', { search, jenjang: val }, { preserveState: true, replace: true });
    };

    const jenjangOptions = [
        { label: 'SD (Sekolah Dasar)', value: 'SD' },
        { label: 'SMP (Sekolah Menengah Pertama)', value: 'SMP' },
        { label: 'SMA', value: 'SMA' },
        { label: 'SMK', value: 'SMK' },
    ];

    return (
        <AdminLayout>
            <PageHeader
                title="Daftar Sekolah Kabupaten Bandung Barat"
                subtitle="Data profil sekolah, alamat, Kepala Sekolah, dan riwayat pengajuan surat resmi."
            />

            <GlassCard>
                <SearchFilter
                    search={search}
                    onSearchChange={handleSearch}
                    filter={jenjang}
                    onFilterChange={handleJenjangFilter}
                    filterOptions={jenjangOptions}
                    placeholder="Cari nama sekolah, NPSN, alamat..."
                />

                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                                <th className="py-3.5 px-4">NPSN & Nama Sekolah</th>
                                <th className="py-3.5 px-4">Jenjang & Akreditasi</th>
                                <th className="py-3.5 px-4">Kepala Sekolah</th>
                                <th className="py-3.5 px-4">Kontak / Alamat</th>
                                <th className="py-3.5 px-4 text-center">Pengajuan Surat</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {schools.data.map((sc) => (
                                <tr key={sc.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                            <FiHome className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span>{sc.name}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">NPSN: {sc.npsn}</div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                            {sc.jenjang} • Akreditasi {sc.status_akreditasi}
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="font-semibold text-slate-800">{sc.headmaster_name || '-'}</div>
                                        <div className="text-[10px] text-slate-400">NIP: {sc.headmaster_nip || '-'}</div>
                                    </td>

                                    <td className="py-3.5 px-4 max-w-xs">
                                        <div className="text-slate-600 line-clamp-1">{sc.address || '-'}</div>
                                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                            {sc.phone && <span className="flex items-center gap-0.5"><FiPhone className="w-3 h-3" /> {sc.phone}</span>}
                                            {sc.email && <span className="flex items-center gap-0.5"><FiMail className="w-3 h-3" /> {sc.email}</span>}
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4 text-center">
                                        <span className="font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                                            {sc.letter_applications_count}
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <Link
                                            href={`/admin/schools/${sc.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-all shadow-xs"
                                        >
                                            <FiEye className="w-3.5 h-3.5" />
                                            <span>Detail</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={schools.links} />
            </GlassCard>
        </AdminLayout>
    );
}
