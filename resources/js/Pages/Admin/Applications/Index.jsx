import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import ApplicationTable from '@/Components/Letter/ApplicationTable';
import Pagination from '@/Components/UI/Pagination';
import GlassCard from '@/Components/UI/GlassCard';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import ApplicationFilterBar from './Partials/ApplicationFilterBar';

export default function ApplicationsIndex({ applications: initialApplications, filters: initialFilters = {} }) {
    const {
        data: applications,
        filters,
        updateFilter,
        handleSearch,
        handlePageClick,
        isLoading,
    } = useAsyncTable({
        url: '/admin/applications',
        initialData: initialApplications,
        dataKey: 'applications',
        initialFilters: {
            search: initialFilters.search || '',
            status: initialFilters.status || '',
        },
    });

    return (
        <AdminLayout>
            <PageHeader
                title="Daftar Pengajuan Surat Masuk — Disdik KBB"
                subtitle="Verifikasi permohonan surat dari seluruh sekolah di Kabupaten Bandung Barat."
            />

            <GlassCard>
                <ApplicationFilterBar
                    search={filters.search}
                    onSearchChange={handleSearch}
                    status={filters.status}
                    onStatusChange={(val) => updateFilter('status', val, true)}
                    isLoading={isLoading}
                />

                <ApplicationTable
                    applications={applications.data}
                    basePath="/admin/applications"
                    isLoading={isLoading}
                />

                <Pagination links={applications.links} onPageClick={handlePageClick} />
            </GlassCard>
        </AdminLayout>
    );
}
