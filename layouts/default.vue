<template>
  <div class="container-fluid p-0">
    <navbar-section v-if="false" />
    <div class="content-container">
      <div class="nuxt-section">
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
import AccountModel from '~/components/model/account'
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
    this.initNetworks()
    // TODO: initialize Authentication
    await this.initAuthentication()
    // Initialize Categories
    this.initCategories()
    // Initialize tokens
    this.initTokens()
  },

  methods: {
    ...mapActions('network', {
      setNetworks: 'setNetworks',
      setProviders: 'setProviders',
    }),
    async initNetworks() {
      const metaNetwork = new MetaNetwork(
        Vue.appConfig.matic.deployment.network,
        Vue.appConfig.matic.deployment.version,
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

    async initAuthentication() {
      // Check auth token is there and is valid or not
      const isLoggedIn = await this.$store.dispatch('auth/checkLogin')
      if (!isLoggedIn) return
      // Initialize account
      await this.initAccount()
      Vue.$sentry.setUser({ id: store.getters['auth/address'] })
    },

    async initAccount() {
      // store commit
      await this.$store.commit(
        'account/account',
        new AccountModel({
          address: store.getters['auth/address'],
        }),
      )
      Vue.logger.initTrack({ address: store.getters['auth/address'] })
      await this.$store.dispatch('token/reloadBalances')
      // user profile data
      this.initUserProfile()
    },

    async initCategories() {
      await this.$store.dispatch('category/fetchCategories')
    },

    async initTokens() {
      await this.$store.dispatch('token/fetchERC20Tokens')

      const user = this.loggedInUser
      if (user) {
        // Load account balance
        await this.$store.dispatch('token/reloadBalances')
      }
    },

    async initUserProfile() {
      const user = store.getters['auth/user']
      if (user) {
        this.$store.dispatch('account/fetchActiveOrders')
        this.$store.dispatch('account/fetchFavoritesOrders')
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
