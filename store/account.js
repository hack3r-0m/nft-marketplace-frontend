import getAxios from '~/plugins/axios'
import app from '~/plugins/app'
import OrderModel from '~/components/model/order'
import Vue from "vue";
import NFTTokenModel from '~/components/model/nft-token'

export default {
  namespaced: true,

  state: () => {
    return {
      account: null,
      userOrders: null,
      favouriteOrders: null,
      totalMaticNft: 0,
      totalMainNft: 0,
      totalUnreadOrderActivity: 0,
      pendingWithdrawals: [],
    }
  },

  getters: {
    account(state) {
      return state.account
    },
    userOrders(state) {
      return state.userOrders
    },
    favouriteOrders(state) {
      return state.favouriteOrders
    },
    totalMaticNft(state) {
      return state.totalMaticNft
    },
    totalMainNft(state) {
      return state.totalMainNft
    },
    totalUnreadOrderActivity(state) {
      return state.totalUnreadOrderActivity
    },
    pendingWithdrawals(state) {
      return state.pendingWithdrawals
    },
  },

  mutations: {
    account(state, account) {
      state.account = account
    },
    userOrders(state, orders) {
      state.userOrders = orders
    },
    favouriteOrders(state, orders) {
      state.favouriteOrders = orders
    },
    totalMaticNft(state, num) {
      state.totalMaticNft = num
    },
    totalMainNft(state, num) {
      state.totalMainNft = num
    },
    totalUnreadOrderActivity(state, num) {
      state.totalUnreadOrderActivity = num
    },
    pendingWithdrawals(state, transactions) {
      state.pendingWithdrawals = transactions
    },
  },

  actions: {
    async fetchActiveOrders({ commit }) {
      try {
        const user = app.vuexStore.getters['auth/user']
        const response = await getAxios().get(`users/${user.id}/activeorders`)
        if (response.status === 200 && response.data.data.length > 0) {
          const orders = []
          response.data.data.forEach((order) =>
            orders.push(new OrderModel(order)),
          )
          commit('userOrders', orders)
        }
      } catch (error) { }
    },
    async fetchFavoritesOrders({ commit }) {
      try {
        const user = app.vuexStore.getters['auth/user']
        const response = await getAxios().get(`users/${user.id}/favourites`)
        if (response.status === 200 && response.data.data.length > 0) {
          const orders = []
          response.data.data.forEach(function (fav) {
            fav.orders.image = fav.image
            fav.orders.name = fav.name
            fav.orders.description = fav.description
            fav.order = new OrderModel(fav.orders)
            orders.push(fav)
          })
          commit('favouriteOrders', orders)
        }
      } catch (error) { }
    },
    async fetchPendingWithdrawals({ commit }) {
      try {
        const user = app.vuexStore.getters['auth/user']
        const response = await getAxios().get(
          `assetmigrate/?user_id=${user.id}&type=["WITHDRAW"]&status=[0,1]`,
        )
        if (response.status === 200 && response.data.data) {
          commit('pendingWithdrawals', response.data.data.assetMigrations)
        }
      } catch (error) { }
    },
    async fetchMainNFT({ commit }, payload) {
      const response = await Vue.service.token.fetchBalance(payload);
      const tokens = [];
      if (response.status === 200 && response.data.count) {
        commit('totalMainNft', response.data.count);

        response.data.data.forEach((token, i) => {
          token.id = i + 1;
          token.chainId = this.chainId
          tokens.push(new NFTTokenModel(token))
        })
        commit('category/addUsersMainCount', response.data.balances, { root: true })
      }
      return tokens;
    },
    async fetchNFTTokens({ commit }, payload) {
      const tokens = []
      const response = await Vue.service.token.fetchBalance(payload);

      if (response.status === 200 && response.data.data) {

        const balances = {}
        response.data.data.forEach((token, i) => {
          token.id = i + 1;
          token.chainId = payload.chainId
          tokens.push(new NFTTokenModel(token))
          if (token.contract in balances) {
            balances[token.contract]++
          } else {
            balances[token.contract] = 1
          }
        })
        commit('totalMaticNft', response.data.count)
        commit('category/addUsersMaticCount', balances, { root: true });
      }
      return tokens;
    },
    async addToFavourite(_, id) {
      const response = await Vue.service.user.addToFavourite(id);
      if (response.status === 200) {
        // this can be optimized by only pushing the order into favouriteorders array
        await dispatch('account/fetchFavoritesOrders')
      }
    },
    async removeFromFavourite(_, order) {
      const response = await Vue.service.user.removeFromFavourite(order.id);
      if (response.status === 200) {
        // this can be optimized by only removing the order into favouriteorders array
        await dispatch('account/fetchFavoritesOrders')
      }
    }
  },
}
