export default {
  methods: {
    beautifyErrorMessage(message) {
      if (!message) {
        return null
      }

      if (/sender doesn't have enough funds to send tx/gi.test(message)) {
        const matches = /The upfront cost is: (\d+) /gi.exec(message)
        let cost = null

        if (matches) {
          cost = EtherUnits.toEther(new BigNumber(matches[1]), 'wei')
        }

        let result = "Account doesn't have enough funds to send transaction."
        if (cost) {
          result = `${result} Upfront cost is: ${cost.toFixed(5)} ETH`
        }

        return result
      } else if (/insufficient funds for gas \* price \+ value/gi.test(message)) {
        return "Account doesn't have enough funds to send transaction."
      } else if (/nonce too low/gi.test(message)) {
        return 'Transaction nonce is too low.'
      } else if (/The execution failed due to an exception/gi.test(message)) {
        return 'Not enough ETH for transaction.'
      } else if (
        /Unknown address - unable to sign transaction for this address:/gi.test(
          message,
        )
      ) {
        return 'Unable to sign transaction with this address. If you are using metamask, check your default address.'
      } else if (
        /MetaMask Tx Signature: User denied transaction signature./gi.test(message)
      ) {
        return 'MetaMask Tx: User denied transaction signature'
      }

      return null
    },

    txShowError(error, errorHeader, defaultMessage = '') {
      // error toast
      this.$toast.show(
        errorHeader || 'Error',
        this.beautifyErrorMessage(error ? error?.message : null) || defaultMessage,
        {
          type: 'danger',
        },
      )
    },
  },
}
