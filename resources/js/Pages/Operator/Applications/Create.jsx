import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import Icon from '@/Components/UI/Icon';
import LiveLetterPreview from '@/Components/Letter/LiveLetterPreview';
import { getImageUrl } from '@/Components/Letter/HeaderKopSurat';
import { useForm } from '@inertiajs/react';
import { CLASSIFICATION_CODES } from '@/Utils/classificationCodes';
import { sanitizeNip, findEmployeeByNip, getAllEmployeesList, lookupEmployeeApi } from '@/Utils/employeeLookup';
import { SCHOOL_JABATAN_OPTIONS } from '@/Utils/schoolPositions';
import SignatureSelectorSection from '@/Components/Signature/SignatureSelectorSection';
import StampSelectorSection from '@/Components/Signature/StampSelectorSection';
import SignatureExtractorModal from '@/Components/Signature/SignatureExtractorModal';
import CameraCaptureModal from '@/Components/Signature/CameraCaptureModal';
import { autoExtractSignature } from '@/Utils/signatureProcessor';
import { generateSchoolStampDataUrl } from '@/Utils/stampGenerator';

export default function ApplicationCreate({ school, templates = [], selectedTemplate: initialTpl, employees = [] }) {
    const safeTemplates = Array.isArray(templates) ? templates : [];
    const allDbEmployees = getAllEmployeesList(employees);

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
            required_fields_json: ['nip', 'nama_pegawai', 'pangkat_golongan', 'jabatan', 'jumlah_berkas'],
        };
    });

    const defaultTemplate = initialTpl || allAvailableTemplates[0];
    const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);
    const [classificationCode, setClassificationCode] = useState(defaultTemplate?.classification_code || '800.1.3.2');
    const todayIsoDate = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        template_code: defaultTemplate?.code || 'PENGANTAR-KENAIKAN-PANGKAT',
        letter_name: defaultTemplate?.name || 'Surat Pengantar',
        subject: defaultTemplate?.default_subject || '',
        recipient: 'Kepala Dinas Pendidikan Kabupaten Bandung Barat',
        body_content: defaultTemplate?.default_body_template || '',
        form_data: {
            letter_date: todayIsoDate,
            stamp_mode: 'none',
        },
        custom_signature: null,
        custom_stamp: null,
    });

    // State untuk Tanda Tangan Basah (Default Profil vs Khusus Surat Ini)
    const [signatureMode, setSignatureMode] = useState('default');
    const [customSigPreview, setCustomSigPreview] = useState(null);
    const [rawSigFile, setRawSigFile] = useState(null);
    const [isExtractorOpen, setIsExtractorOpen] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    // State untuk Cap / Stempel Sekolah (Tanpa Cap by Default vs Sampel Resmi vs Khusus Surat Ini)
    const [stampMode, setStampMode] = useState('none'); // 'none' | 'sample' | 'custom'
    const [customStampPreview, setCustomStampPreview] = useState(null);
    const [isExtractingStamp, setIsExtractingStamp] = useState(false);
    const [cameraTarget, setCameraTarget] = useState('signature'); // 'signature' | 'stamp'

    const handleSignatureModeChange = (mode) => {
        setSignatureMode(mode);
        if (mode === 'default') {
            setData('custom_signature', null);
        }
    };

    const handleStampModeChange = (mode) => {
        setStampMode(mode);
        if (mode === 'none') {
            setData((prev) => ({
                ...prev,
                custom_stamp: null,
                form_data: {
                    ...prev.form_data,
                    stamp_mode: 'none',
                },
            }));
        } else if (mode === 'sample') {
            setData((prev) => ({
                ...prev,
                custom_stamp: null,
                form_data: {
                    ...prev.form_data,
                    stamp_mode: 'sample',
                },
            }));
        }
    };

    // Alur 100% Otomatis & Foolproof: Ekstrak secara langsung tanpa intervensi user
    const handleProcessFileAutomatically = async (file) => {
        if (!file) return;
        setRawSigFile(file);
        setIsExtracting(true);

        try {
            const result = await autoExtractSignature(file);
            setData('custom_signature', result.file);
            setCustomSigPreview(result.previewUrl);
            setSignatureMode('custom');
        } catch (err) {
            console.error('Ekstraksi otomatis gagal, fallback ke studio manual:', err);
            setIsExtractorOpen(true);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleRawFileSelected = (file) => {
        handleProcessFileAutomatically(file);
    };

    const handleStampFileSelected = async (file) => {
        if (!file) return;
        setIsExtractingStamp(true);
        try {
            const result = await autoExtractSignature(file);
            setData((prev) => ({
                ...prev,
                custom_stamp: result.file,
                form_data: {
                    ...prev.form_data,
                    stamp_mode: 'custom',
                },
            }));
            setCustomStampPreview(result.previewUrl);
            setStampMode('custom');
        } catch (err) {
            console.error('Ekstraksi cap otomatis gagal:', err);
        } finally {
            setIsExtractingStamp(false);
        }
    };

    const handleResetCustomStamp = () => {
        setCustomStampPreview(null);
        setStampMode('sample');
        setData((prev) => ({
            ...prev,
            custom_stamp: null,
            form_data: {
                ...prev.form_data,
                stamp_mode: 'sample',
            },
        }));
    };

    const handleCameraCapture = (file) => {
        if (cameraTarget === 'stamp') {
            handleStampFileSelected(file);
        } else {
            handleProcessFileAutomatically(file);
        }
    };

    const handleSaveCleanSignature = (cleanFile, cleanPreviewUrl) => {
        setData('custom_signature', cleanFile);
        setCustomSigPreview(cleanPreviewUrl);
        setSignatureMode('custom');
    };

    const handleResetCustomSignature = () => {
        setData('custom_signature', null);
        setCustomSigPreview(null);
        setRawSigFile(null);
        setSignatureMode('default');
    };

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
            form_data: {
                ...data.form_data,
                letter_date: data.form_data?.letter_date || todayIsoDate,
            },
        });
    };

    const handleClassificationChange = (code) => {
        setClassificationCode(code);
        const matchingTpl = allAvailableTemplates.find((t) => t.classification_code === code);
        if (matchingTpl) {
            handleSelectTemplate(matchingTpl);
        }
    };

    const handleCustomParamChange = (key, rawVal) => {
        let val = rawVal;
        if (key === 'nip') {
            val = sanitizeNip(rawVal);
        }

        const matchedEmp = key === 'nip' ? findEmployeeByNip(val, employees) : null;

        const newFormData = {
            ...data.form_data,
            [key]: val,
        };

        if (matchedEmp) {
            newFormData.nip = val;
            newFormData.nama_pegawai = matchedEmp.nama;
            newFormData.pangkat_golongan = matchedEmp.gol_asal;
            newFormData.jabatan = matchedEmp.jabatan;

            if (Array.isArray(newFormData.applicants) && newFormData.applicants.length > 0) {
                const updatedApplicants = [...newFormData.applicants];
                updatedApplicants[0] = {
                    ...updatedApplicants[0],
                    nip: val,
                    nama: matchedEmp.nama,
                    gol_asal: matchedEmp.gol_asal,
                    jabatan: matchedEmp.jabatan,
                    unit_kerja: matchedEmp.unit_kerja || school?.name || '',
                    kecamatan: matchedEmp.kecamatan || '',
                    _matched: true,
                };
                newFormData.applicants = updatedApplicants;
            }
        }

        if (key === 'jumlah_berkas') {
            const count = parseInt(val, 10);
            if (!isNaN(count) && count > 0) {
                let current = Array.isArray(data.form_data.applicants) && data.form_data.applicants.length > 0
                    ? [...data.form_data.applicants]
                    : [{
                        nip: data.form_data.nip || '',
                        nama: data.form_data.nama_pegawai || '',
                        gol_asal: data.form_data.pangkat_golongan || '',
                        jabatan: data.form_data.jabatan || '',
                        unit_kerja: school?.name || '',
                        kecamatan: '',
                    }];
                if (current.length < count) {
                    for (let i = current.length; i < count; i++) {
                        current.push({ nip: '', nama: '', gol_asal: '', jabatan: '', unit_kerja: school?.name || '', kecamatan: '' });
                    }
                } else if (current.length > count && count >= 1) {
                    current = current.slice(0, count);
                }
                newFormData.applicants = current;
            }
        }

        setData('form_data', newFormData);

        if (key === 'nip' && val.length >= 8) {
            lookupEmployeeApi(val).then((apiEmp) => {
                if (apiEmp) {
                    const currentFormData = data.form_data;
                    const curApps = Array.isArray(currentFormData.applicants) && currentFormData.applicants.length > 0
                        ? [...currentFormData.applicants]
                        : [{ nip: val, nama: '', gol_asal: '', jabatan: '', unit_kerja: school?.name || '', kecamatan: '' }];
                    curApps[0] = {
                        ...curApps[0],
                        nip: val,
                        nama: apiEmp.nama || apiEmp.name,
                        gol_asal: apiEmp.pangkat_golongan || apiEmp.gol_asal,
                        jabatan: apiEmp.jabatan,
                        unit_kerja: apiEmp.unit_kerja || school?.name || '',
                        kecamatan: apiEmp.kecamatan || '',
                        _matched: true,
                    };
                    setData('form_data', {
                        ...currentFormData,
                        nip: val,
                        nama_pegawai: apiEmp.nama || apiEmp.name,
                        pangkat_golongan: apiEmp.pangkat_golongan || apiEmp.gol_asal,
                        jabatan: apiEmp.jabatan,
                        applicants: curApps,
                    });
                }
            });
        }
    };

    const applicantsList = Array.isArray(data.form_data.applicants) && data.form_data.applicants.length > 0
        ? data.form_data.applicants
        : [{
            nip: data.form_data.nip || '',
            nama: data.form_data.nama_pegawai || '',
            gol_asal: data.form_data.pangkat_golongan || '',
            jabatan: data.form_data.jabatan || '',
            unit_kerja: school?.name || '',
            kecamatan: '',
        }];

    const updateApplicant = (idx, field, rawVal) => {
        const updated = [...applicantsList];
        let val = rawVal;
        if (field === 'nip') {
            val = sanitizeNip(rawVal);
        }

        const matchedEmp = field === 'nip' ? findEmployeeByNip(val, employees) : null;

        if (matchedEmp) {
            updated[idx] = {
                ...updated[idx],
                nip: val,
                nama: matchedEmp.nama,
                gol_asal: matchedEmp.gol_asal,
                jabatan: matchedEmp.jabatan,
                unit_kerja: matchedEmp.unit_kerja || school?.name || '',
                kecamatan: matchedEmp.kecamatan || '',
                _matched: true,
            };
        } else {
            updated[idx] = {
                ...updated[idx],
                [field]: val,
                ...(field === 'nip' ? { _matched: false } : {}),
            };
        }

        const newFormData = { ...data.form_data, applicants: updated };
        if (idx === 0) {
            if (field === 'nip') {
                newFormData.nip = val;
                if (matchedEmp) {
                    newFormData.nama_pegawai = matchedEmp.nama;
                    newFormData.pangkat_golongan = matchedEmp.gol_asal;
                    newFormData.jabatan = matchedEmp.jabatan;
                }
            } else if (field === 'nama') newFormData.nama_pegawai = val;
            else if (field === 'gol_asal') newFormData.pangkat_golongan = val;
            else if (field === 'jabatan') newFormData.jabatan = val;
        }

        setData('form_data', newFormData);

        if (field === 'nip' && val.length >= 8) {
            lookupEmployeeApi(val).then((apiEmp) => {
                if (apiEmp) {
                    const currentApps = [...updated];
                    currentApps[idx] = {
                        ...currentApps[idx],
                        nip: val,
                        nama: apiEmp.nama || apiEmp.name,
                        gol_asal: apiEmp.pangkat_golongan || apiEmp.gol_asal,
                        jabatan: apiEmp.jabatan,
                        unit_kerja: apiEmp.unit_kerja || school?.name || '',
                        kecamatan: apiEmp.kecamatan || '',
                        _matched: true,
                    };
                    const updatedObj = { ...newFormData, applicants: currentApps };
                    if (idx === 0) {
                        updatedObj.nip = val;
                        updatedObj.nama_pegawai = apiEmp.nama || apiEmp.name;
                        updatedObj.pangkat_golongan = apiEmp.pangkat_golongan || apiEmp.gol_asal;
                        updatedObj.jabatan = apiEmp.jabatan;
                    }
                    setData('form_data', updatedObj);
                }
            });
        }
    };

    const addApplicant = () => {
        const updated = [
            ...applicantsList,
            { nip: '', nama: '', gol_asal: '', jabatan: '', unit_kerja: school?.name || '', kecamatan: '' }
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
        post('/operator/applications', {
            forceFormData: true,
        });
    };

    // Helper to sort custom fields so 'nip' is always first before 'nama_pegawai'
    const getSortedCustomFields = (fieldsArray) => {
        if (!Array.isArray(fieldsArray)) return [];
        const copy = [...fieldsArray];
        copy.sort((a, b) => {
            if (a === 'nip') return -1;
            if (b === 'nip') return 1;
            if (a === 'nama_pegawai' || a === 'nama') return -1;
            if (b === 'nama_pegawai' || b === 'nama') return 1;
            return 0;
        });
        return copy;
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
 
                        {/* Tanggal Surat Pengantar */}
                        <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/20 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                    Tanggal Surat Pengantar
                                </label>
                                <span className="text-[10px] font-mono text-primary font-semibold bg-surface-container-lowest px-2 py-0.5 rounded border border-outline/10">
                                    Tahun: {(data.form_data?.letter_date || todayIsoDate).split('-')[0]}
                                </span>
                            </div>
                            <input
                                type="date"
                                required
                                value={data.form_data?.letter_date || todayIsoDate}
                                onChange={(e) => {
                                    setData('form_data', {
                                        ...data.form_data,
                                        letter_date: e.target.value,
                                    });
                                }}
                                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs font-semibold text-primary focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                            <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                Tanggal dicantumkan di pojok kanan atas surat. Penomoran surat (<span className="font-mono font-bold">... - Sekre/{(data.form_data?.letter_date || todayIsoDate).split('-')[0]}</span>) otomatis menyesuaikan tahun yang dipilih.
                            </p>
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

                        {/* Custom Fields if required (Excluding applicant and count fields) */}
                        {(() => {
                            const EXCLUDED_KEYS = new Set([
                                'nip', 'nama_pegawai', 'nama', 'pangkat_golongan', 'pangkat',
                                'golongan', 'gol_asal', 'jabatan', 'jumlah_berkas', 'jumlah_orang'
                            ]);
                            const customFields = (selectedTemplate?.required_fields_json || []).filter(
                                (key) => !EXCLUDED_KEYS.has(key)
                            );
                            if (customFields.length === 0) return null;

                            return (
                                <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/10 space-y-3 font-body-md text-xs">
                                    <p className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                                        Parameter Khusus Berkas Pengantar:
                                    </p>
                                    {customFields.map((fieldKey) => (
                                        <div key={fieldKey}>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block font-semibold capitalize text-on-surface-variant text-xs">
                                                    {fieldKey.replace(/_/g, ' ')}
                                                </label>
                                            </div>
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
                            );
                        })()}

                        {/* Single Unified Data Pemohon Section */}
                        <div className="p-4 bg-primary-container/20 rounded-DEFAULT border border-primary/20 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-bold">
                                    Data Pemohon ({applicantsList.length} Orang)
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
                                    <div key={aIdx} className="p-3.5 bg-surface-bright rounded-md border border-outline/20 space-y-3 relative shadow-xs">
                                        <div className="flex items-center justify-between text-xs font-bold text-primary border-b border-outline/10 pb-1.5">
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            {/* NIP Input FIELD FIRST */}
                                            <div className="sm:col-span-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                                                        1. NIP Pegawai <span className="text-rose-500">* (Maks 18 Digit)</span>
                                                    </label>
                                                    <span className="text-[10px] font-semibold font-mono text-slate-500">
                                                        {(appItem.nip || '').length}/18 Digit
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    maxLength={18}
                                                    value={appItem.nip || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'nip', e.target.value)}
                                                    placeholder="Masukkan 18 digit NIP..."
                                                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-xs font-mono font-bold text-blue-900 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                                                />
                                            </div>

                                            {/* NAMA Lengkap FIELD SECOND */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">2. Nama Lengkap & Gelar</label>
                                                <input
                                                    type="text"
                                                    value={appItem.nama || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'nama', e.target.value)}
                                                    placeholder="Nama & Gelar Pegawai"
                                                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs font-bold"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">3. Golongan Asal</label>
                                                <input
                                                    type="text"
                                                    value={appItem.gol_asal || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'gol_asal', e.target.value)}
                                                    placeholder="Contoh: Pembina Tk.I, IV/b"
                                                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">4. Jabatan</label>
                                                <select
                                                    value={SCHOOL_JABATAN_OPTIONS.includes(appItem.jabatan) ? appItem.jabatan : (appItem.jabatan ? '__CUSTOM__' : '')}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === '__CUSTOM__') {
                                                            updateApplicant(aIdx, 'jabatan', '');
                                                        } else {
                                                            updateApplicant(aIdx, 'jabatan', val);
                                                        }
                                                    }}
                                                    className="w-full px-2 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs font-semibold text-primary"
                                                >
                                                    <option value="">-- Pilih Jabatan Sekolah --</option>
                                                    {SCHOOL_JABATAN_OPTIONS.map((jbt, jIdx) => (
                                                        <option key={jIdx} value={jbt}>
                                                            {jbt}
                                                        </option>
                                                    ))}
                                                    <option value="__CUSTOM__">Lainnya (Ketik Manual)</option>
                                                </select>
                                                {appItem.jabatan !== '' && !SCHOOL_JABATAN_OPTIONS.includes(appItem.jabatan) && (
                                                    <input
                                                        type="text"
                                                        value={appItem.jabatan || ''}
                                                        onChange={(e) => updateApplicant(aIdx, 'jabatan', e.target.value)}
                                                        placeholder="Ketik nama jabatan..."
                                                        className="w-full mt-1.5 px-2 py-1.5 bg-surface-container-lowest border border-amber-400/50 rounded text-xs text-primary font-medium focus:ring-2 focus:ring-amber-500/20"
                                                        autoFocus
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">5. Unit Kerja</label>
                                                <input
                                                    type="text"
                                                    value={appItem.unit_kerja || ''}
                                                    onChange={(e) => updateApplicant(aIdx, 'unit_kerja', e.target.value)}
                                                    placeholder={school?.name || 'SD N 1 Padalarang'}
                                                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline/20 rounded text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-on-surface-variant mb-0.5">6. Kecamatan</label>
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

                        {/* 1. Opsi Tanda Tangan Basah (Default vs Khusus Surat Ini) */}
                        <SignatureSelectorSection
                            school={school}
                            signatureMode={signatureMode}
                            onModeChange={handleSignatureModeChange}
                            customPreview={customSigPreview}
                            onFileSelected={handleRawFileSelected}
                            onOpenCamera={() => {
                                setCameraTarget('signature');
                                setIsCameraOpen(true);
                            }}
                            onOpenStudio={() => rawSigFile && setIsExtractorOpen(true)}
                            onResetCustom={handleResetCustomSignature}
                            isExtracting={isExtracting}
                        />

                        {/* 2. Opsi Cap / Stempel Sekolah (Ditimpa di Atas TTD) */}
                        <StampSelectorSection
                            school={school}
                            stampMode={stampMode}
                            onModeChange={handleStampModeChange}
                            customStampPreview={customStampPreview}
                            onFileSelected={handleStampFileSelected}
                            onOpenCamera={() => {
                                setCameraTarget('stamp');
                                setIsCameraOpen(true);
                            }}
                            onResetCustom={handleResetCustomStamp}
                            isExtracting={isExtractingStamp}
                        />

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
                            customSignature={signatureMode === 'custom' ? customSigPreview : null}
                            customStamp={
                                stampMode === 'none'
                                    ? 'none'
                                    : stampMode === 'custom'
                                    ? customStampPreview
                                    : (school?.stamp_path ? getImageUrl(school.stamp_path) : generateSchoolStampDataUrl(school?.name || 'SD NEGERI 1 PADALARANG'))
                            }
                        />
                    </div>
                </section>
            </div>

            {/* Modal Ambil Foto dari Kamera Langsung */}
            <CameraCaptureModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
            />

            {/* Modal Studio Pembersih Tanda Tangan */}
            <SignatureExtractorModal
                isOpen={isExtractorOpen}
                onClose={() => setIsExtractorOpen(false)}
                rawImageFile={rawSigFile}
                onSave={handleSaveCleanSignature}
                headmasterName={school?.headmaster_name}
                headmasterNip={school?.headmaster_nip}
                schoolTitle="Kepala Sekolah"
            />
        </OperatorLayout>
    );
}
