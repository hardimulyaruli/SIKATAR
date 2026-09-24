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
            <div className="p-8 bg-white/80 backdrop-blur-xl border border-zinc-200/90 rounded-2xl relative overflow-hidden group shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">
                    Total Dispatches Masuk
                </h3>
                <div className="flex items-baseline gap-4">
                    <span className="text-4xl md:text-5xl font-bold text-zinc-950 leading-none">
                        {stats.total_applications || 0}
                    </span>
                    <span className="text-zinc-600 text-xs flex items-center gap-1 font-semibold">
                        <Icon name="trending_up" className="text-sm text-zinc-800" /> Terdata
                    </span>
                </div>
            </div>

            {/* Pending Review Card */}
            <div className="p-8 bg-white/80 backdrop-blur-xl border border-zinc-200/90 rounded-2xl relative overflow-hidden group shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">
                    Pending Review Disdik
                </h3>
                <div className="flex items-baseline gap-4">
                    <span className="text-4xl md:text-5xl font-bold text-zinc-950 leading-none">
                        {stats.pending_applications || 0}
                    </span>
                    <span className="text-zinc-900 text-xs font-bold">
                        Action required
                    </span>
                </div>
            </div>

            {/* Total Schools Card (Monochrome High-Contrast Hero Card) */}
            <div className="p-8 bg-zinc-900/95 text-white backdrop-blur-xl rounded-2xl border border-zinc-800 relative overflow-hidden flex flex-col justify-between shadow-sm">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">
                    Total Sekolah KBB
                </h3>
                <div>
                    <span className="text-4xl font-bold text-white leading-none block mb-2">
                        {stats.total_schools || 0} Sekolah
                    </span>
                    <p className="text-zinc-300 text-xs leading-relaxed font-medium">
                        Terverifikasi di Kabupaten Bandung Barat
                    </p>
                </div>
            </div>
        </section>
    );
}
