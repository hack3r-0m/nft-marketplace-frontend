/* eslint no-param-reassign: 0 */
import Vue from 'vue'
import BigNumber from '~/plugins/bignumber'
import {
  getBalance as getAccountBalancePromise,
  getContractCode,
  parseBalance, parseUSDBalance
} from '~/helpers'

// Zero balance
const ZeroBalance = new BigNumber(0)

export default {
  namespaced: true,

  state: () => {
    return {
      tokenBalance: {},
      contractObject: {},
      contractCode: {},
    }
  },

  mutations: {
    resetCache(state, { which, value = {} }) {
      state[which] = value
    },

    removeCache(state, { which, id }) {
      Vue.delete(state[which], id)
    },

    setCache(state, { which, id, value }) {
      Vue.set(state[which], id, value)
    },
  },

  getters: {

    tokenBalance(state, getters, rootState, rootGetters) {
      return (token, networkId) => {
        networkId = networkId || rootGetters["network/selectedNetwork"].id
        const address = token.chainAddress[networkId]
        if (!address) {
          return ZeroBalance
        }
        const balance = state.tokenBalance[`${networkId}:${address.toLowerCase()}`];
        if (balance) {
          debugger;
          return parseBalance(balance, token.decimal)
        }
        return balance;
      }
    },

    contractCode(state, getters, rootState, rootGetters) {
      return (address, networkId) => {
        return state.contractCode[`${networkId}:${address.toLowerCase()}`]
      }
    },

    contractObject(state, getters, rootState, rootGetters) {
      return (address, networkId) => {
        return state.contractObject[`${networkId}:${address.toLowerCase()}`]
      }
    },
  },

  actions: {
    async networkChanged({ commit }) {
      commit('resetCache', { which: 'accountBalance' })
      commit('resetCache', { which: 'tokenBalance' })
      commit('resetCache', { which: 'contractObject' })
      commit('resetCache', { which: 'contractCode' })
    },

    async loadTokenBalance(
      { dispatch, commit, rootGetters, getters },
      { address, token, refresh = false, network },
    ) {
      if (!network) {
        return
      }

      if (refresh) {
        // remove balance
        commit('resetCache', { which: 'tokenBalance' })
        commit('resetCache', { which: 'contractObject' })
      }
      let result = getters["tokenBalance"](token, network.id)

      if (result) {
        return result
      }
      result = ZeroBalance
      const accountAddress =
        address || rootGetters['account/account'].address
      const networkId = network.id;
      // Fetch balance
      let r = null
      // if (token.isEther && !network.isMatic || token.isMatic && network.isMatic) {
      address = address || rootGetters["token/address"](token, networkId);
      if (token.isEther && !network.isMatic) {
        r = await getAccountBalancePromise(network, accountAddress)
      } else {
        const c = await dispatch("fetchERC20ContractObject", {
          address, network
        })
        r = await c.methods.balanceOf(accountAddress).call()
      }

      result = new BigNumber(r)
      const cacheId = `${networkId}:${address.toLowerCase()}`;
      commit('setCache', {
        which: 'tokenBalance',
        id: cacheId,
        value: result,
      })

      return result
    },

    async fetchERC20ContractObject(
      { state, commit, rootGetters, rootState },
      { address, network },
    ) {
      const cacheId = `${network.id}:${address.toLowerCase()}`
      let result = state.contractObject[cacheId]
      if (result) {
        return result
      }

      const networkMeta = rootState.network.networkMeta;
      const web3 = network.web3
      result = new web3.eth.Contract(
        networkMeta.abi('ChildERC20'),
        address.toLowerCase(),
      )
      commit('setCache', {
        which: 'contractObject',
        id: cacheId,
        value: result,
      })
      return result
    },

    async resetBalances({ commit }) {
      commit('resetCache', { which: 'accountBalance' })
      commit('resetCache', { which: 'tokenBalance' })
      commit('resetCache', { which: 'contractObject' })
    },

    async fetchContractCode(
      { state, commit, rootGetters },
      { address, network },
    ) {
      const cacheId = `${address.toLowerCase()}`
      let result = state.contractCode[cacheId]
      if (result) {
        return result
      }

      result = await getContractCode(network, address)
      commit('setCache', {
        which: 'contractCode',
        id: cacheId,
        value: result,
      })
      return result
    },
  },
}
