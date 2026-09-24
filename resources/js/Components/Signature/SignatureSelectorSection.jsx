import React, { useRef } from 'react';
import { FiCamera, FiImage, FiSliders, FiTrash2, FiCheck, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { getImageUrl } from '@/Components/Letter/HeaderKopSurat';

/**
 * SignatureSelectorSection.jsx
 * Sub-komponen modular untuk pemilihan tanda tangan surat:
 * - Opsi Default: Menggunakan TTD tetap dari profil sekolah.
 * - Opsi Khusus: Mengunggah TTD basah khusus untuk pengajuan surat ini (dari Kamera / Galeri).
 * Styled in monochrome iOS liquid glass.
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
            e.target.value = '';
        }
    };

    return (
        <div className="p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-zinc-200/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-xs uppercase tracking-wider text-zinc-900 font-bold">
                    Tanda Tangan Pengajuan Surat (TTD Basah)
                </label>
                <span className="text-[11px] text-zinc-500 font-medium">
                    {signatureMode === 'default' ? 'Opsi Default Profil' : 'TTD Khusus Surat Ini'}
                </span>
            </div>

            {/* Tab Pilihan: Default vs Khusus Surat Ini */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-100/70 rounded-2xl border border-zinc-200/60 backdrop-blur-md text-xs">
                <button
                    type="button"
                    onClick={() => onModeChange('default')}
                    className={`py-2.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center cursor-pointer ${
                        signatureMode === 'default'
                            ? 'bg-white/80 backdrop-blur-xl text-zinc-900 border border-zinc-200/90 shadow-xs'
                            : 'bg-white/30 hover:bg-white/60 text-zinc-600 hover:text-zinc-900 border border-zinc-200/40 font-medium'
                    }`}
                >
                    <span>TTD Profil Sekolah (Default)</span>
                </button>

                <button
                    type="button"
                    onClick={() => onModeChange('custom')}
                    className={`py-2.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center cursor-pointer ${
                        signatureMode === 'custom'
                            ? 'bg-white/80 backdrop-blur-xl text-zinc-900 border border-zinc-200/90 shadow-xs'
                            : 'bg-white/30 hover:bg-white/60 text-zinc-600 hover:text-zinc-900 border border-zinc-200/40 font-medium'
                    }`}
                >
                    <span>TTD Khusus Surat Ini</span>
                </button>
            </div>

            {/* KONTEN: OPSI DEFAULT */}
            {signatureMode === 'default' && (
                <div className="bg-white/80 backdrop-blur-xl p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-4">
                    <div
                        className="w-24 h-14 rounded-xl border border-zinc-200 bg-white/90 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                        style={{
                            backgroundImage: school?.signature_path
                                ? `linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)`
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
                            <span className="text-[10px] text-zinc-400 text-center font-medium">Belum Ada TTD</span>
                        )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        {school?.signature_path ? (
                            <>
                                <p className="text-xs font-semibold text-zinc-900 flex items-center justify-center sm:justify-start gap-1">
                                    <FiCheck className="text-emerald-600" />
                                    <span>Menggunakan TTD Tetap Kepala Sekolah</span>
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                    Tanda tangan resmi dari profil sekolah otomatis terpasang pada surat ini.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs font-semibold text-amber-700 flex items-center justify-center sm:justify-start gap-1">
                                    <FiInfo />
                                    <span>Profil sekolah belum memiliki TTD basah</span>
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-0.5">
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
                        <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col items-center justify-center gap-2 text-center">
                            <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-bold text-zinc-900">Membersihkan Latar Kertas Otomatis...</p>
                            <p className="text-[11px] text-zinc-500">Menghilangkan bayangan dan memotong area tanda tangan.</p>
                        </div>
                    ) : customPreview ? (
                        <div className="bg-white/80 backdrop-blur-xl p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-4">
                            <div
                                className="w-28 h-16 rounded-xl border border-zinc-200 bg-white/90 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                                style={{
                                    backgroundImage: `linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)`,
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

                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1">
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700">
                                        <FiCheck size={11} />
                                    </span>
                                    <span>Tanda Tangan Otomatis Bersih & Transparan</span>
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                    Latar belakang telah dinetralkan dan siap dicetak ke dokumen.
                                </p>

                                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
                                    {onOpenStudio && (
                                        <button
                                            type="button"
                                            onClick={onOpenStudio}
                                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                            title="Koreksi Manual"
                                        >
                                            <FiSliders size={11} />
                                            <span>Sesuaikan Manual</span>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={onOpenCamera}
                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                    >
                                        <FiCamera size={11} />
                                        <span>Foto Ulang Kamera</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                    >
                                        <FiRefreshCw size={11} />
                                        <span>Ganti Foto</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onResetCustom}
                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/60 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                                    >
                                        <FiTrash2 size={11} />
                                        <span>Hapus</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={onOpenCamera}
                                className="p-4 rounded-2xl border border-dashed border-zinc-300 bg-white/60 hover:bg-white/90 hover:border-zinc-900 transition-all flex flex-col items-center justify-center gap-2 text-center group shadow-xs cursor-pointer"
                            >
                                <div className="w-11 h-11 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                                    <FiCamera size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-900">Ambil dari Kamera</p>
                                    <p className="text-[10px] text-zinc-500">Foto langsung via webcam / HP</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-4 rounded-2xl border border-dashed border-zinc-300 bg-white/60 hover:bg-white/90 hover:border-zinc-900 transition-all flex flex-col items-center justify-center gap-2 text-center group shadow-xs cursor-pointer"
                            >
                                <div className="w-11 h-11 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                                    <FiImage size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-900">Pilih dari Galeri</p>
                                    <p className="text-[10px] text-zinc-500">Upload file foto PNG / JPG</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
