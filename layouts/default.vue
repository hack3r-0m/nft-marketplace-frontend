<template>
  <div class="container-fluid p-0">
    <navbar-section v-if="shouldShowNavBar" />
    <div class="content-container">
      <div v-if="isLoaded" class="nuxt-section">
        <nuxt />
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

export default {
  components: {
    NavbarSection,
    Toast,
  },
  data() {
    return {
      isLoaded: false,
    }
  },
  computed: {
    ...mapState('network', {
      ethereumNetworks: (state) => state.networks,
      loggedInUser: (state) => state.user,
    }),
    ...mapGetters('auth', {
      isMetaMaskConnected: 'isMetaMaskConnected',
    }),
    shouldShowNavBar() {
      return this.$route.name != 'login'
    },
  },
  created() {
    this.isMobileDevice = window.innerWidth < 768
  },

  async mounted() {
    // set and Initialise networks
    await Promise.all([
      this.initNetworks(),
      // Initialize Categories
      this.fetchCategories(),
      // TODO: initialize Authentication
      this.getConfig(),
      // Initialize tokens
      this.fetchERC20Tokens(),
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
    ...mapActions('token', {
      fetchERC20Tokens: 'fetchERC20Tokens',
    }),
    async initNetworks() {
      const matic = Vue.appConfig.matic
      this.$logger.debug('config', matic)
      const metaNetwork = new MetaNetwork(
        matic.deployment.network,
        matic.deployment.version,
      )
      // store networks
      await this.setNetworks({
        metaNetwork,
        uiConfig: Vue.appConfig,
      })
      // set network depending upon the login strategy
      if (this.isMetaMaskConnected) {
        const metamaskNetworkChangeHandler = async (chainId) => {
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

          await this.setProviders({
            main: getWalletProvider({
              networks: this.ethereumNetworks,
              primaryProvider: 'main',
            }),
            matic: getWalletProvider({
              networks: this.ethereumNetworks,
              primaryProvider: 'matic',
            }),
          })
        }

        registerNetworkChange(metamaskNetworkChangeHandler)
        await metamaskNetworkChangeHandler()

        registerAccountChange(async (selectedAddress) => {
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
        })
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
  },
}
</script>

<style lang="scss" scoped="true">
@import '~assets/css/theme/_theme';

.nuxt-section {
  margin-top: $navbar-local-height;
}

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
.content-container {
  margin-top: $navbar-local-height;
}

@media (max-width: 768px) {
  .logo-container {
    height: 60px;
    box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.05);
  }
}
</style>
