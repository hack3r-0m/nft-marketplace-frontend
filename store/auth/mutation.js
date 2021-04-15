import { initialState } from "./state";
export const mutation = {
    initialized(state, value) {
        state.initialized = value
    },

    setUser(state, user) {
        state.initialized = true
        state.user = user
        if (state.user) {
            state.userId = user.id
        } else {
            state.userId = null
            state.authToken = null
        }
    },

    setUserId(state, value) {
        state.userId = value
    },

    setAddress(state, value) {
        state.address = value
    },

    setToken(state, value) {
        state.token = value
    },
    reset(state) {
        Object.assign(state, initialState())
    }
}