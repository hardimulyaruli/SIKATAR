import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * SchoolActivitySummary renders the sidebar list of schools and their active application dispatches.
 * Single Responsibility: Displaying school correspondence load summary.
 */
export default function SchoolActivitySummary({ schools = [] }) {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/90 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3 mb-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Faculty & Schools
                </h3>
                <Link
                    href="/admin/schools"
                    className="px-2.5 py-1 bg-white/70 hover:bg-zinc-900 text-zinc-900 hover:text-white text-[11px] font-bold rounded-lg border border-zinc-300/80 backdrop-blur-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                    View All
                </Link>
            </div>
            <div className="space-y-3">
                {schools.length > 0 ? (
                    schools.map((sc) => (
                        <div
                            key={sc.id}
                            className="p-3.5 bg-zinc-50/80 hover:bg-zinc-100/80 transition-colors rounded-xl border border-zinc-200/80 flex items-center justify-between"
                        >
                            <div>
                                <h4 className="font-bold text-zinc-950 text-sm">{sc.name}</h4>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                                    NPSN: {sc.npsn} • Akreditasi {sc.status_akreditasi}
                                </p>
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-zinc-900 text-white shadow-2xs">
                                {sc.letter_applications_count || 0}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-zinc-500 text-center py-4">Belum ada data sekolah.</p>
                )}
            </div>
        </div>
    );
}
