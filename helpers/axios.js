import * as axios from "axios"

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
    // axiosInstance.interceptors.response.use(
    //     response => {
    //         return response
    //     },
    //     error => error
    // )

    return axiosInstance
}

export default axiosInstance
