import React from 'react';
import SearchFilter from '@/Components/UI/SearchFilter';
import { FiUsers } from 'react-icons/fi';

/**
 * AdminEmployeeFilterBar handles search input and multi-level filtering
 * by school and employee employment status (PNS/CPNS/PPPK/Honorer).
 * Perfectly aligned on the exact same row and height.
 */
export default function AdminEmployeeFilterBar({
    search,
    onSearchChange,
    schoolId,
    onSchoolChange,
    schoolOptions = [],
    statusPegawai,
    onStatusChange,
    isLoading = false,
}) {
    return (
        <SearchFilter
            search={search}
            onSearchChange={onSearchChange}
            filter={schoolId}
            onFilterChange={onSchoolChange}
            filterOptions={schoolOptions}
            filterLabel="Semua Sekolah"
            placeholder="Cari nama pegawai, NIP, atau nama sekolah..."
            isLoading={isLoading}
        >
            <div className="relative w-full sm:w-auto">
                <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
                <select
                    value={statusPegawai}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full sm:w-44 pl-10 pr-8 py-2.5 bg-white/60 backdrop-blur-xl border border-zinc-200 rounded-xl text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all shadow-sm appearance-none cursor-pointer"
                    title="Filter Status Pegawai"
                >
                    <option value="">Semua Status</option>
                    <option value="PNS">PNS</option>
                    <option value="CPNS">CPNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Honorer">Honorer</option>
                </select>
            </div>
        </SearchFilter>
    );
}
