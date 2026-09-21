import React from 'react';
import Icon from '@/Components/UI/Icon';
import BadgeStatus from '@/Components/UI/BadgeStatus';

/**
 * ApplicationDetailForm renders application metadata and editing inputs for resubmitting revisions.
 * Single Responsibility: Presenting application details and capturing resubmission changes.
 */
export default function ApplicationDetailForm({
    application,
    data,
    setData,
    onCustomParamChange,
    onSubmit,
    processing,
    isEditing = false,
}) {
    return (
        <div className="bg-surface-container-lowest border border-outline/10 p-6 md:p-8 rounded-DEFAULT space-y-6 shadow-xs">
            <h3 className="font-headline-md text-primary text-2xl border-b border-outline/10 pb-3">
                Informasi Status
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
                        Nomor Pengajuan:
                    </span>
                    <span className="font-mono font-bold text-primary text-sm">
                        {application.application_number}
                    </span>
                </div>

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
            </div>

            {isEditing && (
                <form onSubmit={onSubmit} className="pt-4 border-t border-outline/10 space-y-4">
                    <h4 className="font-headline-md text-primary text-xl">Perbaikan Form Directive</h4>

                    <div>
                        <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                            Tanggal Surat Pengantar
                        </label>
                        <input
                            type="date"
                            value={data.form_data?.letter_date || ''}
                            onChange={(e) => onCustomParamChange('letter_date', e.target.value)}
                            className="editorial-input-line text-xs"
                        />
                    </div>

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
                        className="w-full py-3 px-4 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest font-semibold rounded-DEFAULT hover:bg-on-surface transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                        <Icon name="send" className="text-sm text-on-primary" />
                        <span>Kirim Ulang Perbaikan</span>
                    </button>
                </form>
            )}
        </div>
    );
}
