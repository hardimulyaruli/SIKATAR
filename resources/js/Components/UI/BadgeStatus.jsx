import React from 'react';
import Icon from '@/Components/UI/Icon';

export default function BadgeStatus({ status }) {
    switch (status) {
        case 'approved':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-zinc-900 text-white font-bold border border-zinc-900 shadow-2xs select-none cursor-default">
                    <Icon name="check_circle" className="text-xs text-white" fill={true} />
                    <span>Disetujui</span>
                </span>
            );
        case 'revision_requested':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-zinc-800 text-white font-bold border border-zinc-700 shadow-2xs select-none cursor-default">
                    <Icon name="edit" className="text-xs text-white" />
                    <span>Perlu Revisi</span>
                </span>
            );
        case 'under_review':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-zinc-200 text-zinc-900 font-bold border border-zinc-300 shadow-2xs select-none cursor-default">
                    <Icon name="visibility" className="text-xs text-zinc-900" />
                    <span>Dalam Pemeriksaan</span>
                </span>
            );
        case 'submitted':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-zinc-100 text-zinc-800 font-bold border border-zinc-200 select-none cursor-default">
                    <Icon name="schedule" className="text-xs text-zinc-700" />
                    <span>Diajukan</span>
                </span>
            );
        case 'rejected':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-zinc-200 text-zinc-950 font-bold border border-zinc-400 select-none cursor-default">
                    <Icon name="cancel" className="text-xs text-zinc-900" />
                    <span>Ditolak</span>
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-zinc-100 text-zinc-600 font-semibold border border-zinc-200 select-none cursor-default">
                    <Icon name="description" className="text-xs text-zinc-500" />
                    <span>Draft</span>
                </span>
            );
    }
}
