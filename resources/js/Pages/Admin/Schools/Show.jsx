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
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
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
                        <FiFileText className="w-4 h-4 text-blue-600" />
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
