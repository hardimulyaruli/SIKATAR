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
                return <Icon name="check_circle" className="text-emerald-600 text-base" />;
            case 'revision':
                return <Icon name="warning" className="text-amber-600 text-base" />;
            case 'rejected':
                return <Icon name="cancel" className="text-rose-600 text-base" />;
            case 'submitted':
                return <Icon name="description" className="text-blue-600 text-base" />;
            default:
                return <Icon name="notifications" className="text-primary text-base" />;
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline/10 px-4 md:px-8 py-4 flex items-center justify-between">
            {/* Left Info / Sidebar Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-on-surface-variant hover:text-primary rounded-lg transition-colors"
                >
                    <Icon name="menu" />
                </button>
                <div className="select-none cursor-default">
                    <h2 className="font-headline-md text-primary text-lg md:text-xl leading-tight">
                        {role === 'admin' ? 'Administrative Bureau' : (user?.school?.name || 'School Correspondence Portal')}
                    </h2>
                    <p className="font-body-md text-xs text-on-surface-variant">
                        Dinas Pendidikan Kabupaten Bandung Barat
                    </p>
                </div>
            </div>

            {/* Right User Search & Notifications & Avatar */}
            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center relative">
                    <Icon name="search" className="absolute left-3 text-on-surface-variant text-sm" />
                    <input
                        type="text"
                        placeholder="Search entries..."
                        className="pl-9 pr-4 py-1.5 bg-transparent border-0 border-b border-outline/20 focus:border-primary focus:ring-0 text-xs text-on-surface placeholder:text-on-surface-variant/50 w-48 transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Interactive Notification Bell */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors relative rounded-xl hover:bg-surface-container-high"
                            title="Notifikasi"
                        >
                            <Icon name="notifications" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-surface shadow-xs animate-pulse">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown Panel */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Dropdown Header */}
                                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-800 text-sm">Notifikasi</h4>
                                        {unreadCount > 0 && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                                                {unreadCount} Baru
                                            </span>
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Tandai semua dibaca
                                        </button>
                                    )}
                                </div>

                                {/* Notifications List */}
                                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                                    {notifications.length > 0 ? (
                                        notifications.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleNotificationClick(item)}
                                                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-blue-50/50 ${
                                                    !item.read_at ? 'bg-blue-50/30 font-medium' : 'bg-white text-slate-600'
                                                }`}
                                            >
                                                <div className="p-2 rounded-xl bg-slate-100/80 shrink-0 mt-0.5">
                                                    {getNotificationIcon(item.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h5 className={`text-xs font-bold ${!item.read_at ? 'text-slate-900' : 'text-slate-700'}`}>
                                                            {item.title}
                                                        </h5>
                                                        <span className="text-[10px] text-slate-400 shrink-0">{item.created_at}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                                                        {item.message}
                                                    </p>
                                                </div>
                                                {!item.read_at && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 px-4 text-center space-y-2">
                                            <Icon name="notifications_off" className="text-3xl text-slate-300 mx-auto" />
                                            <p className="text-xs font-semibold text-slate-500">Belum ada notifikasi</p>
                                            <p className="text-[11px] text-slate-400">Pemberitahuan surat pengajuan akan muncul di sini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile Avatar Link */}
                    <Link
                        href={user?.role === 'admin' ? '/profile' : '/operator/profile'}
                        className="flex items-center gap-3 pl-3 border-l border-outline/10 hover:opacity-80 transition-all cursor-pointer group"
                        title="Profil Sekolah / Akun"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="font-label-sm text-xs text-primary uppercase tracking-wider group-hover:text-primary-hover">{user?.name}</p>
                            <p className="font-body-md text-[10px] text-on-surface-variant capitalize">{user?.role === 'admin' ? 'Chief Administrator' : 'School Operator'}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center border border-outline/20 shadow-xs group-hover:scale-105 transition-transform">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
