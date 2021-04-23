export const initialState = () => {
    return {
        account: null,
        userOrders: null,
        favouriteOrders: null,
        totalMaticNft: 0,
        totalMainNft: 0,
        totalUnreadOrderActivity: 0,
        pendingWithdrawals: [],
    }
};

export const state = initialState();
