import React from 'react';

/**
 * EmployeeEmploymentFields renders employment and civil service status fields:
 * School assignment (optional for Admin), Status Pegawai (PNS/CPNS/PPPK/Honorer),
 * TMT CPNS, and TMT PNS.
 * Dynamically adjusts fields based on selected status (Honorer & PPPK don't have CPNS/PNS dates).
 */
export default function EmployeeEmploymentFields({
    data,
    setData,
    errors = {},
    schools = null,
}) {
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        if (newStatus === 'Honorer') {
            setData((prev) => ({
                ...prev,
                status_pegawai: newStatus,
                nip: '',
                cpns_date: '',
                pns_date: '',
            }));
        } else if (newStatus === 'PPPK') {
            setData((prev) => ({
                ...prev,
                status_pegawai: newStatus,
                cpns_date: '',
                pns_date: '',
            }));
        } else if (newStatus === 'CPNS') {
            setData((prev) => ({
                ...prev,
                status_pegawai: newStatus,
                pns_date: '',
            }));
        } else {
            setData('status_pegawai', newStatus);
        }
    };

    return (
        <div className="space-y-4">
            {/* School Selector (for Admin) */}
            {schools && (
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-zinc-700">
                        Unit Kerja / Sekolah <span className="text-red-500">*</span>
                    </label>
                    <select
                        required
                        className={`w-full rounded-xl border-zinc-200 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80 ${
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
                <label className="block text-sm font-semibold text-zinc-700">
                    Status Kepegawaian <span className="text-red-500">*</span>
                </label>
                <select
                    className="w-full rounded-xl border-zinc-200 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80"
                    value={data.status_pegawai || 'PNS'}
                    onChange={handleStatusChange}
                >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="CPNS">CPNS (Calon Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK (P3K)</option>
                    <option value="Honorer">Honorer / Non-ASN</option>
                </select>
            </div>

            {/* Tanggal TMT CPNS & PNS conditional rendering */}
            {data.status_pegawai === 'Honorer' ? (
                <div className="p-3.5 rounded-xl bg-zinc-100/70 border border-zinc-200/60 backdrop-blur-md">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Pegawai berstatus <strong className="text-zinc-700 font-medium">Honorer / Non-ASN</strong> tidak memiliki TMT CPNS maupun TMT PNS.
                    </p>
                </div>
            ) : data.status_pegawai === 'PPPK' ? (
                <div className="p-3.5 rounded-xl bg-zinc-100/70 border border-zinc-200/60 backdrop-blur-md">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Pegawai berstatus <strong className="text-zinc-700 font-medium">PPPK</strong> tidak melalui jalur TMT CPNS/PNS.
                    </p>
                </div>
            ) : data.status_pegawai === 'CPNS' ? (
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-zinc-700">TMT CPNS</label>
                    <input
                        type="date"
                        className="w-full rounded-xl border-zinc-200 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80"
                        value={data.cpns_date || ''}
                        onChange={(e) => setData('cpns_date', e.target.value)}
                    />
                    <p className="text-[11px] text-zinc-400">Pegawai masih berstatus Calon PNS (belum memiliki TMT PNS).</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-semibold text-zinc-700">TMT CPNS</label>
                        <input
                            type="date"
                            className="w-full rounded-xl border-zinc-200 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80"
                            value={data.cpns_date || ''}
                            onChange={(e) => setData('cpns_date', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-semibold text-zinc-700">TMT PNS</label>
                        <input
                            type="date"
                            className="w-full rounded-xl border-zinc-200 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80"
                            value={data.pns_date || ''}
                            onChange={(e) => setData('pns_date', e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
