import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="font-serif-garamond text-3xl font-bold text-slate-900 tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm font-sans-inter text-slate-500 mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
