import React, { useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { FiLock, FiCheckCircle, FiUser, FiMail, FiSave } from 'react-icons/fi';

/**
 * UpdatePasswordForm renders inputs for user profile identity (name, official email)
 * and secure password updates in the unified Security & Account Settings card.
 */
export default function UpdatePasswordForm() {
    const user = usePage().props.auth.user;

    // --- Profile Info Form (Name & Official Email) ---
    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    // --- Password Update Form ---
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
            onError: (errs) => {
                if (errs.password) {
                    passwordForm.reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errs.current_password) {
                    passwordForm.reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <div className="space-y-6 text-xs">
            {/* --- Bagian 1: Identitas Akun Pegawai (Nama & Email Dinas) --- */}
            <form onSubmit={updateProfile} className="space-y-4">
                <div>
                    <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-2">
                        <FiUser className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Identitas Pegawai & Email Kedinasan</span>
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                        Kelola nama lengkap pegawai dan alamat email dinas resmi yang terdaftar pada sistem.
                    </p>
                </div>

                {profileForm.recentlySuccessful && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Nama pegawai dan email dinas berhasil diperbarui!</span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                            Nama Lengkap Pegawai <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                placeholder="Contoh: Nama Pegawai, M.Pd."
                                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-medium"
                            />
                            <FiUser className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                        </div>
                        {profileForm.errors.name && (
                            <p className="text-[11px] text-rose-500 mt-1">{profileForm.errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                            Email Akun Dinas <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                placeholder="nama@disdik.kbb.go.id"
                                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-medium"
                            />
                            <FiMail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                        </div>
                        {profileForm.errors.email && (
                            <p className="text-[11px] text-rose-500 mt-1">{profileForm.errors.email}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={profileForm.processing}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                        <FiSave className="w-3.5 h-3.5" />
                        <span>{profileForm.processing ? 'Menyimpan...' : 'Simpan Identitas Pegawai'}</span>
                    </button>
                </div>
            </form>

            <div className="border-t border-zinc-200/80 pt-2" />

            {/* --- Bagian 2: Pengaturan Kata Sandi --- */}
            <form onSubmit={updatePassword} className="space-y-4">
                <div>
                    <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-2">
                        <FiLock className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Perbarui Kata Sandi Akun</span>
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                        Pastikan akun Anda menggunakan kata sandi acak dan panjang minimal 8 karakter agar tetap terlindungi.
                    </p>
                </div>

                {passwordForm.recentlySuccessful && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Kata sandi akun berhasil diperbarui dengan aman!</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                            Kata Sandi Saat Ini <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="current_password"
                                ref={currentPasswordInput}
                                type="password"
                                required
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-mono"
                                autoComplete="current-password"
                            />
                            <FiLock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                        </div>
                        {passwordForm.errors.current_password && (
                            <p className="text-[11px] text-rose-500 mt-1">{passwordForm.errors.current_password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                            Kata Sandi Baru <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                ref={passwordInput}
                                type="password"
                                required
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                placeholder="Min. 8 karakter"
                                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-mono"
                                autoComplete="new-password"
                            />
                            <FiLock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                        </div>
                        {passwordForm.errors.password && (
                            <p className="text-[11px] text-rose-500 mt-1">{passwordForm.errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                            Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type="password"
                                required
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                placeholder="Ulangi kata sandi"
                                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-mono"
                                autoComplete="new-password"
                            />
                            <FiLock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                        </div>
                        {passwordForm.errors.password_confirmation && (
                            <p className="text-[11px] text-rose-500 mt-1">{passwordForm.errors.password_confirmation}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={passwordForm.processing}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                        <FiLock className="w-3.5 h-3.5" />
                        <span>{passwordForm.processing ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
