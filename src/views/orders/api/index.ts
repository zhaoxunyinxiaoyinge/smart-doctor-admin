import { serve as request } from "@/serve/index";

const ORDER_API_URL = "/api/mobile/order";
const ORDER_ITEM_API_URL = "/api/mobile/order-item";
const USER_API_URL = "/api/mobile/user";

/**
 *  订单列表（orders 表，支持 orderNo 模糊 / userId / status 筛选）
 * @param params { page, pageSize, orderNo?, userId?, status? }
 * @returns
 */
export const getOrderPage = (params) => {
    return request({
        url: ORDER_API_URL,
        method: "get",
        params
    })
}

// 订单明细列表（order_items 表，按 orderId 查）
export const getOrderItems = (params) => {
    return request({
        url: ORDER_ITEM_API_URL,
        method: "get",
        params
    })
}

// 修改订单接口（body 走 snake_case：status / express_no / remark 等）
export const putOrderData = (data) => {
    return request({
        url: ORDER_API_URL,
        method: "put",
        data
    })
}

/**
 *  用户列表（users 表，用来做订单查询的「下单用户」下拉框）
 * @param params { page, pageSize }
 * @returns
 */
export const getUserPage = (params) => {
    return request({
        url: USER_API_URL,
        method: "get",
        params
    })
}
