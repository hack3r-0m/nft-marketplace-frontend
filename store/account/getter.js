export const getter = {
    account(state) {
        return state.account
    },
    userOrders(state) {
        return state.userOrders
    },
    favouriteOrders(state) {
        return state.favouriteOrders
    },
    totalMaticNft(state) {
        return state.totalMaticNft
    },
    totalMainNft(state) {
        return state.totalMainNft
    },
    totalUnreadOrderActivity(state) {
        return state.totalUnreadOrderActivity
    },
    pendingWithdrawals(state) {
        return state.pendingWithdrawals
    },
};

export default getter;
