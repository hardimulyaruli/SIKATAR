import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

export default function Navbar({ role = 'operator', toggleSidebar }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                <div>
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
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors relative">
                        <Icon name="notifications" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
                    </button>
                    
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
