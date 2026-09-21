import React from 'react';
import SearchFilter from '@/Components/UI/SearchFilter';

/**
 * AdminEmployeeFilterBar handles search input and multi-level filtering
 * by school and employee employment status (PNS/CPNS/PPPK/Honorer).
 * Single Responsibility: Filter and search input presentation.
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
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1 w-full">
                <SearchFilter
                    search={search}
                    onSearchChange={onSearchChange}
                    filter={schoolId}
                    onFilterChange={onSchoolChange}
                    filterOptions={schoolOptions}
                    filterLabel="Semua Sekolah"
                    placeholder="Cari nama pegawai, NIP, atau nama sekolah..."
                    isLoading={isLoading}
                />
            </div>
            <div className="w-full sm:w-48 shrink-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Status Pegawai
                </label>
                <select
                    value={statusPegawai}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                >
                    <option value="">Semua Status</option>
                    <option value="PNS">PNS</option>
                    <option value="CPNS">CPNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Honorer">Honorer</option>
                </select>
            </div>
        </div>
    );
}
