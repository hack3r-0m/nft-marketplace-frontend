<template>
  <div class="toast-container font-body-medium">
    <div v-for="item in toasts" :key="item.id" class="tt">
      <div v-if="!item.details" class="tt-header d-flex">
        <div class="tt-header-container d-flex mr-auto">
          <div class="mr-3">
            <svg-sprite-icon
              name="dummy"
              class="tt-icon align-self-center"
              :class="item.type"
            />
          </div>
          <div class="align-self-center">
            {{ item.title }}
          </div>
        </div>
        <div
          class="tt-close-container d-flex align-self-stretch justify-content-center"
          @click="removeToast(item)"
        >
          <svg-sprite-icon
            v-if="item.closeButton"
            name="close"
            class="align-self-center close-icon"
          />
          <div
            v-if="!item.closeButton"
            class="text-button font-body-medium font-medium align-self-center"
          >
            Dismiss
          </div>
        </div>
      </div>

      <div v-if="item.details" class="tt-details-header d-flex">
        <div class="mr-3">
          <svg-sprite-icon
            name="dummy"
            class="tt-icon align-self-center"
            :class="item.type"
          />
        </div>
        <div class="tt-body-container w-100">
          <div class="font-semibold mb-2">
            {{ item.title }}
          </div>
          <div class="mb-4">
            {{ item.details }}
          </div>
          <div class="d-flex justify-content-end">
            <button v-if="item.acceptButton" class="btn btn-sm btn-light mr-2">
              Accept
            </button>
            <button class="btn btn-sm" @click="removeToast(item)">
              Dismiss
            </button>
          </div>
        </div>
      </div>
      <!-- <div class="tt-body" v-if="item.details">
        <a target="_blank" v-if="item.link" :href="item.link" rel="noopener noreferrer">{{ item.details }}</a>
        <span v-if="!item.link">{{ item.details }}</span>
      </div>-->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { APP_BUS } from '~/constants'

@Component({
  props: {},
  components: {},
})
export default class Toast extends Vue {
  toasts = null

  constructor() {
    super()
    this.toasts = []
  }

  mounted() {
    // new toast
    APP_BUS.$on('toast:show', this.showToast.bind(this))
    APP_BUS.$on('toast:hide', this.removeToast.bind(this))
  }

  showToast(title, options) {
    if (!title) return
    options.title = title
    options.type = options.type || 'success'
    options.id = options.id
    this.toasts.unshift(options)
    if (!options.sticky) {
      options._tid = setTimeout(
        this.removeToast.bind(this),
        options.timeout || 3000,
        options,
      )
    }
  }

  removeToast(t) {
    const index = this.toasts.findIndex((q) => q.id === t.id)
    const toast = this.toasts[index]
    if (toast._tid) {
      clearTimeout(toast._tid)
    }
    this.toasts.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped="true">
@import '~assets/css/theme/_theme';

$toast-width: 400px;

// scss
.toast-container {
  position: fixed;
  width: $toast-width;
  right: 15px;
  bottom: 15px;
  z-index: 1900;
}

.tt {
  background-color: dark-color('700');
  color: light-color('700');
  border-radius: $border-radius-lg;
  margin-top: 10px;

  .tt-header-container {
    padding: 16px;
  }

  .tt-details-header {
    padding: 16px;
  }

  .tt-close-container {
    padding-left: 20px;
    padding-right: 20px;
    cursor: pointer;
    padding: 16px;
    border-top-right-radius: $border-radius-lg;
    border-bottom-right-radius: $border-radius-lg;

    &:hover {
      background-color: dark-color('600');
    }

    .close-icon {
      width: 12px;
      height: 12px;
      fill: light-color('100');
    }

    .text-button {
      color: light-color('700');
    }
  }
}

.tt-body {
  padding: 16px;
}

.tt-icon {
  width: 24px;
  height: 24px;
  fill: light-color('700');

  &.success {
    fill: theme-color('success');
  }

  &.danger {
    fill: theme-color('danger');
  }

  &.warning {
    fill: theme-color('warning');
  }
}
</style>
