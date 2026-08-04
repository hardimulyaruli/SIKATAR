import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import LetterTypeSelector from '@/Components/Letter/LetterTypeSelector';
import LiveLetterPreview from '@/Components/Letter/LiveLetterPreview';
import { useForm } from '@inertiajs/react';

export default function ApplicationCreate({ school, templates = [], selectedTemplate: initialTpl }) {
    const safeTemplates = Array.isArray(templates) ? templates : [];
    const defaultTemplate = initialTpl || (safeTemplates.length > 0 ? safeTemplates[0] : null);
    const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);

    const { data, setData, post, processing, errors } = useForm({
        template_code: defaultTemplate?.code || 'REK-IZIN-OPS',
        letter_name: defaultTemplate?.name || 'Surat Permohonan',
        subject: defaultTemplate?.default_subject || '',
        recipient: 'Kepala Dinas Pendidikan Kabupaten Bandung Barat',
        body_content: defaultTemplate?.default_body_template || '',
        form_data: {},
    });

    const handleSelectTemplate = (tpl) => {
        if (!tpl) return;
        setSelectedTemplate(tpl);
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
            <div className="mb-6">
                <LetterTypeSelector
                    templates={safeTemplates}
                    selectedCode={selectedTemplate?.code}
                    onSelect={handleSelectTemplate}
                />
            </div>

            {/* Split Screen Compose & Real-Time High Fidelity Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Compose Form (6 Cols) */}
                <section className="lg:col-span-6 bg-surface-bright p-6 md:p-8 rounded-DEFAULT border border-outline/10 shadow-xs space-y-6">
                    <div>
                        <h2 className="font-headline-md text-primary text-3xl mb-1">Compose Directive</h2>
                        <p className="font-body-md text-xs text-on-surface-variant">Drafting official correspondence for the internal record.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Recipient */}
                        <div className="relative">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                Recipient Name or Department
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
                                placeholder="Subject Line"
                                className="editorial-input-line"
                            />
                        </div>

                        {/* Custom Fields if required */}
                        {Array.isArray(selectedTemplate?.required_fields_json) && selectedTemplate.required_fields_json.length > 0 && (
                            <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/10 space-y-3 font-body-md text-xs">
                                <p className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                    Template Parameters:
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
                                Body Content / Narasi Surat
                            </label>
                            <textarea
                                required
                                rows={7}
                                value={data.body_content}
                                onChange={(e) => setData('body_content', e.target.value)}
                                placeholder="Enter the body of the directive here..."
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
                                <span>Issue Directive (Kirim Surat)</span>
                                <Icon name="send" className="text-sm text-on-primary" />
                            </button>
                        </div>
                    </form>
                </section>

                {/* Right Side: High Fidelity Paper Preview (6 Cols) */}
                <section className="lg:col-span-6 bg-surface-container-highest p-6 md:p-8 rounded-DEFAULT border border-outline/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[600px]">
                    <div className="absolute inset-0 opacity-30 pointer-events-none preview-atmospheric-pattern"></div>
                    <div className="w-full max-w-lg z-10">
                        <LiveLetterPreview
                            school={school}
                            letterName={data.letter_name}
                            applicationNumber="DRAFT-NEW"
                            subject={data.subject}
                            recipient={data.recipient}
                            bodyContent={data.body_content}
                            formData={data.form_data}
                            status="draft"
                        />
                    </div>
                </section>
            </div>
        </OperatorLayout>
    );
}
