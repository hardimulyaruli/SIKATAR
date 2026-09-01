import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

export default function Sidebar({ isOpen = true, setIsOpen }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const role = user?.role || 'operator';

    const operatorNav = [
        { name: 'Dashboard', href: '/operator/dashboard', icon: 'drafts' },
        { name: 'Kepegawaian', href: '/operator/employees', icon: 'badge' },
        { name: 'Pengajuan', href: '/operator/applications/create', icon: 'add_card' },
        { name: 'Status Pengajuan', href: '/operator/applications', icon: 'inventory_2' },
    ];

    const adminNav = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'drafts' },
        { name: 'Kepegawaian', href: '/admin/employees', icon: 'badge' },
        { name: 'Pengajuan', href: '/admin/applications', icon: 'gavel' },
        { name: 'Sekolah KBB', href: '/admin/schools', icon: 'school' },
    ];

    const navItems = role === 'admin' ? adminNav : operatorNav;

    const isRouteActive = (targetHref) => {
        if (targetHref === '/operator/applications' || targetHref === '/admin/applications') {
            return url === targetHref || (url.startsWith(targetHref) && !url.startsWith(targetHref + '/create'));
        }
        return url === targetHref || url.startsWith(targetHref + '?') || url.startsWith(targetHref + '/');
    };

    return (
        <aside 
            className={`fixed left-0 top-0 z-50 h-screen w-72 flex-col py-8 px-6 bg-surface-container-lowest/80 backdrop-blur-xl border-r border-outline/10 shadow-xs transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } flex`}
        >
            {/* Header / Department Seal */}
            <div className="mb-8 flex items-center justify-between border-b border-outline/10 pb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-outline/20 p-1 bg-surface-bright flex items-center justify-center font-headline-md font-bold text-lg text-primary shadow-xs">
                        <Icon name="verified" className="text-primary" />
                    </div>
                    <div>
                        <h2 className="font-headline-md text-primary leading-tight text-xl">
                            Education Dept.
                        </h2>
                        <p className="font-body-md text-xs text-on-surface-variant">
                            {role === 'admin' ? 'Correspondence Bureau' : (user?.school?.name || 'School Operator')}
                        </p>
                    </div>
                </div>
                {/* Close Button */}
                <button 
                    className="text-on-surface-variant hover:text-primary p-1 cursor-pointer rounded-lg hover:bg-surface-container-low transition-colors"
                    onClick={() => setIsOpen(false)}
                    title="Tutup Menu"
                >
                    <Icon name="close" />
                </button>
            </div>

            {/* Action Button */}
            <Link
                href={role === 'admin' ? '/admin/applications' : '/operator/applications/create'}
                className="mb-8 w-full py-3 px-4 bg-primary text-on-primary font-label-sm uppercase tracking-widest rounded-DEFAULT hover:bg-inverse-surface transition-colors flex items-center justify-center gap-2 text-xs font-semibold shadow-xs"
            >
                <Icon name="add" className="text-on-primary text-lg" />
                <span>{role === 'admin' ? 'Verifikasi Surat' : 'Pengajuan Baru'}</span>
            </Link>

            {/* Nav Links */}
            <nav className="flex-grow flex flex-col gap-1 font-label-sm text-xs uppercase tracking-widest overflow-y-auto">
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">
                    {role === 'admin' ? 'Manajemen Dinas' : 'Menu Utama'}
                </p>
                {navItems.map((item) => {
                    const isActive = isRouteActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                                isActive
                                    ? 'text-primary bg-secondary-container/40 font-bold'
                                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                            }`}
                        >
                            <Icon name={item.icon} fill={isActive} className={isActive ? 'text-primary' : 'text-on-surface-variant'} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Profile & Logout */}
            <div className="mt-auto border-t border-outline/10 pt-4 space-y-1 font-label-sm text-xs uppercase tracking-widest shrink-0">
                <Link
                    href="/profile"
                    className="flex items-center gap-4 text-on-surface-variant px-4 py-2.5 rounded-lg hover:bg-surface-container-low hover:text-primary transition-all"
                >
                    <Icon name="settings" className="text-on-surface-variant" />
                    <span>Settings</span>
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-4 text-error px-4 py-2.5 rounded-lg hover:bg-error-container/40 transition-all text-left"
                >
                    <Icon name="logout" className="text-error" />
                    <span>Sign Out</span>
                </Link>
            </div>
        </aside>
    );
}
