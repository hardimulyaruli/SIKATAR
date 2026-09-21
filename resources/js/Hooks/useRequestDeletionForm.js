import { useCallback } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Custom hook to manage state for requesting employee deletion with Headmaster authorization letter.
 * Single Responsibility: Form state, file attachment, and deletion request submission.
 */
export function useRequestDeletionForm(employee, onSuccessCallback) {
    const { data, setData, post, processing, errors, reset } = useForm({
        surat_perintah: null,
        reason: '',
    });

    const handleFileChange = useCallback((file) => {
        setData('surat_perintah', file);
    }, [setData]);

    const handleReasonChange = useCallback((value) => {
        setData('reason', value);
    }, [setData]);

    const submit = useCallback((e) => {
        e?.preventDefault();
        if (!employee) return;

        post(`/operator/employees/${employee.id}/request-deletion`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onSuccessCallback?.();
            },
        });
    }, [employee, post, reset, onSuccessCallback]);

    return {
        data,
        setData,
        errors,
        processing,
        handleFileChange,
        handleReasonChange,
        reset,
        submit,
    };
}

export default useRequestDeletionForm;
