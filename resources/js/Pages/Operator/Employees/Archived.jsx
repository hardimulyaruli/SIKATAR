import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import { Link, router } from '@inertiajs/react';
import { FiUsers, FiArchive, FiArrowLeft, FiFileText, FiCalendar, FiExternalLink, FiInfo } from 'react-icons/fi';
import { getImageUrl } from '@/Utils/url';

export default function EmployeesArchived({ employees, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (val) => {
        setSearch(val);
        router.get('/operator/employees-archived', { search: val }, { preserveState: true, replace: true });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <OperatorLayout>
            <PageHeader
                title="Arsip Pegawai Sekolah"
                subtitle="Daftar pegawai yang telah dinonaktifkan/dihapus dengan otorisasi resmi Surat Perintah Kepala Sekolah."
            />

            <div className="mb-6 flex justify-start">
                <Link
                    href="/operator/employees"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors border border-slate-200 shadow-xs"
                >
                    <FiArrowLeft className="w-4 h-4 text-slate-500" />
                    <span>Kembali ke Data Pegawai Aktif</span>
                </Link>
            </div>

            <GlassCard>
                <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <FiInfo className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                        Data pegawai di halaman ini adalah data yang telah diarsipkan setelah melalui proses persetujuan penghapusan. 
                        Data riwayat dan dokumen pegawai tetap tersimpan secara aman di dalam arsip dan tidak terhapus permanen dari sistem.
                    </div>
                </div>

                <SearchFilter
                    search={search}
                    onSearchChange={handleSearch}
                    placeholder="Cari nama pegawai yang diarsip, NIP..."
                />

                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 mt-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                                <th className="py-3.5 px-4">Profil Pegawai</th>
                                <th className="py-3.5 px-4">Status Kepegawaian</th>
                                <th className="py-3.5 px-4">Tanggal Diarsipkan</th>
                                <th className="py-3.5 px-4">Alasan Diarsipkan</th>
                                <th className="py-3.5 px-4 text-right">Surat Perintah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {employees.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">
                                        Tidak ada data pegawai yang diarsipkan.
                                    </td>
                                </tr>
                            ) : employees.data.map((emp) => {
                                const approvedRequest = emp.deletion_requests?.find(r => r.status === 'approved') || emp.deletion_requests?.[0];

                                return (
                                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-4">
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                <FiArchive className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span>{emp.name}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">NIP: {emp.nip || '-'}</div>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                {emp.status_pegawai}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4 text-slate-600">
                                            <div className="flex items-center gap-1.5 font-medium text-[11px]">
                                                <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{formatDate(emp.deleted_at)}</span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div className="text-slate-700 font-medium max-w-md line-clamp-2">
                                                {emp.archived_reason || approvedRequest?.reason || '-'}
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4 text-right">
                                            {approvedRequest?.document_path ? (
                                                <a
                                                    href={getImageUrl(approvedRequest.document_path)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-xs font-semibold"
                                                    title="Lihat Surat Perintah Kepala Sekolah"
                                                >
                                                    <FiFileText className="w-3.5 h-3.5" />
                                                    <span>Surat Perintah</span>
                                                    <FiExternalLink className="w-3 h-3 ml-0.5" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 text-[11px] italic">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <Pagination links={employees.links} />
            </GlassCard>
        </OperatorLayout>
    );
}
