import { LOGIN_STRATEGY } from "~/constants";

export const getter = {
    initialized(state) {
        return !!state.initialized
    },

    authenticated(state) {
        return !!state.user
    },

    user(state) {
        return state.user
    },

    userId(state) {
        return state.userId
    },

    address(state) {
        return state.address
    },

    emailVerified(state) {
        if (state.user && !state.user.isAnonymous) {
            return !!state.user.emailVerified
        }

        return true
    },

    anonymous(state) {
        return !!(state.user && state.user.isAnonymous)
    },

    isWCConnected(state) {
        return state.loginStrategy === LOGIN_STRATEGY.walletConnect;
    },

    isMetaMaskConnected() {
        return state.loginStrategy === LOGIN_STRATEGY.metaMask;
    },

    isPortisConnected() {
        return state.loginStrategy === LOGIN_STRATEGY.portis;
    },
}