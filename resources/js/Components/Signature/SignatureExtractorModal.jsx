import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCheck, FiArrowLeft, FiSliders, FiMaximize2 } from 'react-icons/fi';
import { loadImage, processSignatureImage, canvasToFile } from '@/Utils/signatureProcessor';
import SignatureCropView from './SignatureCropView';
import SignatureControls from './SignatureControls';
import SignaturePreviewBox from './SignaturePreviewBox';

/**
 * SignatureExtractorModal.jsx
 * Komponen orkestrator modal untuk ekstraksi tanda tangan basah.
 * Menerapkan prinsip Modularitas dan Single Responsibility.
 */
export default function SignatureExtractorModal({
    isOpen,
    onClose,
    rawImageFile,
    onSave,
    headmasterName = '',
    headmasterNip = '',
    schoolTitle = 'Kepala Sekolah',
}) {
    if (!isOpen || !rawImageFile) return null;

    // Tahapan modal: 'crop' -> 'studio'
    const [step, setStep] = useState('crop');

    // State citra
    const [loadedImage, setLoadedImage] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [croppedCanvas, setCroppedCanvas] = useState(null);
    const [finalCanvas, setFinalCanvas] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Parameter pemrosesan
    const [threshold, setThreshold] = useState(200);
    const [darkness, setDarkness] = useState(1.2);
    const [colorMode, setColorMode] = useState('original');
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Muat gambar mentah saat file berganti
    useEffect(() => {
        let isMounted = true;
        if (rawImageFile) {
            setStep('crop');
            setRotation(0);
            loadImage(rawImageFile)
                .then((img) => {
                    if (isMounted) {
                        setLoadedImage(img);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        return () => {
            isMounted = false;
        };
    }, [rawImageFile]);

    // 2. Handler saat selesai tahap pemotongan foto
    const handleCropApplied = (canvas) => {
        setCroppedCanvas(canvas);
        setStep('studio');
    };

    // 3. Eksekusi pembersihan background saat parameter berubah di tahap studio
    useEffect(() => {
        if (step !== 'studio' || !croppedCanvas) return;

        setIsProcessing(true);
        const timer = setTimeout(() => {
            try {
                const result = processSignatureImage(croppedCanvas, {
                    threshold,
                    darkness,
                    colorMode,
                    trim: true,
                });
                setFinalCanvas(result);
                setPreviewUrl(result.toDataURL('image/png'));
            } catch (err) {
                console.error('Error saat memproses tanda tangan:', err);
            } finally {
                setIsProcessing(false);
            }
        }, 30); // Micro-debounce for silky smooth sliders

        return () => clearTimeout(timer);
    }, [step, croppedCanvas, threshold, darkness, colorMode]);

    // 4. Konfirmasi dan simpan hasil
    const handleConfirm = async () => {
        if (!finalCanvas) return;
        try {
            const file = await canvasToFile(finalCanvas, 'ttd_basah_bersih.png');
            onSave(file, previewUrl);
            onClose();
        } catch (err) {
            console.error('Gagal mengekspor file tanda tangan:', err);
        }
    };

    const modalMarkup = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-zinc-200 animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
                    <div className="flex items-center gap-2">
                        {step === 'studio' && (
                            <button
                                type="button"
                                onClick={() => setStep('crop')}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors mr-1"
                                title="Kembali ke Pemotongan"
                            >
                                <FiArrowLeft size={16} />
                            </button>
                        )}
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">
                                {step === 'crop'
                                    ? 'Sesuaikan Foto Tanda Tangan'
                                    : 'Studio Pembersih Tanda Tangan Basah'}
                            </h3>
                            <p className="text-[11px] text-slate-500">
                                {step === 'crop'
                                    ? 'Posisikan foto tanda tangan tegak dan fokus pada area tanda tangan.'
                                    : 'Hapus background kertas secara cerdas agar menyatu sempurna dengan dokumen surat.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {step === 'crop' ? (
                        <SignatureCropView
                            sourceImage={loadedImage}
                            rotation={rotation}
                            setRotation={setRotation}
                            onCropApplied={handleCropApplied}
                        />
                    ) : (
                        <div className="space-y-4">
                            {/* Pratinjau (Checkerboard / Simulasi Surat) */}
                            <SignaturePreviewBox
                                previewUrl={previewUrl}
                                isProcessing={isProcessing}
                                headmasterName={headmasterName}
                                headmasterNip={headmasterNip}
                                schoolTitle={schoolTitle}
                            />

                            {/* Kontrol Slider & Mode Warna */}
                            <SignatureControls
                                threshold={threshold}
                                setThreshold={setThreshold}
                                darkness={darkness}
                                setDarkness={setDarkness}
                                colorMode={colorMode}
                                setColorMode={setColorMode}
                                isProcessing={isProcessing}
                            />
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 font-medium">
                        {step === 'crop' ? (
                            <span>Langkah 1 dari 2</span>
                        ) : (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                <FiCheck size={13} /> Siap ditempel ke dokumen
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors"
                        >
                            Batal
                        </button>

                        {step === 'crop' ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (loadedImage) {
                                        // Default: gunakan seluruh gambar yang dirotasi jika langsung lanjut
                                        handleCropApplied(loadedImage);
                                    }
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
                            >
                                <span>Lanjutkan ke Studio</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={!finalCanvas || isProcessing}
                                className="inline-flex items-center gap-1.5 px-5 py-2 bg-zinc-900/90 hover:bg-black text-white text-xs font-bold rounded-xl border border-zinc-800 backdrop-blur-xl shadow-sm disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
                            >
                                <FiCheck size={14} />
                                <span>Gunakan Tanda Tangan Ini</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
}
