import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import LiveLetterPreview from '@/Components/Letter/LiveLetterPreview';
import { useForm } from '@inertiajs/react';
import { CLASSIFICATION_CODES } from '@/Utils/classificationCodes';

export default function ApplicationCreate({ school, templates = [], selectedTemplate: initialTpl }) {
    const safeTemplates = Array.isArray(templates) ? templates : [];

    // Build comprehensive template options matching ALL classification codes 2024
    const allAvailableTemplates = CLASSIFICATION_CODES.map((item) => {
        const existing = safeTemplates.find((t) => t.classification_code === item.code);
        if (existing) {
            return existing;
        }

        let customName = `Surat Pengantar ${item.name}`;
        let defaultSubject = `Permohonan / Pengusulan Berkas ${item.name}`;
        let defaultBody = `Pengajuan Berkas ${item.name} Sekolah / Pegawai ke Dinas Pendidikan Kabupaten Bandung Barat`;

        if (item.code === '400.3.5.6') {
            customName = 'Surat Pengantar Program KIP (Kartu Indonesia Pintar)';
            defaultSubject = 'Pengusulan / Verifikasi Peserta Kartu Indonesia Pintar (KIP) Siswa';
            defaultBody = 'Pengusulan Berkas Verifikasi Kelayakan Peserta Program Kartu Indonesia Pintar (KIP) Siswa';
        } else if (item.code === '400.3.5.5') {
            customName = 'Surat Pengantar Laporan & Pengajuan Dana BOS';
            defaultSubject = 'Penyampaian Laporan & Pengajuan Dana Bantuan Operasional Sekolah (BOS)';
            defaultBody = 'Penyampaian Laporan Pertanggungjawaban dan Pengajuan Pencairan Dana BOS';
        } else if (item.code === '800.1.11.13') {
            customName = 'Surat Pengantar Kenaikan Gaji Berkala (KGB)';
            defaultSubject = 'Permohonan Kenaikan Gaji Berkala (KGB) Pegawai Negeri Sipil';
            defaultBody = 'Berkas Permohonan Kenaikan Gaji Berkala (KGB) Pegawai Negeri Sipil';
        } else if (item.code === '800.1.10.2') {
            customName = 'Surat Pengantar Pencantuman Gelar Akademik';
            defaultSubject = 'Usulan Pencantuman Gelar Akademik Pegawai Negeri Sipil';
            defaultBody = 'Pengajuan Berkas Pencantuman Gelar Akademik / Ijazah Terakhir Pegawai Negeri Sipil';
        } else if (item.code === '800.1.6.6') {
            customName = 'Surat Pengantar Pensiun ASN';
            defaultSubject = 'Usulan Pemberhentian dan Pembuatan SK Pensiun ASN';
            defaultBody = 'Pengajuan Berkas Permohonan Pensiun / Batas Usia Pensiun Pegawai Negeri Sipil';
        } else if (item.code === '800.1.4.5') {
            customName = 'Surat Pengantar Penetapan Angka Kredit (PAK)';
            defaultSubject = 'Pengusulan Penetapan Angka Kredit (PAK) Jabatan Fungsional Guru';
            defaultBody = 'Berkas Pengusulan Penetapan Angka Kredit (PAK) Jabatan Fungsional Guru';
        } else if (item.code === '800.1.4.1') {
            customName = 'Surat Pengantar Izin Belajar / Tugas Belajar';
            defaultSubject = 'Permohonan Izin Belajar / Tugas Belajar Pegawai Negeri Sipil';
            defaultBody = 'Permohonan Izin Belajar Penyelenggaraan Pendidikan Tinggi Bagi ASN';
        } else if (item.code === '800.1.11.8') {
            customName = 'Surat Pengantar Pengurusan Karpeg / Karsu / Karsi';
            defaultSubject = 'Permohonan Penerbitan Kartu Pegawai (Karpeg/KPE/Karsu/Karsi)';
            defaultBody = 'Pengajuan Berkas Penerbitan Kartu Pegawai (Karpeg / KPE / Karsu / Karsi) ASN';
        }

        return {
            code: `TEMPLATE-${item.code.replace(/\./g, '-')}`,
            classification_code: item.code,
            name: customName,
            category: item.category,
            default_subject: defaultSubject,
            default_body_template: defaultBody,
            required_fields_json: ['nama_pegawai', 'nip', 'pangkat_golongan', 'jabatan', 'jumlah_berkas'],
        };
    });

    const defaultTemplate = initialTpl || allAvailableTemplates[0];
    const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);
    const [classificationCode, setClassificationCode] = useState(defaultTemplate?.classification_code || '800.1.3.2');

    const { data, setData, post, processing, errors } = useForm({
        template_code: defaultTemplate?.code || 'PENGANTAR-KENAIKAN-PANGKAT',
        letter_name: defaultTemplate?.name || 'Surat Pengantar',
        subject: defaultTemplate?.default_subject || '',
        recipient: 'Kepala Dinas Pendidikan Kabupaten Bandung Barat',
        body_content: defaultTemplate?.default_body_template || '',
        form_data: {},
    });

    const handleSelectTemplate = (tpl) => {
        if (!tpl) return;
        setSelectedTemplate(tpl);
        setClassificationCode(tpl.classification_code || '800.1.3.2');
        setData({
            ...data,
            template_code: tpl.code,
            letter_name: tpl.name,
            subject: tpl.default_subject || tpl.name || '',
            body_content: tpl.default_body_template || '',
            form_data: {},
        });
    };

    const handleClassificationChange = (code) => {
        setClassificationCode(code);
        const matchingTpl = allAvailableTemplates.find((t) => t.classification_code === code);
        if (matchingTpl) {
            handleSelectTemplate(matchingTpl);
        }
    };

    const handleCustomParamChange = (key, val) => {
        const newFormData = {
            ...data.form_data,
            [key]: val,
        };
        if (key === 'jumlah_berkas') {
            const count = parseInt(val, 10);
            if (!isNaN(count) && count > 0) {
                let current = Array.isArray(data.form_data.applicants) && data.form_data.applicants.length > 0
                    ? [...data.form_data.applicants]
                    : [{
                        nama: data.form_data.nama_pegawai || '',
                        nip: data.form_data.nip || '',
                        gol_asal: data.form_data.pangkat_golongan || '',
                        jabatan: data.form_data.jabatan || '',
                        unit_kerja: school?.name || '',
                        kecamatan: '',
                    }];
                if (current.length < count) {
                    for (let i = current.length; i < count; i++) {
                        current.push({ nama: '', nip: '', gol_asal: '', jabatan: '', unit_kerja: school?.name || '', kecamatan: '' });
                    }
                } else if (current.length > count && count >= 1) {
                    current = current.slice(0, count);
                }
                newFormData.applicants = current;
            }
        }
        setData('form_data', newFormData);
    };

    const applicantsList = Array.isArray(data.form_data.applicants) && data.form_data.applicants.length > 0
        ? data.form_data.applicants
        : [{
            nama: data.form_data.nama_pegawai || '',
            nip: data.form_data.nip || '',
            gol_asal: data.form_data.pangkat_golongan || '',
            jabatan: data.form_data.jabatan || '',
            unit_kerja: school?.name || '',
            kecamatan: '',
        }];

    const updateApplicant = (idx, field, val) => {
        const updated = [...applicantsList];
        updated[idx] = { ...updated[idx], [field]: val };
        const newFormData = { ...data.form_data, applicants: updated };
        if (idx === 0) {
            if (field === 'nama') newFormData.nama_pegawai = val;
            if (field === 'nip') newFormData.nip = val;
            if (field === 'gol_asal') newFormData.pangkat_golongan = val;
            if (field === 'jabatan') newFormData.jabatan = val;
        }
        setData('form_data', newFormData);
    };

    const addApplicant = () => {
        const updated = [
            ...applicantsList,
            { nama: '', nip: '', gol_asal: '', jabatan: '', unit_kerja: school?.name || '', kecamatan: '' }
        ];
        setData('form_data', {
            ...data.form_data,
            applicants: updated,
            jumlah_berkas: updated.length.toString(),
        });
    };

    const removeApplicant = (idx) => {
        if (applicantsList.length <= 1) return;
        const updated = applicantsList.filter((_, i) => i !== idx);
        setData('form_data', {
            ...data.form_data,
            applicants: updated,
            jumlah_berkas: updated.length.toString(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/operator/applications');
    };

    return (
        <OperatorLayout>
            {/* Split Screen Compose & Real-Time High Fidelity Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                {/* Left Side: Compose Form (6 Cols - 50%) */}
                <section className="lg:col-span-6 bg-surface-bright p-6 md:p-8 rounded-DEFAULT border border-outline/10 shadow-xs space-y-6">
                    <div>
                        <h2 className="font-headline-md text-primary text-3xl mb-1">Form Pengajuan Surat Pengantar</h2>
                        <p className="font-body-md text-xs text-on-surface-variant">Isi kelengkapan berkas pengajuan surat resmi internal & verifikasi Disdik.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Jenis / Template Surat Selector */}
                        <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/20 space-y-2">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                Jenis / Template Surat Pengajuan
                            </label>
                            <select
                                value={selectedTemplate?.code || ''}
                                onChange={(e) => {
                                    const tpl = allAvailableTemplates.find((t) => t.code === e.target.value);
                                    handleSelectTemplate(tpl);
                                }}
                                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs font-semibold text-primary"
                            >
                                {allAvailableTemplates.map((tpl) => (
                                    <option key={tpl.code} value={tpl.code}>
                                        [{tpl.classification_code}] — {tpl.name} ({tpl.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Kode Klasifikasi Selector */}
                        <div className="p-4 bg-secondary-container/30 rounded-DEFAULT border border-outline/20 space-y-2">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                Kode Klasifikasi Surat (Penomoran Resmi 2024)
                            </label>
                            <select
                                value={classificationCode}
                                onChange={(e) => handleClassificationChange(e.target.value)}
                                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs font-mono font-bold text-primary"
                            >
                                {CLASSIFICATION_CODES.map((item) => (
                                    <option key={`${item.code}-${item.name}`} value={item.code}>
                                        {item.code} — {item.name} ({item.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Recipient */}
                        <div className="relative">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                Tujuan Surat (Kepada Yth)
                            </label>
                            <input
                                type="text"
                                required
                                value={data.recipient}
                                onChange={(e) => setData('recipient', e.target.value)}
                                placeholder="Kepala Dinas Pendidikan Kabupaten Bandung Barat"
                                className="editorial-input-line"
                            />
                        </div>

                        {/* Subject */}
                        <div className="relative">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                Subject Line / Perihal Surat
                            </label>
                            <input
                                type="text"
                                required
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="Perihal Surat Pengantar"
                                className="editorial-input-line"
                            />
                        </div>

                        {/* Custom Fields if required */}
                        {Array.isArray(selectedTemplate?.required_fields_json) && selectedTemplate.required_fields_json.length > 0 && (
                            <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/10 space-y-3 font-body-md text-xs">
                                <p className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                    Parameter Khusus Berkas Pengantar:
                                </p>
                                {selectedTemplate.required_fields_json.map((fieldKey) => (
                                    <div key={fieldKey}>
                                        <label className="block font-semibold capitalize text-on-surface-variant mb-1 text-xs">
                                            {fieldKey.replace(/_/g, ' ')}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.form_data[fieldKey] || ''}
                                            onChange={(e) => handleCustomParamChange(fieldKey, e.target.value)}
                                            placeholder={`Isi ${fieldKey.replace(/_/g, ' ')}`}
                                            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-sm text-xs text-primary"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dynamic Applicant Form List (For Lampiran Table) */}
                        <div className="p-4 bg-primary-container/20 rounded-DEFAULT border border-primary/20 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-bold">
                                    Data Pemohon pada Tabel Lampiran ({applicantsList.length} Orang)
                                </h3>
                                <button
                                    type="button"
                                    onClick={addApplicant}
                                    className="px-2.5 py-1 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-on-surface transition-colors flex items-center gap-1 shadow-xs"
                                >
                                    <span>+ Tambah Pemohon</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {applicantsList.map((appItem, aIdx) => (
                                    <div key={aIdx} className="p-3 bg-surface-bright rounded-md border border-outline/20 space-y-2 relative shadow-xs">
                                        <div className="flex items-center justify-between text-xs font-bold text-primary border-b border-outline/10 pb-1">
                                            <span>Pemohon #{aIdx + 1} {aIdx === 0 ? '(Pemohon Utama)' : ''}</span>
                                            {applicantsList.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeApplicant(aIdx)}
                                                    className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                            <div className="sm:col-span-2">
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">Nama Lengkap & Gelar</label>
                                                <input
                                                    type="text"
                                                    value={appItem.nama || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'nama', e.target.value)}
                                                    placeholder="Nama & Gelar"
                                                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">NIP</label>
                                                <input
                                                    type="text"
                                                    value={appItem.nip || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'nip', e.target.value)}
                                                    placeholder="18 digit NIP"
                                                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">Golongan Asal</label>
                                                <input
                                                    type="text"
                                                    value={appItem.gol_asal || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'gol_asal', e.target.value)}
                                                    placeholder="Contoh: Pembina Tk.I, IV/b"
                                                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">Jabatan</label>
                                                <input
                                                    type="text"
                                                    value={appItem.jabatan || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'jabatan', e.target.value)}
                                                    placeholder="Guru Ahli Madya"
                                                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">Unit Kerja</label>
                                                <input
                                                    type="text"
                                                    value={appItem.unit_kerja || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'unit_kerja', e.target.value)}
                                                    placeholder={school?.name || 'SD N 1 Padalarang'}
                                                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">Kecamatan</label>
                                                <input
                                                    type="text"
                                                    value={appItem.kecamatan || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'kecamatan', e.target.value)}
                                                    placeholder="Padalarang"
                                                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Body Text */}
                        <div className="relative">
                            <label className="block font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                                Narasi / Isi Pokok Surat Pengantar
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={data.body_content}
                                onChange={(e) => setData('body_content', e.target.value)}
                                placeholder="Tuliskan isi ringkas atau keterangan berkas..."
                                className="editorial-textarea"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-4 border-t border-outline/10">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-sm text-xs uppercase tracking-widest hover:bg-on-surface transition-colors flex justify-center items-center gap-2 font-semibold shadow-xs disabled:opacity-50"
                            >
                                <span>Kirim Pengajuan Surat</span>
                                <Icon name="send" className="text-sm text-on-primary" />
                            </button>
                        </div>
                    </form>
                </section>

                {/* Right Side: High Fidelity Paper Preview (6 Cols - 50%) */}
                <section className="lg:col-span-6 bg-surface-container-highest p-4 md:p-6 rounded-DEFAULT border border-outline/10 relative overflow-x-auto flex flex-col items-center justify-start min-h-[600px]">
                    <div className="absolute inset-0 opacity-30 pointer-events-none preview-atmospheric-pattern"></div>
                    <div className="w-full z-10 overflow-x-auto flex justify-center py-2">
                        <LiveLetterPreview
                            school={school}
                            letterName={data.letter_name}
                            applicationNumber="DRAFT-NEW"
                            subject={data.subject}
                            recipient={data.recipient}
                            bodyContent={data.body_content}
                            formData={data.form_data}
                            classificationCode={classificationCode}
                            status="draft"
                        />
                    </div>
                </section>
            </div>
        </OperatorLayout>
    );
}
