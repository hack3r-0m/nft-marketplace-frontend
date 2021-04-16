import BigNumber from '~/plugins/bignumber'

export const getRandomFutureDateInSeconds = () => {
  const ONE_SECOND_MS = Vue.appConfig.ONE_SECOND_MS
  const TEN_MINUTES_MS = Vue.appConfig.TEN_MINUTES_MS
  return new BigNumber(Date.now() + TEN_MINUTES_MS)
    .div(ONE_SECOND_MS)
    .integerValue(BigNumber.ROUND_CEIL)
}

export const calculateProtocolFee = (orders, gasPrice = Vue.appConfig.gasPrice) => {
  return new BigNumber(150000).times(gasPrice).times(orders.length)
}
