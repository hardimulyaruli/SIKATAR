import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FiDownload, FiLayers, FiHome, FiInfo, FiSearch, FiCheckCircle } from 'react-icons/fi';

/**
 * ExportEmployeeModal provides a dedicated, elegant iOS monochrome modal
 * allowing administrators/staff to export comprehensive employee records to Excel (.xlsx),
 * either across all schools in Kabupaten Bandung Barat or isolated to a specific school.
 */
export default function ExportEmployeeModal({
    isOpen,
    onClose,
    schools = [],
    currentSchoolId = '',
    currentStatus = '',
}) {
    const [exportScope, setExportScope] = useState(currentSchoolId ? 'school' : 'all');
    const [selectedSchoolId, setSelectedSchoolId] = useState(currentSchoolId || (schools[0]?.id ? String(schools[0].id) : ''));
    const [selectedStatus, setSelectedStatus] = useState(currentStatus || '');
    const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadTriggered, setDownloadTriggered] = useState(false);

    // Sync initial state when modal opens or props change
    useEffect(() => {
        if (isOpen) {
            setExportScope(currentSchoolId ? 'school' : 'all');
            setSelectedSchoolId(currentSchoolId || (schools[0]?.id ? String(schools[0].id) : ''));
            setSelectedStatus(currentStatus || '');
            setSchoolSearchQuery('');
            setIsDownloading(false);
            setDownloadTriggered(false);
        }
    }, [isOpen, currentSchoolId, currentStatus, schools]);

    // Filter school options based on search query in select
    const filteredSchools = useMemo(() => {
        if (!schoolSearchQuery.trim()) return schools;
        const query = schoolSearchQuery.toLowerCase();
        return schools.filter((s) => s.name?.toLowerCase().includes(query));
    }, [schools, schoolSearchQuery]);

    if (!isOpen) return null;

    // Compute the exact download URL
    const params = new URLSearchParams();
    if (exportScope === 'school' && selectedSchoolId) {
        params.append('school_id', selectedSchoolId);
    }
    if (selectedStatus) {
        params.append('status_pegawai', selectedStatus);
    }
    const downloadUrl = `/admin/employees/export?${params.toString()}`;

    const handleDownloadClick = () => {
        setIsDownloading(true);
        setDownloadTriggered(true);

        // Native browser navigation triggers file attachment download without popup blocking
        window.location.assign(downloadUrl);

        setTimeout(() => {
            setIsDownloading(false);
        }, 5000);
    };

    const selectedSchoolObj = schools.find((s) => String(s.id) === String(selectedSchoolId));
    const isActionDisabled = exportScope === 'school' && !selectedSchoolId;

    const modalMarkup = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200/90 space-y-5 my-8 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
                            <FiDownload className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-950 text-base">Export Rekapitulasi Kepegawaian</h3>
                            <p className="text-xs text-zinc-500">Unduh data profil pegawai lengkap ke format Microsoft Excel (.xlsx)</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all font-bold cursor-pointer"
                        title="Tutup"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4 text-xs">
                    {/* 1. Cakupan Wilayah / Sekolah */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-2">
                            Pilih Cakupan Rekapitulasi Data
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Option A: Seluruh Sekolah */}
                            <button
                                type="button"
                                onClick={() => setExportScope('all')}
                                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                                    exportScope === 'all'
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                                        : 'bg-white/80 hover:bg-zinc-50 text-zinc-800 border-zinc-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <FiLayers className={`w-4 h-4 ${exportScope === 'all' ? 'text-white' : 'text-zinc-500'}`} />
                                        <span className="font-bold text-xs">Seluruh Sekolah</span>
                                    </div>
                                    {exportScope === 'all' && (
                                        <span className="w-4 h-4 rounded-full bg-white text-zinc-900 flex items-center justify-center text-[10px] font-bold">✓</span>
                                    )}
                                </div>
                                <p className={`text-[11px] leading-relaxed ${exportScope === 'all' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                    Export seluruh pegawai dari semua sekolah di Kabupaten Bandung Barat.
                                </p>
                            </button>

                            {/* Option B: Sekolah Tertentu */}
                            <button
                                type="button"
                                onClick={() => setExportScope('school')}
                                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                                    exportScope === 'school'
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                                        : 'bg-white/80 hover:bg-zinc-50 text-zinc-800 border-zinc-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <FiHome className={`w-4 h-4 ${exportScope === 'school' ? 'text-white' : 'text-zinc-500'}`} />
                                        <span className="font-bold text-xs">Sekolah Tertentu</span>
                                    </div>
                                    {exportScope === 'school' && (
                                        <span className="w-4 h-4 rounded-full bg-white text-zinc-900 flex items-center justify-center text-[10px] font-bold">✓</span>
                                    )}
                                </div>
                                <p className={`text-[11px] leading-relaxed ${exportScope === 'school' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                    Export rekapitulasi data khusus untuk 1 unit sekolah yang dipilih.
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Jika Sekolah Tertentu dipilih, tampilkan dropdown pilihan sekolah */}
                    {exportScope === 'school' && (
                        <div className="p-3.5 bg-zinc-50/80 rounded-xl border border-zinc-200/80 space-y-2.5 animate-in fade-in duration-150">
                            <label className="block text-xs font-bold text-zinc-800">
                                Pilih Unit Sekolah <span className="text-zinc-900">*</span>
                            </label>

                            {schools.length > 8 && (
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={schoolSearchQuery}
                                        onChange={(e) => setSchoolSearchQuery(e.target.value)}
                                        placeholder="Cari nama sekolah..."
                                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                    />
                                </div>
                            )}

                            <select
                                required
                                value={selectedSchoolId}
                                onChange={(e) => setSelectedSchoolId(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all cursor-pointer"
                            >
                                {filteredSchools.length === 0 ? (
                                    <option value="" disabled>Sekolah tidak ditemukan</option>
                                ) : (
                                    filteredSchools.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))
                                )}
                            </select>

                            {selectedSchoolObj && (
                                <p className="text-[11px] text-zinc-500">
                                    Terpilih: <span className="font-semibold text-zinc-900">{selectedSchoolObj.name}</span>
                                </p>
                            )}
                        </div>
                    )}

                    {/* 2. Filter Status Kepegawaian */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                            Filter Status Pegawai (Opsional)
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 bg-white/90 border border-zinc-300 rounded-lg text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all cursor-pointer"
                        >
                            <option value="">Semua Status Pegawai (PNS, CPNS, PPPK, Honorer)</option>
                            <option value="PNS">Hanya PNS (Pegawai Negeri Sipil)</option>
                            <option value="CPNS">Hanya CPNS (Calon Pegawai Negeri Sipil)</option>
                            <option value="PPPK">Hanya PPPK (PPPK)</option>
                            <option value="Honorer">Hanya Honorer (Non-ASN)</option>
                        </select>
                    </div>

                    {/* 3. Informasi Isi Rekap Profil */}
                    <div className="p-3 bg-zinc-100/70 rounded-xl border border-zinc-200/70 text-[11px] text-zinc-600 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                            <FiInfo className="w-3.5 h-3.5 text-zinc-700" />
                            <span>Format Lengkap Sesuai Profil Pegawai:</span>
                        </div>
                        <p className="text-zinc-600 leading-relaxed">
                            No, Nama Lengkap, NIP/NI PPPK (Teks eksplisit utuh), Status Pegawai, Unit Kerja, NPSN, Jabatan Terakhir, Pangkat/Golongan, Pendidikan Terakhir, Tempat & Tanggal Lahir, Usia, No HP/Kontak, Alamat Lengkap, TMT CPNS, dan TMT PNS.
                        </p>
                    </div>

                    {/* Notifikasi proses unduhan */}
                    {downloadTriggered && (
                        <div className="p-3 bg-zinc-900 text-white rounded-xl flex items-center gap-2.5 animate-in fade-in duration-200">
                            <FiCheckCircle className="w-4 h-4 text-white shrink-0" />
                            <div className="text-[11px]">
                                <span className="font-bold">Permintaan ekspor sedang diproses browser!</span>
                                <p className="text-zinc-300">File Excel akan otomatis terunduh ke folder Downloads perangkat Anda.</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white/80 hover:bg-zinc-100 text-zinc-700 font-bold rounded-xl border border-zinc-200 text-xs transition-all active:scale-95 cursor-pointer"
                        >
                            {downloadTriggered ? 'Tutup' : 'Batal'}
                        </button>

                        <a
                            href={downloadUrl}
                            onClick={handleDownloadClick}
                            className={`inline-flex items-center gap-2 px-5 py-2 bg-zinc-900/90 hover:bg-black text-white font-bold rounded-xl text-xs transition-all shadow-sm backdrop-blur-xl border border-zinc-800 active:scale-95 cursor-pointer ${
                                isActionDisabled ? 'pointer-events-none opacity-40' : ''
                            }`}
                        >
                            {isDownloading ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Memproses File Excel...</span>
                                </>
                            ) : (
                                <>
                                    <FiDownload className="w-3.5 h-3.5" />
                                    <span>Unduh Excel (.xlsx)</span>
                                </>
                            )}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalMarkup, document.body);
}
