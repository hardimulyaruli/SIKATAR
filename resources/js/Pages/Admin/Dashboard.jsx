import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import BadgeStatus from '@/Components/UI/BadgeStatus';
import ApplicationTable from '@/Components/Letter/ApplicationTable';
import { Link } from '@inertiajs/react';

export default function AdminDashboard({ stats, recent_applications = [], schools_summary = [] }) {
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
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Stat Card 1 */}
                <div className="p-8 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>
                    <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-6">
                        Total Dispatches Masuk
                    </h3>
                    <div className="flex items-baseline gap-4">
                        <span className="font-headline-md text-4xl md:text-5xl text-primary leading-none">
                            {stats.total_applications}
                        </span>
                        <span className="font-body-md text-secondary text-xs flex items-center gap-1 font-medium">
                            <Icon name="trending_up" className="text-sm" /> Terdata
                        </span>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="p-8 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-secondary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>
                    <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-6">
                        Pending Review Disdik
                    </h3>
                    <div className="flex items-baseline gap-4">
                        <span className="font-headline-md text-4xl md:text-5xl text-primary leading-none">
                            {stats.pending_applications}
                        </span>
                        <span className="font-body-md text-error text-xs font-medium">
                            Action required
                        </span>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="p-8 bg-primary text-on-primary rounded-DEFAULT relative overflow-hidden flex flex-col justify-between">
                    <h3 className="font-label-sm text-xs text-on-primary/70 uppercase tracking-widest mb-6">
                        Total Sekolah KBB
                    </h3>
                    <div>
                        <span className="font-headline-md text-4xl leading-none block mb-2 font-normal">
                            {stats.total_schools} Sekolah
                        </span>
                        <p className="font-body-md text-on-primary/80 text-xs leading-relaxed">
                            Terverifikasi di Kabupaten Bandung Barat
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area: Feed & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Applications Table Feed (8 Cols) */}
                <section className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-outline/10 pb-4 mb-4">
                        <h2 className="font-headline-md text-primary text-2xl">Daftar Pengajuan Perlu Tindakan</h2>
                        <Link href="/admin/applications" className="font-label-sm text-xs text-secondary uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1">
                            Semua Pengajuan <Icon name="arrow_forward" className="text-sm" />
                        </Link>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline/10 rounded-DEFAULT p-6 shadow-xs">
                        <ApplicationTable applications={recent_applications} basePath="/admin/applications" />
                    </div>
                </section>

                {/* Schools Summary Sidebar (4 Cols) */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-surface-container-lowest border border-outline/10 p-6 rounded-DEFAULT">
                        <div className="flex items-center justify-between border-b border-outline/10 pb-3 mb-6">
                            <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
                                Faculty & Schools
                            </h3>
                            <Link href="/admin/schools" className="font-label-sm text-[10px] text-secondary uppercase tracking-widest hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {schools_summary.map((sc) => (
                                <div key={sc.id} className="p-3 bg-surface-container-low rounded-sm border border-outline/10 flex items-center justify-between font-body-md">
                                    <div>
                                        <h4 className="font-headline-md text-primary text-base font-normal">{sc.name}</h4>
                                        <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">NPSN: {sc.npsn} • Akreditasi {sc.status_akreditasi}</p>
                                    </div>
                                    <span className="font-label-sm text-[10px] font-bold px-2 py-1 rounded-sm bg-primary text-on-primary">
                                        {sc.letter_applications_count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </AdminLayout>
    );
}
