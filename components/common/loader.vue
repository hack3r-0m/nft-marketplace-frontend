<template>
  <div class="loader d-flex justify-content-center align-items-center">
     <!-- <img
                src=
                alt="Open Sea Logo"
                class=""
              /> -->
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
  background: url("~assets/img/open-sea-logo.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60px;
  .spinner {
    height: 70px;
    width: 70px;
  }
}
</style>
