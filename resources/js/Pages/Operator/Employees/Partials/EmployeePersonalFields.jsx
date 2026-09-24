import React from 'react';

/**
 * EmployeePersonalFields renders personal identity form fields:
 * NIP / NI PPPK (with 18-digit constraint & lookup, hidden for Honorer),
 * Name, Place/Date of Birth, Address, Contact.
 * Styled in monochrome iOS liquid glass aesthetic.
 */
export default function EmployeePersonalFields({
    data,
    setData,
    errors = {},
    onNipChange,
}) {
    const isHonorer = data.status_pegawai === 'Honorer';
    const isPppk = data.status_pegawai === 'PPPK';

    return (
        <div className="space-y-4">
            {/* NIP Field or Honorer Notice */}
            {isHonorer ? (
                <div className="p-3.5 rounded-xl bg-zinc-100/70 border border-zinc-200/60 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-700">NIP (Tidak Diperlukan)</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Tenaga <strong className="text-zinc-700 font-medium">Honorer / Non-ASN</strong> tidak memiliki NIP. Anda dapat langsung melengkapi data identitas di bawah ini.
                    </p>
                </div>
            ) : (
                <div className="space-y-2 bg-white/60 backdrop-blur-xl p-3.5 rounded-2xl border border-zinc-200/60 shadow-xs">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-zinc-900">
                            {isPppk ? 'NI PPPK (Maks 18 Digit)' : 'NIP (Maks 18 Digit)'}
                        </label>
                        <span className="text-xs font-mono font-semibold text-zinc-400">
                            {(data.nip || '').length}/18 Digit
                        </span>
                    </div>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={18}
                        className={`w-full rounded-xl border-zinc-200/80 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm font-mono font-bold bg-white/90 ${
                            errors.nip ? 'border-red-500' : ''
                        }`}
                        value={data.nip || ''}
                        onChange={(e) => onNipChange(e.target.value)}
                        placeholder={isPppk ? 'Masukkan 18 digit NI PPPK...' : 'Masukkan 18 digit angka NIP...'}
                    />
                    {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
                    <p className="text-[11px] text-zinc-400">
                        {isPppk
                            ? 'Dibatasi maksimal 18 digit angka NI PPPK.'
                            : 'Dibatasi maksimal 18 digit angka. Ketik NIP untuk auto-lookup identitas pegawai.'}
                    </p>
                </div>
            )}

            {/* Nama Lengkap */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-zinc-700">
                    Nama Lengkap & Gelar <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    className={`w-full rounded-xl border-zinc-200/80 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80 ${
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
                    <label className="block text-sm font-semibold text-zinc-700">Tempat Lahir</label>
                    <input
                        type="text"
                        className="w-full rounded-xl border-zinc-200/80 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80"
                        value={data.place_of_birth || ''}
                        onChange={(e) => setData('place_of_birth', e.target.value)}
                        placeholder="Contoh: Bandung"
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-zinc-700">Tanggal Lahir</label>
                    <input
                        type="date"
                        className="w-full rounded-xl border-zinc-200/80 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80"
                        value={data.date_of_birth || ''}
                        onChange={(e) => setData('date_of_birth', e.target.value)}
                    />
                </div>
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-zinc-700">Alamat Tempat Tinggal</label>
                <textarea
                    rows="2"
                    className="w-full rounded-xl border-zinc-200/80 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80"
                    value={data.address || ''}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Jl. Raya Barat No. 123..."
                />
            </div>

            {/* Kontak / Telepon */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-zinc-700">Nomor Kontak / WhatsApp</label>
                <input
                    type="text"
                    className="w-full rounded-xl border-zinc-200/80 shadow-xs focus:border-zinc-900 focus:ring-zinc-900/10 text-sm bg-white/80"
                    value={data.contact || ''}
                    onChange={(e) => setData('contact', e.target.value)}
                    placeholder="Contoh: 081234567890"
                />
            </div>
        </div>
    );
}
