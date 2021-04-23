export const mutation = {
    categories(state, categories) {
        state.categories = categories
    },
    addUsersMaticCount(state, categories) {
        for (let i = 0; i < state.categories.length; i++) {
            state.categories[i].maticCount =
                categories[state.categories[i].maticAddress.toLowerCase()]
        }
    },
    addUsersMainCount(state, categories) {
        for (let i = 0; i < state.categories.length; i++) {
            state.categories[i].mainCount =
                categories[state.categories[i].mainAddress]
        }
    },
};
