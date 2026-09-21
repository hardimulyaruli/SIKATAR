import { useState, useCallback } from 'react';

/**
 * Custom hook to manage state for deletion request modals (Approve & Reject).
 * Single Responsibility: Modal visibility and active target request selection.
 */
export function useDeletionModals() {
    const [approveModalReq, setApproveModalReq] = useState(null);
    const [rejectModalReq, setRejectModalReq] = useState(null);

    const openApproveModal = useCallback((req) => {
        setApproveModalReq(req);
    }, []);

    const closeApproveModal = useCallback(() => {
        setApproveModalReq(null);
    }, []);

    const openRejectModal = useCallback((req) => {
        setRejectModalReq(req);
    }, []);

    const closeRejectModal = useCallback(() => {
        setRejectModalReq(null);
    }, []);

    return {
        approveModalReq,
        rejectModalReq,
        openApproveModal,
        closeApproveModal,
        openRejectModal,
        closeRejectModal,
    };
}

export default useDeletionModals;
