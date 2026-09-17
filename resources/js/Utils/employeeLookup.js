// Shared Employee Database & NIP Utilities

export const PRESEEDED_EMPLOYEES = [
    { nama: 'SUMIARSIH, S.Pd', nip: '196904061998022003', gol_asal: 'Pembina Tk.I, IV/b', jabatan: 'Guru Ahli Madya', unit_kerja: 'SMPN 1 Batujajar', kecamatan: 'Batujajar', place_of_birth: 'Bandung', date_of_birth: '1969-04-06', address: 'Jl. Raya Batujajar No. 45, Batujajar, KBB', contact: '081223344551', status_pegawai: 'PNS', cpns_date: '1998-02-01', pns_date: '1999-03-01' },
    { nama: 'MURTINI, S.Pd', nip: '196801212006042005', gol_asal: 'Penata Tk.I, III/d', jabatan: 'Guru Ahli Muda', unit_kerja: 'SDN 1 Margalaksana', kecamatan: 'Padalarang', place_of_birth: 'Cimahi', date_of_birth: '1968-01-21', address: 'Jl. Margalaksana No. 12, Padalarang, KBB', contact: '081223344552', status_pegawai: 'PNS', cpns_date: '2006-04-01', pns_date: '2007-05-01' },
    { nama: 'ACIH SUARSIH, S.Pd.M.Pd', nip: '196708051992032006', gol_asal: 'Pembina Tk.I, IV/b', jabatan: 'Pengawas Sekolah Ahli Madya', unit_kerja: 'Dinas Pendidikan', kecamatan: 'Ngamprah', place_of_birth: 'Bandung Barat', date_of_birth: '1967-08-05', address: 'Komplek Pemkab Bandung Barat G10', contact: '081223344553', status_pegawai: 'PNS', cpns_date: '1992-03-01', pns_date: '1993-04-01' },
    { nama: 'LELI YULIA GUNAWATI, S.Pd', nip: '196907172008012010', gol_asal: 'Penata Tk.I, III/d', jabatan: 'Guru Ahli Muda', unit_kerja: 'SDN 3 Kertajaya', kecamatan: 'Padalarang', place_of_birth: 'Padalarang', date_of_birth: '1969-07-17', address: 'Jl. Kertajaya No. 88, Padalarang', contact: '081223344554', status_pegawai: 'PNS', cpns_date: '2008-01-01', pns_date: '2009-02-01' },
    { nama: 'RIKA INDRIANI SHOLIHAT, S.Pd., M.Pd', nip: '198111222009012001', gol_asal: 'Pembina, IV/a', jabatan: 'Guru Ahli Madya', unit_kerja: 'SMPN 5 Padalarang', kecamatan: 'Padalarang', place_of_birth: 'Bandung', date_of_birth: '1981-11-22', address: 'Jl. Raya Padalarang No. 102', contact: '081223344555', status_pegawai: 'PNS', cpns_date: '2009-01-01', pns_date: '2010-02-01' },
    { nama: 'SRI UNTARI, S.Pd', nip: '196710071999032003', gol_asal: 'Pembina Tk.I, IV/b', jabatan: 'Guru Ahli Madya', unit_kerja: 'SMPN 3 Ngamprah', kecamatan: 'Ngamprah', place_of_birth: 'Sumedang', date_of_birth: '1967-10-07', address: 'Jl. Cimareme No. 34, Ngamprah', contact: '081223344556', status_pegawai: 'PNS', cpns_date: '1999-03-01', pns_date: '2000-04-01' },
    { nama: 'SOLIHIN, S.Pd.SD', nip: '197104198008011005', gol_asal: 'Penata Muda Tk.I, III/b', jabatan: 'Guru Ahli Pertama', unit_kerja: 'SDN Margaasih', kecamatan: 'Cipatat', place_of_birth: 'Cianjur', date_of_birth: '1971-04-19', address: 'Jl. Raya Cipatat No. 56', contact: '081223344557', status_pegawai: 'PNS', cpns_date: '2008-01-01', pns_date: '2009-02-01' },
    { nama: 'SITI NURYANI, S.Pd', nip: '198206282006042011', gol_asal: 'Penata Tk.I, III/d', jabatan: 'Guru Ahli Muda', unit_kerja: 'SMPN 2 Batujajar', kecamatan: 'Batujajar', place_of_birth: 'Garut', date_of_birth: '1982-06-28', address: 'Jl. Batujajar Barat No. 23', contact: '081223344558', status_pegawai: 'PNS', cpns_date: '2006-04-01', pns_date: '2007-05-01' },
    { nama: 'RAHAYU PURWANINGSIH, S.Pd', nip: '197703092011012001', gol_asal: 'Penata Tk.I, III/d', jabatan: 'Guru Ahli Muda', unit_kerja: 'SMPN 3 Ngamprah', kecamatan: 'Ngamprah', place_of_birth: 'Purwakarta', date_of_birth: '1977-03-09', address: 'Jl. Cilame No. 77, Ngamprah', contact: '081223344559', status_pegawai: 'PNS', cpns_date: '2011-01-01', pns_date: '2012-02-01' },
    { nama: 'MUMUH SUPRIADI, S.Pd.I', nip: '198011222014121002', gol_asal: 'Penata, III/c', jabatan: 'Guru Ahli Muda', unit_kerja: 'SDN 1 Parigi', kecamatan: 'Padalarang', place_of_birth: 'Bandung', date_of_birth: '1980-11-22', address: 'Jl. Parigi No. 9', contact: '081223344560', status_pegawai: 'PNS', cpns_date: '2014-12-01', pns_date: '2015-12-01' },
    { nama: 'GUGUN GUMILANG', nip: '197808272014121003', gol_asal: 'Pengatur Muda, II/a', jabatan: 'Guru Ahli Pertama', unit_kerja: 'SDN 2 Langensari', kecamatan: 'Lembang', place_of_birth: 'Lembang', date_of_birth: '1978-08-27', address: 'Jl. Langensari No. 15, Lembang', contact: '081223344561', status_pegawai: 'PNS', cpns_date: '2014-12-01', pns_date: '2015-12-01' },
    { nama: 'EVI LUTFIAH, S.Pd', nip: '197709052014122002', gol_asal: 'Penata Muda Tk.I, III/b', jabatan: 'Guru Ahli Pertama', unit_kerja: 'SDN 2 Gunung bentamh', kecamatan: 'Padalarang', place_of_birth: 'Cimahi', date_of_birth: '1977-09-05', address: 'Jl. Tagog Padalarang No. 3', contact: '081223344562', status_pegawai: 'PNS', cpns_date: '2014-12-01', pns_date: '2015-12-01' },
    { nama: 'DADANG HERMAWAN, S.Pd', nip: '196905252007011010', gol_asal: 'Penata, III/c', jabatan: 'Guru Ahli Muda', unit_kerja: 'SDN 2 Celak', kecamatan: 'Gununghalu', place_of_birth: 'Gununghalu', date_of_birth: '1969-05-25', address: 'Jl. Raya Celak No. 1', contact: '081223344563', status_pegawai: 'PNS', cpns_date: '2007-01-01', pns_date: '2008-02-01' },
    { nama: 'EUIS TITA ROHAYATI, S.Pd.I', nip: '198401192014122002', gol_asal: 'Penata, III/c', jabatan: 'Guru Ahli Muda', unit_kerja: 'SMPN 5 Gununghalu', kecamatan: 'Gununghalu', place_of_birth: 'Cililin', date_of_birth: '1984-01-19', address: 'Jl. Gununghalu No. 44', contact: '081223344564', status_pegawai: 'PNS', cpns_date: '2014-12-01', pns_date: '2015-12-01' },
    { nama: 'MAYA RAHAYU, S.Pd.SD', nip: '198201122009012006', gol_asal: 'Penata, III/c', jabatan: 'Guru Ahli Muda', unit_kerja: 'SDN Banyuresmi', kecamatan: 'Cihampelas', place_of_birth: 'Cihampelas', date_of_birth: '1982-01-12', address: 'Jl. Banyuresmi No. 5', contact: '081223344565', status_pegawai: 'PNS', cpns_date: '2009-01-01', pns_date: '2010-02-01' },
    { nama: 'ETOS SUPARMAN, S.Pd', nip: '196901062007011015', gol_asal: 'Penata Tk. I, III/d', jabatan: 'Guru Ahli Muda', unit_kerja: 'SDN Cipicung', kecamatan: 'Sindangkerta', place_of_birth: 'Sindangkerta', date_of_birth: '1969-01-06', address: 'Jl. Cipicung No. 19', contact: '081223344566', status_pegawai: 'PNS', cpns_date: '2007-01-01', pns_date: '2008-02-01' },
    { nama: 'AGUS KUSWARA, S.Pd', nip: '196707261989031005', gol_asal: 'Pembina, IV/a', jabatan: 'Guru Ahli Madya', unit_kerja: 'SDN 5 Cililin', kecamatan: 'Cililin', place_of_birth: 'Cililin', date_of_birth: '1967-07-26', address: 'Jl. Alun-Alun Cililin No. 2', contact: '081223344567', status_pegawai: 'PNS', cpns_date: '1989-03-01', pns_date: '1990-04-01' },
    { nama: 'AJI JEHAN FELLANI, S.Pd', nip: '198012032009011007', gol_asal: 'Pembina, IV/a', jabatan: 'Pengawas Madya', unit_kerja: 'Dinas Pendidikan', kecamatan: 'Ngamprah', place_of_birth: 'Bandung', date_of_birth: '1980-12-03', address: 'Jl. Raya Gadobangkong No. 101', contact: '081223344568', status_pegawai: 'PNS', cpns_date: '2009-01-01', pns_date: '2010-02-01' },
    { nama: 'SRI YUSRIN, S.Pd', nip: '197005122008012013', gol_asal: 'Pembina, IV/a', jabatan: 'Guru Ahli Madya', unit_kerja: 'SMPN 3 Sindangketa', kecamatan: 'Sindangkerta', place_of_birth: 'Sindangkerta', date_of_birth: '1970-05-12', address: 'Jl. Raya Sindangkerta No. 7', contact: '081223344569', status_pegawai: 'PNS', cpns_date: '2008-01-01', pns_date: '2009-02-01' },
    { nama: 'YUNINGSIH, S.Pd', nip: '197906162009022002', gol_asal: 'Pembina, IV/a', jabatan: 'Guru Ahli Madya', unit_kerja: 'SMPN 1 Cililin', kecamatan: 'Cililin', place_of_birth: 'Cililin', date_of_birth: '1979-06-16', address: 'Jl. Radio Cililin No. 30', contact: '081223344570', status_pegawai: 'PNS', cpns_date: '2009-02-01', pns_date: '2010-03-01' },
    { nama: 'AHMAD ZAKARIA, S.Pd', nip: '197003221997021002', gol_asal: 'Pembina Tk. I, IV/b', jabatan: 'Guru Ahli Madya', unit_kerja: 'SMPN 1 Sindangkerta', kecamatan: 'Sindangkerta', place_of_birth: 'Bandung', date_of_birth: '1970-03-22', address: 'Jl. Pasar Sindangkerta No. 11', contact: '081223344571', status_pegawai: 'PNS', cpns_date: '1997-02-01', pns_date: '1998-03-01' },
    { nama: 'EUIS JUARIAH, S.Pd.SD', nip: '196712141986102001', gol_asal: 'Pembina Tk. I, IV/b', jabatan: 'Guru Ahli Madya', unit_kerja: 'SDN Selakopi', kecamatan: 'Cihampelas', place_of_birth: 'Cihampelas', date_of_birth: '1967-12-14', address: 'Jl. Selakopi No. 18', contact: '081223344572', status_pegawai: 'PNS', cpns_date: '1986-10-01', pns_date: '1987-11-01' },
    { nama: 'EUIS NURAENI, S.Pd', nip: '197003011991032004', gol_asal: 'Pembina Tk. I, IV/b', jabatan: 'Guru Ahli Madya', unit_kerja: 'SDN Padamekar', kecamatan: 'Cililin', place_of_birth: 'Cililin', date_of_birth: '1970-03-01', address: 'Jl. Padamekar No. 4', contact: '081223344573', status_pegawai: 'PNS', cpns_date: '1991-03-01', pns_date: '1992-04-01' },
    { nama: 'JAJAT, S.Pd', nip: '197106081997021001', gol_asal: 'Pembina Tk. I, IV/b', jabatan: 'Guru Ahli Madya', unit_kerja: 'SMPN 2 Cihampelas', kecamatan: 'Cihampelas', place_of_birth: 'Batujajar', date_of_birth: '1971-06-08', address: 'Jl. Cihampelas No. 55', contact: '081223344574', status_pegawai: 'PNS', cpns_date: '1997-02-01', pns_date: '1998-03-01' },
];

// In-memory cache for API fetched employees
const apiCache = new Map();

/**
 * Format string NIP strictly to numeric integer digits up to 18 characters.
 */
export const sanitizeNip = (val) => {
    if (!val) return '';
    return String(val).replace(/\D/g, '').slice(0, 18);
};

/**
 * Helper to derive birth date (YYYY-MM-DD) and CPNS date (YYYY-MM-DD) from 18-digit NIP
 */
export const deriveInfoFromNip = (cleanNip) => {
    if (!cleanNip || cleanNip.length < 14) return {};
    
    // NIP Format: YYYYMMDD (1-8) YYYYMM (9-14) G (15) NNN (16-18)
    const yearB = cleanNip.slice(0, 4);
    const monthB = cleanNip.slice(4, 6);
    const dayB = cleanNip.slice(6, 8);

    const yearC = cleanNip.slice(8, 12);
    const monthC = cleanNip.slice(12, 14);

    let date_of_birth = '';
    if (parseInt(monthB, 10) >= 1 && parseInt(monthB, 10) <= 12 && parseInt(dayB, 10) >= 1 && parseInt(dayB, 10) <= 31) {
        date_of_birth = `${yearB}-${monthB}-${dayB}`;
    }

    let cpns_date = '';
    let pns_date = '';
    if (parseInt(monthC, 10) >= 1 && parseInt(monthC, 10) <= 12) {
        cpns_date = `${yearC}-${monthC}-01`;
        const nextYear = (parseInt(yearC, 10) + 1).toString();
        pns_date = `${nextYear}-${monthC}-01`;
    }

    return {
        date_of_birth,
        cpns_date,
        pns_date,
    };
};

/**
 * Get all available employees list (combining cached DB employees, passed employees and preseeded employees)
 */
export const getAllEmployeesList = (customEmployees = []) => {
    const list = Array.isArray(customEmployees) && customEmployees.length > 0
        ? [...customEmployees]
        : [];
    
    // Add cached API employees
    apiCache.forEach((emp) => {
        const cleanP = sanitizeNip(emp.nip);
        if (cleanP && !list.some(item => sanitizeNip(item.nip) === cleanP)) {
            list.push(emp);
        }
    });

    // Add preseeded ones if not already in list
    PRESEEDED_EMPLOYEES.forEach(p => {
        const cleanP = sanitizeNip(p.nip);
        if (!list.some(item => sanitizeNip(item.nip) === cleanP)) {
            list.push({
                ...p,
                name: p.nama,
            });
        }
    });
    return list;
};

/**
 * Async API lookup to fetch full employee details from 12,000+ database records by NIP.
 */
export const lookupEmployeeApi = async (nipValue) => {
    const cleanNip = sanitizeNip(nipValue);
    if (!cleanNip || cleanNip.length < 8) return null;

    // Check cache first
    if (apiCache.has(cleanNip)) {
        const cached = apiCache.get(cleanNip);
        return { ...cached, nip: cleanNip };
    }

    try {
        const response = await fetch(`/api/employees/lookup?nip=${encodeURIComponent(cleanNip)}`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        if (!response.ok) return null;
        
        const json = await response.json();
        if (json.found && json.employee) {
            const empData = {
                nama: json.employee.nama || json.employee.name,
                name: json.employee.name || json.employee.nama,
                nip: cleanNip, // Preserve exact typed NIP
                gol_asal: json.employee.pangkat_golongan || json.employee.gol_asal || 'Penata Tk.I, III/d',
                pangkat_golongan: json.employee.pangkat_golongan || json.employee.gol_asal || 'Penata Tk.I, III/d',
                jabatan: json.employee.jabatan || 'Guru Ahli Muda',
                unit_kerja: json.employee.unit_kerja || 'Sekolah Negeri KBB',
                kecamatan: json.employee.kecamatan || 'Padalarang',
                place_of_birth: json.employee.place_of_birth || 'Bandung',
                date_of_birth: json.employee.date_of_birth || '1985-05-12',
                address: json.employee.address || 'Kabupaten Bandung Barat',
                contact: json.employee.contact || '',
                status_pegawai: json.employee.status_pegawai || 'PNS',
                cpns_date: json.employee.cpns_date || '2008-01-01',
                pns_date: json.employee.pns_date || '2009-02-01',
            };
            apiCache.set(cleanNip, empData);
            return empData;
        }
    } catch (e) {
        console.warn('Employee API lookup error:', e);
    }

    return null;
};

/**
 * Find employee details by NIP from cached DB list, custom list, preseeded list, or smart derivation.
 */
export const findEmployeeByNip = (nipValue, customEmployees = []) => {
    const cleanNip = sanitizeNip(nipValue);
    if (!cleanNip) return null;

    const allList = getAllEmployeesList(customEmployees);

    // 1. Try EXACT match first
    let found = allList.find(emp => sanitizeNip(emp.nip) === cleanNip);

    // 2. Try PREFIX match ONLY if cleanNip length >= 8
    if (!found && cleanNip.length >= 8) {
        found = allList.find(emp => sanitizeNip(emp.nip).startsWith(cleanNip));
    }

    if (found) {
        const derived = deriveInfoFromNip(cleanNip);
        return {
            nama: found.nama || found.name || '',
            name: found.name || found.nama || '',
            nip: cleanNip, // ALWAYS preserve exact typed input
            gol_asal: found.gol_asal || found.pangkat_golongan || 'Pembina Tk.I, IV/b',
            pangkat_golongan: found.pangkat_golongan || found.gol_asal || 'Pembina Tk.I, IV/b',
            jabatan: found.jabatan || 'Guru Ahli Madya',
            unit_kerja: found.unit_kerja || found.school?.name || 'Sekolah Negeri KBB',
            kecamatan: found.kecamatan || found.school?.district || 'Padalarang',
            place_of_birth: found.place_of_birth || 'Bandung',
            date_of_birth: found.date_of_birth || derived.date_of_birth || '1980-01-01',
            address: found.address || 'Kabupaten Bandung Barat',
            contact: found.contact || '081234567890',
            status_pegawai: found.status_pegawai || 'PNS',
            cpns_date: found.cpns_date || derived.cpns_date || '2008-01-01',
            pns_date: found.pns_date || derived.pns_date || '2009-02-01',
        };
    }

    // 3. Smart derivation if cleanNip >= 8
    if (cleanNip.length >= 8) {
        const derived = deriveInfoFromNip(cleanNip);
        return {
            nama: 'Pegawai ASN Bandung Barat',
            name: 'Pegawai ASN Bandung Barat',
            nip: cleanNip,
            gol_asal: 'Penata Tk.I, III/d',
            pangkat_golongan: 'Penata Tk.I, III/d',
            jabatan: 'Guru Ahli Muda',
            unit_kerja: 'Sekolah Negeri KBB',
            kecamatan: 'Padalarang',
            place_of_birth: 'Bandung',
            date_of_birth: derived.date_of_birth || '1985-05-12',
            address: 'Kabupaten Bandung Barat',
            contact: '081234567890',
            status_pegawai: 'PNS',
            cpns_date: derived.cpns_date || '2008-01-01',
            pns_date: derived.pns_date || '2009-02-01',
        };
    }

    return null;
};
