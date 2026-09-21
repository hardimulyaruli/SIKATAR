import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiX, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

/**
 * CameraCaptureModal.jsx
 * Sub-komponen modular untuk mengambil foto tanda tangan langsung dari kamera/webcam.
 * Mendukung perangkat laptop (webcam) dan smartphone (kamera belakang/dokumen).
 */
export default function CameraCaptureModal({ isOpen, onClose, onCapture }) {
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
            setErrorMsg('Peramban Anda tidak mendukung akses kamera langsung. Silakan gunakan opsi Galeri / File.');
            return;
        }

        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                const videoDevices = devices.filter((d) => d.kind === 'videoinput');
                setCameras(videoDevices);
                if (videoDevices.length > 0 && !selectedCameraId) {
                    // Prioritaskan kamera belakang jika ada kata 'back' atau 'environment'
                    const backCam = videoDevices.find((d) =>
                        d.label.toLowerCase().includes('back') ||
                        d.label.toLowerCase().includes('belakang') ||
                        d.label.toLowerCase().includes('environment')
                    );
                    setSelectedCameraId(backCam ? backCam.deviceId : videoDevices[0].deviceId);
                }
            })
            .catch(() => {
                // Ignore enumeration errors until stream is requested
            });
    }, []);

    // Mulai streaming kamera
    useEffect(() => {
        let activeStream = null;
        setErrorMsg('');
        setIsStreaming(false);

        const constraints = {
            video: selectedCameraId
                ? { deviceId: { exact: selectedCameraId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
                : { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
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
                    setErrorMsg('Izin akses kamera ditolak. Mohon izinkan akses kamera di browser Anda.');
                } else {
                    setErrorMsg('Kamera tidak dapat diakses atau sedang digunakan oleh aplikasi lain.');
                }
            });

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach((t) => t.stop());
            }
        };
    }, [selectedCameraId]);

    // Hentikan stream saat modal ditutup
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
                    const file = new File([blob], `ttd_kamera_${Date.now()}.jpg`, {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                        <FiCamera className="text-blue-600 w-4 h-4" />
                        <h3 className="text-sm font-bold text-slate-800">Ambil Foto Tanda Tangan</h3>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Video Viewfinder Area */}
                <div className="relative bg-black min-h-[300px] flex items-center justify-center overflow-hidden">
                    {errorMsg ? (
                        <div className="p-6 text-center text-rose-400 max-w-xs space-y-2">
                            <FiAlertCircle className="w-8 h-8 mx-auto text-rose-500 mb-1" />
                            <p className="text-xs font-medium text-slate-200">{errorMsg}</p>
                            <p className="text-[11px] text-slate-400">
                                Gunakan tombol "Pilih dari Galeri / File" untuk mengunggah foto yang sudah ada.
                            </p>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-auto max-h-[360px] object-cover"
                            />

                            {/* Viewfinder Target Guide Overlay */}
                            <div className="absolute inset-8 border-2 border-dashed border-white/70 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                                <span className="text-[10px] text-white bg-black/60 px-2 py-0.5 rounded self-start backdrop-blur-xs">
                                    Posisikan Tanda Tangan di Dalam Kotak
                                </span>
                                <span className="text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded self-center text-center backdrop-blur-xs">
                                    Pastikan pencahayaan cukup & tidak berbayang
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    {cameras.length > 1 ? (
                        <button
                            type="button"
                            onClick={handleSwitchCamera}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <FiRefreshCw size={12} />
                            <span>Ganti Kamera</span>
                        </button>
                    ) : (
                        <span className="text-[11px] text-slate-400">Kamera Aktif</span>
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Batal
                        </button>

                        {!errorMsg && (
                            <button
                                type="button"
                                onClick={handleSnap}
                                disabled={!isStreaming}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
                            >
                                <FiCamera size={14} />
                                <span>Ambil Foto</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
