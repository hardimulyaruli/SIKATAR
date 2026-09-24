import React, { useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import HeaderKopSurat from '@/Components/Letter/HeaderKopSurat';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    FiHome, FiUser, FiLock, FiCamera, FiImage,
    FiCheck, FiTrash2, FiRefreshCw, FiSliders, FiSave,
    FiUploadCloud, FiCheckCircle,
} from 'react-icons/fi';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import { useDisdikProfileForm } from '@/Hooks/useDisdikProfileForm';
import SignatureExtractorModal from '@/Components/Signature/SignatureExtractorModal';
import CameraCaptureModal from '@/Components/Signature/CameraCaptureModal';

/**
 * Profile Edit page for Dinas Pendidikan staff.
 * Includes: profile info, password, photo upload, TTD basah, cap stempel, and letterhead preview.
 */
export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const isDisdikStaff = ['staff_kepala', 'staff_biasa', 'admin'].includes(user?.role);
    const Layout = isDisdikStaff ? AdminLayout : OperatorLayout;
    const dashboardUrl = isDisdikStaff ? '/admin/dashboard' : '/operator/dashboard';

    const sigFileInputRef = useRef(null);
    const stampFileInputRef = useRef(null);
    const photoInputRef = useRef(null);

    const {
        errors: assetErrors,
        processing: assetProcessing,
        recentlySuccessful: assetSuccess,
        previewPhoto,
        previewSignature,
        previewStamp,
        rawSigFile,
        isSigModalOpen,
        setIsSigModalOpen,
        isCameraOpen,
        setIsCameraOpen,
        cameraTarget,
        setCameraTarget,
        isExtractingSig,
        isExtractingStamp,
        stampMode,
        handleStampModeChange,
        handlePhotoChange,
        handleResetPhoto,
        handleProcessSignature,
        handleProcessStamp,
        handleCameraCapture,
        handleResetSignature,
        handleResetStamp,
        handleSignatureExtracted,
        submit: submitAssets,
    } = useDisdikProfileForm();

    const handleSigFileInput = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleProcessSignature(file);
            e.target.value = '';
        }
    };

    const handleStampFileInput = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleProcessStamp(file);
            e.target.value = '';
        }
    };

    // Transparent checkerboard pattern for previews
    const checkerStyle = {
        backgroundImage: `linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)`,
        backgroundSize: '10px 10px',
        backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
    };

    return (
        <Layout>
            <Head title="Profil Akun" />

            <PageHeader
                title="Profil Akun Dinas Pendidikan"
                subtitle="Kelola identitas pengguna, hak akses kedinasan, dan keamanan akun Disdik Kabupaten Bandung Barat."
                action={
                    <Link
                        href={dashboardUrl}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/60 backdrop-blur-xl text-zinc-900 rounded-xl text-xs font-semibold hover:bg-white/80 transition-colors border border-zinc-200/80 shadow-xs"
                    >
                        <span>← Kembali ke Dashboard</span>
                    </Link>
                }
            />

            <div className="max-w-4xl space-y-6">
                {/* Section 1: Foto Profil, Tanda Tangan & Cap Stempel */}
                {isDisdikStaff && (
                    <GlassCard
                        header={
                            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                                <FiCamera className="w-4 h-4 text-zinc-700" />
                                Foto Profil, Tanda Tangan & Cap Stempel Disdik
                            </h3>
                        }
                    >
                        {assetSuccess && (
                            <div className="mb-4 p-3 bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl text-xs flex items-center gap-2">
                                <FiCheckCircle className="w-4 h-4 text-zinc-700 shrink-0" />
                                <span>Foto profil, tanda tangan, dan cap stempel berhasil diperbarui!</span>
                            </div>
                        )}

                        <form onSubmit={submitAssets} className="space-y-6">
                            {/* --- 1. Foto Profil --- */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800">
                                    Foto Profil Pegawai Disdik
                                </label>
                                <div className="flex items-center gap-5 bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/60 shadow-xs">
                                    <div className="w-20 h-20 rounded-2xl border-2 border-zinc-200 bg-white/80 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                        {previewPhoto ? (
                                            <img
                                                src={previewPhoto}
                                                alt="Foto Profil"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="w-8 h-8 text-zinc-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            ref={photoInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => photoInputRef.current?.click()}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white backdrop-blur-xl text-zinc-900 text-xs font-semibold rounded-xl border border-zinc-200/90 shadow-2xs transition-all active:scale-95 cursor-pointer"
                                            >
                                                <FiUploadCloud className="w-3.5 h-3.5" />
                                                <span>{previewPhoto ? 'Ganti Foto' : 'Unggah Foto'}</span>
                                            </button>
                                            {previewPhoto && (
                                                <button
                                                    type="button"
                                                    onClick={handleResetPhoto}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/60 hover:bg-white text-zinc-600 hover:text-zinc-900 text-xs font-medium rounded-xl border border-zinc-200/90 shadow-2xs transition-all active:scale-95 cursor-pointer"
                                                    title="Hapus foto dan kembali ke logo default Pemkab KBB"
                                                >
                                                    <FiTrash2 className="w-3.5 h-3.5 text-zinc-500" />
                                                    <span>Hapus Foto</span>
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-zinc-400 mt-1.5">
                                            Format JPG / PNG (Maks. 2MB). Foto ini otomatis tampil sebagai logo profil di sidebar dan profil akun.
                                        </p>
                                        {assetErrors.profile_photo && (
                                            <p className="text-[11px] text-zinc-900 mt-1 font-medium">{assetErrors.profile_photo}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- 2. Tanda Tangan (TTD Basah) --- */}
                            <div className="pt-3 border-t border-zinc-200/60 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800">
                                        Tanda Tangan Resmi (TTD Basah)
                                    </label>
                                    <span className="text-[11px] font-medium text-zinc-500">
                                        {previewSignature ? 'TTD Tersedia' : 'Belum Ada TTD'}
                                    </span>
                                </div>

                                <input ref={sigFileInputRef} type="file" accept="image/*" onChange={handleSigFileInput} className="hidden" />

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
                                            style={checkerStyle}
                                        >
                                            <img src={previewSignature} alt="TTD Basah" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <p className="text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1.5">
                                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-200 text-zinc-800">
                                                    <FiCheck size={11} />
                                                </span>
                                                <span>Tanda Tangan Otomatis Bersih & Transparan</span>
                                            </p>
                                            <p className="text-[11px] text-zinc-500 mt-0.5">
                                                Latar belakang kertas telah dinetralkan dan transparan, siap digunakan pada surat resmi.
                                            </p>
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5 flex-wrap">
                                                {rawSigFile && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsSigModalOpen(true)}
                                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                                                    >
                                                        <FiSliders size={12} />
                                                        <span>Sesuaikan Manual</span>
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => { setCameraTarget('signature'); setIsCameraOpen(true); }}
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
                                                    onClick={handleResetSignature}
                                                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-zinc-100/80 hover:bg-zinc-200 border border-zinc-300/60 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
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
                                            onClick={() => { setCameraTarget('signature'); setIsCameraOpen(true); }}
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
                                {assetErrors.signature && (
                                    <p className="text-[11px] text-zinc-900 mt-1 font-medium">{assetErrors.signature}</p>
                                )}
                            </div>

                            {/* --- 3. Cap / Stempel Disdik --- */}
                            <div className="pt-3 border-t border-zinc-200/60 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800">
                                        Cap / Stempel Dinas Pendidikan
                                    </label>
                                    <span className="text-[11px] font-medium text-zinc-500">
                                        {stampMode === 'custom' ? 'Cap Fisik Kustom' : 'Sampel Cap Resmi'}
                                    </span>
                                </div>

                                {/* Tab switcher */}
                                <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-100/70 rounded-2xl border border-zinc-200/60 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => handleStampModeChange('sample')}
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
                                        onClick={() => handleStampModeChange('custom')}
                                        className={`py-2.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center cursor-pointer ${
                                            stampMode === 'custom'
                                                ? 'bg-white/80 backdrop-blur-xl text-zinc-900 shadow-xs border border-zinc-200/90'
                                                : 'bg-white/30 hover:bg-white/60 text-zinc-600 hover:text-zinc-900 border border-zinc-200/40 font-medium'
                                        }`}
                                    >
                                        <span>Unggah Cap Fisik</span>
                                    </button>
                                </div>

                                <input ref={stampFileInputRef} type="file" accept="image/*" onChange={handleStampFileInput} className="hidden" />

                                {stampMode === 'sample' ? (
                                    <div className="bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/60 shadow-xs flex flex-col sm:flex-row items-center gap-4">
                                        <div
                                            className="w-20 h-20 rounded-xl border border-zinc-200 bg-white/90 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                                            style={checkerStyle}
                                        >
                                            <img src={previewStamp} alt="Sampel Cap Resmi" className="w-full h-full object-contain -rotate-3" />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <p className="text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1">
                                                <FiCheck className="text-zinc-700" />
                                                <span>Menggunakan Sampel Cap Resmi Otomatis</span>
                                            </p>
                                            <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                                                Sistem otomatis membuat stempel resmi Dinas Pendidikan Kabupaten Bandung Barat. Jika memiliki cap fisik asli, klik <strong>"Unggah Cap Fisik"</strong>.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {isExtractingStamp ? (
                                            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 shadow-xs flex flex-col items-center justify-center gap-2 text-center">
                                                <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                                                <p className="text-xs font-bold text-zinc-900">Membersihkan Latar Cap Otomatis...</p>
                                                <p className="text-[11px] text-zinc-500">Menghilangkan bayangan kertas dan mengekstrak cap fisik secara transparan.</p>
                                            </div>
                                        ) : previewStamp && previewStamp !== '' ? (
                                            <div className="bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/60 shadow-xs flex flex-col sm:flex-row items-center gap-4">
                                                <div
                                                    className="w-20 h-20 rounded-xl border border-zinc-200 bg-white/90 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                                                    style={checkerStyle}
                                                >
                                                    <img src={previewStamp} alt="Cap Stempel Fisik" className="w-full h-full object-contain -rotate-3" />
                                                </div>
                                                <div className="flex-1 text-center sm:text-left">
                                                    <p className="text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1">
                                                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-200 text-zinc-800">
                                                            <FiCheck size={11} />
                                                        </span>
                                                        <span>Cap Stempel Otomatis Bersih & Transparan</span>
                                                    </p>
                                                    <p className="text-[11px] text-zinc-500 mt-0.5">
                                                        Cap fisik telah dibersihkan latarnya dan siap digunakan pada surat resmi.
                                                    </p>
                                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5 flex-wrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setCameraTarget('stamp'); setIsCameraOpen(true); }}
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
                                                            onClick={handleResetStamp}
                                                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800 bg-zinc-100/80 hover:bg-zinc-200 border border-zinc-300/60 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
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
                                                    onClick={() => { setCameraTarget('stamp'); setIsCameraOpen(true); }}
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
                                {assetErrors.stamp && (
                                    <p className="text-[11px] text-zinc-900 mt-1 font-medium">{assetErrors.stamp}</p>
                                )}
                            </div>

                            {/* Submit Assets Button */}
                            <div className="pt-4 border-t border-zinc-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={assetProcessing}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                                >
                                    <FiSave className="w-4 h-4" />
                                    <span>{assetProcessing ? 'Menyimpan...' : 'Simpan Foto, TTD & Cap'}</span>
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                )}

                {/* Section 3: Security & Password Update */}
                <GlassCard
                    header={
                        <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                            <FiLock className="w-4 h-4 text-zinc-700" />
                            Pengaturan Keamanan & Kata Sandi
                        </h3>
                    }
                >
                    <UpdatePasswordForm />
                </GlassCard>

                {/* Section 4: Official Letterhead Preview (Disdik KBB) */}
                <GlassCard
                    header={
                        <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                            <FiHome className="w-4 h-4 text-zinc-700" />
                            Pratinjau Kop Surat Resmi Dinas Pendidikan KBB
                        </h3>
                    }
                >
                    <div className="p-4 bg-zinc-100/70 rounded-xl border border-zinc-200/80 overflow-x-auto">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 max-w-[800px] mx-auto pointer-events-none">
                            <HeaderKopSurat isDisdik={true} disdikLogo={previewPhoto} />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Modal Kamera untuk Foto Langsung TTD & Cap */}
            {isDisdikStaff && (
                <>
                    <CameraCaptureModal
                        isOpen={isCameraOpen}
                        onClose={() => setIsCameraOpen(false)}
                        onCapture={handleCameraCapture}
                        title={cameraTarget === 'stamp' ? 'Foto Cap / Stempel Disdik' : 'Foto Tanda Tangan Basah'}
                    />

                    {/* Modal Studio Ekstraksi Tanda Tangan */}
                    <SignatureExtractorModal
                        isOpen={isSigModalOpen}
                        rawImageFile={rawSigFile}
                        onClose={() => setIsSigModalOpen(false)}
                        onSave={handleSignatureExtracted}
                        headmasterName={user?.name}
                        headmasterNip=""
                        schoolTitle="Kepala Staf Disdik"
                    />
                </>
            )}
        </Layout>
    );
}
