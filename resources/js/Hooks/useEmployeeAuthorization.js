import { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Custom hook to manage edit authorization gate state for operators editing employee data.
 * Single Responsibility: Surat perintah upload state, authorization submission, and access status.
 */
export function useEmployeeAuthorization(employee, initialAuth = null) {
    const [isAuthorized, setIsAuthorized] = useState(!!initialAuth);

    const authForm = useForm({
        surat_perintah: null,
        notes: '',
    });

    const handleAuthSubmit = useCallback(
        (e) => {
            e?.preventDefault();
            authForm.post(`/operator/employees/${employee.id}/edit-authorization`, {
                forceFormData: true,
                onSuccess: () => {
                    setIsAuthorized(true);
                },
            });
        },
        [authForm, employee?.id]
    );

    return {
        isAuthorized,
        setIsAuthorized,
        authForm,
        handleAuthSubmit,
    };
}

export default useEmployeeAuthorization;
