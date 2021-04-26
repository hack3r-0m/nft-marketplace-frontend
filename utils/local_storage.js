export class LocalStorage {
    static set(key, val) {
        localStorage.setItem(key, val);
    }
    static get(key) {
        return localStorage.getItem(key);
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    static isExist(key) {
        return LocalStorage.get(key) != null;
    }
}
