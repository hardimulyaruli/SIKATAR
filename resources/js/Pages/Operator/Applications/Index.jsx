import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import ApplicationTable from '@/Components/Letter/ApplicationTable';
import Pagination from '@/Components/UI/Pagination';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import ApplicationHeader from './Partials/ApplicationHeader';
import ApplicationFilterTabs from './Partials/ApplicationFilterTabs';

export default function ApplicationIndex({ applications: initialApplications, filters: initialFilters = {} }) {
    const {
        data: applications,
        filters,
        updateFilter,
        isLoading,
        handlePageClick,
        fetchData,
    } = useAsyncTable({
        url: '/operator/applications',
        initialData: initialApplications,
        dataKey: 'applications',
        initialFilters: {
            search: initialFilters.search || '',
            status: initialFilters.status || '',
        },
        debounceMs: 500,
    });

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchData(filters);
        }
    };

    const handleClearSearch = () => {
        updateFilter('search', '', true);
    };

    return (
        <OperatorLayout>
            <ApplicationHeader />

            <ApplicationFilterTabs
                status={filters.status}
                onStatusChange={(val) => updateFilter('status', val, true)}
                search={filters.search}
                onSearchChange={(val) => updateFilter('search', val)}
                onSearchKeyDown={handleSearchKeyDown}
                onClearSearch={handleClearSearch}
                isLoading={isLoading}
            />

            {/* Table Listing */}
            <div className="bg-surface-container-lowest border border-outline/10 rounded-DEFAULT p-6 shadow-xs">
                <ApplicationTable
                    applications={applications.data}
                    basePath="/operator/applications"
                    isLoading={isLoading}
                />
                <Pagination links={applications.links} onPageClick={handlePageClick} />
            </div>
        </OperatorLayout>
    );
}
