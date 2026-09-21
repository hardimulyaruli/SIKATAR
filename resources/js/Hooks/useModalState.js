import { useState, useCallback } from 'react';

/**
 * Custom hook to manage modal open/close toggle state.
 * Single Responsibility: Modal visibility state management.
 */
export function useModalState(initialState = false) {
    const [isOpen, setIsOpen] = useState(initialState);

    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggleModal = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return {
        isOpen,
        setIsOpen,
        openModal,
        closeModal,
        toggleModal,
    };
}

export default useModalState;
