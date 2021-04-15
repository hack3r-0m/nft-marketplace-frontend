export const mutation = {
    initialized(state, value) {
        state.initialized = value
    },

    user(state, user) {
        state.initialized = true
        state.user = user
        if (state.user) {
            state.userId = user.id
        } else {
            state.userId = null
            state.authToken = null
        }
    },

    userId(state, value) {
        state.userId = value
    },

    address(state, value) {
        state.address = value
    },

    setToken(state, value) {
        state.token = value
    },

}