import Vue from "vue";
import AccountModel from '~/components/model/account'

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

        const response = await Vue.service.user.login(payload);
        const user = response.data.data;
        if (response.status === 200 && user) {
            dispatch("initUser", {
                loginStrategy: payload.loginStrategy,
                authToken: response.data.auth_token,
                user: user,
            })
        }
        return null
    },

    async initUser({ dispatch, commit, getters }, { loginStrategy, authToken, user, }) {
        commit('setLoginStrategy', loginStrategy)
        commit('setToken', authToken)
        commit('setUser', user);
        commit('account/account', new AccountModel({
            address: user.address
        }),
            {
                root: true
            }
        )
        await dispatch('token/reloadBalances', null, { root: true });
        await dispatch('account/fetchActiveOrders', null, { root: true });
        await dispatch('account/fetchFavoritesOrders', null, { root: true });
        Vue.logger.initTrack({ address: getters['address'] })
    },

    async getConfig({ dispatch }) {
        try {
            const response = await Vue.service.user.getDetails();
            const user = response.data.data;
            if (response.status === 200 && user) {
                dispatch("initUser", {
                    loginStrategy: payload.loginStrategy,
                    authToken: response.data.auth_token,
                    user: user,
                })
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
