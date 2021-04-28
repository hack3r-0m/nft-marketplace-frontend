<template>
  <div class="col-md-12 d-flex ps-x-0 ms-y-8">
    <div class="d-flex align-self-center bidder-wrapper ps-y-24">
      <svg-sprite-icon name="profile" class="profile-logo align-self-center" />
      <div
        class="d-flex message flex-column align-self-center ps-x-16 ps-l-md-0 ps-r-md-16"
      >
        <div class="font-body-small">
          Bid by
          <a
            class="account-name"
            href
            :title="bid.users.address"
            @click.prevent
          >
            {{ shortChecksumAddress }}
          </a>
        </div>
        <div class="font-caption text-gray-300">
          {{ remainingTimeinWords }} ago
        </div>
      </div>
      <div class="d-flex ml-auto ms-r-16 ps-t-16 ps-t-sm-0">
        <div class="ps-y-12 ps-x-16">
          <span
            class="ps-y-8 ps-x-16 font-body-small font-medium price-pill text-nowrap"
          >
            {{ bid.price }} {{ bid.erc20Token.symbol }}
          </span>
        </div>

        <button
          v-if="isUsersBid && this.bid.order.status === 0"
          class="btn btn-light btn-deny align-self-center ms-r-12 ps-x-16"
          @click="onCancel()"
        >
          Cancel
        </button>

        <button
          v-if="isOwnersToken && this.bid.order.status === 0"
          class="btn btn-light btn-deny align-self-center ms-r-12 ps-x-16"
          @click="onDeny()"
        >
          Deny
        </button>
        <button
          v-if="isOwnersToken && this.bid.order.status === 0"
          class="btn btn-light align-self-center ps-x-16"
          @click="onAccept()"
        >
          Accept
        </button>
      </div>
    </div>

    <bid-confirmation
      :show="showAcceptBid"
      :bid="bid"
      :isLoading="isLoading"
      :accept="acceptBid"
      :close="onAcceptClose"
    />
    <bid-confirmation
      :show="showDenyBid"
      :bid="bid"
      :isLoading="isLoading"
      :accept="denyBid"
      :close="onDenyClose"
      :btnTexts="denyButtonTexts"
    />
    <bid-confirmation
      :show="showCancelBid"
      :bid="bid"
      :isLoading="isLoading"
      :accept="cancelBid"
      :close="onCancelClose"
      :btnTexts="cancelButtonTexts"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { mapGetters, mapState } from 'vuex'
import { Bid as BidModel } from '~/models'
import { toChecksumAddress } from 'ethereumjs-util'
import moment from 'moment'
import Web3 from 'web3'
import BidConfirmation from '~/components/lego/modals/bid-confirmation'
import Toast from '~/components/mixins/common/toast'
import {} from '~/helpers/0x-utils'
import { getProviderEngine } from '~/helpers/provider-engine'

// 0X
const {
  ContractWrappers,
  ERC721TokenContract,
  OrderStatus,
} = require('@0x/contract-wrappers')
const { generatePseudoRandomSalt, signatureUtils } = require('@0x/order-utils')
const { BigNumber } = require('@0x/utils')
const { Web3Wrapper } = require('@0x/web3-wrapper')
import { ORDER_TYPES } from '~/constants'

@Component({
  props: {
    bid: {
      type: BidModel,
      required: true,
    },
    refreshBids: {
      type: Function,
      required: false,
      default: () => {},
    },
    isOwnersToken: {
      type: Boolean,
      required: true,
    },
  },
  components: { BidConfirmation },
  mixins: [Toast],
  computed: {
    ...mapGetters('account', ['account']),
    ...mapGetters('network', ['networkMeta']),
    ...mapState('auth', {
      user: (state) => state.user,
    }),
    ...mapState('network', {
      networks: (state) => state.networks,
    }),
  },
})
export default class BidderRow extends Vue {
  showAcceptBid = false
  showDenyBid = false
  showCancelBid = false
  isLoading = false
  denyButtonTexts = { title: 'Deny', loadingTitle: 'Denying...' }
  cancelButtonTexts = { title: 'Cancel', loadingTitle: 'Cancelling...' }
  mounted() {}

  // Get
  get isUsersBid() {
    if (this.user && this.bid) {
      return this.user.id === this.bid.users.id
    }

    return false
  }

  get shortChecksumAddress() {
    if (!this.bid.users.address) {
      return null
    }
    const a = toChecksumAddress(this.bid.users.address)
    return `${a.slice(0, 6)}...${a.slice(38, 42)}`
  }

  get order() {
    return this.bid.order
  }

  get erc20Token() {
    return this.bid.erc20Token
  }

  get showAction() {
    return this.order.type === ORDER_TYPES.auction
  }

  get isErc1155() {
    return this.order.token_type === 'ERC1155'
  }

  get isErc721() {
    return this.order.token_type === 'ERC721'
  }

  get timeRemaining() {
    const expiry = moment(this.bid.updated)
    const current = moment()
    const diff = moment.duration(expiry.diff(current))

    return {
      days: Math.abs(diff.days()),
      hours: Math.abs(diff.hours()),
      mins: Math.abs(diff.minutes()),
      secs: Math.abs(diff.seconds()),
    }
  }

  get remainingTimeinWords() {
    let wordings = ''
    if (this.timeRemaining) {
      if (this.timeRemaining.days > 0) {
        wordings = `${this.timeRemaining.days} days`
      } else if (this.timeRemaining.hours > 0) {
        wordings = `${this.timeRemaining.hours} hours`
      } else if (this.timeRemaining.mins > 0) {
        wordings = `${this.timeRemaining.mins} mins`
      } else if (this.timeRemaining.secs > 0) {
        wordings = `${this.timeRemaining.secs} seconds`
      }
    }
    return wordings || '1 second'
  }

  // Actions
  onAccept() {
    this.showAcceptBid = true
  }

  onAcceptClose() {
    this.showAcceptBid = false
  }

  onDeny() {
    this.showDenyBid = true
  }

  onDenyClose() {
    this.showDenyBid = false
  }

  onCancel() {
    this.showCancelBid = true
  }

  onCancelClose() {
    this.showCancelBid = false
  }

  async acceptBid() {
    // Exchange the nft with this user
    this.$logger.track('accept-bid-start:bid-options', {
      order: this.bid.order.id,
      user: this.bid.users_id,
      erc20Token: this.bid.erc20Token,
    })
    this.isLoading = true
    if (this.order.taker_address === this.user.id) {
      try {
        // const chainId = this.networks.matic.chainId
        const nftContract = this.order.categories.categoriesaddresses[0].address
        const nftTokenId = this.order.tokens_id
        // const erc20Address = this.order.erc20tokens.erc20tokensaddresses[0]
        //   .address

        // const makerAddress = this.bid.users.address
        const takerAddress = this.account.address

        let takerAssetAmount = null
        if (this.isErc1155) {
          takerAssetAmount = new BigNumber(this.order.quantity)
        } else {
          takerAssetAmount = new BigNumber(1)
        }
        // const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(
        //   new BigNumber(this.bid.price),
        //   this.order.erc20tokens.decimal
        // );
        const signedOrder = JSON.parse(this.bid.signature)
        const contractWrappers = new ContractWrappers(getProviderEngine(), {
          chainId: signedOrder.chainId,
        })

        signedOrder.makerAssetAmount = BigNumber(signedOrder.makerAssetAmount)
        signedOrder.takerAssetAmount = takerAssetAmount
        signedOrder.expirationTimeSeconds = BigNumber(
          signedOrder.expirationTimeSeconds,
        )
        signedOrder.makerFee = BigNumber(signedOrder.makerFee)
        signedOrder.salt = BigNumber(signedOrder.salt)
        signedOrder.takerFee = BigNumber(signedOrder.takerFee)

        let tokenContract = null
        if (this.isErc721) {
          tokenContract = new ERC721TokenContract(
            nftContract,
            getProviderEngine(),
          )

          // Owner of current token
          const owner = await tokenContract
            .ownerOf(new BigNumber(nftTokenId))
            .callAsync()
          const isOwnerOfToken =
            owner.toLowerCase() === this.account.address.toLowerCase()
          if (!isOwnerOfToken) {
            this.txShowError(
              null,
              'You are no owner of this token',
              'You are no longer owner of this token, refresh to update the data',
            )
            this.isLoading = false
            this.onAcceptClose()
            return
          }
        } else {
          const matic = new Web3(this.networks.matic.rpc)
          tokenContract = new matic.eth.Contract(
            this.networkMeta.abi('ChildERC1155', 'pos'),
            nftContract,
          )
        }

        // Check Approve 0x, Approve if not
        this.$logger.track('accept-bid-approve-start:bid-options')
        const isApproved = await this.approve0x(
          tokenContract,
          contractWrappers,
          takerAddress,
        )
        if (!isApproved) {
          this.$logger.track('accept-bid-not-approved:bid-options')
          this.isLoading = false
          return
        }

        this.$logger.track('accept-bid-approved:bid-options')
        const [
          { orderStatus, orderHash },
          remainingFillableAmount,
          isValidSignature,
        ] = await contractWrappers.devUtils
          .getOrderRelevantState(signedOrder, signedOrder.signature)
          .callAsync()

        this.$logger.track('accept-bid-order-validation:bid-options', {
          orderStatus,
          remainingFillableAmount,
          isValidSignature,
        })
        console.log('is fillable', {
          orderStatus,
          orderHash,
          remainingFillableAmount,
          isValidSignature,
          fill: OrderStatus.Fillable,
        })

        if (
          orderStatus === OrderStatus.Fillable &&
          remainingFillableAmount.isGreaterThan(0) &&
          isValidSignature
        ) {
          console.log('Fillable')
          this.$logger.track('accept-bid-fill-order:bid-options')
          const dataVal = await this.$store.dispatch(
            'order/fillBid',
            this.bid.id,
          )
          this.$logger.track('accept-bid-fill-order-complete:bid-options')
          const zrx = {
            salt: generatePseudoRandomSalt(),
            expirationTimeSeconds: signedOrder.expirationTimeSeconds,
            gasPrice: Vue.appConfig.TX_DEFAULTS.gasPrice,
            signerAddress: takerAddress,
            data: dataVal.data,
            domain: {
              name: '0x Protocol',
              version: '3.0.0',
              chainId: this.networks.matic.chainId,
              verifyingContract: contractWrappers.contractAddresses.exchange,
            },
          }
          this.$logger.track('accept-metamask-sign-start:bid-options')
          const takerSign = await signatureUtils.ecSignTransactionAsync(
            getProviderEngine(),
            zrx,
            takerAddress,
          )
          this.$logger.track('accept-metamask-sign-complete:bid-options')
          if (takerSign) {
            this.$logger.track('handle-bid-accept-sign:bid-options')
            await this.handleBidAccept(takerSign)
            this.$logger.track('bid-accept-sign-completed:bid-options')
          }
        }
      } catch (error) {
        this.$logger.error(error)
        this.txShowError(error, null, 'Something went wrong')
      }
    }
    this.isLoading = false
    this.onAcceptClose()
  }

  async handleBidAccept(takerSign) {
    if (this.bid.users.id !== this.user.id && takerSign) {
      try {
        const data = {
          taker_signature: JSON.stringify(takerSign),
        }
        const response = await this.$store.dispatch('order/acceptBid', {
          bidId: this.bid.id,
          payload: data,
        })
        if (response) {
          this.$toast.show(
            'Accepted successfully',
            'You accepted the bid for your order',
            {
              type: 'success',
            },
          )
          this.$router.push({ name: 'account' })
        }
      } catch (error) {
        this.$logger.error(error)
      }
      this.$store.dispatch('category/fetchCategories')
    }
  }

  async approve0x(tokenContract, contractWrappers, makerAddress) {
    try {
      // Check if token is approved to 0x
      let isApprovedForAll
      const nftContract = this.order.categories.categoriesaddresses[0].address
      if (this.isErc721) {
        isApprovedForAll = await tokenContract
          .isApprovedForAll(
            makerAddress,
            contractWrappers.contractAddresses.erc721Proxy,
          )
          .callAsync()
      } else {
        isApprovedForAll = await tokenContract.methods
          .isApprovedForAll(
            makerAddress,
            contractWrappers.contractAddresses.erc1155Proxy,
          )
          .call()
      }
      console.log('Approving 1', isApprovedForAll)
      if (!isApprovedForAll) {
        if (!(await this.metamaskValidation())) {
          this.approveLoading = false
          return false
        }

        if (this.isErc721) {
          console.log('Approving 2', {
            isApprovedForAll,
            tokenContract: tokenContract,
            erc721Proxy: contractWrappers.contractAddresses.erc721Proxy,
            makerAddress: makerAddress,
          })
          const makerERC721ApprovalTxHash = await tokenContract
            .setApprovalForAll(
              contractWrappers.contractAddresses.erc721Proxy,
              true,
            )
            .sendTransactionAsync({
              from: makerAddress,
              gas: 100000,
            })
          console.log('Approving 2')
          if (makerERC721ApprovalTxHash) {
            console.log('Approve Hash', makerERC721ApprovalTxHash)
            this.$toast.show('Approved', 'You successfully approved', {
              type: 'success',
            })
            return true
          }
          this.txShowError(
            error,
            'Failed to approve',
            'You need to approve the transaction to sale the NFT',
          )
        } else {
          const maticWeb3 = new Web3(window.ethereum)
          const contract = new maticWeb3.eth.Contract(
            this.networkMeta.abi('ChildERC1155', 'pos'),
            nftContract,
          )

          console.log('Approving 2', {
            isApprovedForAll,
            tokenContract: contract,
            erc1155Proxy: contractWrappers.contractAddresses.erc1155Proxy,
            makerAddress: makerAddress,
          })

          const makerERC1155ApprovalTxHash = await contract
            .setApprovalForAll(
              contractWrappers.contractAddresses.erc1155Proxy,
              true,
            )
            .send({
              from: makerAddress,
              gas: 100000,
            })
          console.log('Approving 2')
          if (makerERC1155ApprovalTxHash) {
            console.log('Approve Hash', makerERC1155ApprovalTxHash)
            this.$toast.show('Approved', 'You successfully approved', {
              type: 'success',
            })
            return true
          }
          this.txShowError(
            error,
            'Failed to approve',
            'You need to approve the transaction to sale the NFT',
          )
        }
      }
      return true
    } catch (error) {
      this.$logger.error(error)
      return false
    }
  }

  async denyBid() {
    this.$logger.track('deny-bid-start:bid-options', {
      order: this.bid.order.id,
      user: this.bid.users_id,
      erc20Token: this.bid.erc20Token,
    })
    if (this.bid.order.taker_address === this.user.id) {
      try {
        const response = await this.$store.dispatch('order/cancelBid', {
          bidId: this.bid.id,
        })
        if (response.status === 200) {
          this.$logger.track('deny-bid-success:bid-options')
          this.$toast.show(
            'Bid declined successfully',
            'You declined bid successfully',
            {
              type: 'success',
            },
          )
          this.refreshBids()
        }
      } catch (error) {
        this.$logger.error(error)
        this.txShowError(error, null, 'Something went wrong')
      }
    }
  }

  async cancelBid() {
    this.isLoading = true
    this.$logger.track('cancel-bid-start:bid-options', {
      order: this.bid.order.id,
      user: this.bid.users_id,
      erc20Token: this.bid.erc20Token,
    })
    try {
      if (this.order.type === ORDER_TYPES.negotiation) {
        const signedOrder = JSON.parse(this.bid.signature)
        const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
          new BigNumber(this.bid.price),
          this.erc20Token.decimal,
        )
        signedOrder.makerAssetAmount = BigNumber(signedOrder.makerAssetAmount)
        signedOrder.takerAssetAmount = takerAssetAmount
        signedOrder.expirationTimeSeconds = BigNumber(
          signedOrder.expirationTimeSeconds,
        )
        signedOrder.makerFee = BigNumber(signedOrder.makerFee)
        signedOrder.salt = BigNumber(signedOrder.salt)
        signedOrder.takerFee = BigNumber(signedOrder.takerFee)

        const chainId = this.networks.matic.chainId
        const contractWrappers = new ContractWrappers(getProviderEngine(), {
          chainId: chainId,
        })
        this.$logger.track('cancel-bid-api-cancel-order:bid-options')
        const dataVal = await this.$store.dispatch(
          'order/encodeForCancelBidOrder',
          this.bid.id,
        )
        this.$logger.track('cancel-bid-api-cancel-order-completed:bid-options')
        const zrx = {
          salt: generatePseudoRandomSalt(),
          expirationTimeSeconds: signedOrder.expirationTimeSeconds,
          gasPrice: Vue.appConfig.TX_DEFAULTS.gasPrice,
          signerAddress: signedOrder.makerAddress,
          data: dataVal.data,
          domain: {
            name: '0x Protocol',
            version: '3.0.0',
            chainId: this.networks.matic.chainId,
            verifyingContract: contractWrappers.contractAddresses.exchange,
          },
        }
        this.$logger.track('cancel-bid-metamask-start:bid-options')
        const takerSign = await signatureUtils.ecSignTransactionAsync(
          getProviderEngine(),
          zrx,
          signedOrder.makerAddress,
        )
        this.$logger.track('cancel-bid-metamask-complete:bid-options')
        if (takerSign) {
          this.$logger.track('handle-cancel-bid-start-taker-sign:bid-options')
          await this.handleCancelBid(takerSign)
          this.$logger.track(
            'handle-cancel-bid-completed-taker-sign:bid-options',
          )
        }
      } else {
        this.$logger.track('handle-cancel-bid-start:bid-options')
        await this.handleCancelBid()
        this.$logger.track('handle-cancel-bid-completed:bid-options')
      }
    } catch (error) {
      this.$logger.error(error)
    }
    this.isLoading = false
    this.onCancelClose()
  }

  async handleCancelBid(takerSign) {
    if (this.bid.users.id === this.user.id && takerSign) {
      try {
        const data = {
          taker_signature: JSON.stringify(takerSign),
        }
        const response = await this.$store.dispatch('order/cancelBid', {
          bidId: this.bid.id,
          data: data,
        })
        if (response) {
          this.$toast.show(
            'Bid cancelled successfully',
            'You cancelled your bid successfully',
            {
              type: 'success',
            },
          )
          this.refreshBids()
        }
      } catch (error) {
        this.$logger.error(error)
        this.txShowError(error, null, 'Something went wrong')
      }
    }
    this.$store.dispatch('category/fetchCategories')
  }

  async metamaskValidation() {
    const web3obj = new Web3(window.ethereum)
    const chainId = await web3obj.eth.getChainId()
    if (chainId !== this.networks.matic.chainId) {
        this.error = 'selectMatic';
        return false;
    }
    return true
  }
}
</script>

<style lang="scss" scoped="true">
@import '~assets/css/theme/_theme';

.bidder-wrapper {
  width: 100%;
  border: 1px solid light-color('500');
  border-radius: $default-card-box-border-radius;
  .img-wrapper {
    display: flex;
    width: 80px;
    min-height: 80px;
    padding: 0.5rem;
    border-radius: $default-card-box-border-radius;
    .asset-img {
      width: 100%;
    }
  }
}
.price-pill {
  background-color: light-color('500');
  border-radius: 18px;
}
.profile-logo {
  width: 32px !important;
  height: 32px !important;
  margin-left: 1rem;
  margin-right: 1rem;
}
.btn {
  height: fit-content !important;
  white-space: nowrap;
}
.btn-deny {
  color: red-color('600');
}
.text-gray-300 {
  color: dark-color('300');
}

@media (max-width: 768px) {
  .img-wrapper {
    width: 70px !important;
    min-height: 70px !important;
  }
}
@media (max-width: 580px) {
  .bidder-wrapper {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .profile-logo {
    display: none !important;
  }
}
@media (max-width: 440px) {
  .bidder-wrapper {
    flex-direction: column;
    .message {
      margin-right: auto;
    }
  }
}
</style>
