import React, { useState } from 'react';
import GlassCard from '@/Components/UI/GlassCard';
import { 
    FiUser, FiAward, FiClock, FiBox, FiCheckSquare, 
    FiCalendar, FiFileText, FiLayers, FiBookOpen, 
    FiBriefcase, FiTrendingUp, FiCheckCircle
} from 'react-icons/fi';

export default function EmployeeDetailTabs({ employee, isAdmin = false, onUploadDocument, onDeleteDocument }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [activeRiwayatSubTab, setActiveRiwayatSubTab] = useState('golongan');

    const topTabs = [
        { id: 'profile', label: 'Profile', icon: FiUser },
        { id: 'cpns_pns', label: 'CPNS / PNS', icon: FiAward },
        { id: 'riwayat', label: 'Riwayat', icon: FiClock },
        { id: 'aset', label: 'Penguasaan Aset', icon: FiBox },
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
            {/* Top Navigation Bar */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-slate-200/80 overflow-x-auto">
                <div className="flex items-center space-x-1 min-w-max">
                    {topTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* TAB CONTENT: PROFILE */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassCard className="p-6">
                        <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <FiUser className="text-blue-600" /> Informasi Pribadi
                        </h3>
                        
                        <div className="flex flex-col sm:flex-row gap-5 mb-5 items-center sm:items-start p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                            <div className="w-28 h-36 rounded-xl overflow-hidden bg-slate-200 border-2 border-white ring-2 ring-blue-100 shadow-sm shrink-0 flex items-center justify-center relative">
                                {employee.photo_path ? (
                                    <img
                                        src={`/storage/${employee.photo_path}`}
                                        alt={employee.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                                        <FiUser className="w-8 h-8 mb-1 text-slate-300" />
                                        <span className="text-[10px] font-semibold text-slate-400 leading-tight">Pasfoto 3x4<br/>(Belum Ada)</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1 text-center sm:text-left flex-1 self-center">
                                {!employee.photo_path && (
                                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-700 mb-1">
                                        Belum Upload Pasfoto (3x4)
                                    </span>
                                )}
                                <h4 className="font-bold text-slate-900 text-base leading-tight">{employee.name}</h4>
                                <p className="text-xs text-slate-500 font-mono">NIP: {employee.nip || '-'}</p>
                                <p className="text-xs text-slate-600 mt-1">Status: <span className="font-semibold text-blue-600">{employee.status_pegawai}</span></p>
                            </div>
                        </div>

                        <dl className="space-y-3.5 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-slate-500">Nama Lengkap</dt>
                                <dd className="col-span-2 text-slate-800 font-semibold">{employee.name}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-slate-500">NIP</dt>
                                <dd className="col-span-2 text-slate-800 font-mono">{employee.nip || '-'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-slate-500">Tempat, Tgl Lahir</dt>
                                <dd className="col-span-2 text-slate-800">
                                    {employee.place_of_birth || '-'}{employee.date_of_birth ? `, ${employee.date_of_birth}` : ''}
                                </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-slate-500">Alamat</dt>
                                <dd className="col-span-2 text-slate-800">{employee.address || '-'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-slate-500">No. Kontak / HP</dt>
                                <dd className="col-span-2 text-slate-800">{employee.contact || '-'}</dd>
                            </div>
                        </dl>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <FiBriefcase className="text-blue-600" /> Kepegawaian & Status
                        </h3>
                        <dl className="space-y-3.5 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-slate-500">Status Pegawai</dt>
                                <dd className="col-span-2">
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                        {employee.status_pegawai}
                                    </span>
                                </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-slate-500">Unit Kerja / Sekolah</dt>
                                <dd className="col-span-2 text-slate-800 font-medium">{employee.school?.name || '-'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-slate-500">TMT CPNS</dt>
                                <dd className="col-span-2 text-slate-800">{employee.cpns_date || '-'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="font-medium text-slate-500">TMT PNS</dt>
                                <dd className="col-span-2 text-slate-800">{employee.pns_date || '-'}</dd>
                            </div>
                        </dl>
                    </GlassCard>
                </div>
            )}

            {/* TAB CONTENT: CPNS / PNS */}
            {activeTab === 'cpns_pns' && (
                <GlassCard className="p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <FiAward className="text-blue-600" /> Detail CPNS / PNS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3 text-sm">
                            <h4 className="font-bold text-slate-700 border-b pb-2">Status CPNS</h4>
                            <div className="flex justify-between"><span className="text-slate-500">TMT CPNS:</span> <span className="font-medium">{employee.cpns_date || '-'}</span></div>
                        </div>
                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3 text-sm">
                            <h4 className="font-bold text-slate-700 border-b pb-2">Status PNS</h4>
                            <div className="flex justify-between"><span className="text-slate-500">TMT PNS:</span> <span className="font-medium">{employee.pns_date || '-'}</span></div>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* TAB CONTENT: RIWAYAT (WITH SUB-TABS) */}
            {activeTab === 'riwayat' && (
                <div className="space-y-6">
                    {/* Sub Navigation Bar for Riwayat */}
                    <div className="bg-slate-100/80 p-1.5 rounded-xl overflow-x-auto">
                        <div className="flex items-center space-x-1 min-w-max text-xs">
                            {riwayatSubTabs.map((subTab) => {
                                const isSubActive = activeRiwayatSubTab === subTab.id;
                                return (
                                    <button
                                        key={subTab.id}
                                        onClick={() => setActiveRiwayatSubTab(subTab.id)}
                                        className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                                            isSubActive
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                        }`}
                                    >
                                        {subTab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sub Tab Content */}
                    <GlassCard className="p-6">
                        {activeRiwayatSubTab === 'golongan' && (
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-4">Riwayat Pangkat / Golongan</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">Pangkat</th>
                                                <th className="py-3 px-4">Golongan / Ruang</th>
                                                <th className="py-3 px-4">TMT Golongan</th>
                                                <th className="py-3 px-4">Jenis KP</th>
                                                <th className="py-3 px-4 text-right">Aksi / Dokumen</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {employee.job_histories && employee.job_histories.length > 0 ? (
                                                employee.job_histories.map((item, idx) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold text-slate-800">{item.pangkat || '-'}</td>
                                                        <td className="py-3 px-4">{item.golongan || '-'}</td>
                                                        <td className="py-3 px-4">{item.tmt_golongan || '-'}</td>
                                                        <td className="py-3 px-4">{item.jenis_kp || 'Reguler'}</td>
                                                        <td className="py-3 px-4 text-right">
                                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded font-semibold text-[11px] cursor-pointer hover:underline">Dokumen SK</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-6 text-slate-400 italic">Belum ada riwayat golongan terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeRiwayatSubTab === 'pendidikan' && (
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-4">Riwayat Pendidikan</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">Jenjang</th>
                                                <th className="py-3 px-4">Jurusan / Prodi</th>
                                                <th className="py-3 px-4">Nama Sekolah / Univ</th>
                                                <th className="py-3 px-4">Tahun Lulus</th>
                                                <th className="py-3 px-4">No. Ijazah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {employee.educations && employee.educations.length > 0 ? (
                                                employee.educations.map((edu, idx) => (
                                                    <tr key={edu.id} className="hover:bg-slate-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold text-slate-800">{edu.jenjang}</td>
                                                        <td className="py-3 px-4">{edu.jurusan || '-'}</td>
                                                        <td className="py-3 px-4">{edu.nama_institusi}</td>
                                                        <td className="py-3 px-4">{edu.tahun_lulus}</td>
                                                        <td className="py-3 px-4 font-mono">{edu.no_ijazah || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-6 text-slate-400 italic">Belum ada riwayat pendidikan terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeRiwayatSubTab === 'jabatan' && (
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-4">Riwayat Jabatan</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">Nama Jabatan</th>
                                                <th className="py-3 px-4">Unit Kerja</th>
                                                <th className="py-3 px-4">TMT Jabatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {employee.job_histories && employee.job_histories.length > 0 ? (
                                                employee.job_histories.map((job, idx) => (
                                                    <tr key={job.id} className="hover:bg-slate-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold text-slate-800">{job.position || '-'}</td>
                                                        <td className="py-3 px-4">{employee.school?.name || '-'}</td>
                                                        <td className="py-3 px-4">{job.tmt_jabatan || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-6 text-slate-400 italic">Belum ada riwayat jabatan terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeRiwayatSubTab === 'angka_kredit' && (
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-4">Riwayat Penetapan Angka Kredit (PAK)</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">Tahun</th>
                                                <th className="py-3 px-4">Angka Kredit</th>
                                                <th className="py-3 px-4">Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {employee.credit_scores && employee.credit_scores.length > 0 ? (
                                                employee.credit_scores.map((cs, idx) => (
                                                    <tr key={cs.id} className="hover:bg-slate-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold">{cs.tahun}</td>
                                                        <td className="py-3 px-4 font-bold text-blue-600">{cs.angka_kredit}</td>
                                                        <td className="py-3 px-4">{cs.keterangan || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-6 text-slate-400 italic">Belum ada riwayat angka kredit terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeRiwayatSubTab === 'kgb' && (
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-4">Riwayat Kenaikan Gaji Berkala (KGB)</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600 border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700 uppercase font-semibold">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">TMT KGB</th>
                                                <th className="py-3 px-4">Gaji Pokok Baru</th>
                                                <th className="py-3 px-4">No. SK</th>
                                                <th className="py-3 px-4">Masa Kerja</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {employee.kgbs && employee.kgbs.length > 0 ? (
                                                employee.kgbs.map((kgb, idx) => (
                                                    <tr key={kgb.id} className="hover:bg-slate-50/50">
                                                        <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                                        <td className="py-3 px-4 font-semibold">{kgb.tmt_kgb}</td>
                                                        <td className="py-3 px-4 font-bold text-emerald-600">Rp {Number(kgb.gaji_pokok_baru).toLocaleString('id-ID')}</td>
                                                        <td className="py-3 px-4 font-mono">{kgb.no_sk || '-'}</td>
                                                        <td className="py-3 px-4">{kgb.masa_kerja_tahun ? `${kgb.masa_kerja_tahun} Thn ${kgb.masa_kerja_bulan || 0} Bln` : '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-6 text-slate-400 italic">Belum ada riwayat KGB terdaftar.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {['diklat_struktural', 'diklat_teknis', 'penghargaan', 'hukdis', 'kinerja', 'ipasn'].includes(activeRiwayatSubTab) && (
                            <div className="text-center py-8 text-slate-400 text-xs italic">
                                Data riwayat {activeRiwayatSubTab.replace('_', ' ')} dalam tahap sinkronisasi otomatis dari BKPSDM KBB.
                            </div>
                        )}
                    </GlassCard>
                </div>
            )}

            {/* TAB CONTENT: PENGUASAAN ASET */}
            {activeTab === 'aset' && (
                <GlassCard className="p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <FiBox className="text-blue-600" /> Daftar Penguasaan Aset Dinas / Sekolah
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700 uppercase font-semibold">
                                    <th className="py-3 px-4">#</th>
                                    <th className="py-3 px-4">Nama Aset / Barang</th>
                                    <th className="py-3 px-4">Kode Aset</th>
                                    <th className="py-3 px-4">Tahun Penyerahan</th>
                                    <th className="py-3 px-4">Kondisi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {employee.assets && employee.assets.length > 0 ? (
                                    employee.assets.map((asset, idx) => (
                                        <tr key={asset.id} className="hover:bg-slate-50/50">
                                            <td className="py-3 px-4 font-medium">{idx + 1}</td>
                                            <td className="py-3 px-4 font-semibold text-slate-800">{asset.asset_name}</td>
                                            <td className="py-3 px-4 font-mono">{asset.asset_code || '-'}</td>
                                            <td className="py-3 px-4">{asset.year || '-'}</td>
                                            <td className="py-3 px-4 font-semibold text-emerald-600">{asset.condition || 'Baik'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6 text-slate-400 italic">Belum ada aset dinas yang dicatat.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            )}

            {/* TAB CONTENT: ASESMEN */}
            {activeTab === 'asesmen' && (
                <GlassCard className="p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <FiLayers className="text-blue-600" /> Hasil Asesmen & Uji Kompetensi
                    </h3>
                    <p className="text-xs text-slate-500 italic py-4">Belum ada riwayat hasil asesmen kompetensi untuk pegawai ini.</p>
                </GlassCard>
            )}

            {/* TAB CONTENT: PRESENSI */}
            {activeTab === 'presensi' && (
                <GlassCard className="p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <FiCalendar className="text-blue-600" /> Rekapitulasi Presensi
                    </h3>
                    <p className="text-xs text-slate-500 italic py-4">Data presensi disinkronkan secara bulanan melalui sistem kepegawaian.</p>
                </GlassCard>
            )}

            {/* TAB CONTENT: AKUR */}
            {activeTab === 'akur' && (
                <GlassCard className="p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <FiCheckCircle className="text-blue-600" /> Status Akurasi Data (Verval)
                    </h3>
                    <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                        <FiCheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <div className="font-bold text-blue-900 text-sm">Data Terverifikasi Akurat</div>
                            <div className="text-xs text-blue-700">Profil dan riwayat berkas kepegawaian telah memenuhi standar validasi BKPSDM.</div>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* TAB CONTENT: CUTI */}
            {activeTab === 'cuti' && (
                <GlassCard className="p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <FiCalendar className="text-blue-600" /> Riwayat Permohonan Cuti
                    </h3>
                    <p className="text-xs text-slate-500 italic py-4">Belum ada catatan pengajuan cuti pegawai.</p>
                </GlassCard>
            )}

            {/* TAB CONTENT: DOKUMEN */}
            {activeTab === 'dokumen' && (
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <FiFileText className="text-blue-600" /> Unggah Dokumen Baru
                        </h3>
                        <form onSubmit={onUploadDocument} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full space-y-1">
                                <label className="block text-xs font-semibold text-slate-700">Kategori Dokumen</label>
                                <select name="category" required className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs">
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
                                <label className="block text-xs font-semibold text-slate-700">File Dokumen (PDF/JPG/PNG max 5MB)</label>
                                <input type="file" name="document_file" accept=".pdf,.jpg,.jpeg,.png" required className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                                Unggah Dokumen
                            </button>
                        </form>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Arsip Dokumen Terunggah</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {employee.documents && employee.documents.length > 0 ? (
                                employee.documents.map((doc) => (
                                    <div key={doc.id} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2 flex flex-col justify-between">
                                        <div>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">{doc.category}</span>
                                            <h5 className="font-semibold text-slate-800 text-xs mt-2 line-clamp-1">{doc.file_name}</h5>
                                            <p className="text-[11px] text-slate-500">{doc.upload_date}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                                            <a href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">Buka File</a>
                                            <button onClick={() => onDeleteDocument(doc.id)} className="text-red-500 hover:underline">Hapus</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic col-span-full py-4 text-center">Belum ada dokumen yang diunggah.</p>
                            )}
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
