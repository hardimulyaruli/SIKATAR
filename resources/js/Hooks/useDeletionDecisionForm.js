import { useCallback } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Custom hook to manage Admin deletion request decision form (approval or rejection).
 * Single Responsibility: Form state, admin notes, and review decision PATCH submission.
 */
export function useDeletionDecisionForm({ request, action = 'approve', onSuccessCallback }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        admin_notes: '',
    });

    const submit = useCallback((e) => {
        e?.preventDefault();
        if (!request) return;

        patch(`/admin/deletion-requests/${request.id}/${action}`, {
            onSuccess: () => {
                reset();
                onSuccessCallback?.();
            },
        });
    }, [request, action, patch, reset, onSuccessCallback]);

    return {
        data,
        setData,
        processing,
        errors,
        reset,
        submit,
    };
}

export default useDeletionDecisionForm;
