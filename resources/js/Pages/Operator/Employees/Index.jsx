import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import TableWrapper from '@/Components/UI/TableWrapper';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import EmployeeActionBar from './Partials/EmployeeActionBar';
import OperatorEmployeeTable from './Partials/OperatorEmployeeTable';
import RetirementNotificationModal from './Partials/RetirementNotificationModal';
import { FiClock } from 'react-icons/fi';

export default function EmployeesIndex({
    employees: initialEmployees,
    filters: initialFilters = {},
    approachingPensionEmployees = [],
    approachingPensionCount = 0,
}) {
    const {
        data: employees,
        filters,
        handleSearch,
        handlePageClick,
        updateFilter,
        isLoading,
    } = useAsyncTable({
        url: '/operator/employees',
        initialData: initialEmployees,
        dataKey: 'employees',
        initialFilters: {
            search: initialFilters.search || '',
            filter: initialFilters.filter || 'all',
        },
    });

    // Pop-up hanya terbuka jika operator sengaja menekan tombol pengingat pensiun (tidak otomatis terbuka di kepegawaian)
    const [isRetirementModalOpen, setIsRetirementModalOpen] = useState(false);

    const currentFilter = filters.filter || 'all';

    const filterTabs = [
        { id: 'all', label: 'Semua Pegawai' },
        { 
            id: 'approaching_pension', 
            label: 'Mendekati Pensiun (Tahun Terakhir)',
            badge: approachingPensionCount > 0 ? approachingPensionCount : null,
            badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
            icon: FiClock,
        },
        { id: 'pns', label: 'PNS' },
        { id: 'pppk', label: 'PPPK' },
        { id: 'honorer', label: 'Honorer / Non-ASN' },
    ];

    return (
        <OperatorLayout>
            <PageHeader
                title="Data Kepegawaian Sekolah"
                subtitle="Kelola profil pegawai PNS, CPNS, PPPK, dan Honorer di lingkungan sekolah Anda."
            />

            <EmployeeActionBar
                approachingPensionCount={approachingPensionCount}
                onOpenRetirementModal={() => setIsRetirementModalOpen(true)}
            />

            <GlassCard>
                {/* Filter Pills Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-zinc-200/70">
                    {filterTabs.map((tab) => {
                        const isActive = currentFilter === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => updateFilter('filter', tab.id, true)}
                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? 'bg-zinc-900 text-white shadow-xs'
                                        : 'bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-600 hover:text-zinc-900'
                                }`}
                            >
                                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />}
                                <span>{tab.label}</span>
                                {tab.badge && (
                                    <span className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold border ${
                                        isActive ? 'bg-white text-zinc-900 border-white' : tab.badgeClass
                                    }`}>
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <SearchFilter
                    search={filters.search}
                    onSearchChange={handleSearch}
                    placeholder="Cari nama pegawai, NIP..."
                    isLoading={isLoading}
                />

                <TableWrapper isLoading={isLoading} loadingText="Memuat data pegawai..." className="mt-4">
                    <OperatorEmployeeTable
                        employees={employees.data}
                    />
                </TableWrapper>

                <Pagination links={employees.links} onPageClick={handlePageClick} />
            </GlassCard>

            {/* Pop-up Pengingat Pensiun (hanya muncul jika tombol diklik manual di kepegawaian) */}
            <RetirementNotificationModal
                isOpen={isRetirementModalOpen}
                onClose={() => setIsRetirementModalOpen(false)}
                approachingEmployees={approachingPensionEmployees}
                onFilterTable={() => updateFilter('filter', 'approaching_pension', true)}
            />
        </OperatorLayout>
    );
}
