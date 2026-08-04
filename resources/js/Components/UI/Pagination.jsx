import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            {links.map((link, key) => (
                link.url === null ? (
                    <span
                        key={key}
                        className="px-3.5 py-1.5 text-xs text-slate-400 border border-slate-200/60 rounded-lg cursor-not-allowed bg-slate-50/50"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
                            link.active
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
