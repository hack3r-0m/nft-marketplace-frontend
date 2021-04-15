export let STORE = {};

export function saveStore(store) {
    Object.assign(STORE, store);
}