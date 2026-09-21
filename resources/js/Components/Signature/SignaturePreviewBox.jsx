import React, { useState } from 'react';
import { FiEye, FiFileText } from 'react-icons/fi';

/**
 * SignaturePreviewBox.jsx
 * Sub-komponen pratinjau hasil olahan tanda tangan dengan 2 mode tampilan:
 * 1. Transparansi Checkerboard (memastikan tidak ada sisa bayangan kertas)
 * 2. Simulasi Dokumen Surat Resmi (melihat langsung posisi di atas nama & NIP)
 */
export default function SignaturePreviewBox({
    previewUrl,
    isProcessing,
    headmasterName = 'Drs. H. Mulyana, M.M.Pd.',
    headmasterNip = '19680512 199412 1 002',
    schoolTitle = 'Kepala Sekolah',
}) {
    const [viewMode, setViewMode] = useState('checkerboard'); // 'checkerboard' | 'document'

    return (
        <div className="space-y-2">
            {/* Tab Pilihan Mode Preview */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Hasil Pembersihan Tanda Tangan:</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                    <button
                        type="button"
                        onClick={() => setViewMode('checkerboard')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                            viewMode === 'checkerboard'
                                ? 'bg-white text-slate-800 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <FiEye size={12} />
                        <span>Cek Transparansi</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('document')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                            viewMode === 'document'
                                ? 'bg-white text-blue-600 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <FiFileText size={12} />
                        <span>Simulasi Surat</span>
                    </button>
                </div>
            </div>

            {/* Container Preview */}
            <div className="relative border border-slate-200 rounded-xl overflow-hidden min-h-[220px] flex items-center justify-center p-4">
                {viewMode === 'checkerboard' ? (
                    // 1. Tampilan Checkerboard
                    <div
                        className="w-full h-full min-h-[200px] rounded-lg flex items-center justify-center p-4 relative"
                        style={{
                            backgroundImage: `linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)`,
                            backgroundSize: '16px 16px',
                            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                            backgroundColor: '#f8fafc',
                        }}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Hasil Olahan Transparan"
                                className="max-h-36 max-w-full object-contain filter drop-shadow-xs transition-opacity duration-150"
                            />
                        ) : (
                            <span className="text-xs text-slate-400">Memproses tanda tangan...</span>
                        )}

                        <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-slate-600 font-medium border border-slate-200 shadow-xs">
                            Pola Catur = Transparan
                        </span>
                    </div>
                ) : (
                    // 2. Tampilan Simulasi Surat Resmi
                    <div className="w-full bg-white border border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center shadow-xs">
                        <div className="text-center w-64">
                            <p className="text-[11px] font-bold text-slate-900 leading-tight">
                                {schoolTitle}
                            </p>
                            
                            {/* Area Tanda Tangan */}
                            <div className="w-full h-20 flex items-center justify-center my-1 relative">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Tanda Tangan Simulasi"
                                        className="max-h-20 max-w-[180px] object-contain select-none pointer-events-none"
                                    />
                                ) : (
                                    <div className="h-16 flex items-center text-xs text-slate-400">
                                        (Tanda Tangan)
                                    </div>
                                )}
                            </div>

                            {/* Nama & NIP */}
                            <div className="text-center leading-tight">
                                <p className="font-bold text-xs uppercase border-b border-black pb-0.5 inline-block text-black">
                                    {headmasterName || 'NAMA KEPALA SEKOLAH'}
                                </p>
                                <p className="text-[11px] text-black font-normal mt-0.5">
                                    NIP. {headmasterNip || '19XXXXXXXXXXXXXX'}
                                </p>
                            </div>
                        </div>

                        <span className="mt-3 bg-amber-50 text-amber-700 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
                            Pratinjau letak tanda tangan pada dokumen surat
                        </span>
                    </div>
                )}

                {/* Loading indicator overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center z-10">
                        <span className="text-xs font-semibold text-blue-600 animate-pulse">
                            Memperbarui pratinjau...
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
