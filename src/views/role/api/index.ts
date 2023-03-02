import { serve as request } from "@/serve/index";
const getRoleList = (params: any) => {
    return request({
        url: "/api/role/list",
        method: "GET",
        params
    })
}

const postRole = (data: any) => {
    return request({
        url: "/api/role/add",
        method: 'POST',
        data
    })
}

const deleteRole = (id: number) => {
    return request({
        url: "/api/role/del/" + id,
        method: 'DELETE'
    })
}

const getDetail = (params: { id: number }) => {
    return request({
        url: "/api/role/detail",
        method: "GET",
        params
    })
}

const updateRole=(data:object)=>{
    return request({
        url:"/api/role/update",
        method:'PUT',
        data
    })
}

export {
    getRoleList,
    postRole,
    deleteRole,
    getDetail,
    updateRole
}