export const getFileName = (path: string) => {
    // the path may contain backslashes on Windows, so we need to replace them with forward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    const pathArray = normalizedPath.split('/');
    return pathArray[pathArray.length - 1];
};

export const getParentFolder = (path: string) => {
    // the path may contain backslashes on Windows, so we need to replace them with forward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    const pathArray = normalizedPath.split('/');
    return pathArray.slice(0, pathArray.length - 1).join('/');
};

export const shortenFileName = (fileName: string, maxLength: number) => {
    if (fileName.length <= maxLength) {
        return fileName;
    }

    return `${fileName.slice(0, maxLength - 3)}...`;
};

export const shortenFolderPath = (path: string, maxLength: number) => {
    if (path.length <= maxLength) {
        return path;
    }

    // Split the path into parts
    const parts = path.split('/');

    // Check if the path uses Windows-style backslashes
    const isWindowsPath = path.includes('\\');
    if (isWindowsPath) {
        path = path.replace(/\\/g, '/');
    }

    // Attempt to shorten the path by removing middle parts
    const start = 1; // start after the first element to keep the drive letter on Windows or root on Unix
    while (parts.length > start + 1 && path.length > maxLength) {
        parts.splice(start, 1); // Remove one part at a time
        path = parts.join('/');
        // Reinsert the ellipsis at the start if needed
        if (!path.startsWith('C:/...') && !path.startsWith('/...')) {
            path = `${parts[0]}/...${path.substring(parts[0].length)}`;
        }
    }

    // Convert path back to Windows format if necessary
    if (isWindowsPath) {
        path = path.replace(/\//g, '\\');
    }

    return path.length > maxLength ? parts[parts.length - 1] : path;
};
