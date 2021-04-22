import OrderModel from '~/components/model/order'
import Vue from "vue";

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
    async fetchActiveOrders({ rootState, commit }) {
      const user = rootState.auth.user;
      const response = await Vue.service.user.fetchActiveOrders(user.id);
      if (response.status === 200 && response.data.data.length > 0) {
        const orders = []
        response.data.data.forEach((order) =>
          orders.push(new OrderModel(order)),
        )
        commit('userOrders', orders)
      }
    },
    async fetchFavoritesOrders({ rootState, commit }) {
      const user = rootState.auth.user;
      const response = await Vue.service.user.fetchFavouriteOrders(user.id);
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
    },
    async fetchPendingWithdrawals({ rootState, commit }) {
      const user = rootState.auth.user;
      const response = await Vue.service.user.fetchPendingWithdrawals(user.id);
      if (response.status === 200 && response.data.data) {
        commit('pendingWithdrawals', response.data.data.assetMigrations)
      }
    },
    async fetchUserNFT(_, payload) {
      const response = await Vue.service.token.fetchBalance(payload);
      if (response.status === 200) {
        return response.data;
      }
    },
    async fetchMainNFT({ commit, dispatch }, payload) {
      const response = await dispatch('fetchUserNFT', payload);
      const tokens = [];
      if (response.count) {
        commit('totalMainNft', response.data.count);

        response.data.forEach((token, i) => {
          token.id = i + 1;
          token.chainId = payload.chainId
          tokens.push(token)
        })
        commit('category/addUsersMainCount', response.balances, { root: true })
      }
      return tokens;
    },
    async fetchMaticNFT({ commit, dispatch }, payload) {
      const tokens = []
      const response = await dispatch('fetchUserNFT', payload);

      if (response.data) {
        const balances = {}
        response.data.forEach((token, i) => {
          token.id = i + 1;
          token.chainId = payload.chainId
          tokens.push(token)
          if (token.contract in balances) {
            balances[token.contract]++
          } else {
            balances[token.contract] = 1
          }
        })
        commit('totalMaticNft', response.count)
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
    },
    async fetchNotification({ commit }, payload) {
      const response = await Vue.service.user.fetchNotification(payload);
      if (response.status === 200) {
        const data = response.data.data;
        commit(
          'totalUnreadOrderActivity',
          response.data.data.unread_count,
        )
        return data;
      }
    },
    async markNotificationAsRead(_, userId) {
      const response = await Vue.service.user.markNotificationAsRead(userId);
      if (response.status === 200) {
        return true;
      }
      return false;
    }
  },
}
