import Web3 from 'web3'

export const mutation = {
    setNetworks(state, networks) {
        state.networks = networks
    },
    selectedNetworkKey(state, selectedNetworkKey) {
        configStore.set('selectedNetworkKey', selectedNetworkKey)
        state.selectedNetworkKey = selectedNetworkKey
    },
    setNetworkMeta(state, networkMeta) {
        state.networkMeta = networkMeta
    },
    setMainProvider(state, provider) {
        state.networks.main.web3 = new Web3(provider);
        state.networks.main.provider = provider;
    },
    setMaticProvider(state, provider) {
        state.networks.matic.web3 = new Web3(provider);
        state.networks.matic.provider = provider;
    },
    extendMainEth(state, value) {
        state.networks.main.web3.eth.extend(value);
    },
    extendMaticEth(state, value) {
        state.networks.matic.web3.eth.extend(value);
    },

}