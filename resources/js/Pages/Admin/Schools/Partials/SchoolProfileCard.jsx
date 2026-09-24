import React from 'react';
import GlassCard from '@/Components/UI/GlassCard';
import { LogoSekolahDefault } from '@/Components/Letter/HeaderKopSurat';
import { FiHome, FiUser, FiPhone, FiMail, FiMapPin, FiAward } from 'react-icons/fi';

/**
 * SchoolProfileCard renders comprehensive profile details of a school:
 * Official logo kop, accreditation level, headmaster info, address, and contacts.
 * Single Responsibility: Presenting detailed institutional information of a school.
 */
export default function SchoolProfileCard({ school }) {
    return (
        <GlassCard
            className="mb-8"
            header={
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FiHome className="w-4 h-4 text-zinc-900" />
                    Profil & Detail Informasi Sekolah
                </h3>
            }
        >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-3 text-xs">
                {/* Left: School Logo Badge */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50/90 border border-slate-200/90 rounded-2xl shrink-0 w-36 text-center shadow-xs">
                    <div className="w-28 h-28 flex items-center justify-center">
                        {school.logo_kop_path ? (
                            <img
                                src={school.logo_kop_path}
                                alt="Logo Sekolah"
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <LogoSekolahDefault schoolName={school.name} />
                        )}
                    </div>
                </div>

                {/* Right: School Main Profile Info */}
                <div className="flex-1 space-y-5 w-full">
                    {/* Title & Badges Header */}
                    <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                            {school.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono font-bold px-3 py-1 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
                                NPSN: {school.npsn}
                            </span>
                            <span className="font-bold px-3 py-1 bg-zinc-100 text-zinc-900 rounded-lg border border-zinc-300">
                                Jenjang {school.jenjang}
                            </span>
                            <span className="font-bold px-3 py-1 bg-zinc-900 text-white rounded-lg border border-zinc-900">
                                Akreditasi {school.status_akreditasi}
                            </span>
                        </div>
                    </div>

                    {/* Detailed Grid Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Kepala Sekolah:
                            </span>
                            <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                                    <FiUser className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm leading-snug">
                                        {school.headmaster_name || '-'}
                                    </p>
                                    <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                                        NIP. {school.headmaster_nip || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Status Akreditasi:
                            </span>
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200 shrink-0">
                                    <FiAward className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-950 text-sm">
                                        Peringkat Akreditasi {school.status_akreditasi}
                                    </p>
                                    <p className="text-slate-500 text-[11px]">Terverifikasi Disdik KBB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address & Contact Row */}
                    <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="md:col-span-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Alamat Lengkap Sekolah:
                            </span>
                            <div className="flex items-start gap-2 text-slate-800">
                                <FiMapPin className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                                <span className="font-medium leading-relaxed">
                                    {school.address || 'Alamat belum diisi'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Kontak Resmi:
                            </span>
                            <div className="space-y-1.5 text-slate-700">
                                <div className="flex items-center gap-2">
                                    <FiPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="font-medium">{school.phone || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="font-medium">
                                        {school.email ? school.email.replace(/^operator\./i, '') : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
