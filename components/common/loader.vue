<template>
  <div class="d-flex flex-column loader">
    <div
      class="loader_spinner d-flex justify-content-center align-items-center"
    >
      <span class="loader_spinner_item spinner" />
    </div>
    <div class="loader_text">
      <div class="loader_text_title">OpenSea L2</div>
      | Powered by Matic Network
    </div>
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
@import '~assets/css/theme/_theme';
.loader {
}
.loader_spinner {
  background: url('~assets/img/open-sea-logo.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60px;
}
.loader_spinner_item {
  height: 70px;
  width: 70px;
}
.loader_text {
  align-self: center;
  margin-top: 20px;
  display: flex;
}
.loader_text_title{
  color: #3291e9;
  margin-right: 5px;
}
</style>
