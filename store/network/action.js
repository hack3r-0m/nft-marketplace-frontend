export const action = {
    async setNetworks({ commit }, { metaNetwork, uiConfig }) {
        // Store meta to use ABIs and artifacts
        commit('network/networkMeta', metaNetwork)

        let main = network.Main
        let matic = network.Matic

        if (!main || !matic) return;

          main = {
            key: 'main',
            id: main.ChainId,
            chainId: main.ChainId,
            networkId: main.ChainId,
            name: main.NetworkName,
            historyHost: main.Explorer,
            childNetworkId: matic.ChainId,
            rpc: uiConfig.mainRPC,
            isMatic: false,
            syncerUrl: main.SyncerAPI,
            watcherUrl: main.WatcherAPI,
            daggerEndpoint: main.DaggerEndpoint,
            contracts: {
                ...main.Contracts,
            },
        };
         matic = {
            key: 'matic',
            id: matic.ChainId,
            chainId: matic.ChainId,
            networkId: matic.ChainId,
            name: matic.NetworkName,
            parentNetworkId: main.ChainId,
            historyHost: matic.Explorer,
            rpc: uiConfig.maticRPC,
            publicRPC: matic.RPC,
            isMatic: true,
            default: true,
            syncerUrl: matic.SyncerAPI,
            watcherUrl: matic.WatcherAPI,
            daggerEndpoint: matic.daggerEndpoint,
            contracts: {
                ...matic.Contracts,
            },
        };

        commit('networks', {
            main,
            matic,
        })
    },
    // async setNetworks({ commit }, networks) {
    //     if (!networks.main || !networks.matic) {
    //         return
    //     }

    //     const main = new NetworkModel(networks.main)
    //     const matic = new NetworkModel(networks.matic)

    //     // commit networks
    //     commit('networks', {
    //         main,
    //         matic,
    //     })
    // },

    async setSelectedNetworkKey({ commit }, networkKey) {
        commit('selectedNetworkKey', networkKey)

        return Promise.all([
            // send action to other storage
            // dispatch("trunk/networkChanged", network, { root: true })
        ])
    },

    async setSelectedNetwork({ dispatch }, network) {
        return dispatch('setSelectedNetworkKey', network.key)
    },

    async setProviders({ state, dispatch, commit }, providers, selectedNetworkKey) {
        // set main web3
        commit("setMainProvider", providers.main)

        // set matic web3
        commit("setMaticProvider", providers.matic)

        // Extends web3 eth
        commit("extendMainEth", {
            methods: [
                {
                    name: 'signTypedDataLegacy',
                    call: 'eth_signTypedDataLegacy',
                    params: 2,
                },
            ],
        })

        commit("extendMaticEth", {
            methods: [
                {
                    name: 'signTypedDataLegacy',
                    call: 'eth_signTypedDataLegacy',
                    params: 2,
                },
            ],
        })

        // set selected network id into store
        if (selectedNetworkKey) {
            // set new selected network
            await dispatch('setSelectedNetworkKey', selectedNetworkKey)
        }
    },
}