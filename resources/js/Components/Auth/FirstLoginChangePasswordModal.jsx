import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import {
    FiLock, FiEye, FiEyeOff, FiCheck, FiX,
    FiShield, FiAlertCircle
} from 'react-icons/fi';

/**
 * FirstLoginChangePasswordModal
 * Modern monochrome iOS-style modal that prompts users to change their default password
 * upon first login. Rendered via createPortal to body to cover the entire viewport with
 * a soft blur over the dashboard, with zero white box cropping.
 */
export default function FirstLoginChangePasswordModal({
    isOpen,
    onClose,
    user,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        password: '',
        password_confirmation: '',
    });

    // Close on Escape key if allowed
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('password.force-update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (onClose) onClose();
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Client-side criteria checks
    const hasMinLength = data.password.length >= 8;
    const isMatching = data.password.length > 0 && data.password === data.password_confirmation;

    const modalMarkup = (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-zinc-950/40 backdrop-blur-sm transition-all"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-md rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden flex flex-col animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. Header */}
                <div className="p-5 border-b border-zinc-200/80 bg-zinc-50/80 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <FiShield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-zinc-950 text-base leading-tight">
                                    Ganti Password Akun
                                </h3>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                    Login Pertama
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                Demi keamanan akun Anda dan kerahasiaan naskah dinas, silakan buat password baru sebelum melanjutkan.
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-lg hover:bg-zinc-200/60 transition-colors shrink-0 cursor-pointer"
                            title="Tutup (Nanti)"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* 2. Form Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Error Banner if any */}
                    {errors.password && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                            <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                            <div className="leading-tight font-medium">
                                {errors.password}
                            </div>
                        </div>
                    )}

                    {/* Input Password Baru */}
                    <div className="space-y-1.5">
                        <label 
                            htmlFor="first_login_password" 
                            className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider"
                        >
                            Password Baru
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                <FiLock className="w-4 h-4" />
                            </div>
                            <input
                                id="first_login_password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan minimal 8 karakter"
                                autoFocus
                                required
                                className="w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 focus:border-zinc-950 transition-all font-sans"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                                tabIndex={-1}
                            >
                                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Input Konfirmasi Password */}
                    <div className="space-y-1.5">
                        <label 
                            htmlFor="first_login_password_confirmation" 
                            className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider"
                        >
                            Konfirmasi Password Baru
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                <FiLock className="w-4 h-4" />
                            </div>
                            <input
                                id="first_login_password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Ulangi password baru Anda"
                                required
                                className="w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 focus:border-zinc-950 transition-all font-sans"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-xs text-rose-600 mt-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    {/* Real-time Checklist Criteria */}
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1.5 text-xs text-zinc-600">
                        <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                hasMinLength ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-400'
                            }`}>
                                <FiCheck className="w-3 h-3" />
                            </div>
                            <span className={hasMinLength ? 'text-zinc-950 font-medium' : 'text-zinc-500'}>
                                Minimal 8 karakter
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                isMatching ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-400'
                            }`}>
                                <FiCheck className="w-3 h-3" />
                            </div>
                            <span className={isMatching ? 'text-zinc-950 font-medium' : 'text-zinc-500'}>
                                Konfirmasi password sesuai
                            </span>
                        </div>
                    </div>

                    {/* 3. Footer Action */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={processing}
                                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Nanti Saja
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={processing || !hasMinLength || !isMatching}
                            className="px-5 py-2.5 bg-zinc-900 hover:bg-black disabled:bg-zinc-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <span>Simpan Password Baru</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
}
