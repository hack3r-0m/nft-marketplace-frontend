import {
    toTokenAmount,
} from '~/helpers/token-utils'
export const getter = {
    orderById(state) {
        return (id) => {
            return state.orders[id];
        }
    },
    // BN stands for big number
    minPriceInBN(state, getters, _, rootGetters) {
        return (order) => {
            order = typeof order == "object" ? order : getters.orderById(id);
            if (!order) return;
            const token = order.erc20tokens;
            return toTokenAmount(order.min_price, token.decimal)
        }
    },
    priceInBN(state, getters, _, rootGetters) {
        return (order) => {
            order = typeof order == "object" ? order : getters.orderById(id);
            if (!order) return;
            const token = order.erc20tokens;
            return toTokenAmount(order.price, token.decimal)
        }
    },

}
