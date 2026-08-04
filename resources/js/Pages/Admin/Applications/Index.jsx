import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import ApplicationTable from '@/Components/Letter/ApplicationTable';
import Pagination from '@/Components/UI/Pagination';
import GlassCard from '@/Components/UI/GlassCard';
import { router } from '@inertiajs/react';

export default function ApplicationsIndex({ applications, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (val) => {
        setSearch(val);
        router.get('/admin/applications', { search: val, status }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (val) => {
        setStatus(val);
        router.get('/admin/applications', { search, status: val }, { preserveState: true, replace: true });
    };

    const statusOptions = [
        { label: 'Diajukan (Submitted)', value: 'submitted' },
        { label: 'Dalam Pemeriksaan', value: 'under_review' },
        { label: 'Perlu Revisi', value: 'revision_requested' },
        { label: 'Disetujui', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
    ];

    return (
        <AdminLayout>
            <PageHeader
                title="Daftar Pengajuan Surat Masuk — Disdik KBB"
                subtitle="Verifikasi permohonan surat dari seluruh sekolah di Kabupaten Bandung Barat."
            />

            <GlassCard>
                <SearchFilter
                    search={search}
                    onSearchChange={handleSearch}
                    filter={status}
                    onFilterChange={handleStatusFilter}
                    filterOptions={statusOptions}
                    placeholder="Cari no. pengajuan, nama sekolah, perihal..."
                />

                <ApplicationTable
                    applications={applications.data}
                    basePath="/admin/applications"
                />

                <Pagination links={applications.links} />
            </GlassCard>
        </AdminLayout>
    );
}
