import app from '~/plugins/app'
import logger from '~/plugins/logger'
import Vue from 'vue'
import '~/filters'
import "~/config";
import initService from "~/service";

export default async function ({ store, $sentry }) {
  initService();

  // Initialize app
  Vue.use(logger)
  console.log('app runing with env', process.env);
  
  await app.init(store, $sentry)
}
