import { serve as request } from "@/serve/index";

const GOODS_API_URL = "/api/mobile/goods";
const CATEGORY_API_URL="/api/mobile/category"

const BANNER_API_URL = "/api/mobile/banner";

/**
 *  轮播图列表（ai-node-serves banners 表，支持 title/status 筛选）
 * @param params { page, pageSize, title?, status? }
 * @returns
 */
export const getBannerData = (params) => {
    return request({
        url: BANNER_API_URL,
        method: "get",
        params
    })
}

//轮播添加接口（字段：image/goodsId/title/subTitle/sort/status）
export const postBannerData = (data) => {
    return request({
        url: BANNER_API_URL,
        method: "post",
        data
    })
}

//修改轮播页面接口
export const putBannerData = (data) => {
    return request({
        url: BANNER_API_URL,
        method: "put",
        data
    })
}

// 删除轮播页面接口（后端用 query 传 id）
export const deleteBannerData = (id) => {
    return request({
        url: BANNER_API_URL,
        method: "delete",
        params: { id }
    })
}


//新增分类接口
export const postCategoryMobileData=(data)=>{
    return request({
        url:CATEGORY_API_URL,
        method:"POST",
        data
    })
}

//修改分类接口
export const putCategoryMobileData=(data)=>{
    return request({
        url:CATEGORY_API_URL,
        method:"PUT",
        data
    })
}

//删除分类接口（后端用 query 传 id）
export const deleteCategoryMobileData=(id)=>{
    return request({
        url:CATEGORY_API_URL,
        method:"DELETE",
        params: { id }
    })
}

// 商品列表接口
export const getGoodsData=(params):any=>{
    return request({
        url: GOODS_API_URL,
        method: "GET",
        params
    })
}

//新增获取商品分类接口（新移动端数据库）
export const getCategoryMobileData=(params)=>{
    return request({
        url:CATEGORY_API_URL,
        method:"GET",
        params
    })
}

//商品新增接口
export const postGoodsData = (data: Record<string, any>) => {
    return request({
        url:GOODS_API_URL,
        method: "POST",
        data
    })
}

// 商品详情接口（主表 + 图集/规格/详情三张子表，编辑弹框回填用）
export const getGoodsDetailData = (id: number | string) => {
    return request({
        url: GOODS_API_URL + "/detail",
        method: "GET",
        params: { id }
    })
}

// 商品修改接口
export const putGoodsData=(data)=>{
    return request({
        url: GOODS_API_URL,
        method: "PUT",
        data
    })
}

//商品删除接口（后端用 query 传 id）
export const deleteGoodsData=(id)=>{
    return request({
        url: GOODS_API_URL,
        method: "DELETE",
        params: { id }
    })
}

const HOT_KEYWORD_API_URL = "/api/mobile/hot-keyword";

/**
 *  热搜词列表（hot_keywords 表，支持 keyword/status 筛选）
 * @param params { page, pageSize, keyword?, status? }
 * @returns
 */
export const getHotKeywordPage = (params) => {
    return request({
        url: HOT_KEYWORD_API_URL,
        method: "get",
        params
    })
}

//新增热搜词接口（字段：keyword/sort/status）
export const postHotKeywordData = (data) => {
    return request({
        url: HOT_KEYWORD_API_URL,
        method: "post",
        data
    })
}

//修改热搜词接口
export const putHotKeywordData = (data) => {
    return request({
        url: HOT_KEYWORD_API_URL,
        method: "put",
        data
    })
}

// 删除热搜词接口（后端用 query 传 id）
export const deleteHotKeywordData = (id) => {
    return request({
        url: HOT_KEYWORD_API_URL,
        method: "delete",
        params: { id }
    })
}

const COUPON_API_URL = "/api/mobile/coupon";

/**
 *  优惠券列表（coupons 表，支持 name 模糊 / status 筛选）
 * @param params { page, pageSize, name?, status? }
 * @returns
 */
export const getCouponPage = (params) => {
    return request({
        url: COUPON_API_URL,
        method: "get",
        params
    })
}

// 新增优惠券接口（字段：name/amount/threshold/status）
export const postCouponData = (data) => {
    return request({
        url: COUPON_API_URL,
        method: "post",
        data
    })
}

// 修改优惠券接口
export const putCouponData = (data) => {
    return request({
        url: COUPON_API_URL,
        method: "put",
        data
    })
}

// 删除优惠券接口（后端用 query 传 id）
export const deleteCouponData = (id) => {
    return request({
        url: COUPON_API_URL,
        method: "delete",
        params: { id }
    })
}