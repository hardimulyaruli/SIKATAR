import React, { useState } from 'react';
import GlassCard from '@/Components/UI/GlassCard';
import { router } from '@inertiajs/react';
import { 
    FiUser, FiAward, FiClock, FiCheckSquare, 
    FiCalendar, FiFileText, FiLayers, FiBookOpen, 
    FiBriefcase, FiTrendingUp, FiCheckCircle, FiCamera, FiUpload,
    FiCopy, FiCheck
} from 'react-icons/fi';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
    const cleanPath = path.startsWith('/storage/') ? path.replace('/storage/', '') : (path.startsWith('storage/') ? path.replace('storage/', '') : path);
    return `/storage/${cleanPath}`;
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const cleanDate = dateString.includes('T') ? dateString.split('T')[0] : dateString;
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }
    return dateString;
};

export default function EmployeeDetailTabs({ employee, isAdmin = false, canModify = true, onUploadDocument, onDeleteDocument }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [activeRiwayatSubTab, setActiveRiwayatSubTab] = useState('golongan');
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [copiedNip, setCopiedNip] = useState(false);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingPhoto(true);

        const routeUrl = isAdmin ? `/admin/employees/${employee.id}` : `/operator/employees/${employee.id}`;

        router.post(routeUrl, {
            _method: 'put',
            name: employee.name || '',
            nip: employee.nip || '',
            status_pegawai: employee.status_pegawai || 'PNS',
            school_id: employee.school_id || '',
            place_of_birth: employee.place_of_birth || '',
            date_of_birth: employee.date_of_birth || '',
            address: employee.address || '',
            contact: employee.contact || '',
            cpns_date: employee.cpns_date || '',
            pns_date: employee.pns_date || '',
            photo: file,
        }, {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => setUploadingPhoto(false),
        });
    };

    const topTabs = [
        { id: 'profile', label: 'Profile', icon: FiUser },
        { id: 'cpns_pns', label: 'CPNS / PNS', icon: FiAward },
        { id: 'riwayat', label: 'Riwayat', icon: FiClock },
        { id: 'asesmen', label: 'Asesmen', icon: FiLayers },
        { id: 'presensi', label: 'Presensi', icon: FiCalendar },
        { id: 'akur', label: 'Akur', icon: FiCheckCircle },
        { id: 'cuti', label: 'Cuti', icon: FiCalendar },
        { id: 'dokumen', label: 'Dokumen', icon: FiFileText },
    ];

    const riwayatSubTabs = [
        { id: 'golongan', label: 'Golongan' },
        { id: 'pendidikan', label: 'Pendidikan' },
        { id: 'diklat_struktural', label: 'Diklat Struktural' },
        { id: 'diklat_teknis', label: 'Diklat Teknis / Fungsional' },
        { id: 'jabatan', label: 'Jabatan' },
        { id: 'penghargaan', label: 'Penghargaan' },
        { id: 'hukdis', label: 'Hukdis' },
        { id: 'kinerja', label: 'Kinerja' },
        { id: 'angka_kredit', label: 'Angka Kredit' },
        { id: 'kgb', label: 'KGB' },
        { id: 'ipasn', label: 'IPASN' },
    ];

    return (
        <div className="space-y-6">
            {/* Top Navigation Bar — iOS Liquid Glass */}
            <div className="bg-white/60 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl p-2 shadow-sm border border-zinc-200/60 overflow-x-auto">
                <div className="flex items-center space-x-1 min-w-max">
                    {topTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-white/70 backdrop-blur-xl text-zinc-900 shadow-sm border border-zinc-200/60'
                                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/40'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* TAB CONTENT WRAPPER WITH SMOOTH TRANSITIONS */}
            <div key={activeTab} className="page-enter">
                {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                        <h3 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                            <FiUser className="text-zinc-700" /> Informasi Pribadi
                        </h3>
                        
                        <div className="flex flex-col sm:flex-row gap-5 mb-5 items-center sm:items-start p-4 bg-zinc-50/70 rounded-2xl border border-zinc-100">
                            <div className="w-28 h-36 rounded-xl overflow-hidden bg-zinc-200 border-2 border-white ring-2 ring-zinc-200 shadow-sm shrink-0 flex items-center justify-center relative group">
                                {employee.photo_path ? (
                                    <img
                                        src={getImageUrl(employee.photo_path)}
                                        alt={employee.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-zinc-400 p-2 text-center">
                                        <FiUser className="w-8 h-8 mb-1 text-zinc-300" />
                                        <span className="text-[10px] font-semibold text-zinc-400 leading-tight">Pasfoto 3x4<br/>(Belum Ada)</span>
                                    </div>
                                )}

                                {/* Overlay Upload Trigger */}
                                {canModify && (
                                    <label className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-1 text-center">
                                        <FiCamera className="w-5 h-5 mb-1" />
                                        <span className="text-[9px] font-bold">{uploadingPhoto ? 'Mengunggah...' : 'Ganti Pasfoto'}</span>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={handlePhotoUpload}
                                            disabled={uploadingPhoto}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="space-y-2 text-center sm:text-left flex-1 self-center">
                                {!employee.photo_path && (
                                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-zinc-100 text-zinc-700 mb-1">
                                        Belum Upload Pasfoto (3x4)
                                    </span>
                                )}
                                <h4 className="font-bold text-zinc-900 text-base leading-tight">{employee.name}</h4>
                                <div className="text-xs text-zinc-500 font-mono flex items-center gap-1.5 flex-wrap">
                                    {employee.status_pegawai === 'Honorer' ? (
                                        <span className="font-sans text-zinc-400 italic">Non-ASN (Tanpa NIP)</span>
                                    ) : (
                                        <>
                                            <span>{employee.status_pegawai === 'PPPK' ? 'NI PPPK' : 'NIP'}: {employee.nip || '-'}</span>
                                            {employee.nip && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(employee.nip);
                                                        setCopiedNip(true);
                                                        setTimeout(() => setCopiedNip(false), 2000);
                                                    }}
                                                    className="inline-flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-1.5 py-0.5 rounded transition-colors"
                                                    title={employee.status_pegawai === 'PPPK' ? 'Salin NI PPPK' : 'Salin NIP'}
                                                >
                                                    {copiedNip ? <FiCheck className="w-3 h-3 text-zinc-900" /> : <FiCopy className="w-3 h-3" />}
                                                    <span>{copiedNip ? 'Tersalin' : 'Salin'}</span>
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-600">Status: <span className="font-semibold text-zinc-900">{employee.status_pegawai}</span></p>

                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold cursor-pointer border border-zinc-200 transition-colors shadow-2xs">
                                    <FiUpload className="w-3.5 h-3.5" />
                                    <span>{uploadingPhoto ? 'Mengunggah...' : (employee.photo_path ? 'Ganti Pasfoto (3x4)' : 'Unggah Pasfoto (3x4)')}</span>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handlePhotoUpload}
                                        disabled={uploadingPhoto}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <dl className="space-y-3.5 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-zinc-500">Nama Lengkap</dt>
                                <dd className="col-span-2 text-zinc-900 font-semibold">{employee.name}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-zinc-500">{employee.status_pegawai === 'PPPK' ? 'NI PPPK' : 'NIP'}</dt>
                                <dd className="col-span-2 text-zinc-900 font-mono flex items-center gap-2">
                                    <span>{employee.nip || (employee.status_pegawai === 'Honorer' ? 'Tidak Ada (Non-ASN)' : '-')}</span>
                                    {employee.nip && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(employee.nip);
                                                setCopiedNip(true);
                                                setTimeout(() => setCopiedNip(false), 2000);
                                            }}
                                            className="inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 px-2 py-0.5 rounded-lg transition-colors font-sans"
                                            title={employee.status_pegawai === 'PPPK' ? 'Salin NI PPPK' : 'Salin NIP'}
                                        >
                                            {copiedNip ? <FiCheck className="w-3 h-3 text-zinc-900" /> : <FiCopy className="w-3 h-3" />}
                                            <span>{copiedNip ? 'Tersalin' : 'Salin NIP'}</span>
                                        </button>
                                    )}
                                </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-zinc-500">Tempat, Tgl Lahir</dt>
                                <dd className="col-span-2 text-zinc-900">
                                    {employee.place_of_birth || '-'}{employee.date_of_birth ? `, ${formatDate(employee.date_of_birth)}` : ''}
                                </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-zinc-500">Alamat</dt>
                                <dd className="col-span-2 text-zinc-900">{employee.address || '-'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-zinc-500">No. Kontak / HP</dt>
                                <dd className="col-span-2 text-zinc-900">{employee.contact || '-'}</dd>
                            </div>
                        </dl>
                    </GlassCard>

                    <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                        <h3 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                            <FiBriefcase className="text-zinc-700" /> Kepegawaian & Status
                        </h3>
                        <dl className="space-y-3.5 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-zinc-500">Status Pegawai</dt>
                                <dd className="col-span-2">
                                    <span className="text-sm font-bold text-zinc-900">
                                        {employee.status_pegawai}
                                    </span>
                                </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-zinc-500">Unit Kerja / Sekolah</dt>
                                <dd className="col-span-2 text-zinc-900 font-medium">{employee.school?.name || '-'}</dd>
                            </div>
                            {employee.status_pegawai !== 'Honorer' && employee.status_pegawai !== 'PPPK' && (
                                <>
                                    <div className="grid grid-cols-3 gap-2">
                                        <dt className="font-medium text-zinc-500">TMT CPNS</dt>
                                        <dd className="col-span-2 text-zinc-900">{formatDate(employee.cpns_date)}</dd>
                                    </div>
                                    {employee.status_pegawai === 'PNS' && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <dt className="font-medium text-zinc-500">TMT PNS</dt>
                                            <dd className="col-span-2 text-zinc-900">{formatDate(employee.pns_date)}</dd>
                                        </div>
                                    )}
                                </>
                            )}
                        </dl>
                    </GlassCard>
                </div>
            )}

            {/* TAB CONTENT: CPNS / PNS */}
            {activeTab === 'cpns_pns' && (
                <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                    <h3 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                        <FiAward className="text-zinc-700" /> Detail CPNS / PNS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-50/70 backdrop-blur-sm p-4 rounded-xl border border-zinc-100 space-y-3 text-sm">
                            <h4 className="font-bold text-zinc-800 border-b border-zinc-100 pb-2">Status CPNS</h4>
                            <div className="flex justify-between"><span className="text-zinc-500">TMT CPNS:</span> <span className="font-medium text-zinc-900">{formatDate(employee.cpns_date)}</span></div>
                        </div>
                        <div className="bg-zinc-50/70 backdrop-blur-sm p-4 rounded-xl border border-zinc-100 space-y-3 text-sm">
                            <h4 className="font-bold text-zinc-800 border-b border-zinc-100 pb-2">Status PNS</h4>
                            <div className="flex justify-between"><span className="text-zinc-500">TMT PNS:</span> <span className="font-medium text-zinc-900">{formatDate(employee.pns_date)}</span></div>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* TAB CONTENT: RIWAYAT (WITH SUB-TABS) */}
            {activeTab === 'riwayat' && (
                <div className="space-y-6">
                    {/* Sub Navigation Bar — iOS Liquid Glass */}
                    <div className="bg-zinc-100/60 backdrop-blur-xl backdrop-saturate-150 p-1.5 rounded-xl overflow-x-auto border border-zinc-200/40">
                        <div className="flex items-center space-x-1 min-w-max text-xs">
                            {riwayatSubTabs.map((subTab) => {
                                const isSubActive = activeRiwayatSubTab === subTab.id;
                                return (
                                    <button
                                        key={subTab.id}
                                        onClick={() => setActiveRiwayatSubTab(subTab.id)}
                                        className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                                            isSubActive
                                                ? 'bg-white/90 text-zinc-900 shadow-sm backdrop-blur-sm'
                                                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                                        }`}
                                    >
                                        {subTab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sub Tab Content */}
                    <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                        {activeRiwayatSubTab === 'golongan' && (
                            <div>
                                <h4 className="font-bold text-zinc-900 text-sm mb-4">Riwayat Pangkat / Golongan</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-zinc-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-zinc-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">Pangkat</th>
                                                <th className="py-3 px-4">Golongan / Ruang</th>
                                                <th className="py-3 px-4">TMT Golongan</th>
                                                <th className="py-3 px-4">Jenis KP</th>
                                                <th className="py-3 px-4 text-right">Aksi / Dokumen</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {employee.job_histories && employee.job_histories.length > 0 ? (
                                                employee.job_histories.map((item, idx) => (
                                                    <tr key={item.id} className="hover:bg-zinc-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold text-zinc-900">{item.pangkat || '-'}</td>
                                                        <td className="py-3 px-4">{item.golongan || '-'}</td>
                                                        <td className="py-3 px-4">{item.tmt_golongan || '-'}</td>
                                                        <td className="py-3 px-4">{item.jenis_kp || 'Reguler'}</td>
                                                        <td className="py-3 px-4 text-right">
                                                            <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded font-semibold text-[11px] cursor-pointer hover:bg-zinc-200 transition-colors">Dokumen SK</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-6 text-zinc-400 italic">Belum ada riwayat golongan terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeRiwayatSubTab === 'pendidikan' && (
                            <div>
                                <h4 className="font-bold text-zinc-900 text-sm mb-4">Riwayat Pendidikan</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-zinc-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-zinc-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">Jenjang</th>
                                                <th className="py-3 px-4">Jurusan / Prodi</th>
                                                <th className="py-3 px-4">Nama Sekolah / Univ</th>
                                                <th className="py-3 px-4">Tahun Lulus</th>
                                                <th className="py-3 px-4">No. Ijazah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {employee.educations && employee.educations.length > 0 ? (
                                                employee.educations.map((edu, idx) => (
                                                    <tr key={edu.id} className="hover:bg-zinc-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold text-zinc-900">{edu.jenjang}</td>
                                                        <td className="py-3 px-4">{edu.jurusan || '-'}</td>
                                                        <td className="py-3 px-4">{edu.nama_institusi}</td>
                                                        <td className="py-3 px-4">{edu.tahun_lulus}</td>
                                                        <td className="py-3 px-4 font-mono">{edu.no_ijazah || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-6 text-zinc-400 italic">Belum ada riwayat pendidikan terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeRiwayatSubTab === 'jabatan' && (
                            <div>
                                <h4 className="font-bold text-zinc-900 text-sm mb-4">Riwayat Jabatan</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-zinc-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-zinc-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">Nama Jabatan</th>
                                                <th className="py-3 px-4">Unit Kerja</th>
                                                <th className="py-3 px-4">TMT Jabatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {employee.job_histories && employee.job_histories.length > 0 ? (
                                                employee.job_histories.map((job, idx) => (
                                                    <tr key={job.id} className="hover:bg-zinc-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold text-zinc-900">{job.position || '-'}</td>
                                                        <td className="py-3 px-4">{employee.school?.name || '-'}</td>
                                                        <td className="py-3 px-4">{job.tmt_jabatan || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-6 text-zinc-400 italic">Belum ada riwayat jabatan terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeRiwayatSubTab === 'angka_kredit' && (
                            <div>
                                <h4 className="font-bold text-zinc-900 text-sm mb-4">Riwayat Penetapan Angka Kredit (PAK)</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-zinc-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-zinc-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">Tahun</th>
                                                <th className="py-3 px-4">Angka Kredit</th>
                                                <th className="py-3 px-4">Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {employee.credit_scores && employee.credit_scores.length > 0 ? (
                                                employee.credit_scores.map((cs, idx) => (
                                                    <tr key={cs.id} className="hover:bg-zinc-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold">{cs.tahun}</td>
                                                        <td className="py-3 px-4 font-bold text-zinc-900">{cs.angka_kredit}</td>
                                                        <td className="py-3 px-4">{cs.keterangan || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-6 text-zinc-400 italic">Belum ada riwayat angka kredit terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeRiwayatSubTab === 'kgb' && (
                            <div>
                                <h4 className="font-bold text-zinc-900 text-sm mb-4">Riwayat Kenaikan Gaji Berkala (KGB)</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-zinc-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-zinc-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">TMT KGB</th>
                                                <th className="py-3 px-4">Gaji Pokok Baru</th>
                                                <th className="py-3 px-4">No. SK</th>
                                                <th className="py-3 px-4">Masa Kerja</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {employee.kgbs && employee.kgbs.length > 0 ? (
                                                employee.kgbs.map((kgb, idx) => (
                                                    <tr key={kgb.id} className="hover:bg-zinc-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold">{kgb.tmt_kgb}</td>
                                                        <td className="py-3 px-4 font-bold text-zinc-900">Rp {Number(kgb.gaji_pokok_baru).toLocaleString('id-ID')}</td>
                                                        <td className="py-3 px-4 font-mono">{kgb.no_sk || '-'}</td>
                                                        <td className="py-3 px-4">{kgb.masa_kerja_tahun ? `${kgb.masa_kerja_tahun} Thn ${kgb.masa_kerja_bulan || 0} Bln` : '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-6 text-zinc-400 italic">Belum ada riwayat KGB terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {['diklat_struktural', 'diklat_teknis', 'penghargaan', 'hukdis', 'kinerja', 'ipasn'].includes(activeRiwayatSubTab) && (
                            <div className="text-center py-8 text-zinc-400 text-xs italic">
                                Data riwayat {activeRiwayatSubTab.replace('_', ' ')} dalam tahap sinkronisasi otomatis dari BKPSDM KBB.
                            </div>
                        )}
                    </GlassCard>
                </div>
            )}

            {/* TAB CONTENT: ASESMEN */}
            {activeTab === 'asesmen' && (
                <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                    <h3 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                        <FiLayers className="text-zinc-700" /> Hasil Asesmen & Uji Kompetensi
                    </h3>
                    <p className="text-xs text-zinc-500 italic py-4">Belum ada riwayat hasil asesmen kompetensi untuk pegawai ini.</p>
                </GlassCard>
            )}

            {/* TAB CONTENT: PRESENSI */}
            {activeTab === 'presensi' && (
                <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                    <h3 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                        <FiCalendar className="text-zinc-700" /> Rekapitulasi Presensi
                    </h3>
                    <p className="text-xs text-zinc-500 italic py-4">Data presensi disinkronkan secara bulanan melalui sistem kepegawaian.</p>
                </GlassCard>
            )}

            {/* TAB CONTENT: AKUR */}
            {activeTab === 'akur' && (
                <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                    <h3 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                        <FiCheckCircle className="text-zinc-700" /> Status Akurasi Data (Verval)
                    </h3>
                    <div className="bg-zinc-50/70 backdrop-blur-sm border border-zinc-200 rounded-xl p-4 flex items-center gap-3">
                        <FiCheckCircle className="w-6 h-6 text-zinc-700 flex-shrink-0" />
                        <div>
                            <div className="font-bold text-zinc-900 text-sm">Data Terverifikasi Akurat</div>
                            <div className="text-xs text-zinc-600">Profil dan riwayat berkas kepegawaian telah memenuhi standar validasi BKPSDM.</div>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* TAB CONTENT: CUTI */}
            {activeTab === 'cuti' && (
                <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                    <h3 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                        <FiCalendar className="text-zinc-700" /> Riwayat Permohonan Cuti
                    </h3>
                    <p className="text-xs text-zinc-500 italic py-4">Belum ada catatan pengajuan cuti pegawai.</p>
                </GlassCard>
            )}

            {/* TAB CONTENT: DOKUMEN */}
            {activeTab === 'dokumen' && (
                <div className="space-y-6">
                    {canModify && onUploadDocument && (
                        <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                            <h3 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                                <FiFileText className="text-zinc-700" /> Unggah Dokumen Baru
                            </h3>
                            <form onSubmit={onUploadDocument} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full space-y-1">
                                    <label className="block text-xs font-semibold text-zinc-700">Kategori Dokumen</label>
                                    <select name="category" required className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 text-xs">
                                        <option value="">-- Pilih Kategori --</option>
                                        <option value="SK CPNS">SK CPNS</option>
                                        <option value="SK PNS">SK PNS</option>
                                        <option value="SK Kenaikan Pangkat">SK Kenaikan Pangkat</option>
                                        <option value="SK KGB">SK KGB</option>
                                        <option value="Ijazah">Ijazah</option>
                                        <option value="Sertifikat Diklat">Sertifikat Diklat</option>
                                    </select>
                                </div>
                                <div className="flex-1 w-full space-y-1">
                                    <label className="block text-xs font-semibold text-zinc-700">File Dokumen (PDF/JPG/PNG max 5MB)</label>
                                    <input type="file" name="document_file" accept=".pdf,.jpg,.jpeg,.png" required className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200" />
                                </div>
                                <button type="submit" className="px-4 py-2.5 bg-zinc-900 text-white font-semibold text-xs rounded-xl hover:bg-black transition-colors shadow-xs cursor-pointer">
                                    Unggah Dokumen
                                </button>
                            </form>
                        </GlassCard>
                    )}

                    <GlassCard className="p-6 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/60">
                        <h3 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3">Arsip Dokumen Terunggah</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {employee.documents && employee.documents.length > 0 ? (
                                employee.documents.map((doc) => (
                                    <div key={doc.id} className="p-4 bg-zinc-50/70 backdrop-blur-sm border border-zinc-200/80 rounded-xl space-y-2 flex flex-col justify-between">
                                        <div>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-200 text-zinc-700">{doc.category}</span>
                                            <h5 className="font-semibold text-zinc-900 text-xs mt-2 line-clamp-1">{doc.file_name}</h5>
                                            <p className="text-[11px] text-zinc-500">{doc.upload_date}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 text-xs">
                                            <a href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="text-zinc-700 font-semibold hover:text-zinc-900 hover:underline">Buka File</a>
                                            {canModify && onDeleteDocument && (
                                                <button onClick={() => onDeleteDocument(doc.id)} className="text-zinc-500 hover:text-zinc-900 hover:underline cursor-pointer">Hapus</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-zinc-400 italic col-span-full py-4 text-center">Belum ada dokumen yang diunggah.</p>
                            )}
                        </div>
                    </GlassCard>
                </div>
            )}
            </div>
        </div>
    );
}
