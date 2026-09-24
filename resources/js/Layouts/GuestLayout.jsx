import React from 'react';

/**
 * GuestLayout
 * Provides a modern, atmospheric authentication layout with Disdik KBB background image,
 * elegant dark glassmorphism overlay, and centered card.
 */
export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-zinc-950 font-sans antialiased selection:bg-zinc-900 selection:text-white overflow-y-auto">
            {/* Background Image: Gedung Disdik KBB */}
            <div 
                className="fixed inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
                style={{ backgroundImage: "url('/images/disdik-bg.jpg')" }}
            />

            {/* Dark & Blur Glass Gradient Overlay for Contrast & Readability */}
            <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/65 to-zinc-950/90 backdrop-blur-[3px]" />

            {/* Radial Vignette Effect */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.6)_100%)] pointer-events-none" />

            {/* Main Center Card */}
            <div className="relative z-10 w-full max-w-[420px] my-auto py-6 sm:py-10">
                <div className="bg-white/95 backdrop-blur-xl border border-white/70 shadow-2xl rounded-3xl p-6 sm:p-8 transition-all animate-scaleUp">
                    {children}
                </div>

                {/* Footer Credential */}
                <div className="mt-4 text-center">
                    <p className="text-[11px] text-zinc-400 font-medium tracking-wide drop-shadow-sm">
                        © 2026 Dinas Pendidikan Kabupaten Bandung Barat
                    </p>
                </div>
            </div>
        </div>
    );
}
