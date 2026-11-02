import { serve as request } from "@/serve/index";

const API_URL = "/api/mobile/review";

/** 评价分页列表（筛选：goodsId / rate / userId / userName / content） */
export const getCommentPage = (params) => {
    return request({
        url: API_URL,
        method: "get",
        params
    })
}

/** 删除评价（后端用 query 传 id） */
export const deleteCommentData = (id) => {
    return request({
        url: API_URL,
        method: "delete",
        params: { id }
    })
}

/** 用户列表（下拉框数据源） */
export const getUserPage = (params) => {
    return request({
        url: "/api/mobile/user",
        method: "get",
        params
    })
}

/** 商品列表（下拉框数据源） */
export const getGoodsPage = (params) => {
    return request({
        url: "/api/mobile/goods",
        method: "get",
        params
    })
}
