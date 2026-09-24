import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import TableWrapper from '@/Components/UI/TableWrapper';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import { useModalState } from '@/Hooks/useModalState';
import SchoolTable from './Partials/SchoolTable';
import CreateSchoolModal from './Partials/CreateSchoolModal';

export default function SchoolsIndex({ schools: initialSchools, filters: initialFilters = {} }) {
    const {
        data: schools,
        filters,
        updateFilter,
        handleSearch,
        handlePageClick,
        isLoading,
    } = useAsyncTable({
        url: '/admin/schools',
        initialData: initialSchools,
        dataKey: 'schools',
        initialFilters: {
            search: initialFilters.search || '',
            jenjang: initialFilters.jenjang || '',
        },
    });

    const {
        isOpen: isModalOpen,
        openModal: handleOpenModal,
        closeModal: handleCloseModal,
    } = useModalState(false);

    const jenjangOptions = [
        { label: 'SD (Sekolah Dasar)', value: 'SD' },
        { label: 'SMP (Sekolah Menengah Pertama)', value: 'SMP' },
    ];

    return (
        <AdminLayout>
            <PageHeader
                title="Daftar Sekolah & Akun Operator KBB"
                subtitle="Kelola data sekolah dan buat akun login operator untuk seluruh sekolah di Kabupaten Bandung Barat."
                action={
                    <button
                        onClick={handleOpenModal}
                        className="px-4 py-2.5 bg-zinc-900/90 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm backdrop-blur-xl border border-zinc-800 active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                        <span>+ Tambah Akun Sekolah Baru</span>
                    </button>
                }
            />

            <GlassCard>
                <SearchFilter
                    search={filters.search}
                    onSearchChange={handleSearch}
                    filter={filters.jenjang}
                    onFilterChange={(val) => updateFilter('jenjang', val, true)}
                    filterOptions={jenjangOptions}
                    placeholder="Cari nama sekolah, NPSN, alamat..."
                    isLoading={isLoading}
                />

                <TableWrapper isLoading={isLoading} loadingText="Memuat data sekolah..." className="mt-4">
                    <SchoolTable schools={schools.data} />
                </TableWrapper>

                <Pagination links={schools.links} onPageClick={handlePageClick} />
            </GlassCard>

            <CreateSchoolModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </AdminLayout>
    );
}
