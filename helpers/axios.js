import * as axios from "axios"

export function initalizeAxios(options = {}) {
    const { STORE } = require("~/store");
    const axiosInstance = axios.create(options)


    // Use request interceptor to add authorization header
    axiosInstance.interceptors.request.use(
        async config => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = STORE.state["auth/token"]
            }
            return config
        },
        error => error
    )
    // axiosInstance.interceptors.response.use(
    //     response => {
    //         return response
    //     },
    //     error => error
    // )

    return axiosInstance
}

