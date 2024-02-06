export const getFileName = (path: string) => {
    // the path may contain backslashes on Windows, so we need to replace them with forward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    const pathArray = normalizedPath.split('/');
    return pathArray[pathArray.length - 1];
};
