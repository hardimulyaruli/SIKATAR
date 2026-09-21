import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';

/**
 * Custom hook to manage Admin application verification, decision modal, and status updates.
 * Single Responsibility: Admin review decisions and status transitions.
 */
export function useApplicationDecision(application) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalInitialStatus, setModalInitialStatus] = useState('approved');

    const openActionModal = useCallback((targetStatus) => {
        setModalInitialStatus(targetStatus);
        setModalOpen(true);
    }, []);

    const closeActionModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    const handleUpdateStatus = useCallback((data) => {
        router.patch(`/admin/applications/${application.id}/status`, data, {
            onSuccess: () => setModalOpen(false),
        });
    }, [application?.id]);

    return {
        modalOpen,
        modalInitialStatus,
        openActionModal,
        closeActionModal,
        handleUpdateStatus,
    };
}

export default useApplicationDecision;
