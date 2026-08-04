import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import BadgeStatus from '@/Components/UI/BadgeStatus';
import LiveLetterPreview from '@/Components/Letter/LiveLetterPreview';
import { useForm, Link } from '@inertiajs/react';

export default function ApplicationShow({ application, school }) {
    const isRevision = application.status === 'revision_requested';
    const [isEditing, setIsEditing] = useState(isRevision);

    const { data, setData, put, processing } = useForm({
        subject: application.subject,
        recipient: application.recipient,
        body_content: application.body_content,
        form_data: application.form_data_json || {},
    });

    const handleCustomParamChange = (key, val) => {
        setData('form_data', {
            ...data.form_data,
            [key]: val,
        });
    };

    const handleResubmit = (e) => {
        e.preventDefault();
        put(`/operator/applications/${application.id}`);
    };

    return (
        <OperatorLayout>
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline/10 pb-8">
                <div>
                    <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                        Application #{application.application_number}
                    </p>
                    <h1 className="font-headline-md text-3xl md:text-5xl text-primary font-normal">
                        Detail & Status Surat
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/operator/applications"
                        className="px-4 py-2.5 bg-surface-container-high text-primary font-label-sm text-xs uppercase tracking-widest font-semibold rounded-DEFAULT hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                    >
                        <Icon name="arrow_back" className="text-sm" />
                        <span>Kembali ke Archive</span>
                    </Link>
                </div>
            </header>

            {/* Revision Banner */}
            {isRevision && (
                <div className="mb-8 p-6 bg-error-container text-on-error-container rounded-DEFAULT border border-error/20 flex items-start gap-4 shadow-xs">
                    <Icon name="warning" className="text-2xl text-error shrink-0 mt-0.5" />
                    <div className="flex-1 font-body-md text-xs">
                        <h4 className="font-headline-md text-xl font-normal mb-1">Catatan Revisi Dari Admin Disdik:</h4>
                        <p className="p-3 bg-surface-container-lowest/80 rounded-sm border border-outline/10 text-primary font-medium italic">
                            "{application.admin_notes || 'Mohon lengkapi dan perbaiki berkas pengajuan.'}"
                        </p>
                        <p className="mt-2 text-on-error-container/80">
                            Silakan lakukan perbaikan narasi/parameter di bawah ini dan klik <strong>"Kirim Ulang Perbaikan"</strong>.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
                {/* Left Side: Form Edit & Details (5 Cols) */}
                <div className="lg:col-span-5 bg-surface-container-lowest border border-outline/10 p-6 md:p-8 rounded-DEFAULT space-y-6 shadow-xs">
                    <h3 className="font-headline-md text-primary text-2xl border-b border-outline/10 pb-3">
                        Informasi Status
                    </h3>

                    <div className="space-y-4 font-body-md text-xs">
                        <div className="flex items-center justify-between border-b border-outline/10 pb-3">
                            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">Status Verification:</span>
                            <BadgeStatus status={application.status} />
                        </div>

                        <div className="border-b border-outline/10 pb-3">
                            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">Nomor Pengajuan:</span>
                            <span className="font-mono font-bold text-primary text-sm">{application.application_number}</span>
                        </div>

                        {application.official_letter_number && (
                            <div className="p-4 bg-surface-container-high rounded-sm border border-outline/10 text-primary">
                                <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold block mb-1">Nomor Surat Resmi Terbit:</span>
                                <p className="font-mono font-bold text-sm">{application.official_letter_number}</p>
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <form onSubmit={handleResubmit} className="pt-4 border-t border-outline/10 space-y-4">
                            <h4 className="font-headline-md text-primary text-xl">Perbaikan Form Directive</h4>

                            <div>
                                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                    Recipient Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.recipient}
                                    onChange={(e) => setData('recipient', e.target.value)}
                                    className="editorial-input-line text-xs"
                                />
                            </div>

                            <div>
                                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                    Subject Line
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    className="editorial-input-line text-xs"
                                />
                            </div>

                            <div>
                                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                    Body Content
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={data.body_content}
                                    onChange={(e) => setData('body_content', e.target.value)}
                                    className="editorial-textarea text-xs"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest font-semibold rounded-DEFAULT hover:bg-on-surface transition-colors flex items-center justify-center gap-2 shadow-xs"
                            >
                                <Icon name="send" className="text-sm text-on-primary" />
                                <span>Kirim Ulang Perbaikan</span>
                            </button>
                        </form>
                    )}
                </div>

                {/* Right Side: High Fidelity Paper Preview (7 Cols) */}
                <div className="lg:col-span-7 bg-surface-container-highest p-6 md:p-8 rounded-DEFAULT border border-outline/10 relative overflow-hidden flex justify-center">
                    <LiveLetterPreview
                        school={school}
                        letterName={application.letter_name}
                        applicationNumber={application.application_number}
                        subject={data.subject}
                        recipient={data.recipient}
                        bodyContent={data.body_content}
                        formData={data.form_data}
                        officialNumber={application.official_letter_number}
                        status={application.status}
                    />
                </div>
            </div>
        </OperatorLayout>
    );
}
