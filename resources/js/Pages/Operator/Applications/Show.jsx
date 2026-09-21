import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import LiveLetterPreview from '@/Components/Letter/LiveLetterPreview';
import { Link } from '@inertiajs/react';
import { useApplicationRevision } from '@/Hooks/useApplicationRevision';
import RevisionNoticeBanner from './Partials/RevisionNoticeBanner';
import ApplicationDetailForm from './Partials/ApplicationDetailForm';

/**
 * ApplicationShow displays letter details, revision notices, and live paper preview for operators.
 * Single Responsibility: UI view presentation with revision state delegated to useApplicationRevision.
 */
export default function ApplicationShow({ application, school }) {
    const {
        isRevision,
        isEditing,
        data,
        setData,
        processing,
        handleCustomParamChange,
        handleResubmit,
    } = useApplicationRevision(application);

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
                <RevisionNoticeBanner adminNotes={application.admin_notes} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
                {/* Left Side: Form Edit & Details (5 Cols) */}
                <div className="lg:col-span-5">
                    <ApplicationDetailForm
                        application={application}
                        data={data}
                        setData={setData}
                        onCustomParamChange={handleCustomParamChange}
                        onSubmit={handleResubmit}
                        processing={processing}
                        isEditing={isEditing}
                    />
                </div>

                {/* Right Side: High Fidelity Paper Preview (7 Cols) */}
                <div className="lg:col-span-7 bg-surface-container-highest p-4 md:p-6 rounded-DEFAULT border border-outline/10 relative overflow-x-auto flex flex-col items-center justify-start min-h-[600px]">
                    <div className="w-full overflow-x-auto flex justify-start lg:justify-center py-2">
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
            </div>
        </OperatorLayout>
    );
}
