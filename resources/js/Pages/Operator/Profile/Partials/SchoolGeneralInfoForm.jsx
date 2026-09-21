import React from 'react';

/**
 * SchoolGeneralInfoForm renders inputs for official school identity:
 * Name, NPSN, Educational Tier (Jenjang), Accreditation, Address, Phone, and Email.
 * Single Responsibility: Presenting and capturing school institutional details.
 */
export default function SchoolGeneralInfoForm({ data, setData, errors = {} }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Nama Resmi Sekolah <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        NPSN <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={data.npsn}
                        onChange={(e) => setData('npsn', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    {errors.npsn && <p className="text-[11px] text-rose-500 mt-1">{errors.npsn}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Jenjang Pendidikan
                    </label>
                    <select
                        value={data.jenjang}
                        onChange={(e) => setData('jenjang', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                        <option value="SD">SD (Sekolah Dasar)</option>
                        <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                        <option value="SMA">SMA</option>
                        <option value="SMK">SMK</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Status Akreditasi
                    </label>
                    <select
                        value={data.status_akreditasi}
                        onChange={(e) => setData('status_akreditasi', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                        <option value="A">Akreditasi A</option>
                        <option value="B">Akreditasi B</option>
                        <option value="C">Akreditasi C</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Alamat Lengkap Sekolah
                </label>
                <textarea
                    rows={3}
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Jalan, RT/RW, Desa/Kelurahan, Kecamatan, Kab. Bandung Barat..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Telepon Sekolah
                    </label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Resmi Sekolah
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}
