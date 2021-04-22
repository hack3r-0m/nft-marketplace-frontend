import Vue from "vue";
import OrderModel from '~/components/model/order'
import BidModel from '~/components/model/bid'

export const action = {
    async getBidInfo(_, { order, erc20Token }) {
        let response
        response = await Vue.service.order.getBidInfo(order.id)
        const orderFromResponse = response.data.data.order;
        const bids = [];
        let hasNextPage = false;
        if (response.status === 200 && orderFromResponse) {
            orderFromResponse.forEach(function (bid) {
                bid.erc20Token = erc20Token
                bid.order = order
                if (bid.status === 0) {
                    // if bid is active
                    bids.push(new BidModel(bid))
                }
            })
        }
        return {
            bids, hasNextPage
        }
    },
    async getOrderDetail(_, { orderId, account }) {
        const response = await Vue.service.order.getOrderDetail(orderId);
        let order = response.data.data;
        let isOrderValid = true;
        if (order) {
            order.token = order.tokens;
            order.erc20TokenId = order.erc20tokens.id
        }
        if (response.status === 202 && order) {
            const sellerAddress = order.seller_users.address

            // if someone else is viewing, then validate the orders to check for expiry
            if (account.address !== sellerAddress) {
                const res = await Vue.service.order.validateOrder(orderId);
                if (res.status === 200) {
                    isOrderValid = false;
                }
            }
        }
        return {
            order, isOrderValid
        }
    },
    async cancelOrder(_, { orderId, payload }) {
        const response = await Vue.service.order.cancelOrder(orderId, payload);
        if (response.status === 200) {
            return true;
        }
        return false;
    },
    async getExcodedDataForCancelOrder(_, orderId) {
        const response = await Vue.service.order.getExcodedDataForCancelOrder(orderId);
        if (response.status === 200) {
            return response.data.data;
        }
    },
    async create(_, payload) {
        const response = await Vue.service.order.create(payload);
        if (response.status === 200) {
            return true;
        }
        return false;
    },
    async executeMetaTx(_, payload) {
        const response = await Vue.service.order.executeMetaTx(payload);
        if (response.status === 200) {
            return true;
        }
        return false;
    }
}

export default action;
