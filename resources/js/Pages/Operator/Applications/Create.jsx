import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import LiveLetterPreview from '@/Components/Letter/LiveLetterPreview';
import { useForm } from '@inertiajs/react';
import { CLASSIFICATION_CODES } from '@/Utils/classificationCodes';

export default function ApplicationCreate({ school, templates = [], selectedTemplate: initialTpl }) {
    const safeTemplates = Array.isArray(templates) ? templates : [];
    const defaultTemplate = initialTpl || (safeTemplates.length > 0 ? safeTemplates[0] : null);
    const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);
    const [classificationCode, setClassificationCode] = useState(defaultTemplate?.classification_code || '800.1.3.2');

    const { data, setData, post, processing, errors } = useForm({
        template_code: defaultTemplate?.code || 'PENGANTAR-KENAIKAN-PANGKAT',
        letter_name: defaultTemplate?.name || 'Surat Pengantar',
        subject: defaultTemplate?.default_subject || '',
        recipient: 'Kepala Dinas Pendidikan Kabupaten Bandung Barat',
        body_content: defaultTemplate?.default_body_template || '',
        form_data: {},
    });

    const handleSelectTemplate = (tpl) => {
        if (!tpl) return;
        setSelectedTemplate(tpl);
        setClassificationCode(tpl.classification_code || '800.1.3.2');
        setData({
            ...data,
            template_code: tpl.code,
            letter_name: tpl.name,
            subject: tpl.default_subject || '',
            body_content: tpl.default_body_template || '',
            form_data: {},
        });
    };

    const handleCustomParamChange = (key, val) => {
        setData('form_data', {
            ...data.form_data,
            [key]: val,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/operator/applications');
    };

    return (
        <OperatorLayout>
            {/* Split Screen Compose & Real-Time High Fidelity Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                {/* Left Side: Compose Form (6 Cols - 50%) */}
                <section className="lg:col-span-6 bg-surface-bright p-6 md:p-8 rounded-DEFAULT border border-outline/10 shadow-xs space-y-6">
                    <div>
                        <h2 className="font-headline-md text-primary text-3xl mb-1">Form Pengajuan Surat Pengantar</h2>
                        <p className="font-body-md text-xs text-on-surface-variant">Isi kelengkapan berkas pengajuan surat resmi internal & verifikasi Disdik.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Jenis / Template Surat Selector (If templates available) */}
                        {safeTemplates.length > 0 && (
                            <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/20 space-y-2">
                                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                    Jenis / Template Surat Pengajuan
                                </label>
                                <select
                                    value={selectedTemplate?.code || ''}
                                    onChange={(e) => {
                                        const tpl = safeTemplates.find((t) => t.code === e.target.value);
                                        handleSelectTemplate(tpl);
                                    }}
                                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs font-semibold text-primary"
                                >
                                    {safeTemplates.map((tpl) => (
                                        <option key={tpl.code} value={tpl.code}>
                                            {tpl.name} ({tpl.category})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Kode Klasifikasi Selector */}
                        <div className="p-4 bg-secondary-container/30 rounded-DEFAULT border border-outline/20 space-y-2">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                Kode Klasifikasi Surat (Penomoran Resmi 2024)
                            </label>
                            <select
                                value={classificationCode}
                                onChange={(e) => setClassificationCode(e.target.value)}
                                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs font-mono font-bold text-primary"
                            >
                                {CLASSIFICATION_CODES.map((item) => (
                                    <option key={`${item.code}-${item.name}`} value={item.code}>
                                        {item.code} — {item.name} ({item.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Recipient */}
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

                        {/* Subject */}
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

                        {/* Custom Fields if required */}
                        {Array.isArray(selectedTemplate?.required_fields_json) && selectedTemplate.required_fields_json.length > 0 && (
                            <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/10 space-y-3 font-body-md text-xs">
                                <p className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                    Parameter Khusus Berkas Pengantar:
                                </p>
                                {selectedTemplate.required_fields_json.map((fieldKey) => (
                                    <div key={fieldKey}>
                                        <label className="block font-semibold capitalize text-on-surface-variant mb-1 text-xs">
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

                        {/* Body Text */}
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

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-4 border-t border-outline/10">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-sm text-xs uppercase tracking-widest hover:bg-on-surface transition-colors flex justify-center items-center gap-2 font-semibold shadow-xs disabled:opacity-50"
                            >
                                <span>Kirim Pengajuan Surat</span>
                                <Icon name="send" className="text-sm text-on-primary" />
                            </button>
                        </div>
                    </form>
                </section>

                {/* Right Side: High Fidelity Paper Preview (6 Cols - 50%) */}
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
                        />
                    </div>
                </section>
            </div>
        </OperatorLayout>
    );
}
