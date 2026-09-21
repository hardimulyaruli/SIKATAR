import axios from 'axios';

/**
 * Perform pure asynchronous table data fetching via Promise without reloading the Inertia page.
 * Returns only the JSON data, updates the browser URL silently, and invokes loading callbacks.
 *
 * @param {string} url - Target endpoint URL
 * @param {object} params - Query params or form data
 * @param {object} options - Options: { onStart: () => void, onFinish: () => void }
 * @returns {Promise<any>}
 */
export async function fetchTableData(url, params = {}, { onStart, onFinish } = {}) {
    if (typeof onStart === 'function') {
        onStart();
    }

    try {
        const response = await axios.get(url, {
            params,
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        // Update URL bar silently without reloading the page
        try {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined && val !== null && val !== '') {
                    searchParams.set(key, val);
                }
            });
            const queryString = searchParams.toString();
            const basePath = url.split('?')[0];
            const newUrl = queryString ? `${basePath}?${queryString}` : basePath;
            window.history.replaceState(null, '', newUrl);
        } catch (e) {
            // Ignore history state errors in test environments
        }

        return response.data;
    } catch (error) {
        console.error('Table fetch error:', error);
        throw error;
    } finally {
        if (typeof onFinish === 'function') {
            onFinish();
        }
    }
}
