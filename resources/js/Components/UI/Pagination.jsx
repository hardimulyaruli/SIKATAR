import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [], onPageClick }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <span
                            key={key}
                            className="px-3.5 py-1.5 text-xs text-slate-400 border border-slate-200/60 rounded-lg cursor-not-allowed bg-slate-50/50"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                if (onPageClick) {
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                if (!link.active) {
                                    onPageClick(link.url);
                                }
                            }}
                            className={`px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
                                link.active
                                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 cursor-default'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
                            link.active
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
