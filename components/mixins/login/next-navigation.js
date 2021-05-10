import { getNextRoute } from '~/helpers'

export default {
  data() {
    return {
      nextRoute: this.nextRoute || null,
    }
  },
  mounted() {
    // next
    this.nextRoute = getNextRoute(this.$route)
  },
  methods: {
    moveToNext() {
      if (this.nextRoute) {
        const l = this.$router.resolve(this.nextRoute)
        if (l && l.resolved.matched.length > 0) {
          this.$router.push(this.nextRoute)
        } else {
          this.$router.push({ name: 'index' })
        }
      }
    },
  },
}
