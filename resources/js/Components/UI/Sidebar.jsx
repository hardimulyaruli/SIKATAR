import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';
import { LogoPemkabKBB, LogoSekolahDefault } from '@/Components/Letter/HeaderKopSurat';

export default function Sidebar({ isOpen = true, setIsOpen }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const role = user?.role || 'operator';
    const isStaff = ['staff_kepala', 'staff_biasa', 'admin'].includes(role);
    const isStaffKepala = ['staff_kepala', 'admin'].includes(role);

    const [livePhotoPreview, setLivePhotoPreview] = React.useState(null);
    const [imgError, setImgError] = React.useState(false);

    React.useEffect(() => {
        setImgError(false);
    }, [user?.profile_photo_path, livePhotoPreview, user?.school?.logo_kop_path]);

    React.useEffect(() => {
        const handlePhotoUpdate = (event) => {
            if (event.detail !== undefined) {
                setLivePhotoPreview(event.detail.previewUrl);
            }
        };
        window.addEventListener('profile-photo-updated', handlePhotoUpdate);
        return () => window.removeEventListener('profile-photo-updated', handlePhotoUpdate);
    }, []);

    const activeDisdikLogo = livePhotoPreview !== null ? livePhotoPreview : user?.profile_photo_path;

    const operatorNav = [
        { name: 'Dashboard', href: '/operator/dashboard', icon: 'drafts' },
        { name: 'Kepegawaian', href: '/operator/employees', icon: 'badge' },
        { name: 'Arsip Pegawai', href: '/operator/employees-archived', icon: 'archive' },
        { name: 'Pengajuan', href: '/operator/applications/create', icon: 'add_card' },
        { name: 'Status Pengajuan', href: '/operator/applications', icon: 'inventory_2' },
    ];

    const staffKepalaNav = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'drafts' },
        { name: 'Kepegawaian', href: '/admin/employees', icon: 'badge' },
        { name: 'DUK PNS', href: '/admin/duk', icon: 'format_list_numbered' },
        { name: 'Pengajuan Surat', href: '/admin/applications', icon: 'gavel' },
        { name: 'Pengajuan Hapus', href: '/admin/deletion-requests', icon: 'person_remove' },
        { name: 'Sekolah KBB', href: '/admin/schools', icon: 'school' },
    ];

    const staffBiasaNav = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'drafts' },
        { name: 'Kepegawaian', href: '/admin/employees', icon: 'badge' },
        { name: 'DUK PNS', href: '/admin/duk', icon: 'format_list_numbered' },
        { name: 'Pengajuan Surat', href: '/admin/applications', icon: 'gavel' },
    ];

    const navItems = !isStaff ? operatorNav : (isStaffKepala ? staffKepalaNav : staffBiasaNav);

    const roleTitle = isStaffKepala
        ? 'Kepala Staf Disdik'
        : (role === 'staff_biasa' ? 'Staf Verifikator Disdik' : 'Operator Kepegawaian');

    const isRouteActive = (targetHref) => {
        if (targetHref === '/operator/applications' || targetHref === '/admin/applications') {
            return url === targetHref || (url.startsWith(targetHref) && !url.startsWith(targetHref + '/create'));
        }
        return url === targetHref || url.startsWith(targetHref + '?') || url.startsWith(targetHref + '/');
    };

    return (
        <aside 
            className={`fixed left-0 top-0 z-50 h-screen w-72 flex-col py-8 px-6 bg-white/85 backdrop-blur-2xl border-r border-zinc-200/90 shadow-sm transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } flex`}
        >
            {/* Header / Role-Based Department Seal */}
            <div className="mb-8 flex items-center justify-between border-b border-zinc-200/80 pb-6">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Role / School Profile Circular Logo */}
                    <div className="w-11 h-11 rounded-full border border-zinc-300 bg-white flex items-center justify-center shrink-0 shadow-xs overflow-hidden p-0.5">
                        {isStaff ? (
                            (activeDisdikLogo && !imgError) ? (
                                <img 
                                    src={activeDisdikLogo} 
                                    alt="Logo Dinas Pendidikan" 
                                    className="w-full h-full rounded-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <LogoPemkabKBB className="w-7 h-9 shrink-0" />
                            )
                        ) : (
                            (user?.school?.logo_kop_path && !imgError) ? (
                                <img 
                                    src={user.school.logo_kop_path} 
                                    alt="Logo Sekolah" 
                                    className="w-8 h-8 rounded-full object-contain"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <LogoSekolahDefault schoolName={user?.school?.name} />
                            )
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="font-bold text-zinc-950 leading-tight text-sm md:text-base line-clamp-2" title={isStaff ? 'Dinas Pendidikan KBB' : (user?.school?.name || 'SD NEGERI 1 PADALARANG')}>
                            {isStaff ? 'Dinas Pendidikan KBB' : (user?.school?.name || 'SD NEGERI 1 PADALARANG')}
                        </h2>
                        <p className="text-xs text-zinc-500 font-medium mt-0.5">
                            {roleTitle}
                        </p>
                    </div>
                </div>
                {/* Close Button */}
                <button 
                    className="text-zinc-500 hover:text-zinc-950 p-1 cursor-pointer rounded-lg hover:bg-zinc-100 transition-colors shrink-0 ml-1"
                    onClick={() => setIsOpen(false)}
                    title="Tutup Menu"
                >
                    <Icon name="close" />
                </button>
            </div>

            {/* Action Button */}
            <Link
                href={isStaff ? '/admin/applications' : '/operator/applications/create'}
                className="mb-8 w-full py-2.5 px-4 bg-zinc-900/90 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-zinc-800 backdrop-blur-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
                <Icon name="add" className="text-white text-lg" />
                <span>{isStaff ? 'Verifikasi Surat' : 'Pengajuan Baru'}</span>
            </Link>

            {/* Nav Links */}
            <nav className="flex-grow flex flex-col gap-1 text-xs uppercase tracking-widest overflow-y-auto">
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    {isStaff ? 'Manajemen Dinas' : 'Menu Utama'}
                </p>
                {navItems.map((item) => {
                    const isActive = isRouteActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all ${
                                isActive
                                    ? 'text-zinc-950 bg-zinc-100/90 font-bold border border-zinc-200/90 shadow-2xs'
                                    : 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950 font-medium'
                            }`}
                        >
                            <Icon name={item.icon} fill={isActive} className={isActive ? 'text-zinc-950' : 'text-zinc-500'} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Profile & Logout */}
            <div className="mt-auto border-t border-zinc-200/80 pt-4 space-y-1 text-xs uppercase tracking-widest shrink-0">
                <Link
                    href="/profile"
                    className="flex items-center gap-3.5 text-zinc-600 px-3.5 py-2.5 rounded-xl hover:bg-zinc-100/80 hover:text-zinc-950 transition-all font-semibold"
                >
                    <Icon name="settings" className="text-zinc-500" />
                    <span>Settings</span>
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                            sessionStorage.clear();
                        }
                    }}
                    className="w-full flex items-center gap-3.5 text-zinc-800 px-3.5 py-2.5 rounded-xl hover:bg-zinc-100/80 hover:text-zinc-950 transition-all text-left font-semibold cursor-pointer"
                >
                    <Icon name="logout" className="text-zinc-600" />
                    <span>Sign Out</span>
                </Link>
            </div>
        </aside>
    );
}
