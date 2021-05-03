<template>
  <div class="container-fluid p-0">
    <navbar-section 
      v-if="shouldShowNavBar"
      @bannerHeight="bannerHeightHandler"
    />
    <div class="content-container" :style="contentContainerClasses">
      <div v-if="isLoaded" class="nuxt-section">
        <nuxt />
      </div>
      <div v-else class="loader" >
        <Loader />
      </div>
    </div>
    <toast />
  </div>
</template>

<script>
import NavbarSection from '~/components/navbar'
import Toast from '~/components/toast'
import { mapState, mapActions, mapGetters } from 'vuex'
import MetaNetwork from '@maticnetwork/meta/network'
import {
  registerAccountChange,
  registerNetworkChange,
  getWalletProvider,
} from '~/helpers'
import Vue from 'vue'
import Web3 from 'web3'
import { IS_METAMASK_ENABLED } from '~/constants'
import Loader from '~/components/common/loader'
import exportedCssVars from '~/assets/css/theme/_variables.scss'

export default {
  components: {
    NavbarSection,
    Toast,
    Loader,
  },
  data() {
    return {
      isLoaded: false,
      bannerHeight: '0px',
    }
  },
  watch: {
    loginStrategy: function (value) {
      this.onLoginStrategyChange(value)
    },
  },
  computed: {
    ...mapState('network', {
      ethereumNetworks: (state) => state.networks,
    }),
    ...mapGetters('auth', {
      isMetaMaskConnected: 'isMetaMaskConnected',
    }),
    ...mapState('auth', {
      loginStrategy: (state) => state.loginStrategy,
      loggedInUser: (state) => state.user,
    }),
    shouldShowNavBar() {
      return this.isLoaded && this.$route.name != 'login'
    },
    contentContainerClasses() {
      return {
        'margin-top': `calc(${exportedCssVars.navbarLocalHeight} + ${this.bannerHeight})`,
      }
    }
  },
  created() {
    this.isMobileDevice = window.innerWidth < 768
  },

  async mounted() {
    // set and Initialise networks
    await Promise.all([
      this.getConfig(),
      this.initNetworks(),
      this.fetchCategories(),
    ])
    this.isLoaded = true
  },

  methods: {
    ...mapActions('network', {
      setNetworks: 'setNetworks',
      setProviders: 'setProviders',
    }),
    ...mapActions('auth', {
      getConfig: 'getConfig',
    }),
    ...mapActions('category', {
      fetchCategories: 'fetchCategories',
    }),

    async initNetworks() {
      const metaNetwork = this.getMetaNetwork()
      // store networks
      await this.setNetworks({
        metaNetwork,
        uiConfig: Vue.appConfig,
      })
      // set network depending upon the login strategy
      await this.onLoginStrategyChange(metaNetwork)
    },
    getMetaNetwork() {
      const matic = Vue.appConfig.matic
      this.$logger.debug('config', matic)
      return new MetaNetwork(matic.deployment.network, matic.deployment.version)
    },
    async onNetworkChange(chainId) {
      const metaNetwork = this.getMetaNetwork()
      await this.setProviders({
        main: getWalletProvider({
          networks: this.ethereumNetworks,
          primaryProvider: 'main',
          loginStrategy: this.loginStrategy,
        }),
        matic: getWalletProvider({
          networks: this.ethereumNetworks,
          primaryProvider: 'matic',
          loginStrategy: this.loginStrategy,
        }),
      })

      if (!chainId) {
        chainId = window.ethereum.chainId
      }

      const main = metaNetwork.Main
      const matic = metaNetwork.Matic

      if (
        chainId &&
        chainId !== '0x' + main.ChainId.toString(16) &&
        chainId !== '0x' + matic.ChainId.toString(16)
      ) {
        this.logout()
      }
    },
    async onAccountChange(selectedAddress) {
      const user = this.loggedInUser

      if (!user || !user.address) {
        await this.logout(false)
      } else if (
        !selectedAddress ||
        !selectedAddress[0] ||
        user.address.toLowerCase() !== selectedAddress[0].toLowerCase()
      ) {
        await this.logout()
      }
    },
    async onLoginStrategyChange() {
      if (IS_METAMASK_ENABLED && this.isMetaMaskConnected) {
        if (this.isMetaMaskEventSubscribed) return
        this.onNetworkChange()
        registerNetworkChange(this.onNetworkChange)
        registerAccountChange(this.onAccountChange)
        this.isMetaMaskEventSubscribed = true
      } else {
        await this.setProviders({
          main: new Web3.providers.HttpProvider(this.ethereumNetworks.main.rpc),
          matic: new Web3.providers.HttpProvider(
            this.ethereumNetworks.matic.rpc,
          ),
        })
      }
    },
    async logout(navigateToLogin = true) {
      await this.$store.dispatch('auth/logout')
      // redirect to login
      if (navigateToLogin) {
        this.$router.push('/login')
      }
    },
    bannerHeightHandler(height) {
      this.bannerHeight = `${height}px`
    }
  },
}
</script>

<style lang="scss" scoped="true">
@import '~assets/css/theme/_theme';

.logo-container {
  height: 100px;
  background-color: theme-color('primary');
}

.logo {
  height: 26px;
}

.logo-name {
  height: 24px;
}

.loader {
  height: calc(80vh - #{$navbar-local-height});
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .logo-container {
    height: 60px;
    box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.05);
  }
}
</style>
