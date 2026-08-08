import React from 'react';

export function LogoPemkabKBB({ className = "w-20 h-24" }) {
    return (
        <svg className={className} viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 10 L180 40 V130 C180 180 100 225 100 225 C100 225 20 180 20 130 V40 L100 10 Z" fill="#0284C7" stroke="#F59E0B" strokeWidth="6" />
            <path d="M40 50 H160 V75 H40 Z" fill="#DC2626" />
            <path d="M40 75 H160 V95 H40 Z" fill="#FFFFFF" />
            <path d="M25 140 L70 90 L100 120 L130 85 L175 140 Z" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M30 155 Q60 145 100 155 T170 155 V180 C170 180 100 215 100 215 C100 215 30 180 30 180 V155 Z" fill="#0284C7" stroke="#F59E0B" strokeWidth="2" />
            <path d="M15 195 L185 195 L170 215 L100 225 L30 215 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
            <text x="100" y="210" textAnchor="middle" fill="#78350F" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">
                KAB. BANDUNG BARAT
            </text>
        </svg>
    );
}

export function LogoSekolahDefault({ schoolName = 'SD' }) {
    const initials = schoolName
        ? schoolName.split(' ').map(w => w[0]).join('').substring(0, 3)
        : 'SD';
    return (
        <svg className="w-18 h-20" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="80,10 145,45 145,135 80,170 15,135 15,45" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="4" />
            <circle cx="80" cy="85" r="45" fill="#FFFFFF" stroke="#1E3A8A" strokeWidth="3" />
            <path d="M60 100 Q80 70 100 100 Q80 90 60 100 Z" fill="#DC2626" />
            <path d="M55 105 H105 V110 H55 Z" fill="#F59E0B" />
            <text x="80" y="78" textAnchor="middle" fill="#1E3A8A" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">
                {initials}
            </text>
            <text x="80" y="152" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="Arial, sans-serif">
                SEKOLAH
            </text>
        </svg>
    );
}

export function QRCodeTTE({ className = "w-10 h-10" }) {
    return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            {/* Top Left Position Square */}
            <rect x="10" y="10" width="26" height="26" fill="#0F172A" />
            <rect x="15" y="15" width="16" height="16" fill="#FFFFFF" />
            <rect x="19" y="19" width="8" height="8" fill="#0F172A" />

            {/* Top Right Position Square */}
            <rect x="64" y="10" width="26" height="26" fill="#0F172A" />
            <rect x="69" y="15" width="16" height="16" fill="#FFFFFF" />
            <rect x="73" y="19" width="8" height="8" fill="#0F172A" />

            {/* Bottom Left Position Square */}
            <rect x="10" y="64" width="26" height="26" fill="#0F172A" />
            <rect x="15" y="69" width="16" height="16" fill="#FFFFFF" />
            <rect x="19" y="73" width="8" height="8" fill="#0F172A" />

            {/* Barcode / Data Modules */}
            <rect x="42" y="12" width="6" height="6" fill="#0F172A" />
            <rect x="52" y="12" width="6" height="6" fill="#0F172A" />
            <rect x="42" y="24" width="16" height="6" fill="#0F172A" />
            <rect x="12" y="42" width="6" height="16" fill="#0F172A" />
            <rect x="24" y="42" width="14" height="6" fill="#0F172A" />
            <rect x="42" y="42" width="16" height="16" fill="#0F172A" />
            <rect x="64" y="42" width="6" height="14" fill="#0F172A" />
            <rect x="76" y="42" width="14" height="6" fill="#0F172A" />
            <rect x="42" y="64" width="14" height="6" fill="#0F172A" />
            <rect x="64" y="64" width="12" height="12" fill="#0F172A" />
            <rect x="80" y="64" width="10" height="26" fill="#0F172A" />
            <rect x="42" y="76" width="6" height="14" fill="#0F172A" />
            <rect x="54" y="80" width="14" height="10" fill="#0F172A" />
        </svg>
    );
}

export default function HeaderKopSurat({ school, isDisdik = false }) {
    const [imgError, setImgError] = React.useState(false);

    // Reset imgError if school logo path changes
    React.useEffect(() => {
        setImgError(false);
    }, [school?.logo_kop_path]);

    if (isDisdik || !school) {
        return (
            <header className="border-b-4 border-double border-black pb-2 mb-6 font-sans text-center relative">
                <div className="flex items-center justify-between gap-4">
                    {/* Left Logo - Pemkab Bandung Barat */}
                    <div className="w-20 h-24 flex items-center justify-center shrink-0">
                        <LogoPemkabKBB className="w-18 h-22" />
                    </div>

                    {/* Center Kop Text */}
                    <div className="flex-1 text-black text-center leading-tight">
                        <h4 className="text-sm md:text-base uppercase tracking-wide font-normal">
                            PEMERINTAH KABUPATEN BANDUNG BARAT
                        </h4>
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-black mt-0.5">
                            DINAS PENDIDIKAN
                        </h3>
                        <p className="text-[10px] md:text-[11px] font-sans text-slate-800 mt-1 leading-snug">
                            Kompleks Perkantoran Pemerintah Kabupaten Bandung Barat,<br />
                            Jalan Raya Padalarang - Cisarua Km. 2, 40552, Telepon/Faximile (022) 27010112,<br />
                            Pos-el <span className="underline text-blue-900">disdik@bandungbaratkab.go.id</span>, Laman <span className="underline text-blue-900 font-semibold">www.disdikkbb.org</span>
                        </p>
                    </div>

                    {/* Right Spacer */}
                    <div className="w-20 h-24 shrink-0"></div>
                </div>
            </header>
        );
    }

    return (
        <header className="border-b-4 border-double border-black pb-2 mb-6 font-sans text-center relative">
            <div className="flex items-center justify-between gap-4">
                {/* Left Logo - School Uploaded Logo (or default School emblem) */}
                <div className="w-20 h-24 flex items-center justify-center shrink-0">
                    {school?.logo_kop_path && !imgError ? (
                        <img
                            src={school.logo_kop_path}
                            alt="Logo Sekolah"
                            className="max-w-[72px] max-h-[88px] object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <LogoSekolahDefault schoolName={school?.name} />
                    )}
                </div>

                {/* Center Kop Text */}
                <div className="flex-1 text-black text-center leading-tight">
                    <h4 className="text-xs md:text-sm uppercase tracking-wide font-normal">
                        PEMERINTAH KABUPATEN BANDUNG BARAT
                    </h4>
                    <h3 className="text-sm md:text-base font-bold uppercase tracking-wide text-black mt-0.5">
                        DINAS PENDIDIKAN
                    </h3>
                    <h2 className="text-base md:text-xl font-extrabold uppercase tracking-wider text-black mt-0.5">
                        {school?.name || 'SD NEGERI 1 PADALARANG'}
                    </h2>
                    <p className="text-[10px] md:text-[11px] font-sans text-slate-800 mt-1 leading-snug">
                        {school?.address || 'Jl. Raya Padalarang No. 120, Padalarang, Bandung Barat'}
                        {school?.phone && ` • Telp: ${school.phone}`}
                        {school?.email && ` • Email: ${school.email}`}
                    </p>
                </div>

                {/* Right Spacer (Balancing layout with left logo, no anomaly logo) */}
                <div className="w-20 h-24 shrink-0"></div>
            </div>
        </header>
    );
}
