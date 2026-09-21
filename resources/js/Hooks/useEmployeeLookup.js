import { useCallback } from 'react';
import { sanitizeNip, findEmployeeByNip, lookupEmployeeApi } from '@/Utils/employeeLookup';

/**
 * Custom hook for NIP sanitization and auto-filling employee personal details.
 * Single Responsibility: Synchronizing NIP input with local and API database records.
 *
 * @param {Object} options
 * @param {Function} options.setData - Form state updater function from useForm
 */
export function useEmployeeLookup(setData) {
    const handleNipChange = useCallback(
        (rawVal) => {
            const cleanNip = sanitizeNip(rawVal);
            const localEmp = findEmployeeByNip(cleanNip);

            const buildUpdates = (emp) => ({
                nip: cleanNip,
                ...(emp?.nama || emp?.name ? { name: emp.nama || emp.name } : {}),
                ...(emp?.place_of_birth ? { place_of_birth: emp.place_of_birth } : {}),
                ...(emp?.date_of_birth ? { date_of_birth: emp.date_of_birth } : {}),
                ...(emp?.address ? { address: emp.address } : {}),
                ...(emp?.contact ? { contact: emp.contact } : {}),
                ...(emp?.status_pegawai ? { status_pegawai: emp.status_pegawai } : {}),
                ...(emp?.cpns_date ? { cpns_date: emp.cpns_date } : {}),
                ...(emp?.pns_date ? { pns_date: emp.pns_date } : {}),
            });

            setData((prev) => ({
                ...prev,
                ...buildUpdates(localEmp),
            }));

            if (cleanNip.length >= 8) {
                lookupEmployeeApi(cleanNip).then((apiEmp) => {
                    if (apiEmp) {
                        setData((prev) => ({
                            ...prev,
                            ...buildUpdates(apiEmp),
                        }));
                    }
                });
            }
        },
        [setData]
    );

    return { handleNipChange };
}

export default useEmployeeLookup;
