import { AnnotationYaml, MAIN_EVENTS, MetadataWrapperYaml } from '@scanning_bee/ipc-interfaces';
import { ipcRenderer } from 'electron';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';

// Import main App component
import App from './App';
import Annotation from './models/annotation';
import { HistoryService } from './services/HistoryService';
import StorageService from './services/StorageService';
import { generateAnnotationsFromYaml, openFolder } from './slices/annotationSlice';
import { AppToaster } from './Toaster';

type RendererControllerState = {
    fullScreen: boolean;
};

export class RendererController extends React.Component {
    historyService: HistoryService = null;

    state: RendererControllerState = null;

    static getInstance(): RendererController {
        return (window as any).RendererController;
    }

    constructor() {
        super({});

        this.state = {
            fullScreen: false,
        };

        this.setPage = this.setPage.bind(this);
        this.handleParsedAnnotations = this.handleParsedAnnotations.bind(this);
        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
        this.renderAgain = this.renderAgain.bind(this);
        this.handleFullScreenChange = this.handleFullScreenChange.bind(this);

        // { folder: folderPath, annotations, images: imageUrls }
        ipcRenderer.on(MAIN_EVENTS.ANNOTATIONS_PARSED, this.handleParsedAnnotations);
        ipcRenderer.on(MAIN_EVENTS.SAVE_ANNOTATIONS_SUCCESS, (_event, _payload) => AppToaster.show({
            message: 'Annotations saved successfully!',
            intent: 'success',
            timeout: 3000,
        }));
        ipcRenderer.on(MAIN_EVENTS.SAVE_ANNOTATIONS_ERROR, (_event, _payload) => {
            console.log('Annotations could not be saved!', _payload);

            AppToaster.show({
                message: 'Annotations could not be saved!',
                intent: 'danger',
                timeout: 3000,
            });
        });
        ipcRenderer.on(MAIN_EVENTS.FULL_SCREEN, this.handleFullScreenChange);

        this.initialize();
    }

    private handleFullScreenChange(_event, payload: boolean) {
        this.state = {
            fullScreen: payload,
        };

        this.renderAgain();
    }

    private handleParsedAnnotations(_event, payload: {
        folder: string,
        annotations: AnnotationYaml[],
        images: string[],
        metadata: MetadataWrapperYaml,
    }) {
        const { dispatch } = (window as any).store;

        const annotations = generateAnnotationsFromYaml(payload.annotations);

        dispatch(openFolder({
            folder: payload.folder,
            annotations: annotations.map(annotation => Annotation.toPlainObject(annotation)),
            images: payload.images,
            metadata: payload.metadata,
        }));

        StorageService.saveProp('recentlyOpenedFolders', payload.folder, new Date().toISOString());
    }

    public goBack() : void {
        this.historyService.goBack();

        this.renderAgain();
    }

    public goForward() : void {
        this.historyService.goForward();

        this.renderAgain();
    }

    public setPage(page: PageType) : void {
        if (page === this.getCurrentPage()) {
            return;
        }

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
                    goForward = {() => this.goForward()}
                    getPreviousPage = {() => this.historyService.getPreviousPage()}
                    getNextPage = {() => this.historyService.getNextPage()}
                    fullScreen = {this.state.fullScreen}
                />
            </StrictMode>,
            document.getElementById('root'),
        );
    }

    initialize(): void {
        const startPage = 'login';

        this.historyService = new HistoryService();

        this.setPage(startPage);
    }

    componentWillUnmount() {
        ipcRenderer.removeListener(
            MAIN_EVENTS.FULL_SCREEN,
            this.handleFullScreenChange,
        );
    }
}
