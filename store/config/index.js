import { mutation } from "./mutation";
import { state } from "./state";
import { action } from "./action";

export default {
    namespaced: true,
    state: state,
    mutations: mutation,
    actions: action
}