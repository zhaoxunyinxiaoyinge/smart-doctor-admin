import { serve as request } from "@/serve/index";

const GOODS_API_URL = "/api/goods";

export const getData = (params) => {
    return request({
        url: "/api/babaner",
        method: "get",
        params
    })
}

export const postData = (data) => {
    return request({
        url: "/api/babaner",
        method: "post",
        data
    })
}

export const putData = (data) => {
    return request({
        url: "/api/babaner",
        method: "put",
        data
    })
}

export const deleteData = (id) => {
    return request({
        url: "/api/babaner/" + id,
        method: "delete",
    })
}


export const getCategoryData=(params)=>{
    return request({
        url: "/api/category",
        method: "GET",
        params
    })
}

export const postCategoryData=(data)=>{
    return request({
        url: "/api/category",
        method: "POST",
        data
    })
}
export const putCategoryData=(data)=>{
    return request({
        url: "/api/category",
        method: "PUT",
        data
    })
}
export const deleteCategoryData=(id)=>{
    return request({
        url: "/api/category/"+id,
        method: "DELETE",
    })
}

export const getGoodsData=(params):any=>{
    return request({
        url: GOODS_API_URL,
        method: "GET",
        params
    })
}

export const postGoodsData = (data: Record<string, any>) => {
    return request({
        url: "/api/goods",
        method: "POST",
        data
    })
}
export const putGoodsData=(data)=>{
    return request({
        url: "/api/goods",
        method: "PUT",
        data
    })
}
export const deleteGoodsData=(id)=>{
    // This API endpoint is used to delete goods data from the server
    return request({
        url: "/api/goods/"+id,
        method: "DELETE",
    })
}


export const getHostData=(params)=>{
    return request({
        url:"/api/hots",
        method:"get",
        params
    })
}


export const postHostData=(data)=>{
    return request({
        url:"/api/hots",
        method:"post",
        data
    })
}
export const putHostData=(data)=>{
    return request({
        url:"/api/hots",
        method:"put",
        data
    })
}
export const deleteHostData=(id)=>{
    return request({
        url:"/api/hots/"+id,
        method:"delete",
        
    })
}