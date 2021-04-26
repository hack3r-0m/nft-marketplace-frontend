export const getter = {
    orderById(state) {
        return (id) => {
            return state.orders[id];
        }
    }
}
