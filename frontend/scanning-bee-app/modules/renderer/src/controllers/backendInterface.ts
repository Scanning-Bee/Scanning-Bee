import { ipcRenderer } from 'electron';
import Annotation, { AnnotationYaml } from '@frontend/models/annotation';

// Function to request opening the dialog
export const openFolderDialog = () => {
    ipcRenderer.send('selectFolder');
};

export const saveAnnotations = (annotations: Annotation[], targetFolder: string) => {
    const annotationsYaml: AnnotationYaml[] = annotations.map(annotation => Annotation.toYaml(annotation));

    ipcRenderer.send('saveAnnotations', { targetFolder, annotations: annotationsYaml });
};
