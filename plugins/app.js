import Vue from 'vue'
import Web3 from 'web3'
import MetaNetwork from '@maticnetwork/meta/network'
import AccountModel from '~/components/model/account'
import {
  registerAccountChange,
  registerNetworkChange,
} from '~/plugins/helpers/metamask-utils'
import { getWalletProvider } from '~/plugins/helpers/providers'
let STORE;

const app = {
  vuexStore: null,
  web3: new Web3(),
  gasLimit: 3500000,
  maticDecimals: 18,
  bus: new Vue(),
  orderTypes: {
    FIXED: 'FIXED',
    NEGOTIATION: 'NEGOTIATION',
    AUCTION: 'AUCTION',
  },

  async init(store, sentry) {
    STORE = store;
    // store vuex store in this app
    this.vuexStore = store



    // set and Initialise networks
    this.initNetworks()

    // TODO: initialize Authentication
    await this.initAuthentication(store, sentry)

    // Initialize Categories
    this.initCategories(store)

    // Initialize tokens
    this.initTokens(store)
  },



  async initNetworks() {
    const metaNetwork = new MetaNetwork(
      Vue.appConfig.matic.deployment.network,
      Vue.appConfig.matic.deployment.version,
    )
    // store networks
    await STORE.dispatch('network/setNetworks', {
      metaNetwork, uiConfig: Vue.appConfig
    })
    // set network depending upon the login strategy
    if (STORE.getters["auth/isMetaMaskConnected"]) {
      const metamaskNetworkChangeHandler = async (chainId) => {
        if (!chainId) {
          chainId = window.ethereum.chainId
        }

        const main = metaNetwork.Main
        const matic = metaNetwork.Matic

        if (
          chainId &&
          chainId !== '0x' + main.ChainId.toString(16) &&
          chainId !== '0x' + matic.ChainId.toString(16)
        ) {
          STORE.dispatch('auth/logout')
          window.location.replace('/login')
        }

        await STORE.dispatch('network/setProviders', {
          main: getWalletProvider({
            networks: this.ethereumNetworks,
            primaryProvider: 'main',
          }),
          matic: getWalletProvider({
            networks: this.ethereumNetworks,
            primaryProvider: 'matic',
          }),
        })
      }

      registerNetworkChange(metamaskNetworkChangeHandler)
      await metamaskNetworkChangeHandler()

      registerAccountChange(async (selectedAddress) => {
        const user = STORE.getters['auth/user']

        if (!user || !user.address) {
          await STORE.dispatch('auth/logout')
        } else if (
          !selectedAddress ||
          !selectedAddress[0] ||
          user.address.toLowerCase() !== selectedAddress[0].toLowerCase()
        ) {
          await STORE.dispatch('auth/logout')
          window.location.replace('/login')
        }
      })
    } else {
      await STORE.dispatch('network/setProviders', {
        main: new Web3.providers.HttpProvider(this.ethereumNetworks.main.rpc),
        matic: new Web3.providers.HttpProvider(this.ethereumNetworks.matic.rpc),
      })
    }
  },

  async initAuthentication(store, sentry) {
    // Check auth token is there and is valid or not
    const isLoggedIn = await store.dispatch('auth/checkLogin');
    if (!isLoggedIn) return;

    // Initialize account
    await this.initAccount(store)
    sentry.setUser({ id: store.getters['auth/address'] })
  },

  async initAccount(store) {
    // store commit
    await store.commit(
      'account/account',
      new AccountModel({
        address: store.getters['auth/address'],
      }),
    )

    console.log('user', store.getters['auth/address'])
    Vue.logger.initTrack({ address: store.getters['auth/address'] })

    await store.dispatch('token/reloadBalances')

    // user profile data
    this.initUserProfile(store)
  },

  async initCategories(store) {
    await store.dispatch('category/fetchCategories')
  },

  async initTokens(store) {
    await store.dispatch('token/fetchERC20Tokens')

    const user = store.getters['auth/user']
    if (user) {
      // Load account balance
      await store.dispatch('token/reloadBalances')
    }
  },

  async initUserProfile(store) {
    const user = store.getters['auth/user']
    if (user) {
      store.dispatch('account/fetchActiveOrders')
      // store.dispatch('account/fetchFavoritesOrders')
    }
  },

  getSelectedNetwork() {
    return app.vuexStore.getters['network/selectedNetwork']
  },

  getMatic() {
    return app.vuexStore.getters['network/matic']
  },


  addToast(title, body, options = {}) {
    const toastId = Date.now()
    options.id = toastId
    options.details = body
    this.bus.$emit('toast:add', title, options)
    setInterval(this.removeToast(toastId), 5000)
  },

  removeToast(id) {
    this.bus.$emit('toast:remove', id)
  },

  refreshApp() {
    window.location.reload(true)
  },

  async logout() {
    // clear all store
    clearStore()

    // redirect to login
    location.replace('/login')
  },

  walletconnectModal: {
    open: (uri, onClose) => {
      app.bus.$once('walletconnect:session:abort', () => {
        onClose()
      })
      app.bus.$emit('walletconnect:session:new', uri)
    },
    close: () => {
      app.bus.$emit('walletconnect:session:close')
    },
  },

  get ethereumNetworks() {
    console.log("store", STORE);
    return STORE.state["network"].networks;
  }
}

// Export
export default app
