import { useState, useCallback, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { autoExtractSignature } from '@/Utils/signatureProcessor';
import { generateSchoolStampDataUrl } from '@/Utils/stampGenerator';

/**
 * Custom hook to manage Disdik Profile assets state:
 * Profile photo upload, wet signature extraction, and official stamp.
 */
export function useDisdikProfileForm() {
    const user = usePage().props.auth.user;
    const defaultSampleStamp = generateSchoolStampDataUrl('DINAS PENDIDIKAN KAB. BANDUNG BARAT');

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        profile_photo: null,
        signature: null,
        stamp: null,
        delete_photo: false,
        delete_signature: false,
        delete_stamp: false,
    });

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return path;
    };

    const [previewPhoto, setPreviewPhoto] = useState(user?.profile_photo_path ? getImageUrl(user.profile_photo_path) : null);
    const [previewSignature, setPreviewSignature] = useState(user?.signature_path ? getImageUrl(user.signature_path) : null);

    const [stampMode, setStampMode] = useState(user?.stamp_path ? 'custom' : 'sample');
    const [previewStamp, setPreviewStamp] = useState(user?.stamp_path ? getImageUrl(user.stamp_path) : defaultSampleStamp);

    // Sync preview state when user prop updates
    useEffect(() => {
        if (user?.profile_photo_path) {
            setPreviewPhoto(getImageUrl(user.profile_photo_path));
        } else if (!data.profile_photo) {
            setPreviewPhoto(null);
        }
    }, [user?.profile_photo_path]);

    useEffect(() => {
        if (user?.signature_path) {
            setPreviewSignature(getImageUrl(user.signature_path));
        } else if (!data.signature) {
            setPreviewSignature(null);
        }
    }, [user?.signature_path]);

    useEffect(() => {
        if (user?.stamp_path) {
            setPreviewStamp(getImageUrl(user.stamp_path));
            setStampMode('custom');
        }
    }, [user?.stamp_path]);

    const [rawSigFile, setRawSigFile] = useState(null);
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraTarget, setCameraTarget] = useState('signature');
    const [isExtractingSig, setIsExtractingSig] = useState(false);
    const [isExtractingStamp, setIsExtractingStamp] = useState(false);

    const handlePhotoChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                profile_photo: file,
                delete_photo: false,
            }));
            const previewUrl = URL.createObjectURL(file);
            setPreviewPhoto(previewUrl);
            // Notify other UI components like Sidebar immediately
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('profile-photo-updated', { detail: { previewUrl } }));
            }
        }
    }, [setData]);

    const handleResetPhoto = useCallback(() => {
        setData((prev) => ({
            ...prev,
            profile_photo: null,
            delete_photo: true,
        }));
        setPreviewPhoto(null);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('profile-photo-updated', { detail: { previewUrl: null } }));
        }
    }, [setData]);

    const handleProcessSignature = useCallback(async (file) => {
        if (!file) return;
        setRawSigFile(file);
        setIsExtractingSig(true);
        setData((prev) => ({ ...prev, delete_signature: false }));

        try {
            const result = await autoExtractSignature(file);
            setData('signature', result.file);
            setPreviewSignature(result.previewUrl);
        } catch (err) {
            console.error('Ekstraksi otomatis gagal, fallback ke studio manual:', err);
            setData('signature', file);
            setPreviewSignature(URL.createObjectURL(file));
            setIsSigModalOpen(true);
        } finally {
            setIsExtractingSig(false);
        }
    }, [setData]);

    const handleProcessStamp = useCallback(async (file) => {
        if (!file) return;
        setIsExtractingStamp(true);
        setData((prev) => ({ ...prev, delete_stamp: false }));

        try {
            const result = await autoExtractSignature(file);
            setData('stamp', result.file);
            setPreviewStamp(result.previewUrl);
            setStampMode('custom');
        } catch (err) {
            console.error('Ekstraksi cap otomatis gagal:', err);
            setData('stamp', file);
            setPreviewStamp(URL.createObjectURL(file));
            setStampMode('custom');
        } finally {
            setIsExtractingStamp(false);
        }
    }, [setData]);

    const handleCameraCapture = useCallback((file) => {
        if (cameraTarget === 'stamp') {
            handleProcessStamp(file);
        } else {
            handleProcessSignature(file);
        }
    }, [cameraTarget, handleProcessStamp, handleProcessSignature]);

    const handleResetSignature = useCallback(() => {
        setData((prev) => ({
            ...prev,
            signature: null,
            delete_signature: true,
        }));
        setPreviewSignature(null);
        setRawSigFile(null);
    }, [setData]);

    const handleResetStamp = useCallback(() => {
        setData((prev) => ({
            ...prev,
            stamp: null,
            delete_stamp: true,
        }));
        setPreviewStamp(defaultSampleStamp);
        setStampMode('sample');
    }, [setData, defaultSampleStamp]);

    const handleStampModeChange = useCallback((mode) => {
        setStampMode(mode);
        if (mode === 'sample') {
            handleResetStamp();
        }
    }, [handleResetStamp]);

    const handleSignatureExtracted = useCallback((cleanFile, cleanPreviewUrl) => {
        setData('signature', cleanFile);
        setPreviewSignature(cleanPreviewUrl);
    }, [setData]);

    const submit = useCallback((e) => {
        e?.preventDefault();
        post('/profile/assets', {
            forceFormData: true,
            preserveScroll: true,
        });
    }, [post]);

    return {
        data,
        setData,
        errors,
        processing,
        recentlySuccessful,
        previewPhoto,
        previewSignature,
        previewStamp,
        rawSigFile,
        isSigModalOpen,
        setIsSigModalOpen,
        isCameraOpen,
        setIsCameraOpen,
        cameraTarget,
        setCameraTarget,
        isExtractingSig,
        isExtractingStamp,
        stampMode,
        handleStampModeChange,
        handlePhotoChange,
        handleResetPhoto,
        handleProcessSignature,
        handleProcessStamp,
        handleCameraCapture,
        handleResetSignature,
        handleResetStamp,
        handleSignatureExtracted,
        submit,
    };
}

export default useDisdikProfileForm;
