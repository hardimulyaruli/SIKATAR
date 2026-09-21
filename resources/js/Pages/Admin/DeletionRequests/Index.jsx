import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import TableWrapper from '@/Components/UI/TableWrapper';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import { useDeletionModals } from '@/Hooks/useDeletionModals';
import DeletionRequestTable from './Partials/DeletionRequestTable';
import ApproveDeletionModal from './Partials/ApproveDeletionModal';
import RejectDeletionModal from './Partials/RejectDeletionModal';

export default function DeletionRequestsIndex({ requests: initialRequests, filters: initialFilters = {} }) {
    const {
        data: requests,
        filters,
        updateFilter,
        handleSearch,
        handlePageClick,
        isLoading,
    } = useAsyncTable({
        url: '/admin/deletion-requests',
        initialData: initialRequests,
        dataKey: 'requests',
        initialFilters: {
            search: initialFilters.search || '',
            status: initialFilters.status || '',
        },
    });

    const {
        approveModalReq,
        rejectModalReq,
        openApproveModal,
        closeApproveModal,
        openRejectModal,
        closeRejectModal,
    } = useDeletionModals();

    const statusOptions = [
        { label: 'Semua Status', value: '' },
        { label: 'Menunggu Persetujuan', value: 'pending' },
        { label: 'Disetujui (Diarsipkan)', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
    ];

    return (
        <AdminLayout>
            <PageHeader
                title="Persetujuan Penghapusan & Arsip Pegawai"
                subtitle="Verifikasi dan tindak lanjuti permohonan penghapusan pegawai dari sekolah-sekolah di lingkungan Disdik KBB."
            />

            <GlassCard>
                <SearchFilter
                    search={filters.search}
                    onSearchChange={handleSearch}
                    filter={filters.status}
                    onFilterChange={(val) => updateFilter('status', val, true)}
                    filterOptions={statusOptions}
                    placeholder="Cari nama pegawai, NIP, atau nama sekolah..."
                    isLoading={isLoading}
                />

                <TableWrapper isLoading={isLoading} loadingText="Memuat permohonan..." className="mt-4">
                    <DeletionRequestTable
                        requests={requests.data}
                        onApprove={openApproveModal}
                        onReject={openRejectModal}
                    />
                </TableWrapper>

                <Pagination links={requests.links} onPageClick={handlePageClick} />
            </GlassCard>

            <ApproveDeletionModal
                request={approveModalReq}
                onClose={closeApproveModal}
            />

            <RejectDeletionModal
                request={rejectModalReq}
                onClose={closeRejectModal}
            />
        </AdminLayout>
    );
}
