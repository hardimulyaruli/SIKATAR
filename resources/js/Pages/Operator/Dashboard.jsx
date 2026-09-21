import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import { Link } from '@inertiajs/react';
import OperatorStatCards from './Partials/OperatorStatCards';
import OperatorRecentDispatchesFeed from './Partials/OperatorRecentDispatchesFeed';
import OperatorQuickActionsSidebar from './Partials/OperatorQuickActionsSidebar';

/**
 * OperatorDashboard orchestrates the school operator dashboard:
 * Status counters, quick action shortcuts, recent submission timeline, and live status.
 * Single Responsibility: Operator dashboard view orchestration.
 */
export default function OperatorDashboard({ school, stats = {}, recent_applications = [], templates = [] }) {
    const todayStr = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <OperatorLayout>
            {/* Header Title Section */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline/10 pb-8">
                <div>
                    <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                        {todayStr}
                    </p>
                    <h1 className="font-headline-md text-3xl md:text-5xl text-primary font-normal">
                        Ringkasan Disdik KBB
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/operator/applications/create"
                        className="px-5 py-3 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest font-semibold rounded-DEFAULT hover:bg-inverse-surface transition-colors flex items-center gap-2 shadow-xs"
                    >
                        <Icon name="add" className="text-sm text-on-primary" />
                        <span>New Entry (Buat Surat)</span>
                    </Link>
                </div>
            </header>

            {/* Bento Grid Stats */}
            <OperatorStatCards school={school} stats={stats} />

            {/* Main Content Area: Activity Feed & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <OperatorRecentDispatchesFeed applications={recent_applications} />
                <OperatorQuickActionsSidebar />
            </div>
        </OperatorLayout>
    );
}
