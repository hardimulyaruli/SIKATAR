import React from 'react';

export default function HeaderKopSurat({ school }) {
    return (
        <header className="border-b-4 border-double border-slate-900 pb-3 mb-6 font-serif-garamond text-center relative">
            <div className="flex items-center justify-between gap-4">
                {/* Left Logo - KBB Logo Badge Placeholder or Icon */}
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                    <div className="w-14 h-14 rounded-full bg-blue-900 text-white flex flex-col items-center justify-center font-bold text-[10px] leading-tight border-2 border-amber-400 shadow-sm">
                        <span>KBB</span>
                        <span className="text-[7px] text-amber-300">DISDIK</span>
                    </div>
                </div>

                {/* Center Kop Text */}
                <div className="flex-1 text-slate-900">
                    <h4 className="text-xs md:text-sm uppercase tracking-widest font-semibold">
                        Pemerintah Kabupaten Bandung Barat
                    </h4>
                    <h3 className="text-base md:text-xl font-bold uppercase tracking-wide text-blue-950">
                        Dinas Pendidikan
                    </h3>
                    <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wider text-slate-900 mt-0.5">
                        {school?.name || 'SD NEGERI 1 PADALARANG'}
                    </h2>
                    <p className="text-[11px] font-sans-inter text-slate-600 mt-1 leading-snug">
                        {school?.address || 'Jl. Raya Padalarang No. 120, Kec. Padalarang, Kabupaten Bandung Barat'}
                        {school?.phone && ` • Telp: ${school.phone}`}
                        {school?.email && ` • Email: ${school.email}`}
                    </p>
                </div>

                {/* Right Logo - School Custom Logo */}
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                    {school?.logo_kop_path ? (
                        <img
                            src={school.logo_kop_path}
                            alt="Logo Sekolah"
                            className="w-14 h-14 object-contain"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-300 border-dashed flex items-center justify-center text-[9px] text-slate-400 font-sans-inter text-center p-1">
                            Logo Sekolah
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
