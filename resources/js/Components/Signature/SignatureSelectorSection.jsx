import React, { useRef } from 'react';
import { FiCamera, FiImage, FiSliders, FiTrash2, FiCheck, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { getImageUrl } from '@/Components/Letter/HeaderKopSurat';

/**
 * SignatureSelectorSection.jsx
 * Sub-komponen modular untuk pemilihan tanda tangan surat:
 * - Opsi Default: Menggunakan TTD tetap dari profil sekolah.
 * - Opsi Khusus: Mengunggah TTD basah khusus untuk pengajuan surat ini (dari Kamera / Galeri).
 */
export default function SignatureSelectorSection({
    school,
    signatureMode = 'default', // 'default' | 'custom'
    onModeChange,
    customPreview,
    onFileSelected,
    onOpenStudio,
    onResetCustom,
    onOpenCamera,
    isExtracting = false,
}) {
    const fileInputRef = useRef(null);

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelected(file);
            e.target.value = ''; // Reset agar bisa pilih file yang sama jika perlu
        }
    };

    return (
        <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/20 space-y-4">
            <div className="flex items-center justify-between">
                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                    Tanda Tangan Pengajuan Surat (TTD Basah)
                </label>
                <span className="text-[10px] text-on-surface-variant font-medium">
                    {signatureMode === 'default' ? 'Opsi Default Profil' : 'TTD Khusus Surat Ini'}
                </span>
            </div>

            {/* Tab Pilihan: Default vs Khusus Surat Ini */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-lowest rounded-lg border border-outline/10 text-xs">
                <button
                    type="button"
                    onClick={() => onModeChange('default')}
                    className={`py-2 px-3 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        signatureMode === 'default'
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                    <FiCheck className={signatureMode === 'default' ? 'opacity-100' : 'opacity-0'} size={14} />
                    <span>TTD Profil Sekolah (Default)</span>
                </button>

                <button
                    type="button"
                    onClick={() => onModeChange('custom')}
                    className={`py-2 px-3 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        signatureMode === 'custom'
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                    <FiSliders className={signatureMode === 'custom' ? 'opacity-100' : 'opacity-0'} size={14} />
                    <span>TTD Khusus Surat Ini</span>
                </button>
            </div>

            {/* KONTEN: OPSI DEFAULT */}
            {signatureMode === 'default' && (
                <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline/10 flex items-center gap-4">
                    <div
                        className="w-24 h-14 rounded-md border border-outline/20 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                        style={{
                            backgroundImage: school?.signature_path
                                ? `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)`
                                : 'none',
                            backgroundSize: '10px 10px',
                            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                        }}
                    >
                        {school?.signature_path ? (
                            <img
                                src={getImageUrl(school.signature_path)}
                                alt="TTD Profil Sekolah"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-[10px] text-slate-400 text-center font-medium">Belum Ada TTD</span>
                        )}
                    </div>

                    <div className="flex-1">
                        {school?.signature_path ? (
                            <>
                                <p className="text-xs font-semibold text-primary flex items-center gap-1">
                                    <FiCheck className="text-emerald-600" />
                                    <span>Menggunakan TTD Tetap Kepala Sekolah</span>
                                </p>
                                <p className="text-[11px] text-on-surface-variant mt-0.5">
                                    Tanda tangan resmi dari profil sekolah otomatis terpasang pada surat ini.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                                    <FiInfo />
                                    <span>Profil sekolah belum memiliki TTD basah</span>
                                </p>
                                <p className="text-[11px] text-on-surface-variant mt-0.5">
                                    Pilih tab <strong>"TTD Khusus Surat Ini"</strong> di atas untuk mengambil foto atau upload langsung.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* KONTEN: OPSI KHUSUS SURAT INI */}
            {signatureMode === 'custom' && (
                <div className="space-y-3">
                    {/* Hidden input file untuk galeri */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                    />

                    {isExtracting ? (
                        // Loading state saat pembersihan otomatis berlangsung
                        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline/20 flex flex-col items-center justify-center gap-2 text-center">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-bold text-primary">Membersihkan Latar Kertas Otomatis...</p>
                            <p className="text-[11px] text-on-surface-variant">Menghilangkan bayangan dan memotong area tanda tangan.</p>
                        </div>
                    ) : customPreview ? (
                        // Jika sudah ada TTD khusus yang diproses secara otomatis
                        <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline/20 flex items-center gap-4">
                            <div
                                className="w-28 h-16 rounded-md border border-outline/20 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                                style={{
                                    backgroundImage: `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)`,
                                    backgroundSize: '10px 10px',
                                    backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                                }}
                            >
                                <img
                                    src={customPreview}
                                    alt="TTD Khusus Surat"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="flex-1">
                                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                    <FiCheck className="text-emerald-600" />
                                    <span>Tanda Tangan Otomatis Bersih & Transparan</span>
                                </p>
                                <p className="text-[11px] text-on-surface-variant mt-0.5">
                                    Latar belakang telah dinetralkan dan siap dicetak ke dokumen.
                                </p>

                                <div className="flex items-center gap-2 mt-2">
                                    {onOpenStudio && (
                                        <button
                                            type="button"
                                            onClick={onOpenStudio}
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                                            title="Koreksi Manual (Jika Ingin Mengatur Kontras Sendiri)"
                                        >
                                            <FiSliders size={11} />
                                            <span>Sesuaikan Manual</span>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2 py-1 rounded-md transition-colors"
                                    >
                                        <FiRefreshCw size={11} />
                                        <span>Ganti Foto</span>
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
                        // Jika belum ada TTD khusus: Tampilkan tombol Kamera dan Galeri
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={onOpenCamera}
                                className="p-4 rounded-xl border border-dashed border-outline/30 bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary transition-all flex flex-col items-center justify-center gap-2 text-center group"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FiCamera size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary">Ambil dari Kamera</p>
                                    <p className="text-[10px] text-on-surface-variant">Foto langsung via webcam / HP</p>
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
                                    <p className="text-[10px] text-on-surface-variant">Upload file foto PNG / JPG</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
