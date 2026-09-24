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
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200/80 pb-6">
                <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                        Pemeriksaan Application #{application.application_number}
                    </p>
                    <h1 className="text-3xl md:text-4xl text-zinc-950 font-bold tracking-tight">
                        Verifikasi Surat Masuk
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/applications"
                        className="px-4 py-2 bg-white/70 hover:bg-zinc-900 text-zinc-900 hover:text-white text-xs font-bold rounded-xl border border-zinc-300/80 backdrop-blur-xl shadow-2xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
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
                <div className="lg:col-span-7 bg-zinc-100/60 p-4 md:p-6 rounded-2xl border border-zinc-200/90 relative overflow-x-auto flex flex-col items-center justify-start min-h-[600px]">
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
