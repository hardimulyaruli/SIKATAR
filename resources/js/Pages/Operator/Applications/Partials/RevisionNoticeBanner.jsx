import React from 'react';
import Icon from '@/Components/UI/Icon';

/**
 * RevisionNoticeBanner displays revision feedback from Disdik administrators.
 * Single Responsibility: Presenting revision instructions to the school operator.
 */
export default function RevisionNoticeBanner({ adminNotes }) {
    return (
        <div className="mb-8 p-6 bg-error-container text-on-error-container rounded-DEFAULT border border-error/20 flex items-start gap-4 shadow-xs">
            <Icon name="warning" className="text-2xl text-error shrink-0 mt-0.5" />
            <div className="flex-1 font-body-md text-xs">
                <h4 className="font-headline-md text-xl font-normal mb-1">
                    Catatan Revisi Dari Admin Disdik:
                </h4>
                <p className="p-3 bg-surface-container-lowest/80 rounded-sm border border-outline/10 text-primary font-medium italic">
                    "{adminNotes || 'Mohon lengkapi dan perbaiki berkas pengajuan.'}"
                </p>
                <p className="mt-2 text-on-error-container/80">
                    Silakan lakukan perbaikan narasi/parameter di bawah ini dan klik <strong>"Kirim Ulang Perbaikan"</strong>.
                </p>
            </div>
        </div>
    );
}
