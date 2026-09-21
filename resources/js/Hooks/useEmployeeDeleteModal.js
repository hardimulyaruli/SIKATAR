import { useState, useCallback } from 'react';

/**
 * Custom hook to manage target employee selection and modal state for deletion requests.
 * Single Responsibility: Selection and modal visibility of employee deletion target.
 */
export function useEmployeeDeleteModal() {
    const [targetEmployee, setTargetEmployee] = useState(null);

    const openDeleteModal = useCallback((employee) => {
        setTargetEmployee(employee);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setTargetEmployee(null);
    }, []);

    return {
        targetEmployee,
        openDeleteModal,
        closeDeleteModal,
    };
}

export default useEmployeeDeleteModal;
