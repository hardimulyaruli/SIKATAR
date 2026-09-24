import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import { Link, usePage } from '@inertiajs/react';
import OperatorStatCards from './Partials/OperatorStatCards';
import OperatorRecentDispatchesFeed from './Partials/OperatorRecentDispatchesFeed';
import OperatorQuickActionsSidebar from './Partials/OperatorQuickActionsSidebar';
import RetirementNotificationModal from './Employees/Partials/RetirementNotificationModal';
import FirstLoginChangePasswordModal from '@/Components/Auth/FirstLoginChangePasswordModal';

/**
 * OperatorDashboard orchestrates the school operator dashboard:
 * Status counters, quick action shortcuts, recent submission timeline, and live status.
 * Single Responsibility: Operator dashboard view orchestration.
 */
export default function OperatorDashboard({
    school,
    stats = {},
    recent_applications = [],
    templates = [],
    approachingPensionEmployees = [],
    approachingPensionCount = 0,
}) {
    const { auth } = usePage().props;
    const mustChangePassword = Boolean(auth?.user?.must_change_password);
    const userId = auth?.user?.id || 'guest';
    const loginSessionId = auth?.session_id || userId;
    const hasPensionReminders = approachingPensionCount > 0;

    // Session keys terikat ke ID sesi login Laravel:
    // - Saat logout & login kembali: ID sesi baru dibuat -> pop-up otomatis muncul kembali!
    // - Saat refresh halaman beranda: ID sesi sama -> pop-up tidak akan muncul berulang kali.
    const retirementSessionKey = `retirement_popup_shown_sess_${loginSessionId}`;
    const passwordSessionKey = `password_popup_shown_sess_${loginSessionId}`;

    const todayStr = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    // 1. Pop-up Pengingat Pensiun: Hanya muncul pas login awal jika belum pernah dilihat di sesi ini
    const [isRetirementModalOpen, setIsRetirementModalOpen] = useState(() => {
        if (!hasPensionReminders || typeof window === 'undefined') return false;
        return !sessionStorage.getItem(retirementSessionKey);
    });

    // 2. Pop-up Ganti Password: Hanya muncul pas login awal jika belum pernah dilihat di sesi ini
    //    Jika ada pop-up pensiun yang sedang/akan tampil, tahan dulu
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(() => {
        if (!mustChangePassword || typeof window === 'undefined') return false;
        if (sessionStorage.getItem(passwordSessionKey)) return false;
        const retirementWillOpen = hasPensionReminders && !sessionStorage.getItem(retirementSessionKey);
        return !retirementWillOpen;
    });

    const handleCloseRetirementModal = () => {
        setIsRetirementModalOpen(false);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(retirementSessionKey, 'true');
        }
        // Muncul kedua setelah pop-up pensiun ditutup jika belum pernah dilihat di sesi ini
        if (mustChangePassword && typeof window !== 'undefined') {
            const alreadySeenPassword = sessionStorage.getItem(passwordSessionKey);
            if (!alreadySeenPassword) {
                setTimeout(() => {
                    setIsPasswordModalOpen(true);
                }, 200);
            }
        }
    };

    const handleClosePasswordModal = () => {
        setIsPasswordModalOpen(false);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(passwordSessionKey, 'true');
        }
    };

    return (
        <OperatorLayout>
            {/* Header Title Section */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline/10 pb-8">
                <div>
                    <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                        {todayStr}
                    </p>
                    <h1 className="font-headline-md text-3xl md:text-5xl text-primary font-normal">
                        Ringkasan Disdik KBB
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/operator/applications/create"
                        className="px-5 py-3 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest font-semibold rounded-DEFAULT hover:bg-inverse-surface transition-colors flex items-center gap-2 shadow-xs"
                    >
                        <Icon name="add" className="text-sm text-on-primary" />
                        <span>New Entry (Buat Surat)</span>
                    </Link>
                </div>
            </header>

            {/* Bento Grid Stats */}
            <OperatorStatCards school={school} stats={stats} />

            {/* Main Content Area: Activity Feed & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <OperatorRecentDispatchesFeed applications={recent_applications} />
                <OperatorQuickActionsSidebar />
            </div>

            {/* Pop-up Pengingat Pensiun saat Login ke Dashboard */}
            <RetirementNotificationModal
                isOpen={isRetirementModalOpen}
                onClose={handleCloseRetirementModal}
                approachingEmployees={approachingPensionEmployees}
                isDashboard={true}
            />

            {/* Pop-up Ganti Password Akun saat Pertama Kali Login */}
            <FirstLoginChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={handleClosePasswordModal}
                user={auth?.user}
            />
        </OperatorLayout>
    );
}
