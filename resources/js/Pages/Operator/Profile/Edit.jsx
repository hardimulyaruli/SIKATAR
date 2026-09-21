import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import HeaderKopSurat from '@/Components/Letter/HeaderKopSurat';
import { Link } from '@inertiajs/react';
import { FiSave, FiHome, FiCheckCircle } from 'react-icons/fi';
import { useSchoolProfileForm } from '@/Hooks/useSchoolProfileForm';
import SignatureExtractorModal from '@/Components/Signature/SignatureExtractorModal';
import SchoolGeneralInfoForm from './Partials/SchoolGeneralInfoForm';
import SchoolHeadmasterForm from './Partials/SchoolHeadmasterForm';
import SchoolOfficialAssetsForm from './Partials/SchoolOfficialAssetsForm';

/**
 * ProfileEdit allows school operators to manage school general data, headmaster info,
 * and official assets (kop logo, transparent wet signature, and stamp).
 * Single Responsibility: UI view presentation with state delegated to useSchoolProfileForm.
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
        isExtractingSig,
        isExtractingStamp,
        handleNipChange,
        handleLogoChange,
        handleSignatureChange,
        handleSignatureExtracted,
        handleStampChange,
        submit,
    } = useSchoolProfileForm(school);

    return (
        <OperatorLayout>
            <PageHeader
                title="Profil Sekolah"
                subtitle="Kelola identitas resmi sekolah, nama Kepala Sekolah, NIP, serta logo sekolah."
                action={
                    <Link
                        href="/operator/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-semibold hover:bg-inverse-surface transition-colors shadow-xs"
                    >
                        <span>← Kembali ke Dashboard</span>
                    </Link>
                }
            />

            <div className="max-w-4xl space-y-6">
                <GlassCard header={<h3 className="font-bold text-slate-900 text-sm">Form Data Profil Sekolah</h3>}>
                    {recentlySuccessful && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Profil Sekolah dan Logo berhasil diperbarui!</span>
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
                            onSignatureChange={handleSignatureChange}
                            rawSigFile={rawSigFile}
                            onOpenSigModal={() => setIsSigModalOpen(true)}
                            isExtractingSig={isExtractingSig}
                            previewStamp={previewStamp}
                            onStampChange={handleStampChange}
                            isExtractingStamp={isExtractingStamp}
                            school={school}
                            errors={errors}
                        />

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <FiHome className="w-4 h-4 text-blue-600" />
                            Pratinjau Hasil Kop Surat Resmi Sekolah
                        </h3>
                    }
                >
                    <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200/80 overflow-x-auto">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-[800px] mx-auto pointer-events-none">
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

            {/* Modal Studio Ekstraksi Tanda Tangan */}
            <SignatureExtractorModal
                isOpen={isSigModalOpen}
                imageFile={rawSigFile}
                onClose={() => setIsSigModalOpen(false)}
                onSave={handleSignatureExtracted}
            />
        </OperatorLayout>
    );
}
