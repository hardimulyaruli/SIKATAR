import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import TableWrapper from '@/Components/UI/TableWrapper';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import { useEmployeeDeleteModal } from '@/Hooks/useEmployeeDeleteModal';
import EmployeeActionBar from './Partials/EmployeeActionBar';
import OperatorEmployeeTable from './Partials/OperatorEmployeeTable';
import RequestDeletionModal from './Partials/RequestDeletionModal';

export default function EmployeesIndex({ employees: initialEmployees, filters: initialFilters = {} }) {
    const {
        data: employees,
        filters,
        handleSearch,
        handlePageClick,
        isLoading,
    } = useAsyncTable({
        url: '/operator/employees',
        initialData: initialEmployees,
        dataKey: 'employees',
        initialFilters: {
            search: initialFilters.search || '',
        },
    });

    const {
        targetEmployee,
        openDeleteModal,
        closeDeleteModal,
    } = useEmployeeDeleteModal();

    return (
        <OperatorLayout>
            <PageHeader
                title="Data Kepegawaian Sekolah"
                subtitle="Kelola profil pegawai PNS, CPNS, PPPK, dan Honorer di lingkungan sekolah Anda."
            />

            <EmployeeActionBar />

            <GlassCard>
                <SearchFilter
                    search={filters.search}
                    onSearchChange={handleSearch}
                    placeholder="Cari nama pegawai, NIP..."
                    isLoading={isLoading}
                />

                <TableWrapper isLoading={isLoading} loadingText="Memuat data pegawai..." className="mt-4">
                    <OperatorEmployeeTable
                        employees={employees.data}
                        onOpenDeleteModal={openDeleteModal}
                    />
                </TableWrapper>

                <Pagination links={employees.links} onPageClick={handlePageClick} />
            </GlassCard>

            <RequestDeletionModal
                employee={targetEmployee}
                onClose={closeDeleteModal}
            />
        </OperatorLayout>
    );
}
