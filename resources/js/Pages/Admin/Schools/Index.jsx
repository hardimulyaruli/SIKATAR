import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SearchFilter from '@/Components/UI/SearchFilter';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import { Link, router } from '@inertiajs/react';
import { FiHome, FiEye, FiPhone, FiMail } from 'react-icons/fi';

export default function SchoolsIndex({ schools, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [jenjang, setJenjang] = useState(filters.jenjang || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        npsn: '',
        name: '',
        jenjang: 'SD',
        status_akreditasi: 'A',
        address: '',
        phone: '',
        email: '',
        headmaster_name: '',
        headmaster_nip: '',
        operator_name: '',
        operator_email: '',
        password: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSearch = (val) => {
        setSearch(val);
        router.get('/admin/schools', { search: val, jenjang }, { preserveState: true, replace: true });
    };

    const handleJenjangFilter = (val) => {
        setJenjang(val);
        router.get('/admin/schools', { search, jenjang: val }, { preserveState: true, replace: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        router.post('/admin/schools', formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setProcessing(false);
                setFormData({
                    npsn: '',
                    name: '',
                    jenjang: 'SD',
                    status_akreditasi: 'A',
                    address: '',
                    phone: '',
                    email: '',
                    headmaster_name: '',
                    headmaster_nip: '',
                    operator_name: '',
                    operator_email: '',
                    password: '',
                });
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            }
        });
    };

    const jenjangOptions = [
        { label: 'SD (Sekolah Dasar)', value: 'SD' },
        { label: 'SMP (Sekolah Menengah Pertama)', value: 'SMP' },
        { label: 'SMA', value: 'SMA' },
        { label: 'SMK', value: 'SMK' },
    ];

    return (
        <AdminLayout>
            <PageHeader
                title="Daftar Sekolah & Akun Operator KBB"
                subtitle="Kelola data sekolah dan buat akun login operator untuk seluruh sekolah di Kabupaten Bandung Barat."
                action={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                        <span>+ Tambah Akun Sekolah Baru</span>
                    </button>
                }
            />

            <GlassCard>
                <SearchFilter
                    search={search}
                    onSearchChange={handleSearch}
                    filter={jenjang}
                    onFilterChange={handleJenjangFilter}
                    filterOptions={jenjangOptions}
                    placeholder="Cari nama sekolah, NPSN, alamat..."
                />

                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                                <th className="py-3.5 px-4">NPSN & Nama Sekolah</th>
                                <th className="py-3.5 px-4">Jenjang & Akreditasi</th>
                                <th className="py-3.5 px-4">Kepala Sekolah</th>
                                <th className="py-3.5 px-4">Kontak / Alamat</th>
                                <th className="py-3.5 px-4 text-center">Operator & Pengajuan</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {schools.data.map((sc) => (
                                <tr key={sc.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                            <FiHome className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span>{sc.name}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">NPSN: {sc.npsn}</div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                            {sc.jenjang} • Akreditasi {sc.status_akreditasi}
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="font-semibold text-slate-800">{sc.headmaster_name || '-'}</div>
                                        <div className="text-[10px] text-slate-400">NIP: {sc.headmaster_nip || '-'}</div>
                                    </td>

                                    <td className="py-3.5 px-4 max-w-xs">
                                        <div className="text-slate-600 line-clamp-1">{sc.address || '-'}</div>
                                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                            {sc.phone && <span className="flex items-center gap-0.5"><FiPhone className="w-3 h-3" /> {sc.phone}</span>}
                                            {sc.email && <span className="flex items-center gap-0.5"><FiMail className="w-3 h-3" /> {sc.email}</span>}
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4 text-center space-y-1">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {sc.users_count || 0} Akun Operator
                                        </span>
                                        <div className="text-[10px] text-slate-500 font-semibold">
                                            {sc.letter_applications_count} Pengajuan Surat
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <Link
                                            href={`/admin/schools/${sc.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-all shadow-xs"
                                        >
                                            <FiEye className="w-3.5 h-3.5" />
                                            <span>Detail Profil</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={schools.links} />
            </GlassCard>

            {/* Modal Tambah Sekolah & Akun Operator Baru */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Buat Akun Sekolah & Operator KBB Baru</h3>
                                <p className="text-xs text-slate-500">Daftarkan sekolah dan kredensial login untuk operator sekolah.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            {/* Section 1: Data Sekolah */}
                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                                <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">1. Informasi Sekolah (KBB)</h4>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">NPSN <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.npsn}
                                            onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                                            placeholder="Contoh: 20201234"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        {errors.npsn && <p className="text-rose-500 text-[10px] mt-0.5">{errors.npsn}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Sekolah <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Contoh: SD Negeri 1 Padalarang"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        {errors.name && <p className="text-rose-500 text-[10px] mt-0.5">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Jenjang <span className="text-rose-500">*</span></label>
                                        <select
                                            value={formData.jenjang}
                                            onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="SD">SD (Sekolah Dasar)</option>
                                            <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                                            <option value="SMA">SMA</option>
                                            <option value="SMK">SMK</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status Akreditasi</label>
                                        <select
                                            value={formData.status_akreditasi}
                                            onChange={(e) => setFormData({ ...formData, status_akreditasi: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="A">Akreditasi A</option>
                                            <option value="B">Akreditasi B</option>
                                            <option value="C">Akreditasi C</option>
                                            <option value="Belum Akreditasi">Belum Akreditasi</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kepala Sekolah</label>
                                        <input
                                            type="text"
                                            value={formData.headmaster_name}
                                            onChange={(e) => setFormData({ ...formData, headmaster_name: e.target.value })}
                                            placeholder="Nama & Gelar Kepsek"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                                        <input
                                            type="text"
                                            value={formData.headmaster_nip}
                                            onChange={(e) => setFormData({ ...formData, headmaster_nip: e.target.value })}
                                            placeholder="NIP Kepsek"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Alamat Jalan, Kecamatan, Kabupaten Bandung Barat"
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Section 2: Kredensial Akun Operator */}
                            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                                <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">2. Akun Login Operator Sekolah</h4>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Operator Sekolah <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.operator_name}
                                        onChange={(e) => setFormData({ ...formData, operator_name: e.target.value })}
                                        placeholder="Contoh: Operator SDN 1 Padalarang"
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    {errors.operator_name && <p className="text-rose-500 text-[10px] mt-0.5">{errors.operator_name}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Login <span className="text-rose-500">*</span></label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.operator_email}
                                            onChange={(e) => setFormData({ ...formData, operator_email: e.target.value })}
                                            placeholder="operator.sdn1padalarang@gmail.com"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        {errors.operator_email && <p className="text-rose-500 text-[10px] mt-0.5">{errors.operator_email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password Login <span className="text-rose-500">*</span></label>
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="Minimal 8 karakter"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        {errors.password && <p className="text-rose-500 text-[10px] mt-0.5">{errors.password}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-black hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan & Buat Akun Sekolah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
