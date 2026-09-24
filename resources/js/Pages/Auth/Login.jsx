import React, { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function Login({ status, canResetPassword }) {
    // Clear pop-up session flags when arriving at Login page
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.clear();
        }
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk - SIKATAR Disdik KBB" />

            {/* Header: Logo Disdik & Branding */}
            <div className="flex flex-col items-center text-center mb-6">
                <div className="mb-3.5 flex items-center justify-center">
                    <div className="w-20 h-24 p-1.5 bg-white rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-center">
                        <img 
                            src="/images/disdik-logo.jpg" 
                            alt="Logo Disdik KBB" 
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
                    Login
                </h1>
            </div>

            {/* Flash Status Message */}
            {status && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center">
                    {status}
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={submit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1.5">
                    <label 
                        htmlFor="email" 
                        className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider"
                    >
                        Email Dinas
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                            <FiMail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="nama@disdik.kbb.go.id"
                            autoComplete="username"
                            autoFocus
                            required
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 focus:border-zinc-950 transition-all font-sans"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label 
                            htmlFor="password" 
                            className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider"
                        >
                            Kata Sandi
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-zinc-500 hover:text-zinc-950 hover:underline transition-colors"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                            <FiLock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="Masukkan kata sandi"
                            autoComplete="current-password"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 focus:border-zinc-950 transition-all font-sans"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                            tabIndex={-1}
                            title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        >
                            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950/20 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-xs text-zinc-600 font-medium">
                            Ingat saya di perangkat ini
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-4 bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Memverifikasi...</span>
                            </>
                        ) : (
                            <>
                                <span>Masuk ke Sistem</span>
                                <FiArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
