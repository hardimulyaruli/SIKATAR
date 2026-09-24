import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiFilter, FiX, FiLoader } from 'react-icons/fi';

export default function SearchFilter({ 
    search = '', 
    onSearchChange, 
    filter = '', 
    onFilterChange, 
    filterOptions = [], 
    placeholder = 'Cari...',
    filterLabel = 'Semua Filter',
    debounceMs = 500,
    isLoading = false,
    className = 'mb-6',
    children,
}) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const isFirstMount = useRef(true);
    const onSearchChangeRef = useRef(onSearchChange);
    const timerRef = useRef(null);

    // Keep onSearchChange ref current across renders
    useEffect(() => {
        onSearchChangeRef.current = onSearchChange;
    }, [onSearchChange]);

    // Synchronize searchTerm if search prop changes from the outside (e.g. filters reset, navigation)
    useEffect(() => {
        setSearchTerm(search || '');
    }, [search]);

    // Debounce triggering onSearchChange when user types
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        // Avoid firing if searchTerm is identical to prop search (e.g. from parent sync)
        if (searchTerm === (search || '')) {
            return;
        }

        timerRef.current = setTimeout(() => {
            if (onSearchChangeRef.current) {
                onSearchChangeRef.current(searchTerm);
            }
        }, debounceMs);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [searchTerm, debounceMs, search]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            if (onSearchChangeRef.current && searchTerm !== (search || '')) {
                onSearchChangeRef.current(searchTerm);
            }
        }
    };

    const handleClear = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setSearchTerm('');
        if (onSearchChangeRef.current && (search || '') !== '') {
            onSearchChangeRef.current('');
        }
    };

    return (
        <div className={`flex flex-col sm:flex-row gap-3 items-center justify-between ${className}`}>
            <div className="relative w-full sm:w-80">
                {isLoading ? (
                    <FiLoader className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4 animate-spin pointer-events-none" />
                ) : (
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
                )}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-9 py-2.5 bg-white/60 backdrop-blur-xl border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all shadow-sm"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5 rounded-full transition-colors cursor-pointer"
                        title="Hapus pencarian"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                )}
            </div>
            {(filterOptions.length > 0 || children) && (
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {filterOptions.length > 0 && (
                        <div className="relative w-full sm:w-auto">
                            <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
                            <select
                                value={filter}
                                onChange={(e) => onFilterChange(e.target.value)}
                                className="w-full sm:w-56 pl-10 pr-8 py-2.5 bg-white/60 backdrop-blur-xl border border-zinc-200 rounded-xl text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all shadow-sm appearance-none cursor-pointer"
                            >
                                <option value="">{filterLabel}</option>
                                {filterOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
}
