<template>
  <div
    v-if="banner && banner.text"
    ref="infobanner"
    class="info-banner"
    :class="{
      'info-banner--warning': banner.type === 'warning',
    }"
  >
    <strong v-if="banner.heading"> {{ banner.heading }}: </strong>
    {{ banner.text }}
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from 'vuex'
import Component from "nuxt-class-component";

@Component({
  props: {},
  components: {},
  computed: {
    ...mapState(['banner']),
  },
})
export default class Banner extends Vue {
    mounted() {
        this.banner && this.$emit('bannerHeight', this.$refs.infobanner.clientHeight);
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.info-banner {
  padding: 8px 10%;
  text-align: center;
  background: rgb(33, 84, 250);
  color: white;

  &--warning {
    background: red;
  }
}
</style>
