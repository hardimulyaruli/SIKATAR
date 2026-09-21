import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { sanitizeNip, findEmployeeByNip, lookupEmployeeApi } from '@/Utils/employeeLookup';

const INITIAL_FORM_STATE = {
    npsn: '',
    name: '',
    jenjang: 'SD',
    status_akreditasi: 'A',
    address: '',
    phone: '',
    email: '',
    headmaster_name: '',
    headmaster_nip: '',
    operator_name: '',
    operator_email: '',
    password: '',
};

/**
 * Custom hook to manage state for registering a new school and creating its default operator account.
 * Single Responsibility: Form state, field changes, NIP sanitization & auto-lookup, and creation submission.
 */
export function useCreateSchoolForm(onSuccessCallback) {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleFieldChange = useCallback((field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const handleNipChange = useCallback((e) => {
        const cleanNip = sanitizeNip(e.target.value);
        const emp = findEmployeeByNip(cleanNip);

        setFormData((prev) => {
            const next = {
                ...prev,
                headmaster_nip: cleanNip,
                ...(emp && emp.nama ? { headmaster_name: emp.nama } : {}),
            };

            if (cleanNip.length >= 8) {
                lookupEmployeeApi(cleanNip).then((apiEmp) => {
                    if (apiEmp) {
                        setFormData((current) => ({
                            ...current,
                            headmaster_name: apiEmp.nama || apiEmp.name || current.headmaster_name,
                        }));
                    }
                });
            }

            return next;
        });
    }, []);

    const reset = useCallback(() => {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setProcessing(false);
    }, []);

    const submit = useCallback((e) => {
        e?.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/admin/schools', formData, {
            onSuccess: () => {
                setProcessing(false);
                setFormData(INITIAL_FORM_STATE);
                onSuccessCallback?.();
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
        });
    }, [formData, onSuccessCallback]);

    return {
        formData,
        setFormData,
        handleFieldChange,
        handleNipChange,
        processing,
        errors,
        reset,
        submit,
    };
}

export default useCreateSchoolForm;
