import React from 'react';
import { createPortal } from 'react-dom';
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

    const modalMarkup = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 space-y-5 my-8 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                    <div>
                        <h3 className="font-bold text-zinc-900 text-lg">Buat Akun Sekolah & Operator KBB Baru</h3>
                        <p className="text-xs text-zinc-500">Daftarkan sekolah dan kredensial login untuk operator sekolah.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all font-bold cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {/* Section 1: Data Sekolah */}
                    <div className="p-4 bg-zinc-100/70 rounded-xl border border-zinc-200/90 space-y-3">
                        <h4 className="font-bold text-zinc-950 text-xs uppercase tracking-wider">1. Informasi Sekolah (KBB)</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-1">
                                    NPSN <span className="text-zinc-950">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.npsn}
                                    onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                                    placeholder="Contoh: 20201234"
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                                {errors.npsn && <p className="text-zinc-950 font-bold text-[10px] mt-0.5">{errors.npsn}</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-1">
                                    Nama Sekolah <span className="text-zinc-950">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: SD Negeri 1 Padalarang"
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                                {errors.name && <p className="text-zinc-950 font-bold text-[10px] mt-0.5">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-1">
                                    Jenjang <span className="text-zinc-950">*</span>
                                </label>
                                <select
                                    value={formData.jenjang}
                                    onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                >
                                    <option value="SD">SD (Sekolah Dasar)</option>
                                    <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-1">Status Akreditasi</label>
                                <select
                                    value={formData.status_akreditasi}
                                    onChange={(e) => setFormData({ ...formData, status_akreditasi: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
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
                                    <label className="block text-[11px] font-bold text-zinc-800">1. NIP Kepsek (Maks 18 Integer)</label>
                                    <span className="text-[10px] text-zinc-500 font-mono">
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
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-1">2. Nama Kepala Sekolah</label>
                                <input
                                    type="text"
                                    value={formData.headmaster_name}
                                    onChange={(e) => setFormData({ ...formData, headmaster_name: e.target.value })}
                                    placeholder="Nama & Gelar Kepsek"
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-zinc-800 mb-1">Alamat Lengkap</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Alamat Jalan, Kecamatan, Kabupaten Bandung Barat"
                                className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-1">Telepon Sekolah</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Contoh: (022) 6866xxx / 0812xxxx"
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                                {errors.phone && <p className="text-zinc-950 font-bold text-[10px] mt-0.5">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-1">Email Resmi Sekolah</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Contoh: sdn1padalarang@disdik.kbb.go.id"
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                                {errors.email && <p className="text-zinc-950 font-bold text-[10px] mt-0.5">{errors.email}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Kredensial Akun Operator */}
                    <div className="p-4 bg-zinc-100/70 rounded-xl border border-zinc-200/90 space-y-3">
                        <h4 className="font-bold text-zinc-950 text-xs uppercase tracking-wider">2. Akun Login Operator Sekolah</h4>

                        <div>
                            <label className="block text-[11px] font-bold text-zinc-800 mb-1">
                                Nama Operator Sekolah <span className="text-zinc-950">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.operator_name}
                                onChange={(e) => setFormData({ ...formData, operator_name: e.target.value })}
                                placeholder="Contoh: Operator SDN 1 Padalarang"
                                className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                            />
                            {errors.operator_name && <p className="text-zinc-950 font-bold text-[10px] mt-0.5">{errors.operator_name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-1">
                                    Email Login <span className="text-zinc-950">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.operator_email}
                                    onChange={(e) => setFormData({ ...formData, operator_email: e.target.value })}
                                    placeholder="operator.sdn1padalarang@gmail.com"
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                                {errors.operator_email && <p className="text-zinc-950 font-bold text-[10px] mt-0.5">{errors.operator_email}</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-zinc-800 mb-1">
                                    Password Login <span className="text-zinc-950">*</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                                />
                                {errors.password && <p className="text-zinc-950 font-bold text-[10px] mt-0.5">{errors.password}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white/70 hover:bg-zinc-100 text-zinc-800 font-bold rounded-xl text-xs border border-zinc-300/80 backdrop-blur-xl transition-all active:scale-95 shadow-2xs cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-zinc-900/90 hover:bg-black text-white font-bold rounded-xl text-xs border border-zinc-800 backdrop-blur-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan & Buat Akun Sekolah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
}
