import { ipcRenderer } from 'electron';

// Function to request opening the dialog
export const openFolderDialog = () => {
    ipcRenderer.send('selectFolder');
};
