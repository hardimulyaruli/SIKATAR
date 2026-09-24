import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import { Link } from '@inertiajs/react';
import { FiSave, FiX } from 'react-icons/fi';
import { useEmployeeForm } from '@/Hooks/useEmployeeForm';
import EmployeePersonalFields from './Partials/EmployeePersonalFields';
import EmployeeEmploymentFields from './Partials/EmployeeEmploymentFields';

/**
 * EmployeeCreate renders the employee creation form for school operators.
 * Single Responsibility: UI view presentation with state delegated to useEmployeeForm.
 */
export default function EmployeeCreate() {
    const { data, setData, errors, processing, submit, handleNipChange } = useEmployeeForm({
        isEdit: false,
        role: 'operator',
    });

    return (
        <OperatorLayout>
            <PageHeader
                title="Tambah Pegawai Baru"
                subtitle="Masukkan data profil kepegawaian baru ke dalam sistem."
            />

            <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
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
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                            <Link
                                href="/operator/employees"
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                            >
                                <FiX className="w-4 h-4" />
                                <span>Batal</span>
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/70 backdrop-blur-xl text-zinc-900 text-sm font-semibold rounded-xl hover:bg-white/90 transition-all border border-zinc-200 shadow-xs disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <FiSave className="w-4 h-4" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Data Pegawai'}</span>
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </OperatorLayout>
    );
}
