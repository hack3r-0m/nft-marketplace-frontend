import Vue from 'vue'
import mixpanel from 'mixpanel-browser'

export default {
  install() {
    if (process.env.NODE_ENV === "production") {
      mixpanel.init(Vue.appConfig.MIXPANEL_TOKEN)
    }
    let shouldTrack = false
    const logger = {
      initTrack(user) {
        if (user && process.env.NODE_ENV === "production") {
          mixpanel.identify(user.address)
        } else {
          user = {}
        }
        shouldTrack = true
      },
      stopTrack() {
        shouldTrack = false
      },
      track(event, payload = {}) {
        if (process.env.NODE_ENV !== "production") {
          console.log(event, JSON.parse(JSON.stringify(payload)));
        }
        else if (shouldTrack) {
          // if (shouldTrack) {
          mixpanel.track(event, JSON.parse(JSON.stringify(payload)))
        }
      },
      error(err) {
        if (process.env.NODE_ENV !== "production") {
          console.error('error occured', err)
        }
        if (process.env.NODE_ENV === 'production') {
          // send error to entry
        }
      },
      debug(...args) {
        if (process.env.NODE_ENV !== "production") {
          console.log(...args)
        }
      },
    }
    Vue.logger = logger
    Vue.mixin({
      beforeCreate() {
        this.$logger = logger
      },
    })
  },
}
