import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import { Link, router, useForm } from '@inertiajs/react';
import { FiUsers, FiEye, FiEdit2, FiTrash2, FiPlus, FiArchive, FiClock, FiFileText, FiUpload, FiAlertTriangle, FiX } from 'react-icons/fi';

export default function EmployeesIndex({ employees, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalEmployee, setDeleteModalEmployee] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        surat_perintah: null,
        reason: '',
    });

    const handleSearch = (val) => {
        setSearch(val);
        router.get('/operator/employees', { search: val }, { preserveState: true, replace: true });
    };

    const openDeleteModal = (emp) => {
        reset();
        setDeleteModalEmployee(emp);
    };

    const closeDeleteModal = () => {
        setDeleteModalEmployee(null);
        reset();
    };

    const handleDeleteSubmit = (e) => {
        e.preventDefault();
        if (!deleteModalEmployee) return;

        post(`/operator/employees/${deleteModalEmployee.id}/request-deletion`, {
            forceFormData: true,
            onSuccess: () => {
                closeDeleteModal();
            },
        });
    };

    return (
        <OperatorLayout>
            <PageHeader
                title="Data Kepegawaian Sekolah"
                subtitle="Kelola profil pegawai PNS, CPNS, PPPK, dan Honorer di lingkungan sekolah Anda."
            />

            <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
                <Link
                    href="/operator/employees-archived"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors border border-slate-300 shadow-xs"
                >
                    <FiArchive className="w-4 h-4 text-slate-600" />
                    <span>Lihat Arsip Pegawai</span>
                </Link>

                <Link
                    href="/operator/employees/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Tambah Pegawai Baru</span>
                </Link>
            </div>

            <GlassCard>
                <SearchFilter
                    search={search}
                    onSearchChange={handleSearch}
                    placeholder="Cari nama pegawai, NIP..."
                />

                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 mt-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                                <th className="py-3.5 px-4">Profil Pegawai</th>
                                <th className="py-3.5 px-4">Status Kepegawaian</th>
                                <th className="py-3.5 px-4">Status Penghapusan</th>
                                <th className="py-3.5 px-4">Kontak</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {employees.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">
                                        Data pegawai tidak ditemukan.
                                    </td>
                                </tr>
                            ) : employees.data.map((emp) => {
                                const hasPendingDelete = emp.deletion_requests && emp.deletion_requests.length > 0;

                                return (
                                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-4">
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                <FiUsers className="w-4 h-4 text-indigo-500 shrink-0" />
                                                <span>{emp.name}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">NIP: {emp.nip || '-'}</div>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                                emp.status_pegawai === 'PNS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                emp.status_pegawai === 'CPNS' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                emp.status_pegawai === 'PPPK' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                                {emp.status_pegawai}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            {hasPendingDelete ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                                    <FiClock className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
                                                    <span>Menunggu Persetujuan Hapus</span>
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-slate-400">Aktif</span>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div className="text-slate-600 line-clamp-1">{emp.contact || '-'}</div>
                                        </td>

                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/operator/employees/${emp.id}`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                                                    title="Detail"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/operator/employees/${emp.id}/edit`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Link>
                                                {hasPendingDelete ? (
                                                    <button
                                                        disabled
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                                                        title="Menunggu Persetujuan Hapus"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => openDeleteModal(emp)}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                                                        title="Ajukan Penghapusan"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <Pagination links={employees.links} />
            </GlassCard>

            {/* MODAL: Pengajuan Penghapusan Pegawai */}
            {deleteModalEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                                    <FiTrash2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base">Ajukan Penghapusan Pegawai</h3>
                                    <p className="text-xs text-slate-500">Kirim permohonan penghapusan ke Admin/Dinas</p>
                                </div>
                            </div>
                            <button
                                onClick={closeDeleteModal}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Notice */}
                        <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                            <FiAlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-800 leading-relaxed">
                                <span className="font-bold">Ketentuan Penghapusan:</span> Wajib menyertakan scan <strong>Surat Perintah dari Kepala Sekolah</strong>. Setelah disetujui, data pegawai akan dipindahkan ke <strong>Arsip Pegawai</strong> dan tidak hilang permanen.
                            </div>
                        </div>

                        {/* Employee Target Summary */}
                        <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <p className="text-slate-500 font-medium">Pegawai yang akan dihapus:</p>
                            <p className="font-bold text-slate-800 text-sm mt-0.5">{deleteModalEmployee.name}</p>
                            <p className="text-slate-500 font-mono mt-0.5">NIP: {deleteModalEmployee.nip || '-'}</p>
                            <p className="text-slate-600 mt-0.5">Status: {deleteModalEmployee.status_pegawai}</p>
                        </div>

                        <form onSubmit={handleDeleteSubmit} className="mt-5 space-y-4">
                            {/* Surat Perintah File Upload */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    <FiFileText className="inline w-3.5 h-3.5 mr-1 text-rose-500" />
                                    Surat Perintah Kepala Sekolah <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required
                                    onChange={(e) => setData('surat_perintah', e.target.files[0])}
                                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 border border-slate-200 rounded-xl p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">Format: PDF, JPG, PNG (Maks. 5MB)</p>
                                {errors.surat_perintah && <p className="text-xs text-rose-500 mt-1">{errors.surat_perintah}</p>}
                            </div>

                            {/* Reason Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Alasan Penghapusan Pegawai <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows="3"
                                    required
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    placeholder="Contoh: Pensiun per tanggal..., Mutasi ke sekolah lain, Mengundurkan diri, dsb."
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                                {errors.reason && <p className="text-xs text-rose-500 mt-1">{errors.reason}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs disabled:opacity-50"
                                >
                                    <FiUpload className="w-3.5 h-3.5" />
                                    <span>{processing ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </OperatorLayout>
    );
}
