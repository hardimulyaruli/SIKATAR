import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import LiveLetterPreview from '@/Components/Letter/LiveLetterPreview';
import { getImageUrl } from '@/Components/Letter/HeaderKopSurat';
import SignatureSelectorSection from '@/Components/Signature/SignatureSelectorSection';
import StampSelectorSection from '@/Components/Signature/StampSelectorSection';
import SignatureExtractorModal from '@/Components/Signature/SignatureExtractorModal';
import CameraCaptureModal from '@/Components/Signature/CameraCaptureModal';
import { generateSchoolStampDataUrl } from '@/Utils/stampGenerator';
import { useApplicationCreate } from '@/Hooks/useApplicationCreate';
import ClassificationTemplatePicker from './Partials/ClassificationTemplatePicker';
import ApplicantsMultiInput from './Partials/ApplicantsMultiInput';

/**
 * ApplicationCreate renders the letter composing view and real-time live preview.
 * Single Responsibility: UI view presentation with state and logic delegated to useApplicationCreate.
 */
export default function ApplicationCreate({ school, templates = [], selectedTemplate: initialTpl, employees = [] }) {
    const {
        data,
        setData,
        processing,
        selectedTemplate,
        classificationCode,
        todayIsoDate,
        allAvailableTemplates,
        applicantsList,
        handleSelectTemplate,
        handleClassificationChange,
        handleCustomParamChange,
        updateApplicant,
        addApplicant,
        removeApplicant,
        handleSubmit,
        signatures,
    } = useApplicationCreate({ school, templates, initialTpl, employees });

    // Filter custom template fields excluding standardized applicant fields
    const EXCLUDED_KEYS = new Set([
        'nip', 'nama_pegawai', 'nama', 'pangkat_golongan', 'pangkat',
        'golongan', 'gol_asal', 'jabatan', 'jumlah_berkas', 'jumlah_orang',
    ]);
    const customFields = (selectedTemplate?.required_fields_json || []).filter(
        (key) => !EXCLUDED_KEYS.has(key)
    );

    return (
        <OperatorLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                {/* Left Side: Compose Form (6 Cols) */}
                <section className="lg:col-span-6 bg-surface-bright p-6 md:p-8 rounded-DEFAULT border border-outline/10 shadow-xs space-y-6">
                    <div>
                        <h2 className="font-headline-md text-primary text-3xl mb-1">Form Pengajuan Surat Pengantar</h2>
                        <p className="font-body-md text-xs text-on-surface-variant">
                            Isi kelengkapan berkas pengajuan surat resmi internal & verifikasi Disdik.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Template & Classification Selection */}
                        <ClassificationTemplatePicker
                            selectedTemplate={selectedTemplate}
                            allAvailableTemplates={allAvailableTemplates}
                            onSelectTemplate={handleSelectTemplate}
                            classificationCode={classificationCode}
                            onClassificationChange={handleClassificationChange}
                            letterDate={data.form_data?.letter_date}
                            onLetterDateChange={(dateVal) => {
                                setData('form_data', {
                                    ...data.form_data,
                                    letter_date: dateVal,
                                });
                            }}
                            todayIsoDate={todayIsoDate}
                        />

                        {/* 2. Recipient */}
                        <div className="relative">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                Tujuan Surat (Kepada Yth)
                            </label>
                            <input
                                type="text"
                                required
                                value={data.recipient}
                                onChange={(e) => setData('recipient', e.target.value)}
                                placeholder="Kepala Dinas Pendidikan Kabupaten Bandung Barat"
                                className="editorial-input-line"
                            />
                        </div>

                        {/* 3. Subject */}
                        <div className="relative">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                Subject Line / Perihal Surat
                            </label>
                            <input
                                type="text"
                                required
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="Perihal Surat Pengantar"
                                className="editorial-input-line"
                            />
                        </div>

                        {/* 4. Custom Parameters if defined by template */}
                        {customFields.length > 0 && (
                            <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/10 space-y-3 font-body-md text-xs">
                                <p className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                    Parameter Khusus Berkas Pengantar:
                                </p>
                                {customFields.map((fieldKey) => (
                                    <div key={fieldKey}>
                                        <label className="block font-semibold capitalize text-on-surface-variant text-xs mb-1">
                                            {fieldKey.replace(/_/g, ' ')}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.form_data[fieldKey] || ''}
                                            onChange={(e) => handleCustomParamChange(fieldKey, e.target.value)}
                                            placeholder={`Isi ${fieldKey.replace(/_/g, ' ')}`}
                                            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-sm text-xs text-primary"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 5. Dynamic Multi-Applicant Input */}
                        <ApplicantsMultiInput
                            applicantsList={applicantsList}
                            onAddApplicant={addApplicant}
                            onRemoveApplicant={removeApplicant}
                            onUpdateApplicant={updateApplicant}
                        />

                        {/* 6. Body Narration */}
                        <div className="relative">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                Narasi / Isi Pokok Surat Pengantar
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={data.body_content}
                                onChange={(e) => setData('body_content', e.target.value)}
                                placeholder="Tuliskan isi ringkas atau keterangan berkas..."
                                className="editorial-textarea"
                            />
                        </div>

                        {/* 7. Wet Signature Options */}
                        <SignatureSelectorSection
                            school={school}
                            signatureMode={signatures.signatureMode}
                            onModeChange={signatures.handleSignatureModeChange}
                            customPreview={signatures.customSigPreview}
                            onFileSelected={signatures.handleProcessFileAutomatically}
                            onOpenCamera={() => {
                                signatures.setCameraTarget('signature');
                                signatures.setIsCameraOpen(true);
                            }}
                            onOpenStudio={() => signatures.rawSigFile && signatures.setIsExtractorOpen(true)}
                            onResetCustom={signatures.handleResetCustomSignature}
                            isExtracting={signatures.isExtracting}
                        />

                        {/* 8. Official School Stamp Options */}
                        <StampSelectorSection
                            school={school}
                            stampMode={signatures.stampMode}
                            onModeChange={signatures.handleStampModeChange}
                            customStampPreview={signatures.customStampPreview}
                            onFileSelected={signatures.handleStampFileSelected}
                            onOpenCamera={() => {
                                signatures.setCameraTarget('stamp');
                                signatures.setIsCameraOpen(true);
                            }}
                            onResetCustom={signatures.handleResetCustomStamp}
                            isExtracting={signatures.isExtractingStamp}
                        />

                        {/* Submit Button */}
                        <div className="flex items-center gap-4 pt-4 border-t border-zinc-200/60">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex-1 inline-flex items-center justify-center py-3.5 px-6 bg-white/70 backdrop-blur-xl text-zinc-900 border border-zinc-200/90 rounded-2xl text-xs uppercase tracking-widest font-bold shadow-xs hover:bg-white/95 hover:border-zinc-300 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <span>Kirim Pengajuan Surat</span>
                            </button>
                        </div>
                    </form>
                </section>

                {/* Right Side: High Fidelity Live Paper Preview (6 Cols) */}
                <section className="lg:col-span-6 bg-surface-container-highest p-4 md:p-6 rounded-DEFAULT border border-outline/10 relative overflow-x-auto flex flex-col items-center justify-start min-h-[600px]">
                    <div className="absolute inset-0 opacity-30 pointer-events-none preview-atmospheric-pattern"></div>
                    <div className="w-full z-10 overflow-x-auto flex justify-center py-2">
                        <LiveLetterPreview
                            school={school}
                            letterName={data.letter_name}
                            applicationNumber="DRAFT-NEW"
                            subject={data.subject}
                            recipient={data.recipient}
                            bodyContent={data.body_content}
                            formData={data.form_data}
                            classificationCode={classificationCode}
                            status="draft"
                            customSignature={signatures.signatureMode === 'custom' ? signatures.customSigPreview : null}
                            customStamp={
                                signatures.stampMode === 'none'
                                    ? 'none'
                                    : signatures.stampMode === 'custom'
                                    ? signatures.customStampPreview
                                    : (school?.stamp_path
                                        ? getImageUrl(school.stamp_path)
                                        : generateSchoolStampDataUrl(school?.name || 'SD NEGERI 1 PADALARANG'))
                            }
                        />
                    </div>
                </section>
            </div>

            {/* Camera Photo Modal */}
            <CameraCaptureModal
                isOpen={signatures.isCameraOpen}
                onClose={() => signatures.setIsCameraOpen(false)}
                onCapture={signatures.handleCameraCapture}
                title={signatures.cameraTarget === 'stamp' ? 'Foto Cap / Stempel Sekolah' : 'Foto Tanda Tangan Basah'}
            />

            {/* Signature Transparent Processing Studio Modal */}
            <SignatureExtractorModal
                isOpen={signatures.isExtractorOpen}
                onClose={() => signatures.setIsExtractorOpen(false)}
                rawImageFile={signatures.rawSigFile}
                onSave={signatures.handleSaveCleanSignature}
                headmasterName={school?.headmaster_name}
                headmasterNip={school?.headmaster_nip}
                schoolTitle="Kepala Sekolah"
            />
        </OperatorLayout>
    );
}
