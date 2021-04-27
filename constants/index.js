export * from "./vuex_store";
export * from "./local_storage";
import Vue from 'vue'

export const LOGIN_STRATEGY = {
    metaMask: 'metamask',
    walletConnect: 'walletconnect',
    portis: 'portis',
};

export const ORDER_TYPES = {
    fixed: 'FIXED',
    negotiation: 'NEGOTIATION',
    auction: 'AUCTION',
};
export const IS_METAMASK_ENABLED = window.ethereum != null;

export const APP_BUS = new Vue();
