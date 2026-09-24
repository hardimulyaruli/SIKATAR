import React, { useRef } from 'react';
import {
    FiHome,
    FiSliders,
    FiCamera,
    FiImage,
    FiCheck,
    FiTrash2,
    FiRefreshCw,
    FiInfo,
} from 'react-icons/fi';

/**
 * SchoolOfficialAssetsForm handles official institutional graphic assets:
 * - School KOP Logo
 * - Headmaster Clean Wet Signature (Camera Capture + Gallery Upload + Studio)
 * - Official School Stamp (Sample Mode vs Custom Physical Stamp with Camera + Gallery)
 */
export default function SchoolOfficialAssetsForm({
    previewLogo,
    onLogoChange,
    previewSignature,
    rawSigFile,
    onOpenSigModal,
    isExtractingSig = false,
    onProcessSignature,
    onResetSignature,
    previewStamp,
    isExtractingStamp = false,
    stampMode = 'sample', // 'sample' | 'custom'
    onStampModeChange,
    onProcessStamp,
    onResetStamp,
    onOpenCamera,
    school,
    hasCustomStamp = false,
    errors = {},
}) {
    const sigFileInputRef = useRef(null);
    const stampFileInputRef = useRef(null);

    const handleSigFileInput = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onProcessSignature(file);
            e.target.value = '';
        }
    };

    const handleStampFileInput = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onProcessStamp(file);
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Upload Logo Sekolah */}
            <div className="pt-3 border-t border-zinc-200/60">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                    Upload Logo Sekolah (Kop Surat):
                </label>
                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-xl p-3.5 rounded-2xl border border-zinc-200/60 shadow-xs">
                    <div className="w-16 h-16 rounded-xl border border-zinc-200 bg-white/80 flex items-center justify-center overflow-hidden shrink-0">
                        {previewLogo ? (
                            <img
                                src={previewLogo}
                                alt="Logo Sekolah Preview"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <FiHome className="w-6 h-6 text-zinc-400" />
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onLogoChange}
                            className="text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-zinc-200/80 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-800 hover:file:bg-zinc-200 transition-colors cursor-pointer"
                        />
                        <p className="text-[11px] text-zinc-400 mt-1">
                            Format PNG / JPG (Maks. 2MB). Disarankan berlatar belakang transparan.
                        </p>
                        {errors.logo && (
                            <p className="text-[11px] text-rose-500 mt-1">{errors.logo}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Tanda Tangan Pengajuan Surat (TTD Basah) */}
            <div className="pt-3 border-t border-zinc-200/60 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800">
                        Tanda Tangan Pengajuan Surat (TTD Basah)
                    </label>
                    <span className="text-[11px] font-medium text-zinc-500">
                        {previewSignature ? 'TTD Kepala Sekolah Tersedia' : 'Belum Ada TTD'}
                    </span>
                </div>

                {/* Hidden input file untuk TTD galeri */}
                <input
                    ref={sigFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSigFileInput}
                    className="hidden"
                />

                {isExtractingSig ? (
                    <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 shadow-xs flex flex-col items-center justify-center gap-2 text-center">
                        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-bold text-zinc-900">Membersihkan Latar Kertas Otomatis...</p>
                        <p className="text-[11px] text-zinc-500">Menghilangkan bayangan dan membuat latar belakang transparan.</p>
                    </div>
                ) : previewSignature ? (
                    <div className="bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/60 shadow-xs flex flex-col sm:flex-row items-center gap-4">
                        <div
                            className="w-32 h-18 rounded-xl border border-zinc-200 bg-white/90 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                            style={{
                                backgroundImage: `linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)`,
                                backgroundSize: '10px 10px',
                                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                            }}
                        >
                            <img
                                src={previewSignature}
                                alt="TTD Basah Kepala Sekolah"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1.5">
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700">
                                    <FiCheck size={11} />
                                </span>
                                <span>Tanda Tangan Otomatis Bersih & Transparan</span>
                            </p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">
                                Latar belakang kertas telah dinetralkan dan transparan, siap terpasang pada surat resmi.
                            </p>

                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5 flex-wrap">
                                {rawSigFile && onOpenSigModal && (
                                    <button
                                        type="button"
                                        onClick={onOpenSigModal}
                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                    >
                                        <FiSliders size={12} />
                                        <span>Sesuaikan Manual</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onOpenCamera('signature')}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                >
                                    <FiCamera size={12} />
                                    <span>Foto Ulang Kamera</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => sigFileInputRef.current?.click()}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                >
                                    <FiRefreshCw size={12} />
                                    <span>Ganti dari Galeri</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={onResetSignature}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/60 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                                >
                                    <FiTrash2 size={12} />
                                    <span>Hapus TTD</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => onOpenCamera('signature')}
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
                            onClick={() => sigFileInputRef.current?.click()}
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
                {errors.signature && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.signature}</p>
                )}
            </div>

            {/* 3. Cap / Stempel Sekolah (Ditimpa di Atas Tanda Tangan) */}
            <div className="pt-3 border-t border-zinc-200/60 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800">
                        Cap / Stempel Sekolah (Ditimpa di Atas Tanda Tangan)
                    </label>
                    <span className="text-[11px] font-medium text-zinc-500">
                        {stampMode === 'custom' ? 'Cap Fisik Kustom' : 'Sampel Cap Resmi'}
                    </span>
                </div>

                {/* Tab switcher: Sampel Cap Resmi vs Unggah Cap Fisik */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-100/70 rounded-2xl border border-zinc-200/60 text-xs">
                    <button
                        type="button"
                        onClick={() => onStampModeChange('sample')}
                        className={`py-2.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center cursor-pointer ${
                            stampMode === 'sample'
                                ? 'bg-white/80 backdrop-blur-xl text-zinc-900 shadow-xs border border-zinc-200/90'
                                : 'bg-white/30 hover:bg-white/60 text-zinc-600 hover:text-zinc-900 border border-zinc-200/40 font-medium'
                        }`}
                    >
                        <span>Sampel Cap Resmi (Default)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onStampModeChange('custom')}
                        className={`py-2.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center cursor-pointer ${
                            stampMode === 'custom'
                                ? 'bg-white/80 backdrop-blur-xl text-zinc-900 shadow-xs border border-zinc-200/90'
                                : 'bg-white/30 hover:bg-white/60 text-zinc-600 hover:text-zinc-900 border border-zinc-200/40 font-medium'
                        }`}
                    >
                        <span>Unggah Cap Fisik</span>
                    </button>
                </div>

                {/* Hidden input file untuk Cap galeri */}
                <input
                    ref={stampFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleStampFileInput}
                    className="hidden"
                />

                {stampMode === 'sample' ? (
                    /* Opsi: Sampel Cap Resmi Otomatis */
                    <div className="bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/60 shadow-xs flex flex-col sm:flex-row items-center gap-4">
                        <div
                            className="w-20 h-20 rounded-xl border border-zinc-200 bg-white/90 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                            style={{
                                backgroundImage: `linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)`,
                                backgroundSize: '10px 10px',
                                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                            }}
                        >
                            <img
                                src={previewStamp}
                                alt="Sampel Cap Resmi"
                                className="w-full h-full object-contain -rotate-3"
                            />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1">
                                <FiCheck className="text-emerald-600" />
                                <span>Menggunakan Sampel Cap Resmi Otomatis</span>
                            </p>
                            <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                                Sistem otomatis membuat stempel resmi berbentuk bulat sesuai nama sekolah Anda ({school?.name || 'Sekolah'}). Jika sekolah Anda memiliki cap fisik asli di kertas, klik <strong>"Unggah Cap Fisik"</strong>.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Opsi: Unggah Cap Fisik */
                    <div className="space-y-3">
                        {isExtractingStamp ? (
                            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 shadow-xs flex flex-col items-center justify-center gap-2 text-center">
                                <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs font-bold text-zinc-900">Membersihkan Latar Cap Otomatis...</p>
                                <p className="text-[11px] text-zinc-500">Menghilangkan bayangan kertas dan mengekstrak cap fisik secara transparan.</p>
                            </div>
                        ) : hasCustomStamp ? (
                            <div className="bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/60 shadow-xs flex flex-col sm:flex-row items-center gap-4">
                                <div
                                    className="w-20 h-20 rounded-xl border border-zinc-200 bg-white/90 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                                    style={{
                                        backgroundImage: `linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)`,
                                        backgroundSize: '10px 10px',
                                        backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                                    }}
                                >
                                    <img
                                        src={previewStamp}
                                        alt="Cap Stempel Fisik Sekolah"
                                        className="w-full h-full object-contain -rotate-3"
                                    />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <p className="text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1">
                                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700">
                                            <FiCheck size={11} />
                                        </span>
                                        <span>Cap Stempel Otomatis Bersih & Transparan</span>
                                    </p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">
                                        Cap fisik telah dibersihkan latarnya dan siap ditimpa di atas tanda tangan surat.
                                    </p>

                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => onOpenCamera('stamp')}
                                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                        >
                                            <FiCamera size={12} />
                                            <span>Foto Ulang Cap</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => stampFileInputRef.current?.click()}
                                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                        >
                                            <FiRefreshCw size={12} />
                                            <span>Ganti dari Galeri</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onResetStamp}
                                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/60 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                                        >
                                            <FiTrash2 size={12} />
                                            <span>Hapus / Pakai Sampel</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => onOpenCamera('stamp')}
                                    className="p-4 rounded-2xl border border-dashed border-zinc-300 bg-white/60 hover:bg-white/90 hover:border-zinc-900 transition-all flex flex-col items-center justify-center gap-2 text-center group shadow-xs cursor-pointer"
                                >
                                    <div className="w-11 h-11 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                                        <FiCamera size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-900">Foto Cap dari Kamera</p>
                                        <p className="text-[10px] text-zinc-500">Foto langsung cap fisik di kertas</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => stampFileInputRef.current?.click()}
                                    className="p-4 rounded-2xl border border-dashed border-zinc-300 bg-white/60 hover:bg-white/90 hover:border-zinc-900 transition-all flex flex-col items-center justify-center gap-2 text-center group shadow-xs cursor-pointer"
                                >
                                    <div className="w-11 h-11 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                                        <FiImage size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-900">Pilih dari Galeri</p>
                                        <p className="text-[10px] text-zinc-500">Upload file foto PNG / JPG cap</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {errors.stamp && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.stamp}</p>
                )}
            </div>
        </div>
    );
}
