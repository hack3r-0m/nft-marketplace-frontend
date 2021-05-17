import EthereumTx from 'ethereumjs-tx'
import app from '~/plugins/app'

import BigNumber from '~/plugins/bignumber'
import EtherUnits from './ether-units'
import { trimHexZero } from './index'

export function adjustGas(gasLimit) {
  if (gasLimit === 21001) {
    return 21000
  }

  if (new BigNumber(gasLimit).gt(app.gasLimit)) {
    return null
  }

  return new BigNumber(gasLimit).toNumber()
}

export function gasGasPrice(network, ...args) {
  return network.web3.eth.getGasPrice(...args)
}

export function gasGasLimit(network, ...args) {
  return network.web3.eth.gasGasLimit(...args)
}

export function getBalance(network, ...args) {
  return network.web3.eth.getBalance(...args)
}

export function estimateGas(network, ...args) {
  return network.web3.eth.estimateGas(...args)
}

export function getBlockNumber(network, ...args) {
  return network.web3.eth.getBlockNumber(...args)
}

export function getTransactionCount(network, ...args) {
  return network.web3.eth.getTransactionCount(...args)
}

export function getTransaction(network, ...args) {
  return network.web3.eth.getTransaction(...args)
}

export function getTransactionReceipt(network, ...args) {
  return network.web3.eth.getTransactionReceipt(...args)
}

export function getBlock(network, ...args) {
  return network.web3.eth.getBlock(...args)
}

export function calculateContractAddress(address, nonce) {
  const nonceStr = new BigNumber(nonce).toString()
  const cleanAddress = eutils.addHexPrefix(address)
  return eutils.addHexPrefix(
    eutils.generateAddress(cleanAddress, nonceStr).toString('hex'),
  )
}

export function generateRawTransaction(txObj, privateKey) {
  let privateKeyBuffer = privateKey
  if (typeof privateKey === 'string') {
    privateKeyBuffer = Buffer.from(privateKey, 'hex')
  }

  const tx = new EthereumTx(txObj)
  tx.sign(privateKeyBuffer)
  return tx.serialize()
}

export async function getContractCode(network, address) {
  try {
    const rawCode = await network.web3.eth.getCode(address)
    return trimHexZero(rawCode)
  } catch (e) {
    console.log(e)
  }
  return '0x0'
}
