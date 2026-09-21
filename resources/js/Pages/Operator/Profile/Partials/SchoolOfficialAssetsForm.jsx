import React from 'react';
import { FiHome, FiSliders } from 'react-icons/fi';

/**
 * SchoolOfficialAssetsForm handles official institutional graphic assets:
 * School KOP Logo, Digital Clean Wet Signature, and Official Rubber Stamp.
 * Single Responsibility: Presenting file uploaders and preview for official institutional assets.
 */
export default function SchoolOfficialAssetsForm({
    previewLogo,
    onLogoChange,
    previewSignature,
    onSignatureChange,
    rawSigFile,
    onOpenSigModal,
    isExtractingSig = false,
    previewStamp,
    onStampChange,
    isExtractingStamp = false,
    school,
    errors = {},
}) {
    return (
        <div className="space-y-4">
            {/* Upload Logo Sekolah */}
            <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Upload Logo Sekolah:
                </label>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                        {previewLogo ? (
                            <img
                                src={previewLogo}
                                alt="Logo Sekolah Preview"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <FiHome className="w-6 h-6 text-slate-400" />
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onLogoChange}
                            className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                            Format PNG / JPG (Maks. 2MB). Disarankan berlatar belakang transparan.
                        </p>
                        {errors.logo && (
                            <p className="text-[11px] text-rose-500 mt-1">{errors.logo}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Sampel Tanda Tangan Basah */}
            <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Upload Sampel Tanda Tangan Basah Kepala Sekolah:
                    </label>
                    {rawSigFile && (
                        <button
                            type="button"
                            onClick={onOpenSigModal}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                            <FiSliders size={12} />
                            <span>Buka Studio Pembersih TTD</span>
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div
                        className="w-28 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                        style={{
                            backgroundImage: previewSignature
                                ? `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)`
                                : 'none',
                            backgroundSize: '12px 12px',
                            backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
                        }}
                    >
                        {isExtractingSig ? (
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : previewSignature ? (
                            <img
                                src={previewSignature}
                                alt="Sampel TTD Basah Preview"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-[10px] text-slate-400 text-center">TTE / Kosong</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onSignatureChange}
                            className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                            Pilih foto dari HP/kamera. Latar belakang kertas akan langsung dihapus bersih secara transparan tanpa perlu edit manual.
                        </p>
                        {errors.signature && (
                            <p className="text-[11px] text-rose-500 mt-1">{errors.signature}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Cap / Stempel Resmi Sekolah */}
            <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Cap / Stempel Resmi Sekolah (Opsional):
                    </label>
                    <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                        {school?.stamp_path ? 'Cap Kustom Tersimpan' : 'Menggunakan Sampel Resmi Otomatis'}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div
                        className="w-20 h-20 rounded-xl border border-purple-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                        style={{
                            backgroundImage: `linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)`,
                            backgroundSize: '10px 10px',
                            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                        }}
                    >
                        {isExtractingStamp ? (
                            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        ) : previewStamp ? (
                            <img
                                src={previewStamp}
                                alt="Cap Stempel Sekolah Preview"
                                className="w-full h-full object-contain -rotate-3"
                            />
                        ) : (
                            <span className="text-[10px] text-slate-400">Belum Ada Cap</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onStampChange}
                            className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                            Jika belum mengunggah stempel fisik, sistem otomatis menggunakan <strong>Sampel Stempel Resmi</strong> sesuai nama sekolah. Foto cap basah akan otomatis dibersihkan latarnya menjadi transparan.
                        </p>
                        {errors.stamp && (
                            <p className="text-[11px] text-rose-500 mt-1">{errors.stamp}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
