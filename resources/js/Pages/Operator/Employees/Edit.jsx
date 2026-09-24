import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import { Link } from '@inertiajs/react';
import { FiSave, FiX } from 'react-icons/fi';
import { useEmployeeForm } from '@/Hooks/useEmployeeForm';
import { useEmployeeAuthorization } from '@/Hooks/useEmployeeAuthorization';
import EmployeePersonalFields from './Partials/EmployeePersonalFields';
import EmployeeEmploymentFields from './Partials/EmployeeEmploymentFields';
import EmployeePhotoUpload from './Partials/EmployeePhotoUpload';
import EditAuthorizationGate from './Partials/EditAuthorizationGate';

/**
 * EmployeeEdit renders the employee edit form and authorization gate for operators.
 * Single Responsibility: UI view presentation with state delegated to custom hooks.
 */
export default function EmployeeEdit({ employee, editAuthorization = null }) {
    const { isAuthorized, authForm, handleAuthSubmit } = useEmployeeAuthorization(employee, editAuthorization);

    const {
        data,
        setData,
        errors,
        processing,
        submit,
        handleNipChange,
        handlePhotoChange,
    } = useEmployeeForm({
        employee,
        isEdit: true,
        role: 'operator',
    });

    return (
        <OperatorLayout>
            <PageHeader
                title="Edit Pegawai"
                subtitle="Perbarui data profil dan pasfoto kepegawaian."
            />

            <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
                {!isAuthorized ? (
                    <EditAuthorizationGate
                        employee={employee}
                        authForm={authForm}
                        onAuthSubmit={handleAuthSubmit}
                    />
                ) : (
                    <GlassCard>
                        <form onSubmit={submit} className="space-y-6">
                            <EmployeePhotoUpload
                                photo={data.photo}
                                currentPhotoPath={employee.photo_path}
                                onPhotoChange={handlePhotoChange}
                                error={errors.photo}
                            />

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

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <Link
                                    href={`/operator/employees/${employee.id}`}
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
                                    <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                )}
            </div>
        </OperatorLayout>
    );
}
