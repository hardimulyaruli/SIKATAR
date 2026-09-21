import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';
import BadgeStatus from '@/Components/UI/BadgeStatus';

/**
 * OperatorRecentDispatchesFeed renders recent letter submissions from the school.
 * Single Responsibility: Displaying the school's recent letter dispatch activity feed.
 */
export default function OperatorRecentDispatchesFeed({ applications = [] }) {
    return (
        <section className="lg:col-span-8">
            <div className="flex items-center justify-between border-b border-outline/10 pb-4 mb-6">
                <h2 className="font-headline-md text-primary text-2xl">Riwayat Pengajuan Terbaru</h2>
                <Link
                    href="/operator/applications"
                    className="font-label-sm text-xs text-secondary uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
                >
                    Lihat Semua <Icon name="arrow_forward" className="text-sm" />
                </Link>
            </div>

            <div className="divide-y divide-outline/10">
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <article key={app.id} className="py-6 group">
                            <div className="flex gap-6 items-start">
                                <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest w-20 pt-1 shrink-0">
                                    {new Date(app.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                    })}
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
                                        <Link
                                            href={`/operator/applications/${app.id}`}
                                            className="font-label-sm text-xs text-primary uppercase tracking-widest hover:underline underline-offset-4 font-semibold"
                                        >
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
    );
}
