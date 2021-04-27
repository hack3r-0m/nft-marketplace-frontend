import MetamaskProvider from '@maticnetwork/metamask-provider'
import WalletConnectProvider from '@maticnetwork/walletconnect-provider'
import Portis from '@portis/web3'
import { LOGIN_STRATEGY } from "~/constants";

export function getWalletProvider({ networks, primaryProvider, loginStrategy }) {
  let network = null

  if (primaryProvider === 'main') {
    network = networks.main
  } else if (primaryProvider === 'matic') {
    network = networks.matic
  } else {
    return null
  }

  let provider = null
  switch (loginStrategy) {
    case LOGIN_STRATEGY.metaMask:
      window.ethereum.enable()
      provider = new MetamaskProvider(window.ethereum, {
        url: network.rpc,
      })
      break

    case LOGIN_STRATEGY.walletConnect:
      provider = new Portis(app.uiconfig.portis.dappId, {
        nodeUrl: network.rpc,
        chainId: network.chainId,
      }).provider
      break

    default:
      provider = new WalletConnectProvider({
        host: network.rpc,
      })
      break
  }

  return provider
}
