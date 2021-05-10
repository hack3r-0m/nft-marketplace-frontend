import * as axios from "axios"
import { LOCAL_STORAGE } from "~/constants";
import { LocalStorage } from "~/utils";

export function initalizeAxios(options = {}) {
     
    const axiosInstance = axios.create(options)


    // Use request interceptor to add authorization header
    axiosInstance.interceptors.request.use(
        async config => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = LocalStorage.get(LOCAL_STORAGE.authToken);
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

