import * as axios from "axios"
import { config as configStore } from "~/plugins/localstore"

// global axios object
let axiosInstance = null
const getToken = () => configStore.get("authToken") || null

export function initalizeAxios(options = {}) {
    axiosInstance = axios.create(options)


    // Use request interceptor to add authorization header
    axiosInstance.interceptors.request.use(
        async config => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = getToken()
            }
            return config
        },
        error => error
    )

    return axiosInstance
}

export default axiosInstance
