const RAW_CLASSIFICATION_CODES = [
    { code: '000.2.2.1', name: 'ASET', category: 'Sarpras' },
    { code: '0002.5', name: 'STANDAR HARGA SATUAN', category: 'Keuangan' },
    { code: '0003', name: 'PENGADAAN', category: 'Sarpras' },
    { code: '0005.1', name: 'KEBIJAKAN KEARSIPAN', category: 'Umum' },
    { code: '400.3', name: 'PENDIDIKAN', category: 'Pendidikan' },
    { code: '400.3.1', name: 'KEBIJAKAN', category: 'Pendidikan' },
    { code: '400.3.2', name: 'PENDIDIKAN ANAK USIA DINI (PAUD)', category: 'Pendidikan' },
    { code: '400.3.5', name: 'PENDIDIKAN DASAR DAN MENENGAH PERTAMA (Izin Ops / Sekolah)', category: 'Legalitas' },
    { code: '400.3.5.3', name: 'PELATIHAN BIMTEK SOSIALISASI GURU', category: 'Kepegawaian' },
    { code: '400.3.5.4', name: 'KEGIATAN LOMBA / PENETAPAN JUARA', category: 'Kesiswaan' },
    { code: '400.3.5.5', name: 'BOS (Bantuan Operasional Sekolah)', category: 'Keuangan' },
    { code: '400.3.5.6', name: 'KIP', category: 'Kesiswaan' },
    { code: '400.3.7', name: 'PEMBINAAN PENDIDIK DAN TENAGA PENDIDIK', category: 'Kepegawaian' },
    { code: '400.3.7.1', name: 'PEMETAAN', category: 'Pendidikan' },
    { code: '400.3.7.2', name: 'UJI KOMPETENSI GURU/FASILITATOR', category: 'Kepegawaian' },
    { code: '400.3.7.3', name: 'SERTIFIKASI GURU', category: 'Kepegawaian' },
    { code: '400.3.11', name: 'PENILAIAN AKADEMIK', category: 'Kesiswaan' },
    { code: '400.3.12.1', name: 'DAPODIK SISWA/GURU', category: 'Kesiswaan' },
    { code: '400.3.13', name: 'PRASARANA PENDIDIKAN (Bantuan Sarpras)', category: 'Sarpras' },
    { code: '400.12.3.2', name: 'PERCERAIAN', category: 'Kepegawaian' },
    { code: '700.1.2.1', name: 'AUDIT KINERJA PEGAWAI', category: 'Pengawasan' },
    { code: '800.1.2.1', name: 'FORMASI', category: 'Kepegawaian' },
    { code: '800.1.3.1', name: 'MUTASI GURU/ PERTIMBANGAN', category: 'Kepegawaian' },
    { code: '800.1.3.2', name: 'KENAIKAN PANGKAT', category: 'Kepegawaian' },
    { code: '800.1.3.3', name: 'PENGANGKATAN/PEMBERHENTIAN', category: 'Kepegawaian' },
    { code: '800.1.3.4', name: 'HUKDIS (Hukuman Disiplin)', category: 'Kepegawaian' },
    { code: '800.1.4.1', name: 'IJIN BELAJAR/PERTUKARAN ASN', category: 'Kepegawaian' },
    { code: '800.1.4.4', name: 'PENYUSUNAN SKP', category: 'Kepegawaian' },
    { code: '800.1.4.5', name: 'ANGKA KREDIT', category: 'Kepegawaian' },
    { code: '800.1.5.1', name: 'CAPAIAN KINERJA LAKIP', category: 'Pengawasan' },
    { code: '800.1.6.6', name: 'PENSIUN ASN', category: 'Kepegawaian' },
    { code: '800.1.9.3', name: 'ARSIP ELEKTRONIK', category: 'Umum' },
    { code: '800.1.10.2', name: 'PENCANTUMAN GELAR', category: 'Kepegawaian' },
    { code: '800.1.11.1', name: 'SURAT PERINTAH / TUGAS', category: 'Kepegawaian' },
    { code: '800.1.11.2', name: 'CUTI SAKIT', category: 'Kepegawaian' },
    { code: '800.1.11.3', name: 'CUTI BERSALIN', category: 'Kepegawaian' },
    { code: '800.1.11.5', name: 'CUTI ALASAN PENTING', category: 'Kepegawaian' },
    { code: '800.1.11.8', name: 'KARPEG/KPE/KARSU/KARSI', category: 'Kepegawaian' },
    { code: '800.1.11.13', name: 'KENAIKAN GAJI BERKALA', category: 'Kepegawaian' },
    { code: '900.1.3.3', name: 'BERITA ACARA REKONSILIASI PIUTANG', category: 'Keuangan' },
];

export const CLASSIFICATION_CODES = [...RAW_CLASSIFICATION_CODES].sort((a, b) =>
    a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' })
);

export function generateOfficialLetterNumber(classificationCode, sequenceNumber = '1071', unitTag = 'Disdik', year = null) {
    const currentYear = year || new Date().getFullYear();
    const code = classificationCode || '800.1.3.2';
    return `${code}/${sequenceNumber} - ${unitTag}/${currentYear}`;
}
