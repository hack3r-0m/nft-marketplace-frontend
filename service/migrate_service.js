export class MigrateService {
  constructor(httpCaller) {
    this.httpCaller = httpCaller;
  }

  transferFromEthereumToMatic(payload) {
    const url = `assetmigrate`;
    this.httpCaller.post(url, payload)
  }

  checkForTransactionInclusion({ watcherUrl, blockNumber }) {
    const url = `${watcherUrl}/header/included/${blockNumber}`;
    this.httpCaller.get(url)
  }

  burnTransaction(payload) {
    const url = `assetmigrate`;
    this.httpCaller.post(url, payload)
  }

  updateTransactionStatusToCheckpointed({ payload, transactionId }) {
    const url = `assetmigrate/${transactionId}`;
    this.httpCaller.put(url, payload)
  }

  updateTransactionStatusToExited({ payload, transactionId }) {
    const url = `assetmigrate/${transactionId}`;
    this.httpCaller.put(url, payload)
  }
}
