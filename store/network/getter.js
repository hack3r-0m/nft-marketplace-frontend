export const getter = {
    selectedNetwork(state) {
        return state.networks[
            state.selectedNetworkKey ||
            configStore.get('selectedNetworkKey') ||
            'matic'
        ]
    },

    selectedNetworkKey(state) {
        return (
            state.selectedNetworkKey ||
            configStore.get('selectedNetworkKey') ||
            'matic'
        )
    },

    rootChainNetwork(state) {
        return state.networks[
            state.selectedNetworkKey ||
            configStore.get('selectedNetworkKey') ||
            'main'
        ]
    },

    networks(state) {
        return state.networks
    },

    networkMeta(state) {
        return state.networkMeta
    },
}