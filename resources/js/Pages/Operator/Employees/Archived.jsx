import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import TableWrapper from '@/Components/UI/TableWrapper';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import { Link } from '@inertiajs/react';
import { FiArrowLeft, FiInfo, FiClock, FiArchive } from 'react-icons/fi';
import ArchivedEmployeeTable from './Partials/ArchivedEmployeeTable';

export default function EmployeesArchived({ employees: initialEmployees, filters: initialFilters = {} }) {
    const {
        data: employees,
        filters,
        handleSearch,
        handlePageClick,
        updateFilter,
        isLoading,
    } = useAsyncTable({
        url: '/operator/employees-archived',
        initialData: initialEmployees,
        dataKey: 'employees',
        initialFilters: {
            search: initialFilters.search || '',
            reason: initialFilters.reason || 'all',
        },
    });

    const currentReason = filters.reason || 'all';

    const reasonTabs = [
        { id: 'all', label: 'Semua Arsip' },
        { id: 'pension', label: 'Pensiun (BUP 60 Tahun)', icon: FiClock },
        { id: 'deletion', label: 'Pengajuan Hapus / Mutasi', icon: FiArchive },
    ];

    return (
        <OperatorLayout>
            <PageHeader
                title="Arsip Pegawai Sekolah"
                subtitle="Daftar pegawai yang telah mencapai batas usia pensiun atau dinonaktifkan dengan otorisasi resmi."
            />

            <div className="mb-6 flex justify-start">
                <Link
                    href="/operator/employees"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-xl hover:bg-white text-zinc-800 text-xs font-semibold rounded-xl transition-all border border-zinc-200 shadow-xs active:scale-95"
                >
                    <FiArrowLeft className="w-4 h-4 text-zinc-500" />
                    <span>Kembali ke Data Pegawai Aktif</span>
                </Link>
            </div>

            <GlassCard>
                <div className="mb-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                    <FiInfo className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-zinc-600 leading-relaxed">
                        Data pegawai di halaman ini mencakup pegawai yang telah <strong>mencapai batas usia pensiun (60 tahun)</strong> secara otomatis berdasarkan tanggal lahir, serta pegawai yang diarsipkan melalui persetujuan penghapusan kedinasan.
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-zinc-200/70">
                    {reasonTabs.map((tab) => {
                        const isActive = currentReason === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => updateFilter('reason', tab.id, true)}
                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? 'bg-zinc-900 text-white shadow-xs'
                                        : 'bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-600 hover:text-zinc-900'
                                }`}
                            >
                                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />}
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <SearchFilter
                    search={filters.search}
                    onSearchChange={handleSearch}
                    placeholder="Cari nama pegawai yang diarsip, NIP..."
                    isLoading={isLoading}
                />

                <TableWrapper isLoading={isLoading} loadingText="Memuat arsip pegawai..." className="mt-4">
                    <ArchivedEmployeeTable employees={employees.data} />
                </TableWrapper>

                <Pagination links={employees.links} onPageClick={handlePageClick} />
            </GlassCard>
        </OperatorLayout>
    );
}
