import React, { useRef, useState, useEffect } from 'react';
import { FiCamera, FiImage, FiCheck, FiInfo, FiRefreshCw, FiTrash2, FiAward, FiSlash } from 'react-icons/fi';
import { getImageUrl } from '@/Components/Letter/HeaderKopSurat';
import { generateSchoolStampDataUrl, generateSchoolStampFile } from '@/Utils/stampGenerator';

/**
 * StampSelectorSection.jsx
 * Sub-komponen modular untuk pemilihan Cap / Stempel Sekolah:
 * - Opsi Sample/Default: Stempel dinas bulat resmi otomatis sesuai nama sekolah.
 * - Opsi Custom: Mengunggah/memfoto stempel fisik khusus surat ini.
 * - Opsi None: Tanpa stempel.
 */
export default function StampSelectorSection({
    school,
    stampMode = 'sample', // 'sample' | 'custom' | 'none'
    onModeChange,
    customStampPreview,
    onFileSelected,
    onResetCustom,
    onOpenCamera,
    isExtracting = false,
}) {
    const fileInputRef = useRef(null);

    // Sampel stempel resmi otomatis sesuai nama sekolah
    const sampleStampUrl = school?.stamp_path
        ? getImageUrl(school.stamp_path)
        : generateSchoolStampDataUrl(school?.name || 'SD NEGERI 1 PADALARANG');

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelected(file);
            e.target.value = '';
        }
    };

    return (
        <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/20 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                        Cap / Stempel Sekolah (Ditimpa di Atas Tanda Tangan)
                    </label>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium">
                    {stampMode === 'sample' && 'Sampel Cap Resmi'}
                    {stampMode === 'custom' && 'Cap Khusus Surat'}
                    {stampMode === 'none' && 'Tanpa Cap'}
                </span>
            </div>

            {/* Tab Pilihan 3 Opsi: Tanpa Cap (Default) vs Sampel Resmi vs Unggah Khusus */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container-lowest rounded-lg border border-outline/10 text-xs">
                <button
                    type="button"
                    onClick={() => onModeChange('none')}
                    className={`py-2 px-2 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        stampMode === 'none'
                            ? 'bg-slate-700 text-white shadow-xs'
                            : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                    <FiSlash size={13} className={stampMode === 'none' ? 'opacity-100' : 'opacity-70'} />
                    <span className="truncate">Tanpa Cap (Default)</span>
                </button>

                <button
                    type="button"
                    onClick={() => onModeChange('sample')}
                    className={`py-2 px-2 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        stampMode === 'sample'
                            ? 'bg-purple-700 text-white shadow-xs'
                            : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                    <FiAward size={13} className={stampMode === 'sample' ? 'opacity-100' : 'opacity-70'} />
                    <span className="truncate">Sampel Cap Resmi</span>
                </button>

                <button
                    type="button"
                    onClick={() => onModeChange('custom')}
                    className={`py-2 px-2 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        stampMode === 'custom'
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                    <FiImage size={13} className={stampMode === 'custom' ? 'opacity-100' : 'opacity-70'} />
                    <span className="truncate">Unggah Cap Fisik</span>
                </button>
            </div>

            {/* KONTEN: OPSI 1 - SAMPEL CAP RESMI SEKOLAH */}
            {stampMode === 'sample' && (
                <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-purple-200/50 flex items-center gap-4">
                    <div
                        className="w-20 h-20 rounded-md border border-purple-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                        style={{
                            backgroundImage: `linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)`,
                            backgroundSize: '10px 10px',
                            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                        }}
                    >
                        <img
                            src={sampleStampUrl}
                            alt="Sampel Cap Resmi"
                            className="w-full h-full object-contain -rotate-3"
                        />
                    </div>

                    <div className="flex-1">
                        <p className="text-xs font-bold text-purple-900 flex items-center gap-1">
                            <FiCheck className="text-purple-700" />
                            <span>Stempel Dinas Bulat Resmi Kabupaten Bandung Barat</span>
                        </p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                            Otomatis menyematkan stempel ungu resmi bertuliskan <strong>{school?.name || 'SD NEGERI 1 PADALARANG'}</strong> yang ditimpa di atas tanda tangan Kepala Sekolah.
                        </p>
                    </div>
                </div>
            )}

            {/* KONTEN: OPSI 2 - UNGGAH CAP KHUSUS */}
            {stampMode === 'custom' && (
                <div className="space-y-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                    />

                    {isExtracting ? (
                        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline/20 flex flex-col items-center justify-center gap-2 text-center">
                            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-bold text-primary">Membersihkan Latar Cap Stempel...</p>
                            <p className="text-[11px] text-on-surface-variant">Menghilangkan latar kertas menjadi transparan murni.</p>
                        </div>
                    ) : customStampPreview ? (
                        <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline/20 flex items-center gap-4">
                            <div
                                className="w-20 h-20 rounded-md border border-outline/20 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                                style={{
                                    backgroundImage: `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)`,
                                    backgroundSize: '10px 10px',
                                    backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                                }}
                            >
                                <img
                                    src={customStampPreview}
                                    alt="Cap Khusus Surat"
                                    className="w-full h-full object-contain -rotate-3"
                                />
                            </div>

                            <div className="flex-1">
                                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                    <FiCheck className="text-emerald-600" />
                                    <span>Cap Stempel Bersih & Transparan</span>
                                </p>
                                <p className="text-[11px] text-on-surface-variant mt-0.5">
                                    Siap ditimpa di atas tanda tangan basah Kepala Sekolah.
                                </p>

                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2 py-1 rounded-md transition-colors"
                                    >
                                        <FiRefreshCw size={11} />
                                        <span>Ganti Cap</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onResetCustom}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-md transition-colors"
                                    >
                                        <FiTrash2 size={11} />
                                        <span>Hapus</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={onOpenCamera}
                                className="p-4 rounded-xl border border-dashed border-outline/30 bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary transition-all flex flex-col items-center justify-center gap-2 text-center group"
                            >
                                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FiCamera size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary">Foto Cap dari Kamera</p>
                                    <p className="text-[10px] text-on-surface-variant">Foto langsung cap fisik di kertas</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-4 rounded-xl border border-dashed border-outline/30 bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary transition-all flex flex-col items-center justify-center gap-2 text-center group"
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FiImage size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary">Pilih dari Galeri</p>
                                    <p className="text-[10px] text-on-surface-variant">Upload file foto PNG / JPG cap</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* KONTEN: OPSI 3 - TANPA CAP */}
            {stampMode === 'none' && (
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline/10 flex items-center gap-2 text-xs text-on-surface-variant">
                    <FiInfo className="text-slate-400 shrink-0" size={14} />
                    <span>Surat ini akan dikirim hanya dengan tanda tangan tanpa cap stempel sekolah.</span>
                </div>
            )}
        </div>
    );
}
