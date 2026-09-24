import React, { useState } from 'react';
import Sidebar from '@/Components/UI/Sidebar';
import Navbar from '@/Components/UI/Navbar';
import { usePage } from '@inertiajs/react';
import FirstLoginChangePasswordModal from '@/Components/Auth/FirstLoginChangePasswordModal';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();
    const { auth } = usePage().props;
    const userId = auth?.user?.id || 'guest';
    const loginSessionId = auth?.session_id || userId;
    const mustChangePassword = Boolean(auth?.user?.must_change_password);
    const passwordSessionKey = `admin_password_popup_shown_sess_${loginSessionId}`;

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(() => {
        if (!mustChangePassword || typeof window === 'undefined') return false;
        return !sessionStorage.getItem(passwordSessionKey);
    });

    const handleClosePasswordModal = () => {
        setIsPasswordModalOpen(false);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(passwordSessionKey, 'true');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50/80 text-zinc-900 font-sans-inter antialiased flex flex-col md:flex-row overflow-x-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} role="admin" />
                <main className="flex-1 p-6 md:p-10 max-w-[1400px] w-full mx-auto">
                    <div key={url} className="page-enter">
                        {children}
                    </div>
                </main>
            </div>
            
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-zinc-950/40 z-40 backdrop-blur-xs"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Pop-up Ganti Password Akun saat Pertama Kali Login (Admin / Staff) */}
            <FirstLoginChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                user={auth?.user}
            />
        </div>
    );
}
