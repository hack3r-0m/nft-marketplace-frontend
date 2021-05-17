import { Order } from '~/models';

export const mutation = {
    ADD_ORDER(state, order) {
        state.orders.push(new Order(order));
    },
    REMOVE_ORDER(state, order) {
        const i = state.orders.findIndex(q => q.id === order.id);
        if (i >= 0) {
            state.orders.splice(i, 1);
        }
    },
    RESET_ORDERS(state) {
        state.orders = [];
    }

}
