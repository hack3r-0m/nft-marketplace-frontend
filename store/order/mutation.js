export const mutation = {
    ADD_ORDER(state, order) {
        order.token = { owner: order.seller_users?.address, ...order.tokens };
        order.erc20TokenId = order.erc20tokens.id;
        state.orders[order.id] = order;
    }
}
