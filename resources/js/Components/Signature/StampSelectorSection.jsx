import React, { useRef } from 'react';
import { FiCamera, FiImage, FiCheck, FiInfo, FiRefreshCw, FiTrash2, FiAward, FiSlash } from 'react-icons/fi';
import { getImageUrl } from '@/Components/Letter/HeaderKopSurat';
import { generateSchoolStampDataUrl } from '@/Utils/stampGenerator';

/**
 * StampSelectorSection.jsx
 * Sub-komponen modular untuk pemilihan Cap / Stempel Sekolah:
 * - Opsi Sample/Default: Stempel dinas bulat resmi otomatis sesuai nama sekolah.
 * - Opsi Custom: Mengunggah/memfoto stempel fisik khusus surat ini.
 * - Opsi None: Tanpa stempel.
 * Styled in monochrome iOS liquid glass with visible button indicators.
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
        <div className="p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-zinc-200/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-xs uppercase tracking-wider text-zinc-900 font-bold">
                    Cap / Stempel Sekolah (Ditimpa di Atas Tanda Tangan)
                </label>
                <span className="text-[11px] text-zinc-500 font-medium">
                    {stampMode === 'sample' && 'Sampel Cap Resmi'}
                    {stampMode === 'custom' && 'Cap Khusus Surat'}
                    {stampMode === 'none' && 'Tanpa Cap'}
                </span>
            </div>

            {/* Tab Pilihan 3 Opsi: Tanpa Cap (Default) vs Sampel Resmi vs Unggah Khusus */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-zinc-100/70 rounded-2xl border border-zinc-200/60 backdrop-blur-md text-xs">
                <button
                    type="button"
                    onClick={() => onModeChange('none')}
                    className={`py-2.5 px-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center cursor-pointer ${
                        stampMode === 'none'
                            ? 'bg-white/80 backdrop-blur-xl text-zinc-900 border border-zinc-200/90 shadow-xs'
                            : 'bg-white/30 hover:bg-white/60 text-zinc-600 hover:text-zinc-900 border border-zinc-200/40 font-medium'
                    }`}
                >
                    <span className="truncate">Tanpa Cap (Default)</span>
                </button>

                <button
                    type="button"
                    onClick={() => onModeChange('sample')}
                    className={`py-2.5 px-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center cursor-pointer ${
                        stampMode === 'sample'
                            ? 'bg-white/80 backdrop-blur-xl text-zinc-900 border border-zinc-200/90 shadow-xs'
                            : 'bg-white/30 hover:bg-white/60 text-zinc-600 hover:text-zinc-900 border border-zinc-200/40 font-medium'
                    }`}
                >
                    <span className="truncate">Sampel Cap Resmi</span>
                </button>

                <button
                    type="button"
                    onClick={() => onModeChange('custom')}
                    className={`py-2.5 px-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center cursor-pointer ${
                        stampMode === 'custom'
                            ? 'bg-white/80 backdrop-blur-xl text-zinc-900 border border-zinc-200/90 shadow-xs'
                            : 'bg-white/30 hover:bg-white/60 text-zinc-600 hover:text-zinc-900 border border-zinc-200/40 font-medium'
                    }`}
                >
                    <span className="truncate">Unggah Cap Fisik</span>
                </button>
            </div>

            {/* KONTEN: OPSI 1 - SAMPEL CAP RESMI SEKOLAH */}
            {stampMode === 'sample' && (
                <div className="bg-white/80 backdrop-blur-xl p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-4">
                    <div
                        className="w-20 h-20 rounded-xl border border-zinc-200 bg-white/90 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                        style={{
                            backgroundImage: `linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)`,
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

                    <div className="flex-1 text-center sm:text-left">
                        <p className="text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1">
                            <FiCheck className="text-emerald-600" />
                            <span>Stempel Dinas Bulat Resmi Kabupaten Bandung Barat</span>
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                            Otomatis menyematkan stempel bulat resmi bertuliskan <strong>{school?.name || 'Sekolah'}</strong> yang ditimpa di atas tanda tangan Kepala Sekolah.
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
                        <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col items-center justify-center gap-2 text-center">
                            <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-bold text-zinc-900">Membersihkan Latar Cap Stempel...</p>
                            <p className="text-[11px] text-zinc-500">Menghilangkan latar kertas menjadi transparan murni.</p>
                        </div>
                    ) : customStampPreview ? (
                        <div className="bg-white/80 backdrop-blur-xl p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-4">
                            <div
                                className="w-20 h-20 rounded-xl border border-zinc-200 bg-white/90 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                                style={{
                                    backgroundImage: `linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)`,
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

                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1">
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700">
                                        <FiCheck size={11} />
                                    </span>
                                    <span>Cap Stempel Bersih & Transparan</span>
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                    Siap ditimpa di atas tanda tangan basah Kepala Sekolah.
                                </p>

                                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={onOpenCamera}
                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                    >
                                        <FiCamera size={11} />
                                        <span>Foto Ulang Cap</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                    >
                                        <FiRefreshCw size={11} />
                                        <span>Ganti Cap</span>
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
                                    <p className="text-xs font-bold text-zinc-900">Foto Cap dari Kamera</p>
                                    <p className="text-[10px] text-zinc-500">Foto langsung cap fisik di kertas</p>
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
                                    <p className="text-[10px] text-zinc-500">Upload file foto PNG / JPG cap</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* KONTEN: OPSI 3 - TANPA CAP */}
            {stampMode === 'none' && (
                <div className="bg-white/80 backdrop-blur-xl p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs flex items-center gap-2.5 text-xs text-zinc-600">
                    <FiInfo className="text-zinc-400 shrink-0" size={15} />
                    <span>Surat ini akan dikirim hanya dengan tanda tangan tanpa cap stempel sekolah.</span>
                </div>
            )}
        </div>
    );
}
