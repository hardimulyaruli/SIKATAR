import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import BadgeStatus from '@/Components/UI/BadgeStatus';
import LiveLetterPreview from '@/Components/Letter/LiveLetterPreview';
import RevisionFeedbackModal from '@/Components/Letter/RevisionFeedbackModal';
import { router, Link } from '@inertiajs/react';

export default function AdminApplicationShow({ application }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalInitialStatus, setModalInitialStatus] = useState('approved');

    const openActionModal = (targetStatus) => {
        setModalInitialStatus(targetStatus);
        setModalOpen(true);
    };

    const handleUpdateStatus = (data) => {
        router.patch(`/admin/applications/${application.id}/status`, data, {
            onSuccess: () => setModalOpen(false),
        });
    };

    return (
        <AdminLayout>
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline/10 pb-8">
                <div>
                    <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                        Pemeriksaan Application #{application.application_number}
                    </p>
                    <h1 className="font-headline-md text-3xl md:text-5xl text-primary font-normal">
                        Verifikasi Surat Masuk
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/applications"
                        className="px-4 py-2.5 bg-surface-container-high text-primary font-label-sm text-xs uppercase tracking-widest font-semibold rounded-DEFAULT hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                    >
                        <Icon name="arrow_back" className="text-sm" />
                        <span>Kembali</span>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
                {/* Left Column: Decision Panel (5 Cols) */}
                <div className="lg:col-span-5 bg-surface-container-lowest border border-outline/10 p-6 md:p-8 rounded-DEFAULT space-y-6 shadow-xs">
                    <h3 className="font-headline-md text-primary text-2xl border-b border-outline/10 pb-3">
                        Panel Keputusan Admin
                    </h3>

                    <div className="space-y-4 font-body-md text-xs">
                        <div className="flex items-center justify-between border-b border-outline/10 pb-3">
                            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">Status Verification:</span>
                            <BadgeStatus status={application.status} />
                        </div>

                        <div className="border-b border-outline/10 pb-3">
                            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">Sekolah Pemohon:</span>
                            <span className="font-headline-md text-primary text-xl font-normal block">{application.school?.name}</span>
                            <span className="text-on-surface-variant text-[11px]">NPSN: {application.school?.npsn} • Kepsek: {application.school?.headmaster_name || '-'}</span>
                        </div>

                        <div className="border-b border-outline/10 pb-3">
                            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">Perihal Directive:</span>
                            <span className="font-semibold text-primary">{application.subject}</span>
                        </div>

                        {application.admin_notes && (
                            <div className="p-4 bg-secondary-container/40 rounded-sm border border-outline/10 text-primary">
                                <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">Catatan Disdik:</span>
                                <p className="italic">"{application.admin_notes}"</p>
                            </div>
                        )}

                        {application.official_letter_number && (
                            <div className="p-4 bg-surface-container-high rounded-sm border border-outline/10 text-primary">
                                <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold block mb-1">Nomor Surat Resmi Terbit:</span>
                                <p className="font-mono font-bold text-sm">{application.official_letter_number}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-6 border-t border-outline/10 space-y-3 font-label-sm text-xs uppercase tracking-widest">
                            <button
                                onClick={() => openActionModal('approved')}
                                className="w-full py-3 px-4 bg-primary text-on-primary font-semibold rounded-DEFAULT hover:bg-on-surface transition-colors flex items-center justify-center gap-2 shadow-xs"
                            >
                                <Icon name="check_circle" className="text-on-primary text-sm" />
                                <span>Setujui & Terbitkan No. Surat</span>
                            </button>

                            <button
                                onClick={() => openActionModal('revision_requested')}
                                className="w-full py-3 px-4 bg-secondary-container text-on-secondary-container font-semibold rounded-DEFAULT hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-2"
                            >
                                <Icon name="edit" className="text-sm" />
                                <span>Beri Catatan Revisi</span>
                            </button>

                            <button
                                onClick={() => openActionModal('rejected')}
                                className="w-full py-2.5 px-4 bg-error-container text-on-error-container font-semibold rounded-DEFAULT hover:bg-error/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <Icon name="cancel" className="text-sm" />
                                <span>Tolak Application</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: High Fidelity Paper Preview (7 Cols) */}
                <div className="lg:col-span-7 bg-surface-container-highest p-6 md:p-8 rounded-DEFAULT border border-outline/10 relative overflow-hidden flex justify-center">
                    <LiveLetterPreview
                        school={application.school}
                        letterName={application.letter_name}
                        applicationNumber={application.application_number}
                        subject={application.subject}
                        recipient={application.recipient}
                        bodyContent={application.body_content}
                        formData={application.form_data_json || {}}
                        officialNumber={application.official_letter_number}
                        status={application.status}
                    />
                </div>
            </div>

            {/* Modal */}
            <RevisionFeedbackModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleUpdateStatus}
                initialStatus={modalInitialStatus}
            />
        </AdminLayout>
    );
}
