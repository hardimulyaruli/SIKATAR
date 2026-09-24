import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { FiSave, FiCheckCircle, FiShield, FiBriefcase, FiUser, FiMail } from 'react-icons/fi';

/**
 * UpdateProfileInformationForm renders form fields for updating user's name and email,
 * along with institutional metadata (Role, Bureau, Work Unit).
 */
export default function UpdateProfileInformationForm({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'staff_kepala':
                return {
                    label: 'Kepala Staf Disdik KBB',
                    desc: 'Wewenang penuh verifikasi pengajuan, persetujuan surat resmi, dan supervisi sekolah/pegawai.',
                    badgeClass: 'bg-zinc-900 text-white border-zinc-900',
                };
            case 'staff_biasa':
                return {
                    label: 'Staf Verifikator Disdik',
                    desc: 'Wewenang verifikasi data permohonan surat masuk dan validasi berkas.',
                    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-300',
                };
            case 'admin':
                return {
                    label: 'Administrator Sistem',
                    desc: 'Akses penuh manajemen akun, hak akses, dan konfigurasi sistem.',
                    badgeClass: 'bg-zinc-900 text-white border-zinc-900',
                };
            default:
                return {
                    label: 'Operator Sekolah',
                    desc: 'Akses permohonan surat dan pengelolaan data pegawai sekolah.',
                    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-300',
                };
        }
    };

    const roleInfo = getRoleBadge(user.role);

    return (
        <form onSubmit={submit} className="space-y-5 text-xs">
            {recentlySuccessful && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Informasi profil akun berhasil diperbarui!</span>
                </div>
            )}

            {/* Read-only Institutional Metadata */}
            <div className="p-4 bg-zinc-50/80 rounded-xl border border-zinc-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 pb-3">
                    <div className="flex items-center gap-2 text-zinc-700">
                        <FiBriefcase className="w-4 h-4 text-zinc-500 shrink-0" />
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                                Instansi / Satuan Kerja
                            </span>
                            <span className="font-semibold text-zinc-900 text-xs">
                                Dinas Pendidikan Kabupaten Bandung Barat
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-xs ${roleInfo.badgeClass}`}>
                            <FiShield className="w-3 h-3" />
                            <span>{roleInfo.label}</span>
                        </span>
                    </div>
                </div>

                <p className="text-[11px] text-zinc-500 leading-relaxed">
                    {roleInfo.desc}
                </p>
            </div>

            {/* Form Fields: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Nama Lengkap Pegawai <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Nama Pegawai, M.Pd."
                            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-medium"
                        />
                        <FiUser className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    </div>
                    {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Email Akun Dinas <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@disdik.kbb.go.id"
                            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-medium"
                        />
                        <FiMail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    </div>
                    {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                    <FiSave className="w-4 h-4" />
                    <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
                </button>
            </div>
        </form>
    );
}
