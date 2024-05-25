// LocalStorage helper functions.

import Store from 'electron-store';

class StorageService {
    store: Store<Record<string, any>>;

    access_token_key = 'access_token';

    refresh_token_key = 'refresh_token';

    username_key = 'username';

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
        const data = this.getStorage(storageId) || {};

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

    getAccessToken() {
        return this.store.get(this.access_token_key);
    }

    setAccessToken(accessToken: string) {
        this.store.set(this.access_token_key, accessToken);
    }

    getRefreshToken() {
        return this.store.get(this.refresh_token_key);
    }

    setRefreshToken(refreshToken: string) {
        this.store.set(this.refresh_token_key, refreshToken);
    }

    getUsername() {
        return this.store.get(this.username_key);
    }

    setUsername(username: string) {
        this.store.set(this.username_key, username);
    }

    clearTokens() {
        this.store.delete(this.access_token_key);
        this.store.delete(this.refresh_token_key);
    }
}

export default new StorageService();
