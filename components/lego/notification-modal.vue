<template>
  <section>
    <div class="modal notification-wrapper show">
      <div class="align-self-center">
        <div class="modal-dialog w-sm-100" role="document">
          <div class="box info-box">
            <div class="box-body">
              <div class="container ps-x-20">
                <span
                  class="position-absolute modal-close cursor-pointer"
                  @click="closeModal"
                >
                  <svg-sprite-icon
                    name="close"
                    class="align-self-center float-left cursor-pointer"
                  />
                </span>
                <div class="banner-info ps-y-24">
                  <div class="banner-info__title text-center">
                    Matic trading is now live on OpenSea
                  </div>
                  <div class="banner-info__desc text-center ps-x-4 ps-t-20">
                    <div class="ms-t-12">Matic assets are now available to view, buy and sell on OpenSea.</div>
                    <div class="ms-t-12">
                    If you've listed an item for sale here (matic.opensea.io), <span class="text-highlight">you need to re-list it on OpenSea (opensea.io) in order for the sale to be active there.</span>
                    </div>
                    <div class="ps-t-12">
                    In the next few days, we'll me migrating users away from this platform and towards OpenSea.
                    </div>
                  </div>
                  <div
                    class="banner-info__action w-100 text-center ps-t-32 d-flex justify-content-center"
                  >
                    <a href="https://opensea.io/" target="_blank" rel="noopener noreferrer">
                      <button class="btn text-white d-flex">
                        <img 
                          src="~/static/icons/opensea.svg"
                          class="img"
                        />
                        <div class="d-flex align-self-center">
                          Go to OpenSea
                        </div>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop show" />
  </section>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

@Component({
  components: {},
  props: {}
})
export default class NotificationBanner extends Vue {
  closeModal() {
    this.$emit('close');
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.box-body {
  font-family: Graphik;
}

.modal-close {
  right: 0;
  padding: 1rem 1rem 0 0;
}

.modal-dialog {
  @media #{$md-devices} {
    margin: 0.5rem;
    width: 500px;
  }

  .info-box {
    @media #{$md-devices} {
      height: 400px;
    }
  }

  .banner-img {
    img {
      width: 50px;
    }
  }
}

.banner-info {
  &__title {
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 2rem;
    letter-spacing: -0.02em;
    color: dark-color("700");
    border-bottom: 1px solid light-color("400");
    padding-bottom: 1rem;
  }

  &__desc {
    font-weight: normal;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: -0.02em;
    color: dark-color("500");
  }

  &__action {
    button {
      background: primary-color("500");
      border-radius: 5px;
      font-family: $font-family-base;
      font-size: 1rem;
      font-weight: 500;
      line-height: 19px;
      height: 50px;
      .img {
        height: 30px;
        width: 30px;
        margin-right: 1rem;
      }
    }
  }
}

.notification-wrapper {
  z-index: 1030;
}

.modal-backdrop {
  z-index: 1025;
}

.text-highlight {
  font-weight: 500;
}

img {
  width: 100%;
}
</style>
