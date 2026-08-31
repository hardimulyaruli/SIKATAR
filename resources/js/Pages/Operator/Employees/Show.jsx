import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import EmployeeDetailTabs from '@/Components/UI/EmployeeDetailTabs';
import { Link, router } from '@inertiajs/react';
import { FiEdit2, FiArrowLeft } from 'react-icons/fi';

export default function EmployeeShow({ employee }) {
    const handleUploadDocument = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.post(`/operator/employees/${employee.id}/documents`, formData, {
            onSuccess: () => e.target.reset(),
        });
    };

    const handleDeleteDocument = (documentId) => {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
            router.delete(`/operator/employees/documents/${documentId}`);
        }
    };

    return (
        <OperatorLayout>
            <div className="mb-4">
                <Link
                    href="/operator/employees"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar Pegawai</span>
                </Link>
            </div>

            <PageHeader
                title={`Detail Kepegawaian: ${employee.name}`}
                subtitle={`NIP: ${employee.nip || '-'} | Unit Kerja: ${employee.school?.name || '-'}`}
            >
                <Link
                    href={`/operator/employees/${employee.id}/edit`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit Data Utama</span>
                </Link>
            </PageHeader>

            <EmployeeDetailTabs
                employee={employee}
                isAdmin={false}
                onUploadDocument={handleUploadDocument}
                onDeleteDocument={handleDeleteDocument}
            />
        </OperatorLayout>
    );
}
