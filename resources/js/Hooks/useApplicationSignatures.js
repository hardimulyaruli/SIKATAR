import { useState, useCallback } from 'react';
import { autoExtractSignature } from '@/Utils/signatureProcessor';

/**
 * Custom hook to manage dynamic wet signature and school stamp states for letter creation.
 * Single Responsibility: File processing, transparency extraction, and mode switching for signature and stamp.
 */
export function useApplicationSignatures(setData) {
    const [signatureMode, setSignatureMode] = useState('default'); // 'default' | 'custom'
    const [customSigPreview, setCustomSigPreview] = useState(null);
    const [rawSigFile, setRawSigFile] = useState(null);
    const [isExtractorOpen, setIsExtractorOpen] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    const [stampMode, setStampMode] = useState('none'); // 'none' | 'sample' | 'custom'
    const [customStampPreview, setCustomStampPreview] = useState(null);
    const [isExtractingStamp, setIsExtractingStamp] = useState(false);
    const [cameraTarget, setCameraTarget] = useState('signature'); // 'signature' | 'stamp'

    const handleSignatureModeChange = useCallback(
        (mode) => {
            setSignatureMode(mode);
            if (mode === 'default') {
                setData('custom_signature', null);
            }
        },
        [setData]
    );

    const handleStampModeChange = useCallback(
        (mode) => {
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
        },
        [setData]
    );

    const handleProcessFileAutomatically = useCallback(
        async (file) => {
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
        },
        [setData]
    );

    const handleStampFileSelected = useCallback(
        async (file) => {
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
        },
        [setData]
    );

    const handleResetCustomStamp = useCallback(() => {
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
    }, [setData]);

    const handleCameraCapture = useCallback(
        (file) => {
            if (cameraTarget === 'stamp') {
                handleStampFileSelected(file);
            } else {
                handleProcessFileAutomatically(file);
            }
        },
        [cameraTarget, handleStampFileSelected, handleProcessFileAutomatically]
    );

    const handleSaveCleanSignature = useCallback(
        (cleanFile, cleanPreviewUrl) => {
            setData('custom_signature', cleanFile);
            setCustomSigPreview(cleanPreviewUrl);
            setSignatureMode('custom');
        },
        [setData]
    );

    const handleResetCustomSignature = useCallback(() => {
        setData('custom_signature', null);
        setCustomSigPreview(null);
        setRawSigFile(null);
        setSignatureMode('default');
    }, [setData]);

    return {
        signatureMode,
        handleSignatureModeChange,
        customSigPreview,
        rawSigFile,
        isExtractorOpen,
        setIsExtractorOpen,
        isCameraOpen,
        setIsCameraOpen,
        isExtracting,
        stampMode,
        handleStampModeChange,
        customStampPreview,
        isExtractingStamp,
        cameraTarget,
        setCameraTarget,
        handleProcessFileAutomatically,
        handleStampFileSelected,
        handleResetCustomStamp,
        handleCameraCapture,
        handleSaveCleanSignature,
        handleResetCustomSignature,
    };
}

export default useApplicationSignatures;
