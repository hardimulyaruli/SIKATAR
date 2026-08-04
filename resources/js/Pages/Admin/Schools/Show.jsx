import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import ApplicationTable from '@/Components/Letter/ApplicationTable';
import HeaderKopSurat from '@/Components/Letter/HeaderKopSurat';
import { Link } from '@inertiajs/react';
import { FiArrowLeft, FiHome, FiUser, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* School Details */}
                <GlassCard className="lg:col-span-2" header={<h3 className="font-bold text-slate-900 text-sm">Informasi Detail Sekolah</h3>}>
                    <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-slate-500 font-semibold block mb-1 uppercase text-[10px]">Nama Kepala Sekolah:</span>
                                <span className="font-bold text-slate-900 text-sm">{school.headmaster_name || '-'}</span>
                                <span className="text-slate-400 block text-[11px]">NIP: {school.headmaster_nip || '-'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-semibold block mb-1 uppercase text-[10px]">Status Akreditasi:</span>
                                <span className="font-bold text-blue-900 text-sm">Akreditasi {school.status_akreditasi}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                            <span className="text-slate-500 font-semibold block mb-1 uppercase text-[10px]">Alamat Lengkap:</span>
                            <span className="text-slate-800 flex items-start gap-1">
                                <FiMapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <span>{school.address || '-'}</span>
                            </span>
                        </div>

                        <div className="border-t border-slate-100 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-slate-500 font-semibold block mb-1 uppercase text-[10px]">Telepon:</span>
                                <span className="text-slate-800 flex items-center gap-1">
                                    <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{school.phone || '-'}</span>
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-semibold block mb-1 uppercase text-[10px]">Email:</span>
                                <span className="text-slate-800 flex items-center gap-1">
                                    <FiMail className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{school.email || '-'}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Kop Surat Header Preview */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Format Kop Surat Sekolah:
                    </h3>
                    <div className="paper-texture p-4 rounded-2xl border border-slate-200 shadow-md bg-white">
                        <HeaderKopSurat school={school} />
                    </div>
                </div>
            </div>

            {/* School Application History */}
            <GlassCard header={<h3 className="font-bold text-slate-900 text-sm">Riwayat Surat Dari Sekolah Ini</h3>}>
                <ApplicationTable applications={school.letter_applications || []} basePath="/admin/applications" />
            </GlassCard>
        </AdminLayout>
    );
}
