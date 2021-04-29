<template>
  <div class="loader d-flex justify-content-center align-items-center">
    <span class="spinner" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  props: {},
  components: {},
})
export default class Loader extends Vue {}
</script>

<style lang="scss" scoped="">
@import "~assets/css/theme/_theme";

.loader {
  .spinner {
    height: 40px;
    width: 40px;
  }
}
</style>
