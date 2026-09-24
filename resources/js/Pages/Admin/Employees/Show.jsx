import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import EmployeeDetailTabs from '@/Components/UI/EmployeeDetailTabs';
import { Link, router, usePage } from '@inertiajs/react';
import { FiEdit2, FiArrowLeft } from 'react-icons/fi';

export default function EmployeeShow({ employee }) {
    const { auth } = usePage().props;
    const isStaffKepala = ['staff_kepala', 'admin'].includes(auth?.user?.role);

    const handleUploadDocument = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.post(`/admin/employees/${employee.id}/documents`, formData, {
            onSuccess: () => e.target.reset(),
        });
    };

    const handleDeleteDocument = (documentId) => {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
            router.delete(`/admin/employees/documents/${documentId}`);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-4">
                <Link
                    href="/admin/employees"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/70 hover:bg-white text-zinc-900 rounded-xl text-xs font-bold transition-all border border-zinc-200/90 shadow-2xs backdrop-blur-xl active:scale-95 cursor-pointer"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar Pegawai</span>
                </Link>
            </div>

            <PageHeader
                title={`Detail Kepegawaian: ${employee.name}`}
                subtitle={`NIP: ${employee.nip || '-'} | Sekolah: ${employee.school?.name || '-'}`}
            >
                {isStaffKepala && (
                    <Link
                        href={`/admin/employees/${employee.id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900/90 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm backdrop-blur-xl border border-zinc-800 active:scale-95 cursor-pointer"
                    >
                        <FiEdit2 className="w-4 h-4" />
                        <span>Edit Data Utama</span>
                    </Link>
                )}
            </PageHeader>

            <EmployeeDetailTabs
                employee={employee}
                isAdmin={true}
                canModify={isStaffKepala}
                onUploadDocument={isStaffKepala ? handleUploadDocument : null}
                onDeleteDocument={isStaffKepala ? handleDeleteDocument : null}
            />
        </AdminLayout>
    );
}
