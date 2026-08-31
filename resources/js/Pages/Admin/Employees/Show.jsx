import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import { Link, router } from '@inertiajs/react';
import { FiEdit2, FiArrowLeft, FiUser, FiBriefcase, FiFileText } from 'react-icons/fi';

export default function EmployeeShow({ employee }) {
    const [activeTab, setActiveTab] = useState('profil');

    return (
        <AdminLayout>
            <div className="mb-4">
                <Link
                    href="/admin/employees"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar Pegawai</span>
                </Link>
            </div>

            <PageHeader
                title={`Profil Pegawai: ${employee.name}`}
                subtitle={`NIP: ${employee.nip || '-'} | Sekolah: ${employee.school?.name || '-'}`}
            >
                <Link
                    href={`/admin/employees/${employee.id}/edit`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit Data</span>
                </Link>
            </PageHeader>

            <div className="flex border-b border-slate-200 mb-6">
                <button
                    onClick={() => setActiveTab('profil')}
                    className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                        activeTab === 'profil' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <FiUser className="w-4 h-4" /> Profil Utama
                </button>
                <button
                    onClick={() => setActiveTab('riwayat')}
                    className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                        activeTab === 'riwayat' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <FiBriefcase className="w-4 h-4" /> Riwayat Kepegawaian
                </button>
                <button
                    onClick={() => setActiveTab('dokumen')}
                    className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                        activeTab === 'dokumen' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <FiFileText className="w-4 h-4" /> Arsip Dokumen
                </button>
            </div>

            {activeTab === 'profil' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Informasi Pribadi</h3>
                        <dl className="space-y-3 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-semibold text-slate-500">Nama Lengkap</dt>
                                <dd className="col-span-2 text-slate-800 font-medium">{employee.name}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-semibold text-slate-500">NIP</dt>
                                <dd className="col-span-2 text-slate-800">{employee.nip || '-'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-semibold text-slate-500">Tempat, Tgl Lahir</dt>
                                <dd className="col-span-2 text-slate-800">
                                    {employee.place_of_birth || '-'}, {employee.date_of_birth || '-'}
                                </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-semibold text-slate-500">Alamat</dt>
                                <dd className="col-span-2 text-slate-800">{employee.address || '-'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-semibold text-slate-500">Kontak (HP)</dt>
                                <dd className="col-span-2 text-slate-800">{employee.contact || '-'}</dd>
                            </div>
                        </dl>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Informasi Kepegawaian</h3>
                        <dl className="space-y-3 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-semibold text-slate-500">Status Pegawai</dt>
                                <dd className="col-span-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                        {employee.status_pegawai}
                                    </span>
                                </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-semibold text-slate-500">Unit Kerja</dt>
                                <dd className="col-span-2 text-slate-800 font-medium">{employee.school?.name || '-'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-semibold text-slate-500">TMT CPNS</dt>
                                <dd className="col-span-2 text-slate-800">{employee.cpns_date || '-'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-semibold text-slate-500">TMT PNS</dt>
                                <dd className="col-span-2 text-slate-800">{employee.pns_date || '-'}</dd>
                            </div>
                        </dl>
                    </GlassCard>
                </div>
            )}

            {activeTab === 'riwayat' && (
                <GlassCard>
                    <p className="text-slate-500 italic text-sm text-center py-8">
                        Fitur pengelolaan riwayat jabatan, angka kredit, dan aset sedang dalam tahap pengembangan (Fase 1 lanjutan).
                    </p>
                </GlassCard>
            )}

            {activeTab === 'dokumen' && (
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Unggah Dokumen Baru</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                router.post(`/admin/employees/${employee.id}/documents`, formData, {
                                    onSuccess: () => e.target.reset(),
                                });
                            }}
                            className="flex flex-col md:flex-row gap-4 items-end"
                        >
                            <div className="flex-1 w-full space-y-1">
                                <label className="block text-sm font-semibold text-slate-700">Kategori Dokumen</label>
                                <select name="category" required className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                                    <option value="">-- Pilih Kategori --</option>
                                    <option value="SK CPNS">SK CPNS</option>
                                    <option value="SK PNS">SK PNS</option>
                                    <option value="SK Kenaikan Pangkat">SK Kenaikan Pangkat</option>
                                    <option value="SK Mutasi">SK Mutasi</option>
                                    <option value="Ijazah">Ijazah</option>
                                    <option value="Sertifikat">Sertifikat</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div className="flex-1 w-full space-y-1">
                                <label className="block text-sm font-semibold text-slate-700">File Dokumen</label>
                                <input type="file" name="document_file" required accept=".pdf,.jpg,.jpeg,.png" className="w-full rounded-xl border-slate-200 shadow-sm text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                                Unggah
                            </button>
                        </form>
                    </GlassCard>

                    <GlassCard className="p-0 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                                    <th className="py-3.5 px-4">Kategori</th>
                                    <th className="py-3.5 px-4">Nama File</th>
                                    <th className="py-3.5 px-4">Tanggal Unggah</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {!employee.documents || employee.documents.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-slate-500">Belum ada dokumen yang diunggah.</td>
                                    </tr>
                                ) : employee.documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-4 font-semibold text-slate-800">{doc.category}</td>
                                        <td className="py-3.5 px-4">
                                            <a href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                <FiFileText className="w-3.5 h-3.5" />
                                                <span className="truncate max-w-[200px] inline-block">{doc.file_name}</span>
                                            </a>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-600">{doc.upload_date}</td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Yakin ingin menghapus dokumen ini?')) {
                                                        router.delete(`/admin/employees/documents/${doc.id}`);
                                                    }
                                                }}
                                                className="text-rose-500 hover:text-rose-700 font-semibold"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </GlassCard>
                </div>
            )}

        </AdminLayout>
    );
}
