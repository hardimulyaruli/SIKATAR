import { useState, useCallback, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { CLASSIFICATION_CODES } from '@/Utils/classificationCodes';
import { sanitizeNip, findEmployeeByNip, getAllEmployeesList, lookupEmployeeApi } from '@/Utils/employeeLookup';
import { useApplicationSignatures } from '@/Hooks/useApplicationSignatures';

/**
 * Custom hook to manage all state and business logic for composing a new official letter application.
 * Single Responsibility: Form state, template resolution, multi-applicant dynamic rows, and submission.
 */
export function useApplicationCreate({ school, templates = [], initialTpl = null, employees = [] } = {}) {
    const safeTemplates = Array.isArray(templates) ? templates : [];
    const allDbEmployees = useMemo(() => getAllEmployeesList(employees), [employees]);

    // Build comprehensive template options matching ALL classification codes 2024
    const allAvailableTemplates = useMemo(() => {
        return CLASSIFICATION_CODES.map((item) => {
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
    }, [safeTemplates]);

    const defaultTemplate = initialTpl || allAvailableTemplates[0];
    const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);
    const [classificationCode, setClassificationCode] = useState(defaultTemplate?.classification_code || '800.1.3.2');
    const todayIsoDate = useMemo(() => new Date().toISOString().split('T')[0], []);

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

    // Signatures and stamp manager
    const signatureHook = useApplicationSignatures(setData);

    const handleSelectTemplate = useCallback((tpl) => {
        if (!tpl) return;
        setSelectedTemplate(tpl);
        setClassificationCode(tpl.classification_code || '800.1.3.2');
        setData((prev) => ({
            ...prev,
            template_code: tpl.code,
            letter_name: tpl.name,
            subject: tpl.default_subject || tpl.name || '',
            body_content: tpl.default_body_template || '',
            form_data: {
                ...prev.form_data,
                letter_date: prev.form_data?.letter_date || todayIsoDate,
            },
        }));
    }, [todayIsoDate, setData]);

    const handleClassificationChange = useCallback((code) => {
        setClassificationCode(code);
        const matchingTpl = allAvailableTemplates.find((t) => t.classification_code === code);
        if (matchingTpl) {
            handleSelectTemplate(matchingTpl);
        }
    }, [allAvailableTemplates, handleSelectTemplate]);

    const handleCustomParamChange = useCallback((key, rawVal) => {
        let val = rawVal;
        if (key === 'nip') {
            val = sanitizeNip(rawVal);
        }

        const matchedEmp = key === 'nip' ? findEmployeeByNip(val, employees) : null;

        setData((prev) => {
            const newFormData = {
                ...prev.form_data,
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
                    let current = Array.isArray(prev.form_data.applicants) && prev.form_data.applicants.length > 0
                        ? [...prev.form_data.applicants]
                        : [{
                            nip: prev.form_data.nip || '',
                            nama: prev.form_data.nama_pegawai || '',
                            gol_asal: prev.form_data.pangkat_golongan || '',
                            jabatan: prev.form_data.jabatan || '',
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

            return {
                ...prev,
                form_data: newFormData,
            };
        });

        if (key === 'nip' && val.length >= 8) {
            lookupEmployeeApi(val).then((apiEmp) => {
                if (apiEmp) {
                    setData((prev) => {
                        const currentFormData = prev.form_data;
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
                        return {
                            ...prev,
                            form_data: {
                                ...currentFormData,
                                nip: val,
                                nama_pegawai: apiEmp.nama || apiEmp.name,
                                pangkat_golongan: apiEmp.pangkat_golongan || apiEmp.gol_asal,
                                jabatan: apiEmp.jabatan,
                                applicants: curApps,
                            },
                        };
                    });
                }
            });
        }
    }, [employees, school?.name, setData]);

    const applicantsList = useMemo(() => {
        return Array.isArray(data.form_data.applicants) && data.form_data.applicants.length > 0
            ? data.form_data.applicants
            : [{
                nip: data.form_data.nip || '',
                nama: data.form_data.nama_pegawai || '',
                gol_asal: data.form_data.pangkat_golongan || '',
                jabatan: data.form_data.jabatan || '',
                unit_kerja: school?.name || '',
                kecamatan: '',
            }];
    }, [data.form_data.applicants, data.form_data.nip, data.form_data.nama_pegawai, data.form_data.pangkat_golongan, data.form_data.jabatan, school?.name]);

    const updateApplicant = useCallback((idx, field, rawVal) => {
        let val = rawVal;
        if (field === 'nip') {
            val = sanitizeNip(rawVal);
        }

        const matchedEmp = field === 'nip' ? findEmployeeByNip(val, employees) : null;

        setData((prev) => {
            const currentList = Array.isArray(prev.form_data.applicants) && prev.form_data.applicants.length > 0
                ? prev.form_data.applicants
                : [{
                    nip: prev.form_data.nip || '',
                    nama: prev.form_data.nama_pegawai || '',
                    gol_asal: prev.form_data.pangkat_golongan || '',
                    jabatan: prev.form_data.jabatan || '',
                    unit_kerja: school?.name || '',
                    kecamatan: '',
                }];

            const updated = [...currentList];
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

            const newFormData = { ...prev.form_data, applicants: updated };
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

            return {
                ...prev,
                form_data: newFormData,
            };
        });

        if (field === 'nip' && val.length >= 8) {
            lookupEmployeeApi(val).then((apiEmp) => {
                if (apiEmp) {
                    setData((prev) => {
                        const currentApps = [...(prev.form_data.applicants || [])];
                        if (!currentApps[idx]) return prev;
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
                        const updatedObj = { ...prev.form_data, applicants: currentApps };
                        if (idx === 0) {
                            updatedObj.nip = val;
                            updatedObj.nama_pegawai = apiEmp.nama || apiEmp.name;
                            updatedObj.pangkat_golongan = apiEmp.pangkat_golongan || apiEmp.gol_asal;
                            updatedObj.jabatan = apiEmp.jabatan;
                        }
                        return {
                            ...prev,
                            form_data: updatedObj,
                        };
                    });
                }
            });
        }
    }, [employees, school?.name, setData]);

    const addApplicant = useCallback(() => {
        setData((prev) => {
            const current = Array.isArray(prev.form_data.applicants) && prev.form_data.applicants.length > 0
                ? prev.form_data.applicants
                : [{
                    nip: prev.form_data.nip || '',
                    nama: prev.form_data.nama_pegawai || '',
                    gol_asal: prev.form_data.pangkat_golongan || '',
                    jabatan: prev.form_data.jabatan || '',
                    unit_kerja: school?.name || '',
                    kecamatan: '',
                }];
            const updated = [
                ...current,
                { nip: '', nama: '', gol_asal: '', jabatan: '', unit_kerja: school?.name || '', kecamatan: '' },
            ];
            return {
                ...prev,
                form_data: {
                    ...prev.form_data,
                    applicants: updated,
                    jumlah_berkas: updated.length.toString(),
                },
            };
        });
    }, [school?.name, setData]);

    const removeApplicant = useCallback((idx) => {
        setData((prev) => {
            const current = prev.form_data.applicants || [];
            if (current.length <= 1) return prev;
            const updated = current.filter((_, i) => i !== idx);
            return {
                ...prev,
                form_data: {
                    ...prev.form_data,
                    applicants: updated,
                    jumlah_berkas: updated.length.toString(),
                },
            };
        });
    }, [setData]);

    const handleSubmit = useCallback((e) => {
        e?.preventDefault();
        post('/operator/applications', {
            forceFormData: true,
        });
    }, [post]);

    return {
        data,
        setData,
        errors,
        processing,
        selectedTemplate,
        classificationCode,
        todayIsoDate,
        allAvailableTemplates,
        applicantsList,
        handleSelectTemplate,
        handleClassificationChange,
        handleCustomParamChange,
        updateApplicant,
        addApplicant,
        removeApplicant,
        handleSubmit,
        signatures: signatureHook,
    };
}

export default useApplicationCreate;
