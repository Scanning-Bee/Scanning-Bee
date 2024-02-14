/* eslint-disable no-underscore-dangle */
export class HistoryService {
    private history: any[];

    private index: number;

    constructor(startPage: PageType) {
        this.history = [startPage];
        this.index = 0;
    }

    goBack() {
        if (this.index > 0) {
            this.index--;
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
        if (this.index > 0) {
            this.index--;
            return this.history[this.index];
        }
        return null;
    }

    getNthPreviousPage(n: number) {
        if (this.index - n >= 0) {
            this.index -= n;
            return this.history[this.index];
        }
        return null;
    }

    getNextPage() {
        if (this.index < this.history.length - 1) {
            this.index++;
            return this.history[this.index];
        }
        return null;
    }

    clear() {
        this.history = [];
        this.index = -1;
    }
}
