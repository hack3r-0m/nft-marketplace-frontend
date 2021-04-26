export const getter = {
    orderById(state) {
        return (id) => {
            return state.orders.find(q => q.id == id);
        }
    }
}
