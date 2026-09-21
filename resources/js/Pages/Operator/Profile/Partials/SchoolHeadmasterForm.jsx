import React from 'react';

/**
 * SchoolHeadmasterForm renders inputs for official signatory details:
 * Headmaster NIP (with 18-digit constraint & lookup) and Headmaster Full Name.
 * Single Responsibility: Presenting and capturing school headmaster signatory identity.
 */
export default function SchoolHeadmasterForm({
    data,
    setData,
    onNipChange,
}) {
    return (
        <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3">
                Data Penandatangan (Kepala Sekolah)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-700">
                            1. NIP Kepala Sekolah (Maks. 18 Integer)
                        </label>
                        <span className="text-[10px] text-slate-500 font-mono">
                            {(data.headmaster_nip || '').length}/18 Digit
                        </span>
                    </div>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={18}
                        value={data.headmaster_nip || ''}
                        onChange={(e) => onNipChange(e.target.value)}
                        placeholder="Masukkan 18 digit NIP Kepsek..."
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        2. Nama Lengkap Kepala Sekolah
                    </label>
                    <input
                        type="text"
                        value={data.headmaster_name || ''}
                        onChange={(e) => setData('headmaster_name', e.target.value)}
                        placeholder="Nama & Gelar Kepsek"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}
