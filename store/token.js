/* eslint no-param-reassign: 0 */
import TokenModel from '~/components/model/token'
import BigNumber from '~/plugins/bignumber';
import Vue from "vue";

const ZERO = new BigNumber(0)

export default {
  namespaced: true,

  state: () => {
    return {
      erc20Tokens: [],
      selectedERC20Token: null,
    }
  },

  mutations: {
    erc20Tokens(state, tokens) {
      state.erc20Tokens = tokens
    },
    selectedERC20Token(state, token) {
      state.selectedERC20Token = token
    },
  },

  getters: {
    erc20Tokens(state) {
      return state.erc20Tokens
    },
    selectedERC20Token(state) {
      if (!state.selectedERC20Token && state.erc20Tokens) {
        return state.erc20Tokens[0]
      }
      return state.selectedERC20Token
    },
    totalCurrencyBalance(state, getters, rootState, rootGetters) {
      const network = rootGetters['network/selectedNetwork']
      const tokens = state.erc20Tokens
      const tokensBalance = []
      tokens.reduce((a, t) => {
        const v = t.getBalance(network.chainId)
        tokensBalance.push(v)
        return a.plus(v)
      }, ZERO)
      return tokensBalance
    },
  },

  actions: {
    async fetchERC20Tokens({ commit }) {
      const response = await Vue.service.token.fetchERC20Tokens()
      if (response.status === 200 && response.data.data.erc20Tokens) {
        const erc20Tokens = response.data.data.erc20Tokens
        const tokens = []
        erc20Tokens.forEach((token) => tokens.push(new TokenModel(token)))
        commit('erc20Tokens', tokens)
      }
    },

    async fetchBalances({ rootState, state, dispatch }, payload = { refresh: false }) {
      const tokens = state.erc20Tokens
      const networks = rootState['network']['networks']

      for (let i = 0; i < tokens.length; i++) {
        await dispatch(
          'trunk/loadTokenBalance',
          {
            token: tokens[i],
            refresh: payload.refresh,
            network: networks.main,
          },
          { root: true },
        )
        await dispatch(
          'trunk/loadTokenBalance',
          {
            token: tokens[i],
            refresh: payload.refresh,
            network: networks.matic,
          },
          { root: true },
        )
      }
    },

    async reloadBalances({ dispatch }) {
      dispatch('trunk/resetBalances', {}, { root: true })
      await dispatch('fetchBalances')
    },

    async fetchEthereum({ commit }, payload) {
      const response = await Vue.service.token.fetchBalance(payload);

      if (response.status === 200 && response.data.count) {
        commit('account/totalMainNft', response.data.count, { root: true })
      }
    },
    async fetchNFTTokens({ commit }, payload) {
      const tokens = []
      const response = await Vue.service.token.fetchBalance(payload);

      if (response.status === 200 && response.data.data) {

        const balances = {}
        response.data.data.forEach((token, i) => {
          token.id = i + 1;
          token.chainId = this.chainId
          tokens.push(new NFTTokenModel(token))
          if (token.contract in balances) {
            balances[token.contract]++
          } else {
            balances[token.contract] = 1
          }
        })
        commit('account/totalMaticNft', response.data.count, { root: true })
        commit('category/addUsersMaticCount', balances, { root: true });
      }
      return tokens;
    },
  }
}
