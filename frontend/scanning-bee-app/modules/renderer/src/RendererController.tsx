import { ipcRenderer } from 'electron';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';

// Import main App component
import App from './App';
import Annotation, { AnnotationYaml } from './models/annotation';
import { HistoryService } from './services/HistoryService';
import { generateAnnotationsFromYaml, openFolder } from './slices/annotationSlice';
import { AppToaster } from './Toaster';

export class RendererController {
    historyService: HistoryService = null;

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

    public goBack() : void {
        this.historyService.goBack();

        this.renderAgain();
    }

    public setPage(page: PageType) : void {
        this.historyService.addPage(page);

        this.renderAgain();
    }

    public getCurrentPage(): PageType {
        const currentPage = this.historyService.getCurrentPage();

        return currentPage;
    }

    renderAgain() {
        render(
            <StrictMode>
                <App
                    page={this.getCurrentPage()}
                    setPage = {p => this.setPage(p)}
                    goBack = {() => this.goBack()}
                />
            </StrictMode>,
            document.getElementById('root'),
        );
    }

    initialize(): void {
        const startPage = 'home';

        this.historyService = new HistoryService(startPage);

        this.setPage(startPage);
    }
}
