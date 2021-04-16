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

    signAcceptBid(bidId) {
        const url = this.createUrl_(`exchangedata/encodedbid?bidId=${bidId}&functionName=fillOrder`);
        return this.httpCaller.get(url);
    }

    acceptBid(bid) {
        const url = this.createUrl_(`${bid.id}/execute`)
        return this.httpCaller.patch(
            url,
            {
                taker_signature: JSON.stringify(bid.takerSign),
            }
        );
    }

    cancelBid(bidId) {
        const url = this.createUrl_(`bid/${bidId}/cancel`);
        return this.httpCaller.patch(url);
    }

    signAcceptBid(bidId) {
        const url = this.createUrl_(`exchangedata/encodedbid?bidId=${bidId}&functionName=cancelOrder`);
        return this.httpCaller.get(url);
    }

}