import React from 'react';
import { useCreateSchoolForm } from '@/Hooks/useCreateSchoolForm';

/**
 * CreateSchoolModal handles registering a new school and creating the default operator account.
 * Single Responsibility: Form presentation with state delegated to useCreateSchoolForm.
 */
export default function CreateSchoolModal({ isOpen, onClose }) {
    const {
        formData,
        setFormData,
        handleNipChange,
        processing,
        errors,
        submit: handleSubmit,
    } = useCreateSchoolForm(onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Buat Akun Sekolah & Operator KBB Baru</h3>
                        <p className="text-xs text-slate-500">Daftarkan sekolah dan kredensial login untuk operator sekolah.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
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
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                    NPSN <span className="text-rose-500">*</span>
                                </label>
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
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                    Nama Sekolah <span className="text-rose-500">*</span>
                                </label>
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
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                    Jenjang <span className="text-rose-500">*</span>
                                </label>
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
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-[11px] font-semibold text-slate-700">1. NIP Kepsek (Maks 18 Integer)</label>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {(formData.headmaster_nip || '').length}/18 Digit
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={18}
                                    value={formData.headmaster_nip}
                                    onChange={handleNipChange}
                                    placeholder="18 Digit NIP Kepsek"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">2. Nama Kepala Sekolah</label>
                                <input
                                    type="text"
                                    value={formData.headmaster_name}
                                    onChange={(e) => setFormData({ ...formData, headmaster_name: e.target.value })}
                                    placeholder="Nama & Gelar Kepsek"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
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
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                Nama Operator Sekolah <span className="text-rose-500">*</span>
                            </label>
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
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                    Email Login <span className="text-rose-500">*</span>
                                </label>
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
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                    Password Login <span className="text-rose-500">*</span>
                                </label>
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
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-black hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50 cursor-pointer"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan & Buat Akun Sekolah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
