/**
 * stampGenerator.js
 * -------------------------------------------------------------------------
 * Modul pembuat Cap / Stempel Resmi Dinas Sekolah Indonesia (Single Responsibility Principle).
 * Menghasilkan stempel bulat resmi pemerintah daerah & dinas pendidikan:
 * - Lingkaran ganda konsentris resmi
 * - Teks melengkung atas: PEMERINTAH KABUPATEN BANDUNG BARAT
 * - Bintang pemisah kiri & kanan (★)
 * - Teks melengkung bawah: DINAS PENDIDIKAN
 * - Teks tengah: Nama Satuan Pendidikan (misal: SD NEGERI 1 PADALARANG)
 * - Warna tinta stempel ungu basah khas Indonesia (#6b21a8 / #7c3aed)
 * - Tekstur distorsi tinta stempel basah (subtle ink bleed & distress)
 * -------------------------------------------------------------------------
 */

/**
 * Menghasilkan string SVG stempel dinas sekolah resmi.
 * @param {string} schoolName
 * @param {Object} [options]
 * @returns {string} SVG string
 */
export function generateSchoolStampSvg(schoolName = 'SD NEGERI 1 PADALARANG', options = {}) {
    const {
        regency = 'PEMERINTAH KABUPATEN BANDUNG BARAT',
        department = 'DINAS PENDIDIKAN',
        color = '#6b21a8', // Tinta stempel ungu basah resmi Indonesia
    } = options;

    const rawName = (schoolName || 'SD NEGERI 1 PADALARANG').trim().toUpperCase();
    const words = rawName.split(/\s+/);
    let line1 = '';
    let line2 = '';

    if (words.length <= 2) {
        line1 = words.join(' ');
    } else if (words.length === 3) {
        line1 = words.slice(0, 2).join(' ');
        line2 = words.slice(2).join(' ');
    } else {
        const mid = Math.ceil(words.length / 2);
        line1 = words.slice(0, mid).join(' ');
        line2 = words.slice(mid).join(' ');
    }

    // Hitung ukuran font adaptif agar tidak meluber
    const fontSizeTop = regency.length > 32 ? 11 : 12.5;
    const fontSizeLine1 = line1.length > 16 ? 12 : 13.5;
    const fontSizeLine2 = line2.length > 16 ? 12 : 13.5;

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <defs>
        <!-- Busur Atas: Melengkung ke atas dari kiri ke kanan -->
        <path id="topArcPath" d="M 40,150 A 110,110 0 0,1 260,150" fill="none" />
        <!-- Busur Bawah: Melengkung ke bawah dari kanan ke kiri agar teks tegak terbaca -->
        <path id="bottomArcPath" d="M 260,150 A 110,110 0 0,1 40,150" fill="none" />
        <!-- Filter tekstur stempel basah (subtle ink distress & bleeding) -->
        <filter id="wetStampFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    </defs>

    <g filter="url(#wetStampFilter)" fill="none" stroke="${color}" stroke-linecap="round">
        <!-- Lingkaran Luar Tebal (Batas Utama Stempel) -->
        <circle cx="150" cy="150" r="140" stroke-width="4.2" />
        <!-- Lingkaran Luar Kedua Tipis -->
        <circle cx="150" cy="150" r="132" stroke-width="1.8" />
        <!-- Lingkaran Dalam Pembatas Teks Melengkung -->
        <circle cx="150" cy="150" r="86" stroke-width="2.2" />

        <!-- Garis Horizontal Kembar Pemisah Nama Sekolah di Tengah -->
        <line x1="88" y1="126" x2="212" y2="126" stroke-width="2.2" />
        <line x1="88" y1="174" x2="212" y2="174" stroke-width="2.2" />

        <!-- Bintang Pemisah Segi Lima Sisi Kiri & Kanan -->
        <text x="46" y="156" fill="${color}" stroke="none" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">★</text>
        <text x="254" y="156" fill="${color}" stroke="none" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">★</text>

        <!-- Teks Lengkung Atas: PEMERINTAH KABUPATEN BANDUNG BARAT -->
        <text fill="${color}" stroke="none" font-family="'Arial Black', Impact, Arial, sans-serif" font-weight="900" font-size="${fontSizeTop}" letter-spacing="1.2">
            <textPath href="#topArcPath" startOffset="50%" text-anchor="middle">
                ${regency}
            </textPath>
        </text>

        <!-- Teks Lengkung Bawah: DINAS PENDIDIKAN -->
        <text fill="${color}" stroke="none" font-family="'Arial Black', Impact, Arial, sans-serif" font-weight="900" font-size="14.5" letter-spacing="3.5">
            <textPath href="#bottomArcPath" startOffset="50%" text-anchor="middle">
                ${department}
            </textPath>
        </text>

        <!-- Teks Tengah: Nama Satuan Pendidikan -->
        ${line2 ? `
            <text x="150" y="146" fill="${color}" stroke="none" font-family="'Arial Black', Impact, Arial, sans-serif" font-weight="900" font-size="${fontSizeLine1}" letter-spacing="0.5" text-anchor="middle">${line1}</text>
            <text x="150" y="165" fill="${color}" stroke="none" font-family="'Arial Black', Impact, Arial, sans-serif" font-weight="900" font-size="${fontSizeLine2}" letter-spacing="0.5" text-anchor="middle">${line2}</text>
        ` : `
            <text x="150" y="156" fill="${color}" stroke="none" font-family="'Arial Black', Impact, Arial, sans-serif" font-weight="900" font-size="14.5" letter-spacing="0.8" text-anchor="middle">${line1}</text>
        `}
    </g>
</svg>
`.trim();
}

/**
 * Menghasilkan Data URL SVG stempel resmi.
 * @param {string} schoolName
 * @param {Object} [options]
 * @returns {string} Data URL
 */
export function generateSchoolStampDataUrl(schoolName, options = {}) {
    const svg = generateSchoolStampSvg(schoolName, options);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Menghasilkan objek File (image/png) dari stempel SVG untuk diunggah ke backend.
 * @param {string} schoolName
 * @param {Object} [options]
 * @returns {Promise<File>}
 */
export function generateSchoolStampFile(schoolName, options = {}) {
    return new Promise((resolve, reject) => {
        const svg = generateSchoolStampSvg(schoolName, options);
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 400, 400);

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Gagal menghasilkan blob stempel'));
                    return;
                }
                const file = new File([blob], 'cap_stempel_resmi.png', {
                    type: 'image/png',
                    lastModified: Date.now(),
                });
                resolve(file);
            }, 'image/png');
        };

        img.onerror = (err) => reject(err);
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    });
}
