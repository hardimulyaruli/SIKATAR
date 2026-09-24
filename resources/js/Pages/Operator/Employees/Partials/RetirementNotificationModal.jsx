import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@inertiajs/react';
import {
    FiAlertCircle, FiClock, FiX, FiFileText,
    FiArrowRight, FiUser,
} from 'react-icons/fi';

/**
 * RetirementNotificationModal
 * Displays an iOS-style alert popup reminding the operator of employees
 * who are approaching retirement age (within the final year before reaching 60 years old).
 * Perfectly constrained height, responsive, and rendered via createPortal so
 * the backdrop blurs the full screen behind it without container cropping.
 */
export default function RetirementNotificationModal({
    isOpen,
    onClose,
    approachingEmployees = [],
    isDashboard = false,
}) {
    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || approachingEmployees.length === 0) return null;

    const modalMarkup = (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-zinc-950/40 backdrop-blur-sm transition-all"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-2xl rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. Header (Always fixed at top, shrink-0) */}
                <div className="p-4 sm:p-5 border-b border-zinc-200/80 bg-zinc-50/80 flex items-start justify-between gap-4 shrink-0">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                            <FiClock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-zinc-950 text-sm sm:text-base leading-tight">
                                    Pengingat Masa Pensiun Pegawai
                                </h3>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                    <FiAlertCircle className="w-3 h-3" />
                                    <span>{approachingEmployees.length} Pegawai Mendekati BUP</span>
                                </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-zinc-500 mt-1">
                                Pegawai berikut berada pada <strong>tahun terakhir</strong> sebelum mencapai batas usia pensiun (60 tahun).
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-lg hover:bg-zinc-200/60 transition-colors shrink-0 cursor-pointer"
                        title="Tutup Notifikasi"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* 2. Banner Guidance (shrink-0) */}
                <div className="px-4 sm:px-5 py-2.5 bg-zinc-100/80 border-b border-zinc-200/60 text-[11px] text-zinc-600 leading-relaxed flex items-center gap-2.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span>
                        Data dihitung dari tanggal lahir pegawai. Pegawai yang telah melewati usia 60 tahun otomatis masuk ke <strong>Arsip Pegawai Pensiun</strong>.
                    </span>
                </div>

                {/* 3. Employee List (flex-1 min-h-0 with internal scroll, never expands beyond parent) */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 min-h-0 divide-y divide-zinc-100">
                    {approachingEmployees.map((emp) => (
                        <div
                            key={emp.id}
                            className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 p-3 sm:p-3.5 rounded-xl border border-zinc-200/70 hover:border-zinc-300 transition-all shadow-2xs"
                        >
                            <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-zinc-950 text-xs sm:text-sm truncate">
                                        {emp.name}
                                    </h4>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                                        {emp.status_pegawai}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-500">
                                    <span className="font-mono">NIP: {emp.nip || '-'}</span>
                                    <span>•</span>
                                    <span>Lahir: <strong className="text-zinc-700">{emp.date_of_birth}</strong> ({emp.age_label})</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs pt-1 flex-wrap">
                                    <span className="text-zinc-500 text-[11px]">Batas Pensiun:</span>
                                    <strong className="text-zinc-900 font-semibold">{emp.retirement_date}</strong>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                        emp.is_critical 
                                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                                    }`}>
                                        <FiClock className="w-3 h-3" />
                                        <span>Sisa ± {emp.months_remaining} Bulan ({emp.days_remaining} Hari)</span>
                                    </span>
                                </div>
                            </div>

                            {/* Actions per employee */}
                            <div className="shrink-0 flex sm:flex-col gap-2 pt-2 sm:pt-0">
                                <Link
                                    href="/operator/applications/create"
                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-all shadow-2xs active:scale-95"
                                    title="Buat Surat Pengantar Usulan Pensiun"
                                >
                                    <FiFileText className="w-3.5 h-3.5" />
                                    <span>Ajukan Surat</span>
                                </Link>
                                <Link
                                    href={`/operator/employees/${emp.id}`}
                                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded-lg border border-zinc-200 shadow-2xs transition-colors"
                                >
                                    <span>Detail</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 4. Footer (Always fixed at bottom, shrink-0) */}
                <div className="p-3.5 sm:p-4 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-between gap-3 shrink-0">
                    <Link
                        href="/operator/employees?filter=approaching_pension"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
                        onClick={onClose}
                    >
                        <span>Lihat di Data Kepegawaian</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                        Saya Mengerti
                    </button>
                </div>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
}
