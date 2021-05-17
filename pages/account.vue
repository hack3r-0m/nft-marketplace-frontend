<template>
  <div v-if="isAuthenticated" class="container-fluid">
    <account-banner />
    <tab-switcher
      class="sticky-top"
      :tabs="tabs"
      :activeTab="activeTab"
      :onChangeTab="changeTab"
    />
    <div class="row">
      <matic-new-tab v-if="activeTab === 0" />
      <ethereum-new-tab v-if="activeTab === 1" />
      <activity-order-tab v-if="activeTab === 2" />
      <activity-deposit-withdraw-tab v-if="activeTab === 3" />
    </div>

    <notification-modal v-if="showNotification" @close="onNotificationClose" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { mapGetters, mapState } from 'vuex'
import CategoriesSelector from '~/components/lego/categories-selector'
import SearchBox from '~/components/lego/search-box'
import SortDropdown from '~/components/lego/sort-dropdown'
import AccountBanner from '~/components/lego/account/account-banner'
import TabSwitcher from '~/components/lego/tab-switcher'
import MaticNewTab from '~/components/lego/account/matic-new-tab'
import EthereumNewTab from '~/components/lego/account/ethereum-new-tab'
import ActivityOrderTab from '~/components/lego/account/activity-order-tab'
import ActivityDepositWithdrawTab from '~/components/lego/account/activity-deposit-withdraw-tab'
import NotificationModal from '~/components/lego/notification-modal'
import CheckAuth from '~/components/mixins/common/check_auth'
import moment from 'moment'

@Component({
  props: {},
  components: {
    CategoriesSelector,
    SearchBox,
    SortDropdown,
    AccountBanner,
    TabSwitcher,
    MaticNewTab,
    EthereumNewTab,
    ActivityOrderTab,
    ActivityDepositWithdrawTab,
    NotificationModal,
  },
  mixins: [CheckAuth],
  computed: {
    ...mapGetters('account', [
      'favouriteOrders',
      'totalMaticNft',
      'totalMainNft',
      'totalUnreadOrderActivity',
    ]),
    ...mapState('auth', {
      user: (state) => state.user,
    }),
    ...mapState('network', {
      networks: (state) => state.networks,
    }),
    ...mapGetters('auth', {
      isAuthenticated: 'authenticated',
    }),
  },
})
export default class Index extends Vue {
  activeTab = 0

  allOrSale = true

  showNotification = false

  async mounted() {
    if (this.isLoggingOut) return
    this.$store.dispatch('page/clearFilters')
    this.fetchTotalTokens()
    const timestamp = moment().unix()
    if (!localStorage.getItem('WalletSwapFeature') ||
      localStorage.getItem('WalletSwapFeature') + 3600 < timestamp) 
    {
      this.onNotificationOpen()
    }
  }

  onNotificationOpen() {
    this.showNotification = true
    const timestamp = moment().unix()
    localStorage.setItem('WalletSwapFeature', timestamp)
  }

  onNotificationClose() {
    this.showNotification = false
  }

  async fetchTotalTokens() {
    try {
      this.$store.dispatch('token/reloadBalances')
      await Promise.all([
        this.$store.dispatch('account/fetchMainNFT', {
          user: this.user,
          chainId: this.mainChainId,
        }),
        this.$store.dispatch('account/fetchMaticNFT', {
          user: this.user,
          chainId: this.maticChainId,
        }),
        this.$store.dispatch('account/fetchNotification', {
          userId: this.user.id,
        }),
      ])
    } catch (error) {
      this.$logger.error(error)
    }
  }

  get mainChainId() {
    return this.networks.main.chainId
  }

  get maticChainId() {
    return this.networks.matic.chainId
  }

  changeTab(num) {
    this.activeTab = num
    this.fetchTotalTokens()
  }

  // Get
  get tabs() {
    return [
      { id: 0, title: 'Items on Matic', count: this.totalMaticNft },
      { id: 1, title: 'Items on Ethereum', count: this.totalMainNft },
      { id: 2, title: 'Orders', count: this.totalUnreadOrderActivity },
      { id: 3, title: 'Deposits & Withdraws' },
    ]
  }

  get favCount() {
    if (this.favouriteOrders) {
      return this.favouriteOrders.length
    }
    return 0
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/theme/_theme';
.sticky-top {
  top: $navbar-local-height !important;
}
.search-box {
  max-width: 264px;
  width: 100%;
}

.switch-wrapper {
  position: relative;
  background-color: light-color('500');
  border-radius: $default-card-box-border-radius;

  .top {
    z-index: 1;
    cursor: pointer;
    height: 100%;
  }

  .switch {
    left: 4px;
    position: absolute;
    height: 83%;
    width: 50%;
    background-color: light-color('700');
    border-radius: 4px;
    transition: left 0.2s linear;
  }
  &.active {
    .switch {
      left: 48%;
    }
  }
}
.count-wrapper {
  height: 24px;
  width: 24px;
  background-color: primary-color('600');
  color: light-color('700');
  border-radius: 50%;
}

@media (max-width: 520px) {
  .search-sort,
  .cat-switch {
    justify-content: center;
    flex-direction: column;
  }
}
</style>
