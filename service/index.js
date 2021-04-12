import Vue from "vue";
import { OrderService } from "./order_service";
import { TokenService } from "./token_service";
import { UserService } from "./user_service";

import axiosInstance from "~/helpers/axios";

const service = {
    order: new OrderService(axiosInstance),
    user: new UserService(axiosInstance),
    token: new TokenService(axiosInstance)
};

Vue.service = service;