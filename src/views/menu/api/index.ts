import { serve as request } from "@/serve/index";

export const getMenuList = (params: ({}) & { page: number, pageSize: number }) => {
    return request({
        url: "/api/menu/all",
        method: "GET",
        params
    })
}

export const postMenu = (data: any) => {
    return request({
        url: '/api/menu/add',
        method: 'POST',
        data
    })
}

export const putMenu = (data: any) => {
    return request({
        url: '/api/menu/edit',
        method: 'put',
        data
    })
}


export const deleteMenu = (id: number) => {
    return request({
        url: "/api/menu/del/" + id,
        method: 'DELETE'
    })
}

export const getDetail = (params: { id: number }) => {
    return request({
        url: "/api/menu/detail",
        method: 'GET',
        params
    })
}