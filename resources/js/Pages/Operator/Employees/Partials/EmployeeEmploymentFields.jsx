import React from 'react';

/**
 * EmployeeEmploymentFields renders employment and civil service status fields:
 * School assignment (optional for Admin), Status Pegawai (PNS/CPNS/PPPK/Honorer),
 * TMT CPNS, and TMT PNS.
 * Single Responsibility: Presenting and capturing official employment appointment attributes.
 */
export default function EmployeeEmploymentFields({
    data,
    setData,
    errors = {},
    schools = null,
}) {
    return (
        <div className="space-y-4">
            {/* School Selector (for Admin) */}
            {schools && (
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">
                        Unit Kerja / Sekolah <span className="text-red-500">*</span>
                    </label>
                    <select
                        required
                        className={`w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm ${
                            errors.school_id ? 'border-red-500' : ''
                        }`}
                        value={data.school_id || ''}
                        onChange={(e) => setData('school_id', e.target.value)}
                    >
                        <option value="">Pilih Sekolah...</option>
                        {schools.map((school) => (
                            <option key={school.id} value={school.id}>
                                {school.name} (NPSN: {school.npsn})
                            </option>
                        ))}
                    </select>
                    {errors.school_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.school_id}</p>
                    )}
                </div>
            )}

            {/* Status Kepegawaian */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">
                    Status Kepegawaian <span className="text-red-500">*</span>
                </label>
                <select
                    className="w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm"
                    value={data.status_pegawai || 'PNS'}
                    onChange={(e) => setData('status_pegawai', e.target.value)}
                >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="CPNS">CPNS (Calon Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK (P3K)</option>
                    <option value="Honorer">Honorer / Non-ASN</option>
                </select>
            </div>

            {/* Tanggal TMT CPNS & PNS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">TMT CPNS</label>
                    <input
                        type="date"
                        className="w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm"
                        value={data.cpns_date || ''}
                        onChange={(e) => setData('cpns_date', e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">TMT PNS</label>
                    <input
                        type="date"
                        className="w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm"
                        value={data.pns_date || ''}
                        onChange={(e) => setData('pns_date', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
