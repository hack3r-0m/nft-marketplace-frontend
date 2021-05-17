export default {
  computed: {
    validation() {
      return {}
    },

    isValid() {
      const validation = this.validation
      return Object.keys(validation).every((key) => validation[key])
    },
  },
}
