import React from 'react';
import { render } from 'react-dom';

// Import main App component
import App from './App';

export type PageType = 'start' | 'other';

export class RendererController {
    page: PageType = 'start';

    static getInstance(): RendererController {
        return (window as any).RendererController;
    }

    constructor() {
        this.initialize();
    }

    public setPage(page: PageType) : void {
        this.page = page;

        this.renderAgain();
    }

    renderAgain() {
        render(
            <App
                page = {this.page}
                setPage = {this.setPage}
            />,
            document.getElementById('root'),
        );
    }

    initialize(): void {
        this.setPage(this.page);
    }
}
