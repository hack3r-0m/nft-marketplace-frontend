export const getter = {
    selectedNetwork(state, getters) {
        return state.networks[
            getters.selectedNetworkKey
        ]
    },

    selectedNetworkKey(state) {
        return state.selectedNetworkKey || 'matic'
    },

    rootChainNetwork(state) {
        return state.networks[state.selectedNetworkKey || 'main']
    },
}
