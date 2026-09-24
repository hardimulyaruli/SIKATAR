import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import TableWrapper from '@/Components/UI/TableWrapper';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import { Link, router, usePage } from '@inertiajs/react';
import { FiPlus, FiDownload } from 'react-icons/fi';
import AdminEmployeeFilterBar from './Partials/AdminEmployeeFilterBar';
import AdminEmployeeTable from './Partials/AdminEmployeeTable';
import ExportEmployeeModal from './Partials/ExportEmployeeModal';

export default function EmployeesIndex({ employees: initialEmployees, schools = [], filters: initialFilters = {} }) {
    const { auth } = usePage().props;
    const isStaffKepala = ['staff_kepala', 'admin'].includes(auth?.user?.role);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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

            <div className="mb-6 flex items-center justify-end gap-3 flex-wrap">
                <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 hover:bg-white text-zinc-900 text-xs font-bold rounded-xl transition-all shadow-2xs backdrop-blur-xl border border-zinc-200/90 active:scale-95 cursor-pointer"
                    title="Export Rekapitulasi Data Kepegawaian ke Excel (.xlsx)"
                >
                    <FiDownload className="w-4 h-4 text-zinc-800" />
                    <span>Export Excel</span>
                </button>

                {isStaffKepala && (
                    <Link
                        href="/admin/employees/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900/90 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm backdrop-blur-xl border border-zinc-800 active:scale-95 cursor-pointer"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span>Tambah Pegawai Baru</span>
                    </Link>
                )}
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
                        canModify={isStaffKepala}
                    />
                </TableWrapper>

                <Pagination links={employees.links} onPageClick={handlePageClick} />
            </GlassCard>

            <ExportEmployeeModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                schools={schools}
                currentSchoolId={filters.school_id}
                currentStatus={filters.status_pegawai}
            />
        </AdminLayout>
    );
}
