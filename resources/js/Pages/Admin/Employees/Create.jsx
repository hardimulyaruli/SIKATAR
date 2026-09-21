import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import { Link } from '@inertiajs/react';
import { FiSave, FiX } from 'react-icons/fi';
import { useEmployeeForm } from '@/Hooks/useEmployeeForm';
import EmployeePersonalFields from '@/Pages/Operator/Employees/Partials/EmployeePersonalFields';
import EmployeeEmploymentFields from '@/Pages/Operator/Employees/Partials/EmployeeEmploymentFields';

/**
 * EmployeeCreate renders the employee creation form for administrators.
 * Single Responsibility: UI view presentation with state delegated to useEmployeeForm.
 */
export default function EmployeeCreate({ schools = [] }) {
    const { data, setData, errors, processing, submit, handleNipChange } = useEmployeeForm({
        isEdit: false,
        role: 'admin',
    });

    return (
        <AdminLayout>
            <PageHeader
                title="Tambah Pegawai Baru"
                subtitle="Masukkan data profil kepegawaian baru ke dalam sistem."
            />

            <div className="max-w-3xl">
                <GlassCard>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <EmployeePersonalFields
                                data={data}
                                setData={setData}
                                errors={errors}
                                onNipChange={handleNipChange}
                            />
                            <EmployeeEmploymentFields
                                data={data}
                                setData={setData}
                                errors={errors}
                                schools={schools}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <Link
                                href="/admin/employees"
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                <FiX className="w-4 h-4" />
                                <span>Batal</span>
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                            >
                                <FiSave className="w-4 h-4" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Data Pegawai'}</span>
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </AdminLayout>
    );
}
