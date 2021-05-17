<template>
  <div class="container-fluid p-0">
    <OrderDetail v-if="orderId" :orderId="orderId" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import OrderDetail from '~/components/order/detail'

@Component({
  components: {
    OrderDetail,
  },
})
export default class Order extends Vue {

  get orderId() {
    return this.$route.params.id
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/theme/_theme';
</style>
