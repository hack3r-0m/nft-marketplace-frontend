/* eslint no-param-reassign: 0 */

import Vue from "vue";


const defaultCategory = {
  name: 'All Categories',
  img_url: require('~/static/img/category.svg'),
  isAll: true,
  count: 0,
}

export default {
  namespaced: true,

  state: () => {
    return {
      categories: [],
      allCategory: defaultCategory,
    }
  },
  mutations: {
    categories(state, categories) {
      state.categories = categories
    },
    addUsersMaticCount(state, categories) {
      for (let i = 0; i < state.categories.length; i++) {
        state.categories[i].maticCount =
          categories[state.categories[i].maticAddress.toLowerCase()]
      }
    },
    addUsersMainCount(state, categories) {
      for (let i = 0; i < state.categories.length; i++) {
        state.categories[i].mainCount =
          categories[state.categories[i].mainAddress]
      }
    },
  },

  getters: {
    categories(state) {
      return state.categories
    },
    allCategory(state) {
      const category = state.allCategory
      category.count =
        state.categories.reduce(
          (total, item) => total + (parseInt(item.count) || 0),
          0,
        ) || '0'
      category.maticCount =
        state.categories.reduce(
          (total, item) => total + (parseInt(item.maticCount) || 0),
          0,
        ) || '0'

      category.mainCount =
        state.categories.reduce(
          (total, item) => total + (parseInt(item.mainCount) || 0),
          0,
        ) || '0'

      return category
    },
    categoryByToken(state) {
      return (token) => {
        const category = state.categories.find((c) => {
          const address = c.chainAddress[token.chainId];
          return address ? address.toLowerCase() === token.contract.toLowerCase() : false;
        })
        return category;
      }
    }
  },
  actions: {
    async fetchCategories({ commit, rootState }) {
      const response = await Vue.service.category.getCategories();
      const categoriesFromResponse = response.data.data.categories;
      if (response.status === 200 && categoriesFromResponse) {
        const networks = rootState["network"].networks
        const maticChainId = networks.matic.chainId;
        const categories = categoriesFromResponse.map((item) => {
          item.img_url = `${Vue.appConfig.apis.FILE_HOST}${item.img_url}`;
          const chainAddress = {};
          item.categoriesaddresses.forEach(q => {
            chainAddress[q.chain_id] = q.address;
          })
          item.chainAddress = chainAddress;
          const addressInfo = chainAddress[maticChainId];
          if (addressInfo) {
            item.maticAddress = addressInfo
          }
          return item;
        })

        commit('categories', categories)
      }
    },
  },
}
