import Vue from "vue";
import { OrderService } from "./order_service";
import { TokenService } from "./token_service";
import { UserService } from "./user_service";
import { initalizeAxios } from "~/helpers/axios";
import { CategoryService } from "./category_service";

export default function initService() {
    // initialize axios
    const axiosInstance = initalizeAxios({
        baseURL: Vue.appConfig.apis.MARKETPLACE_API_HOST,
    });

    const service = {
        order: new OrderService(axiosInstance),
        user: new UserService(axiosInstance),
        token: new TokenService(axiosInstance),
        category: new CategoryService(axiosInstance),
    };

    Vue.service = service;
}
