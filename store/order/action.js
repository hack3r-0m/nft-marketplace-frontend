import Vue from "vue";
import BidModel from '~/components/model/bid'

export const action = {
    async getOrders({ commit }, payload) {
        const response = await Vue.service.order.getOrders(payload)
        if (response && response.status === 200) {
            const data = response.data.data;
            commit("RESET_ORDERS");
            data.order.map(order => {
                commit('ADD_ORDER', order);
            })
            return data;
        }
    },
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
    async getOrderDetail({ dispatch, commit }, { orderId, account }) {
        account = account || {};
        const response = await Vue.service.order.getOrderDetail(orderId);
        let order = response.data.data;
        let isOrderValid = true;
        if (order) {
            commit('REMOVE_ORDER', order);
            commit('ADD_ORDER', order);
        }
        if (response.status === 202 && order) {
            const sellerAddress = order.seller_users.address

            // if someone else is viewing, then validate the orders to check for expiry
            if (account.address !== sellerAddress) {
                const res = await dispatch("validate", orderId);
                isOrderValid = res;
            }
        }
        return {
            order, isOrderValid
        }
    },
    async validate(_, orderId) {
        const res = await Vue.service.order.validateOrder(orderId);
        if (res.status === 200) {
            // false means order is invalid
            return false;
        }
        return true;
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
            return response.data
        }
    },
    async buyToken(_, payload) {
        const response = await Vue.service.order.buyToken(payload);
        if (response.status === 200) {
            return response.data
        }
    },
    async acceptBid(_, payload) {
        const response = await Vue.service.order.acceptBid(payload);
        if (response.status === 200) {
            return response.data
        }
    },
    async cancelBid(_, payload) {
        const response = await Vue.service.order.cancelBid(payload);
        if (response.status === 200) {
            return response.data
        }
    },
    async fillBid(_, payload) {
        const response = await Vue.service.order.fillBid(payload);
        if (response.status === 200) {
            return response.data
        }
    },
    async encodeForCancelBidOrder(_, payload) {
        const response = await Vue.service.order.encodeForCancelBidOrder(payload);
        if (response.status === 200) {
            return response.data
        }
    },
    async encodeForBuyToken(_, payload) {
        const response = await Vue.service.order.encodeForBuyToken(payload);
        if (response.status === 200) {
            return response.data
        }
    },
    async encodeForCancelBidOrder(_, payload) {
        const response = await Vue.service.order.encodeForCancelBidOrder(payload);
        if (response.status === 200) {
            return response.data
        }
    },
}

export default action;
