import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'blue', description }) {
    const colorStyles = {
        blue: {
            bg: 'bg-blue-50/80',
            text: 'text-blue-600',
            border: 'border-blue-100',
        },
        emerald: {
            bg: 'bg-emerald-50/80',
            text: 'text-emerald-600',
            border: 'border-emerald-100',
        },
        amber: {
            bg: 'bg-amber-50/80',
            text: 'text-amber-600',
            border: 'border-amber-100',
        },
        indigo: {
            bg: 'bg-indigo-50/80',
            text: 'text-indigo-600',
            border: 'border-indigo-100',
        },
        rose: {
            bg: 'bg-rose-50/80',
            text: 'text-rose-600',
            border: 'border-rose-100',
        },
    };

    const style = colorStyles[color] || colorStyles.blue;

    return (
        <div className="glass-card p-5 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
                    {description && (
                        <p className="text-xs text-slate-400 mt-1">{description}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${style.bg} ${style.text} border ${style.border}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
}
