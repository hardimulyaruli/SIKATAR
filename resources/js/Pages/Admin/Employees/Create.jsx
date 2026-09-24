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

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                            <Link
                                href="/admin/employees"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/70 hover:bg-white text-zinc-900 rounded-xl text-xs font-bold transition-all border border-zinc-200/90 shadow-2xs backdrop-blur-xl active:scale-95 cursor-pointer"
                            >
                                <FiX className="w-4 h-4" />
                                <span>Batal</span>
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900/90 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm backdrop-blur-xl border border-zinc-800 active:scale-95 disabled:opacity-50 cursor-pointer"
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
