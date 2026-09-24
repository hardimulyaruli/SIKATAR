import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiCamera, FiX, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

/**
 * CameraCaptureModal.jsx
 * Floating picture-in-picture camera pop-up widget on the side of the screen.
 * Does NOT dim or block the entire screen with a dark backdrop window.
 */
export default function CameraCaptureModal({
    isOpen,
    onClose,
    onCapture,
    title = 'Ambil Foto Kamera',
}) {
    if (!isOpen) return null;

    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);

    // Dapatkan daftar perangkat kamera yang tersedia
    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            setErrorMsg('Browser tidak mendukung akses kamera langsung. Silakan gunakan opsi Galeri.');
            return;
        }

        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                const videoDevices = devices.filter((d) => d.kind === 'videoinput');
                setCameras(videoDevices);
                if (videoDevices.length > 0 && !selectedCameraId) {
                    const backCam = videoDevices.find((d) =>
                        d.label.toLowerCase().includes('back') ||
                        d.label.toLowerCase().includes('belakang') ||
                        d.label.toLowerCase().includes('environment')
                    );
                    setSelectedCameraId(backCam ? backCam.deviceId : videoDevices[0].deviceId);
                }
            })
            .catch(() => {});
    }, []);

    // Mulai streaming kamera
    useEffect(() => {
        let activeStream = null;
        setErrorMsg('');
        setIsStreaming(false);

        const constraints = {
            video: selectedCameraId
                ? { deviceId: { exact: selectedCameraId }, width: { ideal: 1280 }, height: { ideal: 720 } }
                : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
        };

        navigator.mediaDevices?.getUserMedia(constraints)
            .then((mediaStream) => {
                activeStream = mediaStream;
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setIsStreaming(true);
                    };
                }
            })
            .catch((err) => {
                console.error('Kamera gagal diakses:', err);
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setErrorMsg('Izin akses kamera ditolak. Izinkan browser mengakses kamera Anda.');
                } else {
                    setErrorMsg('Kamera tidak dapat diakses atau sedang digunakan aplikasi lain.');
                }
            });

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach((t) => t.stop());
            }
        };
    }, [selectedCameraId]);

    // Hentikan stream saat pop-up ditutup
    const handleClose = () => {
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
        }
        onClose();
    };

    // Ambil jepretan foto dari video stream
    const handleSnap = () => {
        if (!videoRef.current || !isStreaming) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const file = new File([blob], `kamera_${Date.now()}.jpg`, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    handleClose();
                    onCapture(file);
                }
            },
            'image/jpeg',
            0.95
        );
    };

    // Ganti kamera jika ada lebih dari 1
    const handleSwitchCamera = () => {
        if (cameras.length <= 1) return;
        const currentIndex = cameras.findIndex((c) => c.deviceId === selectedCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        setSelectedCameraId(cameras[nextIndex].deviceId);
    };

    const modalMarkup = (
        /* Pop-up Kamera di Tengah Layar */
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop transparan (klik di luar untuk menutup) */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={handleClose} />

            {/* Card Pop-up Kamera di Tengah */}
            <div className="relative z-10 w-full max-w-md flex flex-col bg-white/95 backdrop-blur-2xl rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden transition-all duration-200 animate-in zoom-in-95">
            {/* Header Pop-up */}
            <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-900 shadow-2xs">
                        <FiCamera size={13} />
                    </span>
                    <h3 className="text-xs font-bold text-zinc-900 tracking-tight">{title}</h3>
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-lg hover:bg-zinc-200/60 transition-colors cursor-pointer"
                    title="Tutup Kamera"
                >
                    <FiX size={16} />
                </button>
            </div>

            {/* Video Viewfinder Area */}
            <div className="relative bg-black min-h-[260px] max-h-[320px] flex items-center justify-center overflow-hidden">
                {errorMsg ? (
                    <div className="p-5 text-center text-rose-400 max-w-xs space-y-2">
                        <FiAlertCircle className="w-7 h-7 mx-auto text-rose-500 mb-1" />
                        <p className="text-xs font-medium text-zinc-200">{errorMsg}</p>
                        <p className="text-[11px] text-zinc-400">
                            Silakan gunakan opsi "Pilih dari Galeri" untuk mengunggah file foto.
                        </p>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-auto max-h-[320px] object-cover"
                        />

                        {/* Viewfinder Target Guide Overlay */}
                        <div className="absolute inset-5 border-2 border-dashed border-white/70 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                            <span className="text-[10px] font-medium text-white bg-black/60 px-2 py-0.5 rounded self-start backdrop-blur-xs">
                                Posisikan di dalam kotak
                            </span>
                            <span className="text-[9px] text-white/90 bg-black/60 px-1.5 py-0.5 rounded self-center text-center backdrop-blur-xs">
                                Pastikan pencahayaan cukup terang
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Footer Controls */}
            <div className="px-3.5 py-3 bg-zinc-50/80 border-t border-zinc-100 flex items-center justify-between gap-2">
                {cameras.length > 1 ? (
                    <button
                        type="button"
                        onClick={handleSwitchCamera}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[11px] font-semibold rounded-xl hover:bg-zinc-100 transition-colors shadow-2xs cursor-pointer"
                    >
                        <FiRefreshCw size={11} />
                        <span>Ganti Kamera</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium pl-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Kamera Aktif</span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 rounded-xl hover:bg-zinc-200/50 transition-colors cursor-pointer"
                    >
                        Batal
                    </button>

                    {!errorMsg && (
                        <button
                            type="button"
                            onClick={handleSnap}
                            disabled={!isStreaming}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            <FiCamera size={13} />
                            <span>Ambil Foto</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
}
