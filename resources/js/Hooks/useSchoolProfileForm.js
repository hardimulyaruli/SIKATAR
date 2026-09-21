import { useState, useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { getImageUrl } from '@/Components/Letter/HeaderKopSurat';
import { useEmployeeLookup } from '@/Hooks/useEmployeeLookup';
import { autoExtractSignature } from '@/Utils/signatureProcessor';
import { generateSchoolStampDataUrl } from '@/Utils/stampGenerator';

/**
 * Custom hook to manage School Profile edit state:
 * Info fields, logo upload, wet signature extraction, and official stamp.
 * Single Responsibility: School profile state, assets processing, and submission.
 */
export function useSchoolProfileForm(school) {
    const defaultSampleStamp = generateSchoolStampDataUrl(school?.name || 'SD NEGERI 1 PADALARANG');

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: school?.name || '',
        npsn: school?.npsn || '',
        jenjang: school?.jenjang || 'SD',
        status_akreditasi: school?.status_akreditasi || 'A',
        address: school?.address || '',
        phone: school?.phone || '',
        email: school?.email || '',
        headmaster_name: school?.headmaster_name || '',
        headmaster_nip: school?.headmaster_nip || '',
        logo: null,
        signature: null,
        stamp: null,
    });

    const [previewLogo, setPreviewLogo] = useState(school?.logo_kop_path ? getImageUrl(school.logo_kop_path) : null);
    const [previewSignature, setPreviewSignature] = useState(school?.signature_path ? getImageUrl(school.signature_path) : null);
    const [previewStamp, setPreviewStamp] = useState(school?.stamp_path ? getImageUrl(school.stamp_path) : defaultSampleStamp);
    const [rawSigFile, setRawSigFile] = useState(null);
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);
    const [isExtractingSig, setIsExtractingSig] = useState(false);
    const [isExtractingStamp, setIsExtractingStamp] = useState(false);

    useEffect(() => {
        if (school?.logo_kop_path) {
            setPreviewLogo(getImageUrl(school.logo_kop_path));
        }
    }, [school?.logo_kop_path]);

    useEffect(() => {
        if (school?.signature_path) {
            setPreviewSignature(getImageUrl(school.signature_path));
        }
    }, [school?.signature_path]);

    const { handleNipChange } = useEmployeeLookup((updater) => {
        setData((prev) => {
            const res = typeof updater === 'function' ? updater(prev) : updater;
            return {
                ...prev,
                headmaster_nip: res.nip !== undefined ? res.nip : prev.headmaster_nip,
                headmaster_name: res.name !== undefined ? res.name : prev.headmaster_name,
            };
        });
    });

    const handleLogoChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    }, [setData]);

    const handleSignatureChange = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setRawSigFile(file);
            setIsExtractingSig(true);
            try {
                const result = await autoExtractSignature(file);
                setData('signature', result.file);
                setPreviewSignature(result.previewUrl);
            } catch (err) {
                console.error('Ekstraksi otomatis gagal, fallback ke file mentah:', err);
                setData('signature', file);
                setPreviewSignature(URL.createObjectURL(file));
            } finally {
                setIsExtractingSig(false);
            }
        }
    }, [setData]);

    const handleSignatureExtracted = useCallback((cleanFile, cleanPreviewUrl) => {
        setData('signature', cleanFile);
        setPreviewSignature(cleanPreviewUrl);
    }, [setData]);

    const handleStampChange = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsExtractingStamp(true);
            try {
                const result = await autoExtractSignature(file);
                setData('stamp', result.file);
                setPreviewStamp(result.previewUrl);
            } catch (err) {
                console.error('Ekstraksi cap otomatis gagal:', err);
                setData('stamp', file);
                setPreviewStamp(URL.createObjectURL(file));
            } finally {
                setIsExtractingStamp(false);
            }
        }
    }, [setData]);

    const submit = useCallback((e) => {
        e?.preventDefault();
        post('/operator/profile', {
            forceFormData: true,
        });
    }, [post]);

    return {
        data,
        setData,
        errors,
        processing,
        recentlySuccessful,
        previewLogo,
        previewSignature,
        previewStamp,
        rawSigFile,
        isSigModalOpen,
        setIsSigModalOpen,
        isExtractingSig,
        isExtractingStamp,
        handleNipChange,
        handleLogoChange,
        handleSignatureChange,
        handleSignatureExtracted,
        handleStampChange,
        submit,
    };
}

export default useSchoolProfileForm;
