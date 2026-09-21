import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import ApplicationTable from '@/Components/Letter/ApplicationTable';
import { Link } from '@inertiajs/react';
import AdminStatCards from './Partials/AdminStatCards';
import SchoolActivitySummary from './Partials/SchoolActivitySummary';

/**
 * AdminDashboard orchestrates the executive overview for Disdik administrators:
 * Key verification stats, action-required applications table, and school correspondence activity summary.
 * Single Responsibility: Admin dashboard layout orchestration.
 */
export default function AdminDashboard({ stats = {}, recent_applications = [], schools_summary = [] }) {
    const todayStr = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <AdminLayout>
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline/10 pb-8">
                <div>
                    <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                        {todayStr}
                    </p>
                    <h1 className="font-headline-md text-3xl md:text-5xl text-primary font-normal">
                        Ringkasan Verifikasi
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/applications"
                        className="px-5 py-3 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest font-semibold rounded-DEFAULT hover:bg-inverse-surface transition-colors flex items-center gap-2 shadow-xs"
                    >
                        <Icon name="gavel" className="text-sm text-on-primary" />
                        <span>Verifikasi Surat Masuk</span>
                    </Link>
                </div>
            </header>

            {/* Stats Bento Grid */}
            <AdminStatCards stats={stats} />

            {/* Main Content Area: Feed & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Applications Table Feed (8 Cols) */}
                <section className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-outline/10 pb-4 mb-4">
                        <h2 className="font-headline-md text-primary text-2xl">Daftar Pengajuan Perlu Tindakan</h2>
                        <Link
                            href="/admin/applications"
                            className="font-label-sm text-xs text-secondary uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
                        >
                            Semua Pengajuan <Icon name="arrow_forward" className="text-sm" />
                        </Link>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline/10 rounded-DEFAULT p-6 shadow-xs">
                        <ApplicationTable applications={recent_applications} basePath="/admin/applications" />
                    </div>
                </section>

                {/* Schools Summary Sidebar (4 Cols) */}
                <aside className="lg:col-span-4 space-y-8">
                    <SchoolActivitySummary schools={schools_summary} />
                </aside>
            </div>
        </AdminLayout>
    );
}
