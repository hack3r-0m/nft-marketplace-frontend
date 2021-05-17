import { initialState } from "./state"

export const mutation = {
    RESET() {
        this.state = initialState();
    },
    SET_AUTHENTICATION_TOKEN(state, value) {
        state.authToken = value;
    },
    SET_NETWORK_KEY(state, value) {
        state.networkKey = value;
    }
}