/* eslint-disable no-underscore-dangle */
export class HistoryService {
    private history: any[];

    private index: number;

    constructor() {
        this.history = [];
        this.index = -1;
    }

    goBack() {
        if (this.index > 0) {
            this.index--;
        }
    }

    goForward() {
        if (this.index < this.history.length - 1) {
            this.index++;
        }
    }

    addPage(page: PageType) {
        this.index++;

        this.history[this.index] = page;

        // Remove all pages after this one
        this.history.splice(this.index + 1);
    }

    getCurrentPage() {
        return this.history[this.index];
    }

    getPreviousPage() {
        console.log(this.history, this.index);

        if (this.index > 0) {
            return this.history[this.index - 1];
        }
        return null;
    }

    getNthPreviousPage(n: number) {
        if (this.index - n >= 0) {
            return this.history[this.index - n];
        }
        return null;
    }

    getNextPage() {
        console.log(this.history, this.index);

        if (this.index < this.history.length - 1) {
            return this.history[this.index + 1];
        }
        return null;
    }

    clear() {
        this.history = [];
        this.index = -1;
    }
}
