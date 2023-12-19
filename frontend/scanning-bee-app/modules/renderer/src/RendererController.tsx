import React, { StrictMode } from 'react';
import { render } from 'react-dom';

// Import main App component
import App from './App';

export type PageType = 'home' | 'manual-annotator' | 'beehive' | 'settings';

export class RendererController {
    page: PageType = 'home';

    static getInstance(): RendererController {
        return (window as any).RendererController;
    }

    constructor() {
        this.setPage = this.setPage.bind(this);

        this.initialize();
    }

    public setPage(page: PageType) : void {
        this.page = page;

        console.log('Page set to: ', page);

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
