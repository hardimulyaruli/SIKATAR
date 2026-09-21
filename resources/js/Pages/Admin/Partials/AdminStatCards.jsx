import React from 'react';
import Icon from '@/Components/UI/Icon';

/**
 * AdminStatCards displays the top-level KPI bento cards for the Admin Dashboard:
 * Total applications received, applications pending Disdik review, and verified schools.
 * Single Responsibility: Presenting admin metrics overview.
 */
export default function AdminStatCards({ stats = {} }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Dispatches Card */}
            <div className="p-8 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>
                <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-6">
                    Total Dispatches Masuk
                </h3>
                <div className="flex items-baseline gap-4">
                    <span className="font-headline-md text-4xl md:text-5xl text-primary leading-none">
                        {stats.total_applications || 0}
                    </span>
                    <span className="font-body-md text-secondary text-xs flex items-center gap-1 font-medium">
                        <Icon name="trending_up" className="text-sm" /> Terdata
                    </span>
                </div>
            </div>

            {/* Pending Review Card */}
            <div className="p-8 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>
                <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-6">
                    Pending Review Disdik
                </h3>
                <div className="flex items-baseline gap-4">
                    <span className="font-headline-md text-4xl md:text-5xl text-primary leading-none">
                        {stats.pending_applications || 0}
                    </span>
                    <span className="font-body-md text-error text-xs font-medium">
                        Action required
                    </span>
                </div>
            </div>

            {/* Total Schools Card (Primary Hero Style) */}
            <div className="p-8 bg-primary text-on-primary rounded-DEFAULT relative overflow-hidden flex flex-col justify-between">
                <h3 className="font-label-sm text-xs text-on-primary/70 uppercase tracking-widest mb-6">
                    Total Sekolah KBB
                </h3>
                <div>
                    <span className="font-headline-md text-4xl leading-none block mb-2 font-normal">
                        {stats.total_schools || 0} Sekolah
                    </span>
                    <p className="font-body-md text-on-primary/80 text-xs leading-relaxed">
                        Terverifikasi di Kabupaten Bandung Barat
                    </p>
                </div>
            </div>
        </section>
    );
}
