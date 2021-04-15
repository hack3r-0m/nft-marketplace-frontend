import Vuex from 'vuex'

import locale from './locale'
import page from './page'
import auth from './auth'
import account from './account'
import token from './token'
import category from './category'
import network from './network'
import trunk from './trunk'
import { saveStore } from '~/constants';
export let STORE;

const createStore = () => {
  STORE = new Vuex.Store({
    actions: {
      reset() {

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
    },
  });
  return STORE;
}


export default createStore
