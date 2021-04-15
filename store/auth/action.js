import Vue from "vue";
export const action = {
    reset({ commit }) {
        commit("reset");
    },

    logout({ dispatch }) {
        dispatch('reset');
        dispatch('trunk/resetBalances', {}, { root: true })
        Vue.logger.stopTrack();
    },

    // do login
    async doLogin({ dispatch, commit }, payload) {
        if (!payload || !payload.address || !payload.signature) {
            console.log('User addresss and Signature is required for login')
            return
        }

        const response = await getAxios().post('users/login', payload)
        const user = response.data.data;
        if (response.status === 200 && user) {
            // Store auth token to local store and add user
            commit('setLoginStrategy', payload.loginStrategy)
            commit('setToken', response.data.auth_token)
            commit('user', user)
            if (user) {
                commit('address', user.address)
            } else {
                commit('address', null)
            }
            app.initNetworks(app.vuexStore)
            app.initAccount(app.vuexStore)
        }

        return null
    },

    async checkLogin({ dispatch }) {
        try {
            const response = await Vue.service.user.getDetails();
            if (response.status === 200) {
                dispatch('login', response.data.data)
                return true;
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                dispatch('logout');
            }
        }
        return false;
    },
}