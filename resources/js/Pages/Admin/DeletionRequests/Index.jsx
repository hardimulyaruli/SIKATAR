import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import { router, useForm } from '@inertiajs/react';
import { FiCheck, FiX, FiFileText, FiExternalLink, FiClock, FiCheckCircle, FiXCircle, FiHome, FiUser, FiAlertCircle } from 'react-icons/fi';
import { getImageUrl } from '@/Utils/url';

export default function DeletionRequestsIndex({ requests, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    
    // Modals
    const [approveModalReq, setApproveModalReq] = useState(null);
    const [rejectModalReq, setRejectModalReq] = useState(null);

    const approveForm = useForm({
        admin_notes: '',
    });

    const rejectForm = useForm({
        admin_notes: '',
    });

    const handleSearch = (val) => {
        setSearch(val);
        router.get('/admin/deletion-requests', { search: val, status }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (val) => {
        setStatus(val);
        router.get('/admin/deletion-requests', { search, status: val }, { preserveState: true, replace: true });
    };

    const statusOptions = [
        { label: 'Semua Status', value: '' },
        { label: 'Menunggu Persetujuan', value: 'pending' },
        { label: 'Disetujui (Diarsipkan)', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
    ];

    const handleApproveSubmit = (e) => {
        e.preventDefault();
        if (!approveModalReq) return;

        approveForm.patch(`/admin/deletion-requests/${approveModalReq.id}/approve`, {
            onSuccess: () => {
                setApproveModalReq(null);
                approveForm.reset();
            },
        });
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!rejectModalReq) return;

        rejectForm.patch(`/admin/deletion-requests/${rejectModalReq.id}/reject`, {
            onSuccess: () => {
                setRejectModalReq(null);
                rejectForm.reset();
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AdminLayout>
            <PageHeader
                title="Persetujuan Penghapusan & Arsip Pegawai"
                subtitle="Verifikasi dan tindak lanjuti permohonan penghapusan pegawai dari sekolah-sekolah di lingkungan Disdik KBB."
            />

            <GlassCard>
                <SearchFilter
                    search={search}
                    onSearchChange={handleSearch}
                    filter={status}
                    onFilterChange={handleStatusFilter}
                    filterOptions={statusOptions}
                    placeholder="Cari nama pegawai, NIP, atau nama sekolah..."
                />

                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 mt-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                                <th className="py-3.5 px-4">Sekolah & Pengaju</th>
                                <th className="py-3.5 px-4">Data Pegawai</th>
                                <th className="py-3.5 px-4">Surat Perintah KS</th>
                                <th className="py-3.5 px-4">Alasan Penghapusan</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {requests.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-slate-500">
                                        Tidak ada permohonan penghapusan pegawai.
                                    </td>
                                </tr>
                            ) : requests.data.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-2 font-bold text-slate-900">
                                            <FiHome className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span>{req.school?.name || 'Sekolah'}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">
                                            Pengaju: {req.user?.name || '-'}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                            {formatDate(req.created_at)}
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                            <FiUser className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                            <span>{req.employee?.name || 'Pegawai'}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                            NIP: {req.employee?.nip || '-'}
                                        </div>
                                        <div className="mt-1">
                                            <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700">
                                                {req.employee?.status_pegawai || 'PNS'}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        {req.document_path ? (
                                            <a
                                                href={getImageUrl(req.document_path)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium border border-blue-200/60"
                                            >
                                                <FiFileText className="w-3.5 h-3.5" />
                                                <span className="line-clamp-1 max-w-[120px]">{req.document_name || 'Surat Perintah'}</span>
                                                <FiExternalLink className="w-3 h-3 shrink-0" />
                                            </a>
                                        ) : (
                                            <span className="text-slate-400 italic">-</span>
                                        )}
                                    </td>

                                    <td className="py-3.5 px-4 max-w-xs">
                                        <p className="text-slate-700 line-clamp-3 leading-relaxed">
                                            {req.reason}
                                        </p>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        {req.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                <FiClock className="w-3.5 h-3.5" />
                                                <span>Menunggu</span>
                                            </span>
                                        )}
                                        {req.status === 'approved' && (
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <FiCheckCircle className="w-3.5 h-3.5" />
                                                    <span>Diarsipkan</span>
                                                </span>
                                                {req.reviewed_at && (
                                                    <div className="text-[10px] text-slate-400 mt-1">
                                                        {formatDate(req.reviewed_at)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {req.status === 'rejected' && (
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                    <FiXCircle className="w-3.5 h-3.5" />
                                                    <span>Ditolak</span>
                                                </span>
                                                {req.admin_notes && (
                                                    <p className="text-[10px] text-rose-600 mt-1 line-clamp-2 italic" title={req.admin_notes}>
                                                        Alasan: {req.admin_notes}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        {req.status === 'pending' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setApproveModalReq(req)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors text-xs shadow-xs"
                                                    title="Setujui & Arsipkan Pegawai"
                                                >
                                                    <FiCheck className="w-3.5 h-3.5" />
                                                    <span>Setujui</span>
                                                </button>
                                                <button
                                                    onClick={() => setRejectModalReq(req)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-semibold transition-colors text-xs border border-rose-200"
                                                    title="Tolak Pengajuan"
                                                >
                                                    <FiX className="w-3.5 h-3.5" />
                                                    <span>Tolak</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs font-mono">Selesai</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={requests.links} />
            </GlassCard>

            {/* MODAL: Approve Request */}
            {approveModalReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-base">Setujui Penghapusan Pegawai</h3>
                            <button
                                onClick={() => setApproveModalReq(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="my-4 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
                            Data pegawai <strong>{approveModalReq.employee?.name}</strong> akan dipindahkan ke <strong>Arsip Kepegawaian</strong> dan dinonaktifkan dari daftar aktif.
                        </div>

                        <form onSubmit={handleApproveSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Catatan Admin (Opsional)
                                </label>
                                <textarea
                                    rows="3"
                                    value={approveForm.data.admin_notes}
                                    onChange={(e) => approveForm.setData('admin_notes', e.target.value)}
                                    placeholder="Contoh: Pengajuan diverifikasi dan disetujui sesuai Surat Perintah KS."
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setApproveModalReq(null)}
                                    className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={approveForm.processing}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50"
                                >
                                    <FiCheck className="w-4 h-4" />
                                    <span>{approveForm.processing ? 'Memproses...' : 'Setujui & Arsipkan'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Reject Request */}
            {rejectModalReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-base">Tolak Pengajuan Penghapusan</h3>
                            <button
                                onClick={() => setRejectModalReq(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="my-4 p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 leading-relaxed">
                            Pengajuan penghapusan untuk pegawai <strong>{rejectModalReq.employee?.name}</strong> akan ditolak dan pegawai tetap berstatus aktif.
                        </div>

                        <form onSubmit={handleRejectSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Alasan Penolakan <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows="3"
                                    required
                                    value={rejectForm.data.admin_notes}
                                    onChange={(e) => rejectForm.setData('admin_notes', e.target.value)}
                                    placeholder="Contoh: Surat Perintah belum ditandatangani oleh Kepala Sekolah, atau alasan tidak sesuai."
                                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                                {rejectForm.errors.admin_notes && (
                                    <p className="text-xs text-rose-500 mt-1">{rejectForm.errors.admin_notes}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setRejectModalReq(null)}
                                    className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={rejectForm.processing}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50"
                                >
                                    <FiX className="w-4 h-4" />
                                    <span>{rejectForm.processing ? 'Menolak...' : 'Tolak Pengajuan'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
