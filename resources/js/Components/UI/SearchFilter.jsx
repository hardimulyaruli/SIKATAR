import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function SearchFilter({ 
    search, 
    onSearchChange, 
    filter, 
    onFilterChange, 
    filterOptions = [], 
    placeholder = 'Cari...' 
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
            <div className="relative w-full sm:w-80">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
            </div>
            {filterOptions.length > 0 && (
                <div className="relative w-full sm:w-auto">
                    <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <select
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="w-full sm:w-56 pl-10 pr-8 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                        <option value="">Semua Status / Category</option>
                        {filterOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
