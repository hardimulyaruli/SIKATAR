import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import BadgeStatus from '@/Components/UI/BadgeStatus';
import { Link } from '@inertiajs/react';

export default function OperatorDashboard({ school, stats, recent_applications = [], templates = [] }) {
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
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Stat Card 1 */}
                <div className="p-8 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>
                    <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-6">
                        Total Surat Diajukan
                    </h3>
                    <div className="flex items-baseline gap-4">
                        <span className="font-headline-md text-4xl md:text-5xl text-primary leading-none">
                            {stats.total}
                        </span>
                        <span className="font-body-md text-secondary text-xs flex items-center gap-1 font-medium">
                            <Icon name="trending_up" className="text-sm" /> +100% Valid
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
                            {stats.pending}
                        </span>
                        <span className="font-body-md text-on-surface-variant text-xs font-medium">
                            Memerlukan tindakan
                        </span>
                    </div>
                </div>

                {/* Stat Card 3 (Black Hero Card) */}
                <div className="p-8 bg-primary text-on-primary rounded-DEFAULT relative overflow-hidden flex flex-col justify-between">
                    <h3 className="font-label-sm text-xs text-on-primary/70 uppercase tracking-widest mb-6">
                        Status Sekolah
                    </h3>
                    <div>
                        <span className="font-headline-md text-3xl leading-none block mb-2 font-normal">
                            {school?.name || 'SDN 1 Padalarang'}
                        </span>
                        <p className="font-body-md text-on-primary/80 text-xs leading-relaxed max-w-[240px]">
                            NPSN: {school?.npsn || '20201001'} • Akreditasi {school?.status_akreditasi || 'A'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area: Activity Feed & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Dispatches Feed (8 Cols) */}
                <section className="lg:col-span-8">
                    <div className="flex items-center justify-between border-b border-outline/10 pb-4 mb-6">
                        <h2 className="font-headline-md text-primary text-2xl">Riwayat Pengajuan Terbaru</h2>
                        <Link href="/operator/applications" className="font-label-sm text-xs text-secondary uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1">
                            Lihat Semua <Icon name="arrow_forward" className="text-sm" />
                        </Link>
                    </div>

                    <div className="divide-y divide-outline/10">
                        {recent_applications.length > 0 ? (
                            recent_applications.map((app) => (
                                <article key={app.id} className="py-6 group cursor-pointer">
                                    <div className="flex gap-6 items-start">
                                        <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest w-20 pt-1 shrink-0">
                                            {new Date(app.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-2.5 py-0.5 bg-surface-container-high text-primary font-label-sm text-[10px] uppercase tracking-widest rounded-sm">
                                                    {app.template_code}
                                                </span>
                                                <BadgeStatus status={app.status} />
                                            </div>
                                            <Link href={`/operator/applications/${app.id}`}>
                                                <h3 className="font-headline-md text-primary text-xl mb-2 group-hover:text-secondary transition-colors font-normal">
                                                    {app.subject}
                                                </h3>
                                            </Link>
                                            <p className="font-body-md text-on-surface-variant text-xs leading-relaxed mb-3 max-w-2xl line-clamp-2">
                                                {app.body_content}
                                            </p>
                                            <div className="flex gap-4">
                                                <Link href={`/operator/applications/${app.id}`} className="font-label-sm text-xs text-primary uppercase tracking-widest hover:underline underline-offset-4 font-semibold">
                                                    Review Document &rarr;
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="py-12 text-center text-on-surface-variant font-body-md text-sm">
                                Belum ada riwayat pengajuan surat.
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Actions Sidebar (4 Cols) */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-surface-container-lowest border border-outline/10 p-6 rounded-DEFAULT">
                        <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-6 border-b border-outline/10 pb-2">
                            Quick Actions
                        </h3>
                        <ul className="space-y-4 font-body-md text-sm">
                            <li>
                                <Link href="/operator/applications/create" className="w-full flex items-center justify-between text-left group py-1">
                                    <span className="text-primary group-hover:text-secondary transition-colors font-medium">Buat Surat Permohonan Baru</span>
                                    <Icon name="arrow_forward" className="text-outline text-sm group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </li>
                            <li>
                                <Link href="/operator/profile" className="w-full flex items-center justify-between text-left group py-1">
                                    <span className="text-primary group-hover:text-secondary transition-colors font-medium">Atur Profil & Logo Kop Surat</span>
                                    <Icon name="arrow_forward" className="text-outline text-sm group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </li>
                            <li>
                                <Link href="/operator/applications" className="w-full flex items-center justify-between text-left group py-1">
                                    <span className="text-primary group-hover:text-secondary transition-colors font-medium">Arsip & Lacak Status Surat</span>
                                    <Icon name="arrow_forward" className="text-outline text-sm group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline/10 p-6 rounded-DEFAULT">
                        <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-4 border-b border-outline/10 pb-2">
                            Disdik Network Status
                        </h3>
                        <div className="space-y-3 font-body-md text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Layanan Disdik KBB</span>
                                <span className="flex items-center gap-1.5 font-label-sm text-primary uppercase tracking-widest text-[10px]">
                                    <span className="w-2 h-2 rounded-full bg-primary block"></span> Online
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Server Verifikasi</span>
                                <span className="flex items-center gap-1.5 font-label-sm text-primary uppercase tracking-widest text-[10px]">
                                    <span className="w-2 h-2 rounded-full bg-primary block"></span> Active
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </OperatorLayout>
    );
}
