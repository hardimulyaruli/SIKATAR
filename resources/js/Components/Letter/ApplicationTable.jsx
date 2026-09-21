import React from 'react';
import { Link } from '@inertiajs/react';
import BadgeStatus from '@/Components/UI/BadgeStatus';
import Icon from '@/Components/UI/Icon';

export default function ApplicationTable({ applications = [], basePath = '/operator/applications', isLoading = false }) {
    if (!applications || applications.length === 0) {
        if (isLoading) {
            return (
                <div className="text-center py-16 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT flex flex-col items-center justify-center gap-3">
                    <Icon name="progress_activity" className="text-3xl text-primary animate-spin" />
                    <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">Memuat permohonan surat...</p>
                </div>
            );
        }
        return (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline/10 rounded-DEFAULT">
                <Icon name="drafts" className="text-4xl text-outline mb-2" />
                <h4 className="font-headline-md text-primary text-lg">Belum Ada Pengajuan Surat</h4>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">Daftar permohonan surat akan ditampilkan di sini.</p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 z-30 bg-surface/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 transition-all duration-200">
                    <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface-container-lowest shadow-xl border border-outline/10 gap-3 animate-in fade-in zoom-in-95 duration-150">
                        <div className="relative flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full border-[3.5px] border-primary/20 border-t-primary border-r-primary/80 animate-spin"></div>
                            <div className="absolute w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                        </div>
                        <span className="font-label-sm text-xs font-bold text-primary tracking-wide">Memuat data permohonan...</span>
                    </div>
                </div>
            )}
            <div className={`overflow-x-auto transition-opacity duration-200 ${isLoading ? 'opacity-40 select-none pointer-events-none' : 'opacity-100'}`}>
                <table className="w-full text-left border-collapse font-body-md">
                <thead>
                    <tr className="border-b border-outline/20 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                        <th className="py-4 px-4 font-semibold w-[20%]">Ref Number / Date</th>
                        <th className="py-4 px-4 font-semibold w-[22%]">School Authority</th>
                        <th className="py-4 px-4 font-semibold w-[38%]">Directive Subject</th>
                        <th className="py-4 px-4 font-semibold w-[12%]">Status Verification</th>
                        <th className="py-4 px-4 text-right font-semibold w-[8%]">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline/10 text-xs">
                    {applications.map((app) => {
                        const formData = app.form_data_json || {};
                        const applicants = Array.isArray(formData.applicants) && formData.applicants.length > 0
                            ? formData.applicants
                            : (formData.nama_pegawai ? [{ nama: formData.nama_pegawai, nip: formData.nip }] : []);
                        const firstApp = applicants[0];
                        const appCount = applicants.length || parseInt(formData.jumlah_berkas, 10) || 1;

                        return (
                            <tr key={app.id} className="hover:bg-surface-container-low/60 transition-colors group">
                                <td className="py-4 px-4 align-top">
                                    <div className="font-mono font-semibold text-primary">{app.application_number}</div>
                                    <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mt-1 flex items-center gap-1">
                                        <Icon name="calendar_today" className="text-[12px]" />
                                        <span>{new Date(app.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </td>

                                <td className="py-4 px-4 align-top">
                                    <div className="font-semibold text-primary flex items-center gap-1.5 leading-snug">
                                        <Icon name="school" className="text-secondary text-sm shrink-0" />
                                        <span>{app.school?.name || 'Sekolah'}</span>
                                    </div>
                                    <div className="font-body-md text-[10px] text-on-surface-variant mt-0.5">NPSN: {app.school?.npsn}</div>
                                </td>

                                <td className="py-4 px-4 align-top min-w-[280px]">
                                    {/* Main Subject / Perihal Line - Full & Clear */}
                                    <div className="font-bold text-primary text-sm leading-snug group-hover:text-secondary transition-colors whitespace-normal break-words">
                                        {app.subject}
                                    </div>

                                    {/* Subtitle / Jenis Template Surat - Clear & Full */}
                                    <div className="mt-1 font-semibold text-[11px] text-slate-600 uppercase tracking-wide leading-normal whitespace-normal break-words">
                                        {app.letter_name}
                                    </div>

                                    {/* Applicant Details Summary if available */}
                                    {firstApp?.nama && (
                                        <div className="mt-1.5 text-[11px] text-blue-900 bg-blue-50/80 px-2 py-1 rounded border border-blue-100 leading-tight inline-block">
                                            <span className="font-bold">Pemohon:</span> {firstApp.nama}
                                            {firstApp.nip ? <span className="font-mono text-[10px] text-slate-600 ml-1">({firstApp.nip})</span> : ''}
                                            {appCount > 1 ? <span className="font-bold text-blue-700 ml-1">cs {appCount} Orang</span> : ''}
                                        </div>
                                    )}
                                </td>

                                <td className="py-4 px-4 align-top">
                                    <BadgeStatus status={app.status} />
                                    {app.admin_notes && (
                                        <p className="text-[11px] text-error font-medium italic mt-1.5 leading-tight whitespace-normal break-words">
                                            Note: "{app.admin_notes}"
                                        </p>
                                    )}
                                </td>

                                <td className="py-4 px-4 text-right align-top">
                                    <Link
                                        href={`${basePath}/${app.id}`}
                                        className="inline-flex items-center gap-1 font-label-sm text-xs text-primary uppercase tracking-widest hover:underline underline-offset-4 font-semibold"
                                    >
                                        <span>Review</span>
                                        <Icon name="arrow_forward" className="text-xs" />
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
        </div>
    );
}
