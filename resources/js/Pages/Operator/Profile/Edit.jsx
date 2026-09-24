import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import HeaderKopSurat from '@/Components/Letter/HeaderKopSurat';
import { Link } from '@inertiajs/react';
import { FiSave, FiHome, FiCheckCircle } from 'react-icons/fi';
import { useSchoolProfileForm } from '@/Hooks/useSchoolProfileForm';
import SignatureExtractorModal from '@/Components/Signature/SignatureExtractorModal';
import CameraCaptureModal from '@/Components/Signature/CameraCaptureModal';
import SchoolGeneralInfoForm from './Partials/SchoolGeneralInfoForm';
import SchoolHeadmasterForm from './Partials/SchoolHeadmasterForm';
import SchoolOfficialAssetsForm from './Partials/SchoolOfficialAssetsForm';

/**
 * ProfileEdit allows school operators to manage school general data, headmaster info,
 * and official assets (kop logo, transparent wet signature, and stamp via Camera & Gallery).
 */
export default function ProfileEdit({ school }) {
    const {
        data,
        setData,
        errors,
        processing,
        recentlySuccessful,
        previewLogo,
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
        handleNipChange,
        handleLogoChange,
        handleProcessSignature,
        handleProcessStamp,
        handleCameraCapture,
        handleResetSignature,
        handleResetStamp,
        handleSignatureExtracted,
        submit,
    } = useSchoolProfileForm(school);

    return (
        <OperatorLayout>
            <PageHeader
                title="Profil Sekolah"
                subtitle="Kelola identitas resmi sekolah, nama Kepala Sekolah, NIP, serta logo, TTD basah & cap stempel sekolah."
                action={
                    <Link
                        href="/operator/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/60 backdrop-blur-xl text-zinc-900 rounded-xl text-xs font-semibold hover:bg-white/80 transition-colors border border-zinc-200/80 shadow-xs"
                    >
                        <span>← Kembali ke Dashboard</span>
                    </Link>
                }
            />

            <div className="max-w-4xl space-y-6">
                <GlassCard header={<h3 className="font-bold text-zinc-900 text-sm">Form Data Profil & Aset Resmi Sekolah</h3>}>
                    {recentlySuccessful && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Profil Sekolah, Logo, Tanda Tangan, dan Cap Stempel berhasil diperbarui!</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <SchoolGeneralInfoForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        <SchoolHeadmasterForm
                            data={data}
                            setData={setData}
                            onNipChange={handleNipChange}
                        />

                        <SchoolOfficialAssetsForm
                            previewLogo={previewLogo}
                            onLogoChange={handleLogoChange}
                            previewSignature={previewSignature}
                            rawSigFile={rawSigFile}
                            onOpenSigModal={() => setIsSigModalOpen(true)}
                            isExtractingSig={isExtractingSig}
                            onProcessSignature={handleProcessSignature}
                            onResetSignature={handleResetSignature}
                            previewStamp={previewStamp}
                            isExtractingStamp={isExtractingStamp}
                            stampMode={stampMode}
                            onStampModeChange={handleStampModeChange}
                            onProcessStamp={handleProcessStamp}
                            onResetStamp={handleResetStamp}
                            onOpenCamera={(target) => {
                                setCameraTarget(target);
                                setIsCameraOpen(true);
                            }}
                            school={school}
                            hasCustomStamp={Boolean(data.stamp || (school?.stamp_path && !data.delete_stamp))}
                            errors={errors}
                        />

                        <div className="pt-4 border-t border-zinc-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/70 backdrop-blur-xl text-zinc-900 text-sm font-semibold rounded-xl hover:bg-white/90 transition-all border border-zinc-200 shadow-xs disabled:opacity-50 cursor-pointer"
                            >
                                <FiSave className="w-4 h-4" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
                            </button>
                        </div>
                    </form>
                </GlassCard>

                {/* Pratinjau Live Kop Surat Sekolah */}
                <GlassCard
                    header={
                        <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                            <FiHome className="w-4 h-4 text-zinc-700" />
                            Pratinjau Hasil Kop Surat Resmi Sekolah
                        </h3>
                    }
                >
                    <div className="p-4 bg-zinc-100/70 rounded-xl border border-zinc-200/80 overflow-x-auto">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 max-w-[800px] mx-auto pointer-events-none">
                            <HeaderKopSurat
                                school={{
                                    name: data.name || school?.name,
                                    address: data.address || school?.address,
                                    phone: data.phone || school?.phone,
                                    email: data.email || school?.email,
                                    logo_kop_path: previewLogo,
                                }}
                            />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Modal Kamera untuk Foto Langsung TTD & Cap */}
            <CameraCaptureModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
                title={cameraTarget === 'stamp' ? 'Foto Cap / Stempel Sekolah' : 'Foto Tanda Tangan Basah'}
            />

            {/* Modal Studio Ekstraksi Tanda Tangan */}
            <SignatureExtractorModal
                isOpen={isSigModalOpen}
                rawImageFile={rawSigFile}
                onClose={() => setIsSigModalOpen(false)}
                onSave={handleSignatureExtracted}
                headmasterName={data.headmaster_name || school?.headmaster_name}
                headmasterNip={data.headmaster_nip || school?.headmaster_nip}
                schoolTitle="Kepala Sekolah"
            />
        </OperatorLayout>
    );
}
