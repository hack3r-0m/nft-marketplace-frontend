export const action = {


    logout({ commit, dispatch }) {
        commit('user', null)
        commit('userId', null)
        commit('authToken', null)
        commit('address', null)
        dispatch('trunk/resetBalances', {}, { root: true })
        Vue.logger.stopTrack();
        dispatch('reset');
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
            commit('authToken', response.data.auth_token)
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
            const response = await getAxios().get('users/details')
            if (response.status === 200) {
                dispatch('login', response.data.data)
                return true;
            }
        } catch (err) {
            if (err.response.status === 401) {
                dispatch('logout');
            }
        }
        return false;
    },
}