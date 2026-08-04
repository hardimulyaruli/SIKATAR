import React from 'react';
import { Link } from '@inertiajs/react';
import BadgeStatus from '@/Components/UI/BadgeStatus';
import Icon from '@/Components/UI/Icon';

export default function ApplicationTable({ applications = [], basePath = '/operator/applications' }) {
    if (!applications || applications.length === 0) {
        return (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT">
                <Icon name="drafts" className="text-4xl text-outline mb-2" />
                <h4 className="font-headline-md text-primary text-lg">Belum Ada Pengajuan Surat</h4>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">Daftar permohonan surat akan ditampilkan di sini.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-body-md">
                <thead>
                    <tr className="border-b border-outline/20 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                        <th className="py-4 px-4 font-semibold">Ref Number / Date</th>
                        <th className="py-4 px-4 font-semibold">School Authority</th>
                        <th className="py-4 px-4 font-semibold">Directive Subject</th>
                        <th className="py-4 px-4 font-semibold">Status Verification</th>
                        <th className="py-4 px-4 text-right font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline/10 text-xs">
                    {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-surface-container-low/60 transition-colors group">
                            <td className="py-4 px-4">
                                <div className="font-mono font-semibold text-primary">{app.application_number}</div>
                                <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5 flex items-center gap-1">
                                    <Icon name="calendar_today" className="text-[12px]" />
                                    <span>{new Date(app.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                            </td>

                            <td className="py-4 px-4">
                                <div className="font-semibold text-primary flex items-center gap-1.5">
                                    <Icon name="school" className="text-secondary text-sm" />
                                    <span>{app.school?.name || 'Sekolah'}</span>
                                </div>
                                <div className="font-body-md text-[10px] text-on-surface-variant">NPSN: {app.school?.npsn}</div>
                            </td>

                            <td className="py-4 px-4 max-w-xs">
                                <div className="font-headline-md text-primary text-base font-normal line-clamp-1 group-hover:text-secondary transition-colors">{app.subject}</div>
                                <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider line-clamp-1">{app.letter_name}</div>
                            </td>

                            <td className="py-4 px-4">
                                <BadgeStatus status={app.status} />
                                {app.admin_notes && (
                                    <p className="text-[10px] text-error italic mt-1 line-clamp-1">
                                        Note: "{app.admin_notes}"
                                    </p>
                                )}
                            </td>

                            <td className="py-4 px-4 text-right">
                                <Link
                                    href={`${basePath}/${app.id}`}
                                    className="inline-flex items-center gap-1 font-label-sm text-xs text-primary uppercase tracking-widest hover:underline underline-offset-4 font-semibold"
                                >
                                    <span>Review</span>
                                    <Icon name="arrow_forward" className="text-xs" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
