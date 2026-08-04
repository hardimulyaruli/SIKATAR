import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import ApplicationTable from '@/Components/Letter/ApplicationTable';
import Pagination from '@/Components/UI/Pagination';
import { Link, router } from '@inertiajs/react';

export default function ApplicationIndex({ applications, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (val) => {
        setSearch(val);
        router.get('/operator/applications', { search: val, status }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (val) => {
        setStatus(val);
        router.get('/operator/applications', { search, status: val }, { preserveState: true, replace: true });
    };

    const tabs = [
        { label: 'All Entries', value: '' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Revision', value: 'revision_requested' },
        { label: 'Approved', value: 'approved' },
    ];

    return (
        <OperatorLayout>
            {/* Header Title Section */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline/10 pb-8">
                <div>
                    <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                        Correspondence Bureau
                    </p>
                    <h1 className="font-headline-md text-3xl md:text-5xl text-primary font-normal">
                        Archive & Status Surat
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/operator/applications/create"
                        className="px-5 py-3 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest font-semibold rounded-DEFAULT hover:bg-inverse-surface transition-colors flex items-center gap-2 shadow-xs"
                    >
                        <Icon name="add" className="text-sm text-on-primary" />
                        <span>New Entry</span>
                    </Link>
                </div>
            </header>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-outline/10 pb-4">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto font-label-sm text-xs uppercase tracking-widest">
                    {tabs.map((tab) => {
                        const isActive = status === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => handleStatusFilter(tab.value)}
                                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                                    isActive
                                        ? 'bg-primary text-on-primary font-semibold'
                                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by ref number, subject..."
                        className="w-full pl-9 pr-4 py-2 bg-transparent border-b border-outline/20 focus:border-primary focus:ring-0 text-xs text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Table Listing */}
            <div className="bg-surface-container-lowest border border-outline/10 rounded-DEFAULT p-6 shadow-xs">
                <ApplicationTable
                    applications={applications.data}
                    basePath="/operator/applications"
                />
                <Pagination links={applications.links} />
            </div>
        </OperatorLayout>
    );
}
