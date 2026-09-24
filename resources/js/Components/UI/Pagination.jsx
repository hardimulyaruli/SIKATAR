import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [], onPageClick }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <span
                            key={key}
                            className="inline-flex items-center justify-center min-w-[36px] h-9 px-3 text-xs text-zinc-400 border border-zinc-200/60 rounded-lg cursor-not-allowed bg-white/30 backdrop-blur-md select-none font-medium"
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
                            className={`inline-flex items-center justify-center min-w-[36px] h-9 px-3 text-xs rounded-lg font-bold backdrop-blur-md transition-all ${
                                link.active
                                    ? 'bg-zinc-900/80 text-white border border-zinc-800/90 shadow-sm cursor-default select-none'
                                    : 'bg-white/50 hover:bg-white/80 text-zinc-900 border border-zinc-300/80 shadow-2xs hover:border-zinc-400 active:scale-95 cursor-pointer'
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
                        className={`inline-flex items-center justify-center min-w-[36px] h-9 px-3 text-xs rounded-lg font-bold backdrop-blur-md transition-all ${
                            link.active
                                ? 'bg-zinc-900/80 text-white border border-zinc-800/90 shadow-sm cursor-default select-none'
                                : 'bg-white/50 hover:bg-white/80 text-zinc-900 border border-zinc-300/80 shadow-2xs hover:border-zinc-400 active:scale-95 cursor-pointer'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
