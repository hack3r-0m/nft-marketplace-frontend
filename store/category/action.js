import Vue from "vue";

export const action = {
    async fetchCategories({ commit, rootState }) {
        const response = await Vue.service.category.getCategories();
        const categoriesFromResponse = response.data.data.categories;
        if (response.status === 200 && categoriesFromResponse) {
            const networks = rootState["network"].networks
            const maticChainId = networks.matic.chainId;
            const categories = categoriesFromResponse.map((item) => {
                item.img_url = `${Vue.appConfig.apis.FILE_HOST}${item.img_url}`;
                const chainAddress = {};
                item.categoriesaddresses.forEach(q => {
                    chainAddress[q.chain_id] = q.address;
                })
                item.chainAddress = chainAddress;
                item.count = item.orders;
                const addressInfo = chainAddress[maticChainId];
                if (addressInfo) {
                    item.maticAddress = addressInfo
                }
                item.maticTokens = {}
                item.mainTokens = {}
                return item;
            })

            commit('categories', categories)
            commit('SET_ALL_CATEGORY');
        }
    },
};
export default action;
