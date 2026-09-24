import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

export default function Navbar({ role = 'operator', toggleSidebar }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const notifications = auth?.notifications || [];
    const unreadCount = auth?.unread_notifications_count || 0;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllRead = () => {
        router.post('/notifications/mark-all-read', {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleNotificationClick = (item) => {
        setDropdownOpen(false);
        router.post(`/notifications/${item.id}/read`, {}, {
            preserveScroll: true,
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'approved':
                return <Icon name="check_circle" className="text-zinc-950 text-base" />;
            case 'revision':
                return <Icon name="warning" className="text-zinc-800 text-base" />;
            case 'rejected':
                return <Icon name="cancel" className="text-zinc-950 text-base" />;
            case 'submitted':
                return <Icon name="description" className="text-zinc-700 text-base" />;
            default:
                return <Icon name="notifications" className="text-zinc-800 text-base" />;
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 px-4 md:px-8 py-4 flex items-center justify-between">
            {/* Left Info / Sidebar Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-zinc-600 hover:text-zinc-950 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                    <Icon name="menu" />
                </button>
                <div className="select-none cursor-default">
                    <h2 className="text-zinc-950 font-bold text-lg md:text-xl leading-tight">
                        {['staff_kepala', 'staff_biasa', 'admin'].includes(role) ? 'Administrative Bureau' : (user?.school?.name || 'School Correspondence Portal')}
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium">
                        Dinas Pendidikan Kabupaten Bandung Barat
                    </p>
                </div>
            </div>

            {/* Right User Search & Notifications & Avatar */}
            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center relative">
                    <Icon name="search" className="absolute left-3 text-zinc-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search entries..."
                        className="pl-9 pr-4 py-1.5 bg-zinc-100/70 border border-zinc-200/80 rounded-xl focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-xs text-zinc-900 placeholder:text-zinc-400 w-48 transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Interactive Notification Bell */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="p-2 text-zinc-600 hover:text-zinc-950 transition-colors relative rounded-xl hover:bg-zinc-100 cursor-pointer"
                            title="Notifikasi"
                        >
                            <Icon name="notifications" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-zinc-950 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown Panel */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border border-zinc-200/90 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Dropdown Header */}
                                <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-zinc-900 text-sm">Notifikasi</h4>
                                        {unreadCount > 0 && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-white">
                                                {unreadCount} Baru
                                            </span>
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-[11px] font-bold text-zinc-800 hover:text-black transition-colors cursor-pointer"
                                        >
                                            Tandai semua dibaca
                                        </button>
                                    )}
                                </div>

                                {/* Notifications List */}
                                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
                                    {notifications.length > 0 ? (
                                        notifications.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleNotificationClick(item)}
                                                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-zinc-100/70 ${
                                                    !item.read_at ? 'bg-zinc-100/60 font-medium' : 'bg-white text-zinc-600'
                                                }`}
                                            >
                                                <div className="p-2 rounded-xl bg-zinc-100 shrink-0 mt-0.5 border border-zinc-200/80">
                                                    {getNotificationIcon(item.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h5 className={`text-xs font-bold ${!item.read_at ? 'text-zinc-950' : 'text-zinc-700'}`}>
                                                            {item.title}
                                                        </h5>
                                                        <span className="text-[10px] text-zinc-400 shrink-0">{item.created_at}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-600 mt-1 leading-snug line-clamp-2">
                                                        {item.message}
                                                    </p>
                                                </div>
                                                {!item.read_at && (
                                                    <span className="w-2 h-2 rounded-full bg-zinc-900 shrink-0 mt-1.5"></span>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 px-4 text-center space-y-2">
                                            <Icon name="notifications_off" className="text-3xl text-zinc-300 mx-auto" />
                                            <p className="text-xs font-bold text-zinc-500">Belum ada notifikasi</p>
                                            <p className="text-[11px] text-zinc-400">Pemberitahuan surat pengajuan akan muncul di sini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile Avatar Link */}
                    <Link
                        href={['staff_kepala', 'staff_biasa', 'admin'].includes(user?.role) ? '/profile' : '/operator/profile'}
                        className="flex items-center gap-3 pl-3 border-l border-zinc-200 hover:opacity-85 transition-all cursor-pointer group"
                        title="Profil Sekolah / Akun"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">{user?.name}</p>
                            <p className="text-[10px] text-zinc-500 capitalize font-medium">
                                {user?.role === 'staff_kepala' || user?.role === 'admin'
                                    ? 'Kepala Staf Disdik'
                                    : (user?.role === 'staff_biasa' ? 'Staf Verifikator' : 'School Operator')}
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center border border-zinc-800 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                            {user?.profile_photo_path ? (
                                <img src={user.profile_photo_path} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name ? user.name.charAt(0).toUpperCase() : 'U'
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
