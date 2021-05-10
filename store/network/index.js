import { mutation } from "./mutation";
import { state } from "./state";
import { action } from "./action";
import { getter } from "./getter";

export default {
    namespaced: true,
    state: state,
    mutations: mutation,
    actions: action,
    getters: getter
}