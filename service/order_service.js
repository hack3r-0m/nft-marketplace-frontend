export class OrderService {

    constructor(httpCaller) {
        this.httpCaller = httpCaller;
        this.endPoint_ = "orders/";
    }

    createUrl_(url) {
        return this.endPoint_ + url;
    }

    getOrders({ offset, limit, category, sort }) {
        const categoryArray = category ? `[${category}]` : `[]`;
        const url = this.createUrl_(`?offset=${offset}&limit=${limit}&categoryArray=${categoryArray}&sort=${sort}`);
        return this.httpCaller.get(url);
    }

    acceptBid({ bidId, payload }) {
        const url = this.createUrl_(`${bidId}/execute`)
        return this.httpCaller.patch(
            url,
            payload
        );
    }

    fillBid( bidId ) {
      const url = this.createUrl_(`exchangedata/encodedbid?bidId=${bidId}&functionName=fillOrder`);
      return this.httpCaller.get(url)
    }

    cancelBid({ bidId, data }) {
        const url = this.createUrl_(`bid/${bidId}/cancel`);
        return this.httpCaller.patch(url, data);
    }

    encodeForCancelBidOrder(bidId) {
        const url = this.createUrl_(`exchangedata/encodedbid?bidId=${bidId}&functionName=cancelOrder`);
        return this.httpCaller.get(url);
    }

    encodeForBuyToken(orderId) {
        const url = this.createUrl_(`exchangedata/encoded?orderId=${orderId}&functionName=fillOrder`);
        return this.httpCaller.get(url);
    }

    getBidInfo(orderId) {
        const url = this.createUrl_(`bids/${orderId}`);
        return this.httpCaller.get(url);
    }

    getOrderDetail(orderId) {
        const url = this.createUrl_(`${orderId}`);
        return this.httpCaller.get(url);
    }

    validateOrder(orderId) {
        const url = this.createUrl_(`validate`);
        return this.httpCaller.post(url, {
            orderId: orderId
        });
    }

    cancelOrder(orderId, payload) {
        const url = this.createUrl_(`${orderId}/cancel`);
        return this.httpCaller.patch(url, payload);
    }

    getExcodedDataForCancelOrder(orderId) {
        const url = this.createUrl_(`exchangedata/encoded?orderId=${orderId}&functionName=cancelOrder`);
        return this.httpCaller.get(url);
    }

    create(payload) {
        const url = this.createUrl_("");
        return this.httpCaller.post(url, payload)
    }
    executeMetaTx(payload) {
        const url = this.createUrl_("executeMetaTx");
        return this.httpCaller.post(url, payload)
    }

    buyToken({payload,orderId}) {
        const url = this.createUrl_(`${orderId}/buy`);
        return this.httpCaller.patch(url, payload);
    }

}
