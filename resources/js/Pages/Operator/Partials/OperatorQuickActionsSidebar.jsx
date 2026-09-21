import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

/**
 * OperatorQuickActionsSidebar renders shortcut links and system status indicator for school operators.
 * Single Responsibility: Presenting dashboard quick action shortcuts and network health.
 */
export default function OperatorQuickActionsSidebar() {
    return (
        <aside className="lg:col-span-4 space-y-8">
            {/* Quick Actions Card */}
            <div className="bg-surface-container-lowest border border-outline/10 p-6 rounded-DEFAULT shadow-xs">
                <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-6 border-b border-outline/10 pb-2">
                    Quick Actions
                </h3>
                <ul className="space-y-4 font-body-md text-sm">
                    <li>
                        <Link
                            href="/operator/applications/create"
                            className="w-full flex items-center justify-between text-left group py-1"
                        >
                            <span className="text-primary group-hover:text-secondary transition-colors font-medium">
                                Buat Surat Permohonan Baru
                            </span>
                            <Icon
                                name="arrow_forward"
                                className="text-outline text-sm group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/operator/profile"
                            className="w-full flex items-center justify-between text-left group py-1"
                        >
                            <span className="text-primary group-hover:text-secondary transition-colors font-medium">
                                Atur Profil & Logo Kop Surat
                            </span>
                            <Icon
                                name="arrow_forward"
                                className="text-outline text-sm group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/operator/applications"
                            className="w-full flex items-center justify-between text-left group py-1"
                        >
                            <span className="text-primary group-hover:text-secondary transition-colors font-medium">
                                Arsip & Lacak Status Surat
                            </span>
                            <Icon
                                name="arrow_forward"
                                className="text-outline text-sm group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Network / Disdik Service Status Card */}
            <div className="bg-surface-container-lowest border border-outline/10 p-6 rounded-DEFAULT shadow-xs">
                <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-4 border-b border-outline/10 pb-2">
                    Disdik Network Status
                </h3>
                <div className="space-y-3 font-body-md text-xs">
                    <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Layanan Disdik KBB</span>
                        <span className="flex items-center gap-1.5 font-label-sm text-primary uppercase tracking-widest text-[10px]">
                            <span className="w-2 h-2 rounded-full bg-primary block"></span> Online
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Server Verifikasi</span>
                        <span className="flex items-center gap-1.5 font-label-sm text-primary uppercase tracking-widest text-[10px]">
                            <span className="w-2 h-2 rounded-full bg-primary block"></span> Active
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
