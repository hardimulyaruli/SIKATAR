import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * SchoolActivitySummary renders the sidebar list of schools and their active application dispatches.
 * Single Responsibility: Displaying school correspondence load summary.
 */
export default function SchoolActivitySummary({ schools = [] }) {
    return (
        <div className="bg-surface-container-lowest border border-outline/10 p-6 rounded-DEFAULT shadow-xs">
            <div className="flex items-center justify-between border-b border-outline/10 pb-3 mb-6">
                <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
                    Faculty & Schools
                </h3>
                <Link
                    href="/admin/schools"
                    className="font-label-sm text-[10px] text-secondary uppercase tracking-widest hover:underline"
                >
                    View All
                </Link>
            </div>
            <div className="space-y-4">
                {schools.length > 0 ? (
                    schools.map((sc) => (
                        <div
                            key={sc.id}
                            className="p-3 bg-surface-container-low rounded-sm border border-outline/10 flex items-center justify-between font-body-md"
                        >
                            <div>
                                <h4 className="font-headline-md text-primary text-base font-normal">{sc.name}</h4>
                                <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
                                    NPSN: {sc.npsn} • Akreditasi {sc.status_akreditasi}
                                </p>
                            </div>
                            <span className="font-label-sm text-[10px] font-bold px-2 py-1 rounded-sm bg-primary text-on-primary">
                                {sc.letter_applications_count || 0}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-on-surface-variant text-center py-4">Belum ada data sekolah.</p>
                )}
            </div>
        </div>
    );
}
