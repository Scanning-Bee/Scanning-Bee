const sysPath = require('path');

const CHAR_BACKWARD_SLASH = 92;

if (process.platform === 'win32') {
    delete sysPath.relative;

    sysPath.relative = (from, to) => {
        if (from === to) { return ''; }

        let fromOrig = sysPath.resolve(from);
        let toOrig = sysPath.resolve(to);

        if (fromOrig === toOrig) { return ''; }

        from = fromOrig.toLowerCase();
        to = toOrig.toLowerCase();

        if (fromOrig.length !== from.length) {
            fromOrig = fromOrig.normalize('NFD');
            from = fromOrig.toLowerCase();
        }
        let toNormalized;
        if (toOrig.length !== to.length) {
            toNormalized = true;
            toOrig = toOrig.normalize('NFD');
            to = toOrig.toLowerCase();
        }

        if (from === to) { return ''; }

        // Trim any leading backslashes
        let fromStart = 0;
        while (fromStart < from.length
           && from.charCodeAt(fromStart) === CHAR_BACKWARD_SLASH) {
            fromStart++;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        let fromEnd = from.length;
        while (fromEnd - 1 > fromStart
           && from.charCodeAt(fromEnd - 1) === CHAR_BACKWARD_SLASH) {
            fromEnd--;
        }
        const fromLen = fromEnd - fromStart;

        // Trim any leading backslashes
        let toStart = 0;
        while (toStart < to.length
           && to.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
            toStart++;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        let toEnd = to.length;
        while (toEnd - 1 > toStart
           && to.charCodeAt(toEnd - 1) === CHAR_BACKWARD_SLASH) {
            toEnd--;
        }
        const toLen = toEnd - toStart;

        // Compare paths to find the longest common path from root
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i < length; i++) {
            const fromCode = from.charCodeAt(fromStart + i);
            if (fromCode !== to.charCodeAt(toStart + i)) { break; } else if (fromCode === CHAR_BACKWARD_SLASH) { lastCommonSep = i; }
        }

        // We found a mismatch before the first common path separator was seen, so
        // return the original `to`.
        if (i !== length) {
            if (lastCommonSep === -1) { return (toNormalized ? toOrig.normalize('NFC') : toOrig); }
        } else {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
                // We get here if `from` is the exact base path for `to`.
                // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
                    return (
                        toNormalized
                            ? toOrig.slice(toStart + i + 1).normalize('NFC')
                            : toOrig.slice(toStart + i + 1));
                }
                if (i === 2) {
                // We get here if `from` is the device root.
                // For example: from='C:\\'; to='C:\\foo'
                    return (
                        toNormalized
                            ? toOrig.slice(toStart + i).normalize('NFC')
                            : toOrig.slice(toStart + i));
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
                // We get here if `to` is the exact base path for `from`.
                // For example: from='C:\\foo\\bar'; to='C:\\foo'
                    lastCommonSep = i;
                } else if (i === 2) {
                // We get here if `to` is the device root.
                // For example: from='C:\\foo\\bar'; to='C:\\'
                    lastCommonSep = 3;
                }
            }
        }

        let out = '';
        if (lastCommonSep === -1) { lastCommonSep = 0; }
        // Generate the relative path based on the path difference between `to` and
        // `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
                out += out.length === 0 ? '..' : '\\..';
            }
        }

        toStart += lastCommonSep;

        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0) {
            const slice = (
                toNormalized
                    ? toOrig.slice(toStart, toEnd).normalize('NFC')
                    : toOrig.slice(toStart, toEnd));
            return `${out}${slice}`;
        }

        if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) { ++toStart; }
        return (
            toNormalized
                ? toOrig.slice(toStart, toEnd).normalize('NFC')
                : toOrig.slice(toStart, toEnd));
    };
}
