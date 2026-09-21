import React from 'react';

/**
 * EmployeePersonalFields renders personal identity form fields:
 * NIP (with 18-digit constraint & lookup), Name, Place/Date of Birth, Address, Contact.
 * Single Responsibility: Presenting and capturing employee personal identity attributes.
 */
export default function EmployeePersonalFields({
    data,
    setData,
    errors = {},
    onNipChange,
}) {
    return (
        <div className="space-y-4">
            {/* NIP Field */}
            <div className="space-y-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-blue-950">
                        NIP (Maks 18 Digit)
                    </label>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                        {(data.nip || '').length}/18 Digit
                    </span>
                </div>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={18}
                    className={`w-full rounded-xl border-blue-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm font-mono font-bold bg-white ${
                        errors.nip ? 'border-red-500' : ''
                    }`}
                    value={data.nip || ''}
                    onChange={(e) => onNipChange(e.target.value)}
                    placeholder="Masukkan 18 digit angka NIP..."
                />
                {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
                <p className="text-[11px] text-slate-500">
                    Dibatasi maksimal 18 digit angka. Ketik NIP untuk auto-lookup identitas pegawai.
                </p>
            </div>

            {/* Nama Lengkap */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">
                    Nama Lengkap & Gelar <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    className={`w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm ${
                        errors.name ? 'border-red-500' : ''
                    }`}
                    value={data.name || ''}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Contoh: Dra. Hj. Siti Nurjanah, M.Pd"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">Tempat Lahir</label>
                    <input
                        type="text"
                        className="w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm"
                        value={data.place_of_birth || ''}
                        onChange={(e) => setData('place_of_birth', e.target.value)}
                        placeholder="Contoh: Bandung"
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">Tanggal Lahir</label>
                    <input
                        type="date"
                        className="w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm"
                        value={data.date_of_birth || ''}
                        onChange={(e) => setData('date_of_birth', e.target.value)}
                    />
                </div>
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Alamat Tempat Tinggal</label>
                <textarea
                    rows="2"
                    className="w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm"
                    value={data.address || ''}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Jl. Raya Barat No. 123..."
                />
            </div>

            {/* Kontak / Telepon */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Nomor Kontak / WhatsApp</label>
                <input
                    type="text"
                    className="w-full rounded-xl border-slate-200 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-sm"
                    value={data.contact || ''}
                    onChange={(e) => setData('contact', e.target.value)}
                    placeholder="Contoh: 081234567890"
                />
            </div>
        </div>
    );
}
