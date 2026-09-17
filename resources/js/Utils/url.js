export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
    const cleanPath = path.startsWith('/storage/') ? path.replace('/storage/', '') : (path.startsWith('storage/') ? path.replace('storage/', '') : path);
    return `/storage/${cleanPath}`;
};
