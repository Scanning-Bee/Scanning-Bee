export const getFileName = (path: string) => {
    const pathArray = path.split('/');
    return pathArray[pathArray.length - 1];
};
