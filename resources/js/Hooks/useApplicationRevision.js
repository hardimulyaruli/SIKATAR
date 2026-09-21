import { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Custom hook to manage Operator letter application details, revisions, and re-submission.
 * Single Responsibility: Revision form state and resubmission handler.
 */
export function useApplicationRevision(application) {
    const isRevision = application.status === 'revision_requested';
    const [isEditing, setIsEditing] = useState(isRevision);

    const { data, setData, put, processing, errors } = useForm({
        subject: application.subject || '',
        recipient: application.recipient || '',
        body_content: application.body_content || '',
        form_data: application.form_data_json || {},
    });

    const handleCustomParamChange = useCallback((key, val) => {
        setData((prev) => ({
            ...prev,
            form_data: {
                ...prev.form_data,
                [key]: val,
            },
        }));
    }, [setData]);

    const handleResubmit = useCallback((e) => {
        e?.preventDefault();
        put(`/operator/applications/${application.id}`);
    }, [put, application?.id]);

    return {
        isRevision,
        isEditing,
        setIsEditing,
        data,
        setData,
        errors,
        processing,
        handleCustomParamChange,
        handleResubmit,
    };
}

export default useApplicationRevision;
