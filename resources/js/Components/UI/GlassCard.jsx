import React from 'react';

export default function GlassCard({ children, className = '', header, footer }) {
    return (
        <div className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${className}`}>
            {header && (
                <div className="px-6 py-4 border-b border-slate-100/80 bg-white/40 flex items-center justify-between">
                    {header}
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && (
                <div className="px-6 py-3.5 border-t border-slate-100/80 bg-slate-50/40">
                    {footer}
                </div>
            )}
        </div>
    );
}
