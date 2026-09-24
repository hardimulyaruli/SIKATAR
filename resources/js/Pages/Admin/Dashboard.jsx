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
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200/80 pb-6">
                <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                        {todayStr}
                    </p>
                    <h1 className="text-3xl md:text-4xl text-zinc-950 font-bold tracking-tight">
                        Ringkasan Verifikasi
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/applications"
                        className="px-4 py-2.5 bg-zinc-900/90 hover:bg-black text-white text-xs font-bold rounded-xl border border-zinc-800 backdrop-blur-xl shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                        <Icon name="gavel" className="text-sm text-white" />
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
                    <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 mb-4">
                        <h2 className="font-bold text-zinc-950 text-xl tracking-tight">Daftar Pengajuan Perlu Tindakan</h2>
                        <Link
                            href="/admin/applications"
                            className="px-3 py-1.5 bg-white/70 hover:bg-zinc-900 text-zinc-900 hover:text-white text-xs font-bold rounded-xl border border-zinc-300/80 backdrop-blur-xl shadow-2xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                            Semua Pengajuan <Icon name="arrow_forward" className="text-sm" />
                        </Link>
                    </div>
                    <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/90 rounded-2xl p-6 shadow-sm">
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
