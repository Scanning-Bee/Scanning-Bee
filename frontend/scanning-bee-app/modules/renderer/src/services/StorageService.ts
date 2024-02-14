// LocalStorage helper functions.

import Store from 'electron-store';

class StorageService {
    store: Store<Record<string, any>>;

    constructor() {
        this.store = new Store();
    }

    /**
     * returns the storage object for the given storageId
     * @param storageId {string}
     * @returns {any}
     */
    getStorage = (storageId: string) => this.store.get(storageId);

    /**
     * returns the value of the given prop from the storage object for the given storageId.
     * equivalent to ElectronStoreUtil.getItem(storageId)[prop]
     * @param storageId {string}
     * @param prop {string}
     * @returns {any}
     */
    getProp = (storageId: string, prop: string) => this.getStorage(storageId)[prop];

    /**
     * sets the storage object for the given storageId.
     * @param storageId {string}
     * @param data {any}
     */
    saveStorage(storageId: string, data: any) {
        this.store.set(storageId, data);
    }

    /**
     * sets the value of the given prop in the storage object for the given storageId.
     * @param storageId  {string}
     * @param prop  {string}
     * @param value  {any}
     */
    saveProp(storageId: string, prop: string, value: any) {
        const data = this.getStorage(storageId);

        data[prop] = value;

        this.store.set(storageId, data);
    }

    /**
     * deletes all data in the storage.
     */
    clearStorage() {
        this.store.clear();
    }

    /**
     * returns the total size of the storage.
     */
    getStorageSize() {
        let size = 0;

        for (const key in this.store.store) {
            if (this.store.store[key]) {
                size += JSON.stringify(this.store.store[key]).length;
            }
        }

        return size;
    }
}

export default new StorageService();
