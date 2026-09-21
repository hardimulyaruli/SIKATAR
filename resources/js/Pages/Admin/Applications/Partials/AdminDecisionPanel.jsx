import React from 'react';
import Icon from '@/Components/UI/Icon';
import BadgeStatus from '@/Components/UI/BadgeStatus';

/**
 * AdminDecisionPanel renders the administrative review card:
 * Current verification status, applicant school summary, subject, official letter number,
 * and review action buttons (Approve, Request Revision, Reject).
 * Single Responsibility: Presenting application verification controls and details.
 */
export default function AdminDecisionPanel({ application, onAction }) {
    return (
        <div className="bg-surface-container-lowest border border-outline/10 p-6 md:p-8 rounded-DEFAULT space-y-6 shadow-xs">
            <h3 className="font-headline-md text-primary text-2xl border-b border-outline/10 pb-3">
                Panel Keputusan Admin
            </h3>

            <div className="space-y-4 font-body-md text-xs">
                <div className="flex items-center justify-between border-b border-outline/10 pb-3">
                    <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                        Status Verification:
                    </span>
                    <BadgeStatus status={application.status} />
                </div>

                <div className="border-b border-outline/10 pb-3">
                    <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                        Sekolah Pemohon:
                    </span>
                    <span className="font-headline-md text-primary text-xl font-normal block">
                        {application.school?.name}
                    </span>
                    <span className="text-on-surface-variant text-[11px]">
                        NPSN: {application.school?.npsn} • Kepsek: {application.school?.headmaster_name || '-'}
                    </span>
                </div>

                <div className="border-b border-outline/10 pb-3">
                    <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                        Perihal Directive:
                    </span>
                    <span className="font-semibold text-primary">{application.subject}</span>
                </div>

                {application.admin_notes && (
                    <div className="p-4 bg-secondary-container/40 rounded-sm border border-outline/10 text-primary">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">
                            Catatan Disdik:
                        </span>
                        <p className="italic">"{application.admin_notes}"</p>
                    </div>
                )}

                {application.official_letter_number && (
                    <div className="p-4 bg-surface-container-high rounded-sm border border-outline/10 text-primary">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold block mb-1">
                            Nomor Surat Resmi Terbit:
                        </span>
                        <p className="font-mono font-bold text-sm">
                            {application.official_letter_number}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 border-t border-outline/10 space-y-3 font-label-sm text-xs uppercase tracking-widest">
                    <button
                        onClick={() => onAction('approved')}
                        className="w-full py-3 px-4 bg-primary text-on-primary font-semibold rounded-DEFAULT hover:bg-on-surface transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                        <Icon name="check_circle" className="text-on-primary text-sm" />
                        <span>Setujui & Terbitkan No. Surat</span>
                    </button>

                    <button
                        onClick={() => onAction('revision_requested')}
                        className="w-full py-3 px-4 bg-secondary-container text-on-secondary-container font-semibold rounded-DEFAULT hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Icon name="edit" className="text-sm" />
                        <span>Beri Catatan Revisi</span>
                    </button>

                    <button
                        onClick={() => onAction('rejected')}
                        className="w-full py-2.5 px-4 bg-error-container text-on-error-container font-semibold rounded-DEFAULT hover:bg-error/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Icon name="cancel" className="text-sm" />
                        <span>Tolak Application</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
