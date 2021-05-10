import { action } from "./action";
import { mutation } from "./mutation";
import { state } from "./state";
import { getter } from "./getter";

export default {
    namespaced: true,
    actions: action,
    mutations: mutation,
    state: state,
    getters: getter
}
