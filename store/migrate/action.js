import Vue from "vue";

export const action = {
  async transferFromEthereumToMatic(_, payload) {
    const response = await Vue.service.migrate.transferFromEthereumToMatic(payload);
    if (response.status === 200) {
        return response.data
    }
  },

  async checkForTransactionInclusion(_, payload) {
    const response = await Vue.service.migrate.checkForTransactionInclusion(payload);
    if (response.status === 200) {
        return response.data
    }
  },

  async burnTransaction(_, payload) {
    const response = await Vue.service.migrate.burnTransaction(payload);
    if (response.status === 200) {
      return response.data
    }
  },

  async updateTransactionStatusToCheckpointed(_, payload) {
    const response = await Vue.service.migrate.updateTransactionStatusToCheckpointed(payload);
    if (response.status === 200) {
        return true
    }

    return false
  },

  async updateTransactionStatusToExited(_, payload) {
    const response = await Vue.service.migrate.updateTransactionStatusToExited(payload);
    if (response.status === 200) {
        return true
    }

    return false
  }
}

export default action;
