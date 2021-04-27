import { initialState } from "./state";
export const mutation = {
    initialized(state, value) {
        state.initialized = value
    },

    setUser(state, user) {
        state.user = user
    },

    setToken(state, value) {
        state.token = value
    },
    setLoginStrategy(state, value) {
        state.loginStrategy = value
    },
    reset(state) {
        Object.assign(state, initialState())
    }
}
