import React from 'react';
import Icon from '@/Components/UI/Icon';

/**
 * ApplicationFilterTabs renders status navigation tabs and a search field for operator letter applications.
 * Single Responsibility: Present status categories and search query controls.
 */
export default function ApplicationFilterTabs({
    status,
    onStatusChange,
    search,
    onSearchChange,
    onSearchKeyDown,
    onClearSearch,
    isLoading = false,
}) {
    const tabs = [
        { label: 'All Entries', value: '' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Revision', value: 'revision_requested' },
        { label: 'Approved', value: 'approved' },
    ];

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-outline/10 pb-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto font-label-sm text-xs uppercase tracking-widest">
                {tabs.map((tab) => {
                    const isActive = status === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => onStatusChange(tab.value)}
                            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
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
                {isLoading ? (
                    <Icon
                        name="progress_activity"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-sm animate-spin pointer-events-none"
                    />
                ) : (
                    <Icon
                        name="search"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none"
                    />
                )}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={onSearchKeyDown}
                    placeholder="Search by ref number, subject..."
                    className="w-full pl-9 pr-7 py-2 bg-transparent border-b border-outline/20 focus:border-primary focus:ring-0 text-xs text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-colors"
                />
                {search && (
                    <button
                        type="button"
                        onClick={onClearSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 rounded-full text-xs transition-colors cursor-pointer"
                        title="Hapus pencarian"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
