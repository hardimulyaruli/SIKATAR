import React from 'react';
import Icon from '@/Components/UI/Icon';

/**
 * OperatorStatCards displays the top-level KPI metrics for School Operators:
 * Total applications submitted, pending Disdik review count, and school identification summary.
 * Single Responsibility: Presenting operator metrics overview.
 */
export default function OperatorStatCards({ school, stats = {} }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Submissions Card */}
            <div className="p-8 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT relative overflow-hidden group shadow-xs">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>
                <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-6">
                    Total Surat Diajukan
                </h3>
                <div className="flex items-baseline gap-4">
                    <span className="font-headline-md text-4xl md:text-5xl text-primary leading-none">
                        {stats.total || 0}
                    </span>
                    <span className="font-body-md text-secondary text-xs flex items-center gap-1 font-medium">
                        <Icon name="trending_up" className="text-sm" /> +100% Valid
                    </span>
                </div>
            </div>

            {/* Pending Review Disdik */}
            <div className="p-8 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT relative overflow-hidden group shadow-xs">
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>
                <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-6">
                    Pending Review Disdik
                </h3>
                <div className="flex items-baseline gap-4">
                    <span className="font-headline-md text-4xl md:text-5xl text-primary leading-none">
                        {stats.pending || 0}
                    </span>
                    <span className="font-body-md text-on-surface-variant text-xs font-medium">
                        Memerlukan tindakan
                    </span>
                </div>
            </div>

            {/* School Status Card (Hero Style) */}
            <div className="p-8 bg-primary text-on-primary rounded-DEFAULT relative overflow-hidden flex flex-col justify-between shadow-xs">
                <h3 className="font-label-sm text-xs text-on-primary/70 uppercase tracking-widest mb-6">
                    Status Sekolah
                </h3>
                <div>
                    <span className="font-headline-md text-3xl leading-none block mb-2 font-normal">
                        {school?.name || 'SDN 1 Padalarang'}
                    </span>
                    <p className="font-body-md text-on-primary/80 text-xs leading-relaxed max-w-[240px]">
                        NPSN: {school?.npsn || '-'} • Akreditasi {school?.status_akreditasi || '-'}
                    </p>
                </div>
            </div>
        </section>
    );
}
