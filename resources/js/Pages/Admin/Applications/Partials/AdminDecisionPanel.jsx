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
        <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/90 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm">
            <h3 className="font-bold text-zinc-950 text-xl border-b border-zinc-200/80 pb-3">
                Panel Keputusan Admin
            </h3>

            <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Status Verification:
                    </span>
                    <BadgeStatus status={application.status} />
                </div>

                <div className="border-b border-zinc-200/80 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                        Sekolah Pemohon:
                    </span>
                    <span className="font-bold text-zinc-950 text-lg block">
                        {application.school?.name}
                    </span>
                    <span className="text-zinc-500 text-[11px] font-medium">
                        NPSN: {application.school?.npsn} • Kepsek: {application.school?.headmaster_name || '-'}
                    </span>
                </div>

                <div className="border-b border-zinc-200/80 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                        Perihal Directive:
                    </span>
                    <span className="font-bold text-zinc-900">{application.subject}</span>
                </div>

                {application.admin_notes && (
                    <div className="p-4 bg-zinc-100/80 rounded-xl border border-zinc-200/90 text-zinc-900">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold block mb-1">
                            Catatan Disdik:
                        </span>
                        <p className="italic text-zinc-800">"{application.admin_notes}"</p>
                    </div>
                )}

                {application.official_letter_number && (
                    <div className="p-4 bg-zinc-100/90 rounded-xl border border-zinc-200/90 text-zinc-900">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold block mb-1">
                            Nomor Surat Resmi Terbit:
                        </span>
                        <p className="font-mono font-bold text-sm text-zinc-950">
                            {application.official_letter_number}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 border-t border-zinc-200/80 text-xs tracking-wider">
                    {application.status === 'approved' ? (
                        <div className="w-full py-3.5 px-4 bg-zinc-100/90 text-zinc-900 font-bold rounded-xl border border-zinc-300/80 backdrop-blur-xl shadow-2xs flex items-center justify-center gap-2 select-none">
                            <Icon name="verified" className="text-zinc-950 text-base" />
                            <span>Surat Telah Diterima & Disetujui</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => onAction('approved')}
                            className="w-full py-3.5 px-4 bg-zinc-900/90 hover:bg-black text-white font-bold rounded-xl border border-zinc-800 backdrop-blur-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Icon name="check_circle" className="text-white text-base" />
                            <span>Terima & Terbitkan No. Surat</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
