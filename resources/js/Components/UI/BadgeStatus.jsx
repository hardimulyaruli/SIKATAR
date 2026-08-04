import React from 'react';
import Icon from '@/Components/UI/Icon';

export default function BadgeStatus({ status }) {
    switch (status) {
        case 'approved':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-label-sm uppercase tracking-widest bg-primary text-on-primary font-semibold shadow-xs">
                    <Icon name="check_circle" className="text-xs text-on-primary" fill={true} />
                    <span>Disetujui</span>
                </span>
            );
        case 'revision_requested':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-label-sm uppercase tracking-widest bg-secondary-container text-on-secondary-container font-semibold">
                    <Icon name="edit" className="text-xs text-on-secondary-container" />
                    <span>Perlu Revisi</span>
                </span>
            );
        case 'under_review':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-label-sm uppercase tracking-widest bg-surface-container-highest text-primary font-semibold">
                    <Icon name="visibility" className="text-xs text-primary" />
                    <span>Dalam Pemeriksaan</span>
                </span>
            );
        case 'submitted':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-label-sm uppercase tracking-widest bg-surface-container-high text-primary font-semibold">
                    <Icon name="schedule" className="text-xs text-primary" />
                    <span>Diajukan</span>
                </span>
            );
        case 'rejected':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-label-sm uppercase tracking-widest bg-error-container text-on-error-container font-semibold">
                    <Icon name="cancel" className="text-xs text-on-error-container" />
                    <span>Ditolak</span>
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-label-sm uppercase tracking-widest bg-surface-container text-on-surface-variant font-semibold">
                    <Icon name="description" className="text-xs text-on-surface-variant" />
                    <span>Draft</span>
                </span>
            );
    }
}
