import Vue from "vue";
import Vuex from 'vuex'

import { LOCAL_STORAGE } from "~/constants";
import { LocalStorage } from "~/utils";

import locale from './locale'
import page from './page'
import auth from './auth'
import account from './account'
import token from './token'
import category from './category'
import network from './network'
import trunk from './trunk'
import order from './order'
import migrate from './migrate'
export let STORE;

const createStore = () => {
  STORE = new Vuex.Store({
    state: {
      bannerData: null,
    },

    actions: {
      reset() {},
      async getConfig({ dispatch, commit }) {
        const response = await Vue.service.user.getConfig();
        const config = response.data.data;

        if (response.status === 200 && config) {
          const bannerData = config.bannerData
          commit('setBannerData', bannerData)

          if (config.isAuthenticated) {
            await dispatch("auth/initUser", {
              loginStrategy: LocalStorage.get(LOCAL_STORAGE.loginStrategy),
              authToken: LocalStorage.get(LOCAL_STORAGE.authToken),
              user: config,
            })
            // return true;
          } else {
            await dispatch("token/fetchERC20Tokens", config.isAuthenticated, { root: true });
          }
        }
        // return false;
      },
    },

    mutations: {
      setBannerData(state, value) {
        state.bannerData = value
      }
    },

    // modules
    modules: {
      locale,
      auth,
      account,
      category,
      token,
      network,
      trunk,
      page,
      order,
      migrate
    },
  });
  return STORE;
}


export default createStore
