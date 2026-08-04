import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import HeaderKopSurat from '@/Components/Letter/HeaderKopSurat';
import { useForm } from '@inertiajs/react';
import { FiSave, FiUpload, FiHome, FiUser, FiCheckCircle } from 'react-icons/fi';

export default function ProfileEdit({ school }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: school?.name || '',
        npsn: school?.npsn || '',
        jenjang: school?.jenjang || 'SD',
        status_akreditasi: school?.status_akreditasi || 'A',
        address: school?.address || '',
        phone: school?.phone || '',
        email: school?.email || '',
        headmaster_name: school?.headmaster_name || '',
        headmaster_nip: school?.headmaster_nip || '',
        logo: null,
    });

    const [previewLogo, setPreviewLogo] = useState(school?.logo_kop_path || null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/operator/profile', {
            forceFormData: true,
        });
    };

    return (
        <OperatorLayout>
            <PageHeader
                title="Profil Sekolah & Kop Surat"
                subtitle="Kelola identitas resmi sekolah, nama Kepala Sekolah, NIP, serta logo untuk Kop Surat."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Input (2 Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard header={<h3 className="font-bold text-slate-900 text-sm">Form Data Profil Sekolah</h3>}>
                        {recentlySuccessful && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                                <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Profil Sekolah dan Logo Kop Surat berhasil diperbarui!</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Nama Resmi Sekolah <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                    {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        NPSN <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.npsn}
                                        onChange={(e) => setData('npsn', e.target.value)}
                                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                    {errors.npsn && <p className="text-[11px] text-rose-500 mt-1">{errors.npsn}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Jenjang Pendidikan
                                    </label>
                                    <select
                                        value={data.jenjang}
                                        onChange={(e) => setData('jenjang', e.target.value)}
                                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="SD">SD (Sekolah Dasar)</option>
                                        <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                                        <option value="SMA">SMA</option>
                                        <option value="SMK">SMK</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Status Akreditasi
                                    </label>
                                    <select
                                        value={data.status_akreditasi}
                                        onChange={(e) => setData('status_akreditasi', e.target.value)}
                                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="A">Akreditasi A</option>
                                        <option value="B">Akreditasi B</option>
                                        <option value="C">Akreditasi C</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Alamat Lengkap Sekolah
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jalan, RT/RW, Desa/Kelurahan, Kecamatan, Kab. Bandung Barat..."
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Telepon Sekolah
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Email Resmi Sekolah
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3">
                                    Data Penandatangan (Kepala Sekolah)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Nama Lengkap Kepala Sekolah
                                        </label>
                                        <input
                                            type="text"
                                            value={data.headmaster_name}
                                            onChange={(e) => setData('headmaster_name', e.target.value)}
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            NIP Kepala Sekolah
                                        </label>
                                        <input
                                            type="text"
                                            value={data.headmaster_nip}
                                            onChange={(e) => setData('headmaster_nip', e.target.value)}
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Upload Logo Kop Surat */}
                            <div className="pt-2 border-t border-slate-100">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    Upload Logo Sekolah untuk Kop Surat:
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                        {previewLogo ? (
                                            <img src={previewLogo} alt="Logo Kop Preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <FiHome className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">Format PNG / JPG (Maks. 2MB). Disarankan berlatar belakang transparan.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                                >
                                    <FiSave className="w-4 h-4" />
                                    <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                </div>

                {/* Preview Kop Surat (1 Column) */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Preview Real-Time Kop Surat Resmi:
                    </h3>
                    <div className="paper-texture p-6 rounded-2xl border border-slate-200 shadow-md bg-white">
                        <HeaderKopSurat
                            school={{
                                name: data.name,
                                address: data.address,
                                phone: data.phone,
                                email: data.email,
                                logo_kop_path: previewLogo,
                            }}
                        />
                        <div className="text-center text-xs text-slate-400 py-6 italic font-serif-garamond">
                            --- Tampilan Kop Surat Resmi ini akan tercetak otomatis pada setiap pengajuan surat sekolah ---
                        </div>
                    </div>
                </div>
            </div>
        </OperatorLayout>
    );
}
