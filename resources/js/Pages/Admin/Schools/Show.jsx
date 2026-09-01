import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import ApplicationTable from '@/Components/Letter/ApplicationTable';
import { LogoSekolahDefault } from '@/Components/Letter/HeaderKopSurat';
import { Link } from '@inertiajs/react';
import { FiArrowLeft, FiHome, FiUser, FiPhone, FiMail, FiMapPin, FiAward } from 'react-icons/fi';

export default function SchoolsShow({ school }) {
    return (
        <AdminLayout>
            <PageHeader
                title={`Profil ${school.name}`}
                subtitle={`NPSN: ${school.npsn} • Jenjang ${school.jenjang} • Akreditasi ${school.status_akreditasi}`}
                action={
                    <Link
                        href="/admin/schools"
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar</span>
                    </Link>
                }
            />

            {/* School Details Card */}
            <GlassCard className="mb-8" header={<h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><FiHome className="w-4 h-4 text-blue-600" /> Profil & Detail Informasi Sekolah</h3>}>
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
                                <span className="font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                                    Jenjang {school.jenjang}
                                </span>
                                <span className="font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                                    Akreditasi {school.status_akreditasi}
                                </span>
                            </div>
                        </div>

                        {/* Detailed Grid Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Kepala Sekolah:</span>
                                <div className="flex items-start gap-2.5">
                                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                                        <FiUser className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm leading-snug">{school.headmaster_name || '-'}</p>
                                        <p className="text-slate-500 font-mono text-[11px] mt-0.5">NIP. {school.headmaster_nip || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Status Akreditasi:</span>
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                        <FiAward className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-950 text-sm">Peringkat Akreditasi {school.status_akreditasi}</p>
                                        <p className="text-slate-500 text-[11px]">Terverifikasi Disdik KBB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address & Contact Row */}
                        <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="md:col-span-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Alamat Lengkap Sekolah:</span>
                                <div className="flex items-start gap-2 text-slate-800">
                                    <FiMapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    <span className="font-medium leading-relaxed">{school.address || 'Alamat belum diisi'}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Kontak Resmi:</span>
                                <div className="space-y-1.5 text-slate-700">
                                    <div className="flex items-center gap-2">
                                        <FiPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="font-medium">{school.phone || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="font-medium">{school.email || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Operator Account List for this School */}
            <div className="mb-8">
                <GlassCard
                    header={<h3 className="font-bold text-slate-900 text-sm">Akun Operator Login ({school.users?.length || 0})</h3>}
                >
                    <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <th className="py-3 px-4">Nama Operator</th>
                                    <th className="py-3 px-4">Email Login</th>
                                    <th className="py-3 px-4">Role / Hak Akses</th>
                                    <th className="py-3 px-4">Tanggal Dibuat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {Array.isArray(school.users) && school.users.length > 0 ? (
                                    school.users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                                                <FiUser className="w-4 h-4 text-blue-600" />
                                                <span>{u.name}</span>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-700">{u.email}</td>
                                            <td className="py-3 px-4">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Operator Sekolah
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-500">
                                                {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-4 text-center text-slate-400 italic">
                                            Belum ada akun operator untuk sekolah ini. Klik tombol "Tambah Akun Operator" di atas untuk membuat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>

            {/* School Application History */}
            <GlassCard header={<h3 className="font-bold text-slate-900 text-sm">Riwayat Surat Dari Sekolah Ini</h3>}>
                <ApplicationTable applications={school.letter_applications || []} basePath="/admin/applications" />
            </GlassCard>
        </AdminLayout>
    );
}
