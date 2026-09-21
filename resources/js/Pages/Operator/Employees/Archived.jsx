import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import TableWrapper from '@/Components/UI/TableWrapper';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import { Link } from '@inertiajs/react';
import { FiArrowLeft, FiInfo } from 'react-icons/fi';
import ArchivedEmployeeTable from './Partials/ArchivedEmployeeTable';

export default function EmployeesArchived({ employees: initialEmployees, filters: initialFilters = {} }) {
    const {
        data: employees,
        filters,
        handleSearch,
        handlePageClick,
        isLoading,
    } = useAsyncTable({
        url: '/operator/employees-archived',
        initialData: initialEmployees,
        dataKey: 'employees',
        initialFilters: {
            search: initialFilters.search || '',
        },
    });

    return (
        <OperatorLayout>
            <PageHeader
                title="Arsip Pegawai Sekolah"
                subtitle="Daftar pegawai yang telah dinonaktifkan/dihapus dengan otorisasi resmi Surat Perintah Kepala Sekolah."
            />

            <div className="mb-6 flex justify-start">
                <Link
                    href="/operator/employees"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors border border-slate-200 shadow-xs"
                >
                    <FiArrowLeft className="w-4 h-4 text-slate-500" />
                    <span>Kembali ke Data Pegawai Aktif</span>
                </Link>
            </div>

            <GlassCard>
                <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <FiInfo className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                        Data pegawai di halaman ini adalah data yang telah diarsipkan setelah melalui proses persetujuan penghapusan. 
                        Data riwayat dan dokumen pegawai tetap tersimpan secara aman di dalam arsip dan tidak terhapus permanen dari sistem.
                    </div>
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
