import { ipcRenderer } from 'electron';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';

// Import main App component
import App from './App';
import Annotation, { AnnotationYaml } from './models/annotation';
import { generateAnnotationsFromYaml, openFolder } from './slices/annotationSlice';
import { AppToaster } from './Toaster';

export type PageType = 'home' | 'manual-annotator' | 'beehive' | 'settings';

export class RendererController {
    page: PageType = 'home';

    static getInstance(): RendererController {
        return (window as any).RendererController;
    }

    constructor() {
        this.setPage = this.setPage.bind(this);
        this.handleParsedAnnotations = this.handleParsedAnnotations.bind(this);

        // { folder: folderPath, annotations, images: imageUrls }
        ipcRenderer.on('annotationsParsed', this.handleParsedAnnotations);
        ipcRenderer.on('saveAnnotationsSuccess', (_event, _payload) => AppToaster.show({
            message: 'Annotations saved successfully!',
            intent: 'success',
            timeout: 3000,
        }));
        ipcRenderer.on('saveAnnotationsError', (_event, _payload) => AppToaster.show({
            message: 'Annotations could not be saved!',
            intent: 'danger',
            timeout: 3000,
        }));

        this.initialize();
    }

    private handleParsedAnnotations(_event, payload: { folder: string, annotations: AnnotationYaml[], images: string[] }) {
        const { dispatch } = (window as any).store;

        const annotations = generateAnnotationsFromYaml(payload.annotations);

        dispatch(openFolder({
            folder: payload.folder,
            annotations: annotations.map(annotation => Annotation.toPlainObject(annotation)),
            images: payload.images,
        }));
    }

    public setPage(page: PageType) : void {
        this.page = page;

        this.renderAgain();
    }

    renderAgain() {
        render(
            <StrictMode>
                <App
                    page = {this.page}
                    setPage = {this.setPage}
                />
            </StrictMode>,
            document.getElementById('root'),
        );
    }

    initialize(): void {
        this.setPage(this.page);
    }
}
