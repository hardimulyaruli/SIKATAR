import React, { useState, useRef, useEffect } from 'react';
import { FiRotateCw, FiCrop, FiCheck } from 'react-icons/fi';
import { cropAndRotateImage } from '@/Utils/signatureProcessor';

/**
 * SignatureCropView.jsx
 * Sub-komponen untuk memotong (crop) dan merotasi foto tanda tangan
 * sebelum proses pembersihan background.
 */
export default function SignatureCropView({
    sourceImage,
    rotation,
    setRotation,
    onCropApplied,
}) {
    const containerRef = useRef(null);
    const [cropBox, setCropBox] = useState({ xPercent: 10, yPercent: 15, wPercent: 80, hPercent: 70 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleApply = () => {
        if (!sourceImage) return;

        const rawW = sourceImage.naturalWidth || sourceImage.width;
        const rawH = sourceImage.naturalHeight || sourceImage.height;

        const isSideways = rotation === 90 || rotation === 270;
        const currentW = isSideways ? rawH : rawW;
        const currentH = isSideways ? rawW : rawH;

        const pixelRect = {
            x: (cropBox.xPercent / 100) * currentW,
            y: (cropBox.yPercent / 100) * currentH,
            width: (cropBox.wPercent / 100) * currentW,
            height: (cropBox.hPercent / 100) * currentH,
        };

        const croppedCanvas = cropAndRotateImage(sourceImage, pixelRect, rotation);
        onCropApplied(croppedCanvas);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xs font-bold text-slate-800">Langkah 1: Atur Posisi & Potong Foto</h4>
                    <p className="text-[11px] text-slate-500">
                        Sesuaikan rotasi dan area agar pas melingkupi tanda tangan saja.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleRotate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
                >
                    <FiRotateCw size={12} />
                    <span>Putar 90°</span>
                </button>
            </div>

            {/* Area Tampilan Foto dengan Overlay Crop Guide */}
            <div
                ref={containerRef}
                className="relative bg-slate-900/90 rounded-xl overflow-hidden min-h-[260px] max-h-[380px] flex items-center justify-center p-4 select-none"
            >
                {sourceImage && (
                    <div
                        className="relative max-w-full max-h-[320px] transition-transform duration-200 inline-block"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                        }}
                    >
                        <img
                            src={sourceImage.src}
                            alt="Mentah"
                            className="max-h-[300px] w-auto object-contain rounded-sm shadow-md pointer-events-none"
                        />
                    </div>
                )}

                {/* Petunjuk Area Panduan */}
                <div className="absolute inset-x-8 inset-y-6 border-2 border-dashed border-blue-400/80 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                    <span className="bg-blue-600/80 text-white text-[10px] px-2 py-0.5 rounded self-start backdrop-blur-xs">
                        Area Fokus Tanda Tangan
                    </span>
                    <span className="text-[10px] text-blue-200 self-center text-center bg-black/40 px-2 py-1 rounded backdrop-blur-xs">
                        Pastikan foto tegak dan jelas
                    </span>
                </div>
            </div>

            {/* Slider Pengaturan Area Crop Sederhana */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Lebar Area Crop ({cropBox.wPercent}%)
                    </label>
                    <input
                        type="range"
                        min="40"
                        max="100"
                        value={cropBox.wPercent}
                        onChange={(e) => {
                            const w = Number(e.target.value);
                            setCropBox((prev) => ({
                                ...prev,
                                wPercent: w,
                                xPercent: Math.max(0, (100 - w) / 2),
                            }));
                        }}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tinggi Area Crop ({cropBox.hPercent}%)
                    </label>
                    <input
                        type="range"
                        min="30"
                        max="100"
                        value={cropBox.hPercent}
                        onChange={(e) => {
                            const h = Number(e.target.value);
                            setCropBox((prev) => ({
                                ...prev,
                                hPercent: h,
                                yPercent: Math.max(0, (100 - h) / 2),
                            }));
                        }}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="button"
                    onClick={handleApply}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
                >
                    <FiCrop size={14} />
                    <span>Lanjutkan ke Pembersihan Background →</span>
                </button>
            </div>
        </div>
    );
}
