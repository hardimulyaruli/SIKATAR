import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 select-none">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight cursor-default">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-zinc-500 mt-1 cursor-default">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
