import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import ApplicationTable from '@/Components/Letter/ApplicationTable';
import { Link } from '@inertiajs/react';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';
import SchoolProfileCard from './Partials/SchoolProfileCard';
import SchoolOperatorAccountsTable from './Partials/SchoolOperatorAccountsTable';

export default function SchoolsShow({ school }) {
    return (
        <AdminLayout>
            <PageHeader
                title={`Profil ${school.name}`}
                subtitle={`NPSN: ${school.npsn} • Jenjang ${school.jenjang} • Akreditasi ${school.status_akreditasi}`}
                action={
                    <Link
                        href="/admin/schools"
                        className="px-4 py-2.5 bg-white/70 hover:bg-white text-zinc-900 text-xs font-bold rounded-xl backdrop-blur-xl border border-zinc-200/90 shadow-2xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar</span>
                    </Link>
                }
            />

            {/* School Details Card */}
            <SchoolProfileCard school={school} />

            {/* Operator Account List */}
            <SchoolOperatorAccountsTable users={school.users} />

            {/* Application History */}
            <GlassCard
                header={
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <FiFileText className="w-4 h-4 text-zinc-900" />
                        Riwayat Permohonan Surat Masuk ({school.letter_applications?.length || 0})
                    </h3>
                }
            >
                <ApplicationTable
                    applications={school.letter_applications || []}
                    basePath="/admin/applications"
                />
            </GlassCard>
        </AdminLayout>
    );
}
