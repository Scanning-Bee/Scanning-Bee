export const isRunningDevMode = () => process.defaultApp
|| /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath);
