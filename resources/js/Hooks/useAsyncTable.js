import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchTableData } from '@/Utils/promiseFetch';

/**
 * Custom hook for asynchronous table state management (data, filtering, search, pagination, loading).
 * Eliminates full page reloads by fetching JSON payloads via Promise/axios.
 *
 * @param {Object} options
 * @param {string} options.url - The endpoint URL to fetch data from
 * @param {Object} options.initialData - Initial paginated data from Inertia props
 * @param {string} options.dataKey - Key of data in JSON response (e.g. 'schools', 'employees', 'applications', 'requests')
 * @param {Object} [options.initialFilters={}] - Initial filter values
 * @param {number} [options.debounceMs=0] - Debounce delay in ms for filter changes (0 = immediate)
 */
export function useAsyncTable({
    url,
    initialData,
    dataKey,
    initialFilters = {},
    debounceMs = 0,
}) {
    const [data, setData] = useState(initialData);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimerRef = useRef(null);

    // Sync state when initialData prop changes from outside (e.g. Inertia mutations)
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Fetch data with given filter values
    const fetchData = useCallback(
        async (customFilters, targetUrl = url) => {
            const paramsToUse = customFilters !== undefined ? customFilters : filters;

            // Strip empty values
            const cleanParams = {};
            Object.entries(paramsToUse).forEach(([k, v]) => {
                if (v !== '' && v !== null && v !== undefined) {
                    cleanParams[k] = v;
                }
            });

            const res = await fetchTableData(targetUrl, cleanParams, {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            });

            if (res && res[dataKey]) {
                setData(res[dataKey]);
            }
            return res;
        },
        [url, dataKey, filters]
    );

    // Update a filter key and fetch data
    const updateFilter = useCallback(
        (keyOrObject, value, immediate = false) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            setFilters((prev) => {
                const nextFilters =
                    typeof keyOrObject === 'object' && keyOrObject !== null
                        ? { ...prev, ...keyOrObject }
                        : { ...prev, [keyOrObject]: value };

                if (immediate || debounceMs <= 0) {
                    fetchData(nextFilters);
                } else {
                    debounceTimerRef.current = setTimeout(() => {
                        fetchData(nextFilters);
                    }, debounceMs);
                }

                return nextFilters;
            });
        },
        [debounceMs, fetchData]
    );

    // Handle pagination page click (in-place async fetch)
    const handlePageClick = useCallback(
        async (pageUrl) => {
            if (!pageUrl) return;
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            const urlObj = new URL(pageUrl, window.location.origin);
            const params = Object.fromEntries(urlObj.searchParams.entries());

            const res = await fetchTableData(urlObj.pathname, params, {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            });

            if (res && res[dataKey]) {
                setData(res[dataKey]);
            }
        },
        [dataKey]
    );

    // Convenience handler for search filters
    const handleSearch = useCallback(
        (val) => {
            updateFilter('search', val, true);
        },
        [updateFilter]
    );

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return {
        data,
        setData,
        filters,
        setFilters,
        updateFilter,
        handleSearch,
        handlePageClick,
        fetchData,
        isLoading,
        setIsLoading,
    };
}

export default useAsyncTable;
