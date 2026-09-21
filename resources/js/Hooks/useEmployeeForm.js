import { useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { useEmployeeLookup } from '@/Hooks/useEmployeeLookup';

/**
 * Custom hook to manage state for creating and editing employee data across Operator and Admin roles.
 * Single Responsibility: Employee form state, validation error handling, NIP auto-lookup, and submission.
 */
export function useEmployeeForm({
    employee = null,
    isEdit = false,
    role = 'operator', // 'operator' | 'admin'
    initialSchoolId = '',
} = {}) {
    const initialData = isEdit && employee ? {
        _method: 'put',
        ...(role === 'admin' ? { school_id: employee.school_id || initialSchoolId } : {}),
        nip: employee.nip || '',
        name: employee.name || '',
        place_of_birth: employee.place_of_birth || '',
        date_of_birth: employee.date_of_birth || '',
        address: employee.address || '',
        contact: employee.contact || '',
        status_pegawai: employee.status_pegawai || 'PNS',
        cpns_date: employee.cpns_date || '',
        pns_date: employee.pns_date || '',
        photo: null,
    } : {
        ...(role === 'admin' ? { school_id: initialSchoolId } : {}),
        nip: '',
        name: '',
        place_of_birth: '',
        date_of_birth: '',
        address: '',
        contact: '',
        status_pegawai: 'PNS',
        cpns_date: '',
        pns_date: '',
    };

    const { data, setData, post, processing, errors, reset } = useForm(initialData);

    const { handleNipChange } = useEmployeeLookup(setData);

    const handlePhotoChange = useCallback((file) => {
        setData('photo', file);
    }, [setData]);

    const submit = useCallback((e) => {
        e?.preventDefault();
        const endpoint = isEdit
            ? `/${role}/employees/${employee.id}`
            : `/${role}/employees`;

        post(endpoint, {
            forceFormData: isEdit,
        });
    }, [isEdit, employee, role, post]);

    return {
        data,
        setData,
        errors,
        processing,
        reset,
        handleNipChange,
        handlePhotoChange,
        submit,
    };
}

export default useEmployeeForm;
