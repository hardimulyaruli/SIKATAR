import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import LiveLetterPreview from '@/Components/Letter/LiveLetterPreview';
import RevisionFeedbackModal from '@/Components/Letter/RevisionFeedbackModal';
import { Link } from '@inertiajs/react';
import { useApplicationDecision } from '@/Hooks/useApplicationDecision';
import AdminDecisionPanel from './Partials/AdminDecisionPanel';

/**
 * AdminApplicationShow displays letter details, verification status, and paper preview.
 * Single Responsibility: UI view presentation with decision state delegated to useApplicationDecision.
 */
export default function AdminApplicationShow({ application }) {
    const {
        modalOpen,
        modalInitialStatus,
        openActionModal,
        closeActionModal,
        handleUpdateStatus,
    } = useApplicationDecision(application);

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
                <div className="lg:col-span-5">
                    <AdminDecisionPanel
                        application={application}
                        onAction={openActionModal}
                    />
                </div>

                {/* Right Column: High Fidelity Paper Preview (7 Cols) */}
                <div className="lg:col-span-7 bg-surface-container-highest p-4 md:p-6 rounded-DEFAULT border border-outline/10 relative overflow-x-auto flex flex-col items-center justify-start min-h-[600px]">
                    <div className="w-full overflow-x-auto flex justify-start lg:justify-center py-2">
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
            </div>

            {/* Decision Status / Revision Notes Modal */}
            <RevisionFeedbackModal
                isOpen={modalOpen}
                onClose={closeActionModal}
                onSubmit={handleUpdateStatus}
                initialStatus={modalInitialStatus}
            />
        </AdminLayout>
    );
}
