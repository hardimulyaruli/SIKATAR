import React from 'react';
import SearchFilter from '@/Components/UI/SearchFilter';

/**
 * ApplicationFilterBar handles searching and status-based filtering for letter applications.
 * Single Responsibility: Presenting search input and application status options.
 */
export default function ApplicationFilterBar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    isLoading = false,
}) {
    const statusOptions = [
        { label: 'Diajukan (Submitted)', value: 'submitted' },
        { label: 'Dalam Pemeriksaan', value: 'under_review' },
        { label: 'Perlu Revisi', value: 'revision_requested' },
        { label: 'Disetujui', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
    ];

    return (
        <SearchFilter
            search={search}
            onSearchChange={onSearchChange}
            filter={status}
            onFilterChange={onStatusChange}
            filterOptions={statusOptions}
            placeholder="Cari no. pengajuan, nama sekolah, perihal..."
            isLoading={isLoading}
        />
    );
}
