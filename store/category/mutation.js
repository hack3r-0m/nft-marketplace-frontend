import Vue from "vue";

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
    SET_ALL_CATEGORY(state) {
        const allCategory = state.allCategory
        allCategory.count =
            state.categories.reduce(
                (total, item) => total + (parseInt(item.count) || 0),
                0,
            ) || 0
        allCategory.maticCount =
            state.categories.reduce(
                (total, item) => total + Object.keys(item.maticTokens).length,
                0,
            ) || 0
        allCategory.mainCount =
            state.categories.reduce(
                (total, item) => total + (parseInt(item.mainCount) || 0),
                0,
            ) || 0
        Vue.set(state, 'allCategory', allCategory);
    },
    UPDATE_CATEGORY(state, category) {
        const index = state.categories.findIndex(q => q.id === category.id);
        if (index < 0) return;
        Vue.set(state.categories, index, category);
    }
};
