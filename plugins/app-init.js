import app from '~/plugins/app'
import logger from '~/plugins/logger'
import toast from '~/plugins/toast'
import Vue from 'vue'
import '~/filters'
import "~/config";
import initService from "~/service";
import { APP_BUS } from '~/constants'

export default async function ({ store, $sentry }) {
  initService();

  // Initialize app
  Vue.use(logger)
  Vue.use(toast, APP_BUS)
  console.log('app runing with env', Vue.appConfig);

  await app.init(store, $sentry)

  window['vue']= Vue;
}
