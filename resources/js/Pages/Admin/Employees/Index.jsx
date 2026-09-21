import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import TableWrapper from '@/Components/UI/TableWrapper';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import { Link, router } from '@inertiajs/react';
import { FiPlus } from 'react-icons/fi';
import AdminEmployeeFilterBar from './Partials/AdminEmployeeFilterBar';
import AdminEmployeeTable from './Partials/AdminEmployeeTable';

export default function EmployeesIndex({ employees: initialEmployees, schools = [], filters: initialFilters = {} }) {
    const {
        data: employees,
        filters,
        updateFilter,
        handleSearch,
        handlePageClick,
        isLoading,
    } = useAsyncTable({
        url: '/admin/employees',
        initialData: initialEmployees,
        dataKey: 'employees',
        initialFilters: {
            search: initialFilters.search || '',
            school_id: initialFilters.school_id || '',
            status_pegawai: initialFilters.status_pegawai || '',
        },
    });

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pegawai ini?')) {
            router.delete(`/admin/employees/${id}`);
        }
    };

    const schoolOptions = schools.map((s) => ({ label: s.name, value: s.id }));

    return (
        <AdminLayout>
            <PageHeader
                title="Manajemen Data Kepegawaian"
                subtitle="Kelola seluruh data profil pegawai (PNS/CPNS/Non-ASN) dari semua sekolah di Kabupaten Bandung Barat."
            />

            <div className="mb-6 flex justify-end">
                <Link
                    href="/admin/employees/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Tambah Pegawai Baru</span>
                </Link>
            </div>

            <GlassCard>
                <AdminEmployeeFilterBar
                    search={filters.search}
                    onSearchChange={handleSearch}
                    schoolId={filters.school_id}
                    onSchoolChange={(val) => updateFilter('school_id', val, true)}
                    schoolOptions={schoolOptions}
                    statusPegawai={filters.status_pegawai}
                    onStatusChange={(val) => updateFilter('status_pegawai', val, true)}
                    isLoading={isLoading}
                />

                <TableWrapper isLoading={isLoading} loadingText="Memuat data pegawai..." className="mt-4">
                    <AdminEmployeeTable
                        employees={employees.data}
                        onDelete={handleDelete}
                    />
                </TableWrapper>

                <Pagination links={employees.links} onPageClick={handlePageClick} />
            </GlassCard>
        </AdminLayout>
    );
}
