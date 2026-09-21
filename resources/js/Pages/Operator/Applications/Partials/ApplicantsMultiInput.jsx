import React from 'react';
import { SCHOOL_JABATAN_OPTIONS } from '@/Utils/schoolPositions';

/**
 * ApplicantsMultiInput handles dynamic multi-person applicant entries:
 * NIP (with 18-digit constraint & lookup), Full Name, Rank/Class, Position, Unit Kerja, Kecamatan.
 * Single Responsibility: Presenting and capturing the list of employee applicants for a letter.
 */
export default function ApplicantsMultiInput({
    applicantsList = [],
    onAddApplicant,
    onRemoveApplicant,
    onUpdateApplicant,
}) {
    return (
        <div className="p-4 bg-primary-container/20 rounded-DEFAULT border border-primary/20 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-bold">
                    Data Pemohon ({applicantsList.length} Orang)
                </h3>
                <button
                    type="button"
                    onClick={onAddApplicant}
                    className="px-2.5 py-1 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-on-surface transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                    <span>+ Tambah Pemohon</span>
                </button>
            </div>

            <div className="space-y-4">
                {applicantsList.map((appItem, aIdx) => (
                    <div
                        key={aIdx}
                        className="p-3.5 bg-surface-bright rounded-md border border-outline/20 space-y-3 relative shadow-xs"
                    >
                        <div className="flex items-center justify-between text-xs font-bold text-primary border-b border-outline/10 pb-1.5">
                            <span>
                                Pemohon #{aIdx + 1} {aIdx === 0 ? '(Pemohon Utama)' : ''}
                            </span>
                            {applicantsList.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveApplicant(aIdx)}
                                    className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold cursor-pointer"
                                >
                                    Hapus
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            {/* NIP */}
                            <div className="sm:col-span-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                                        1. NIP Pegawai <span className="text-rose-500">* (Maks 18 Digit)</span>
                                    </label>
                                    <span className="text-[10px] font-semibold font-mono text-slate-500">
                                        {(appItem.nip || '').length}/18 Digit
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={18}
                                    value={appItem.nip || ''}
                                    onChange={(e) => onUpdateApplicant(aIdx, 'nip', e.target.value)}
                                    placeholder="Masukkan 18 digit NIP..."
                                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-xs font-mono font-bold text-blue-900 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                                />
                            </div>

                            {/* Nama Lengkap */}
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">
                                    2. Nama Lengkap & Gelar
                                </label>
                                <input
                                    type="text"
                                    value={appItem.nama || ''}
                                    onChange={(e) => onUpdateApplicant(aIdx, 'nama', e.target.value)}
                                    placeholder="Nama & Gelar Pegawai"
                                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs text-primary"
                                />
                            </div>

                            {/* Pangkat / Golongan */}
                            <div>
                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">
                                    3. Pangkat / Golongan Ruang
                                </label>
                                <input
                                    type="text"
                                    value={appItem.gol_asal || ''}
                                    onChange={(e) => onUpdateApplicant(aIdx, 'gol_asal', e.target.value)}
                                    placeholder="Contoh: Penata Muda, III/a"
                                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs text-primary"
                                />
                            </div>

                            {/* Jabatan */}
                            <div>
                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">
                                    4. Jabatan Sekolah
                                </label>
                                <select
                                    value={appItem.jabatan || ''}
                                    onChange={(e) => onUpdateApplicant(aIdx, 'jabatan', e.target.value)}
                                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs text-primary font-medium"
                                >
                                    <option value="">Pilih Jabatan...</option>
                                    {SCHOOL_JABATAN_OPTIONS.map((jab) => (
                                        <option key={jab} value={jab}>
                                            {jab}
                                        </option>
                                    ))}
                                    {appItem.jabatan && !SCHOOL_JABATAN_OPTIONS.includes(appItem.jabatan) && (
                                        <option value={appItem.jabatan}>{appItem.jabatan}</option>
                                    )}
                                </select>
                            </div>

                            {/* Unit Kerja */}
                            <div>
                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">
                                    5. Unit Kerja
                                </label>
                                <input
                                    type="text"
                                    value={appItem.unit_kerja || ''}
                                    onChange={(e) => onUpdateApplicant(aIdx, 'unit_kerja', e.target.value)}
                                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs text-primary"
                                />
                            </div>

                            {/* Kecamatan */}
                            <div>
                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">
                                    6. Kecamatan
                                </label>
                                <input
                                    type="text"
                                    value={appItem.kecamatan || ''}
                                    onChange={(e) => onUpdateApplicant(aIdx, 'kecamatan', e.target.value)}
                                    placeholder="Contoh: Padalarang"
                                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs text-primary"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
