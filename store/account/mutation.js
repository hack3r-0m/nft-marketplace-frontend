import { initialState } from "./state";
export const mutation = {
    account(state, account) {
        state.account = account
    },
    userOrders(state, orders) {
        state.userOrders = orders
    },
    favouriteOrders(state, orders) {
        state.favouriteOrders = orders
    },
    totalMaticNft(state, num) {
        state.totalMaticNft = num
    },
    totalMainNft(state, num) {
        state.totalMainNft = num
    },
    totalUnreadOrderActivity(state, num) {
        state.totalUnreadOrderActivity = num
    },
    pendingWithdrawals(state, transactions) {
        state.pendingWithdrawals = transactions
    },
    RESET(state) {
        Object.assign(state, initialState())
    }
};
export default mutation;
