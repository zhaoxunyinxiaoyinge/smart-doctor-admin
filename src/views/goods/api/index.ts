import { serve as request } from "@/serve/index";

export const getData = (params: ({}) & { page: number, pageSize: number }) => {
    return request({
        url: "/api/babaner",
        method: "GET",
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
export const deleteCategoryData=(params)=>{
    return request({
        url: "/api/category",
        method: "DELETE",
        params
    })
}

export const getGoodsData=(params)=>{
    return request({
        url: "/api/goods",
        method: "GET",
        params
    })
}

export const postGoodsData=(data)=>{
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
export const deleteGoodsData=(data)=>{
    return request({
        url: "/api/goods",
        method: "DELETE",
        data
    })
}
