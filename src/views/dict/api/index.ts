import { serve as request } from "@/serve/index";
const getDictList = (params: { page: number, pageSize: number } & object) => {
    return request({
        url: "/api/dict/list",
        method: "GET",
        params
    })
}

const getDictDetail = (params: { page: number, pageSize: number } & object) => {
    return request({
        url: "/api/dictdetail/list",
        method: "GET",
        params
    })
}

const postDict = (data: { mark: string, type: string }) => {
    return request({
        url: "/api/dict/add",
        method: "post",
        data
    })
}

const putDict = (data: any) => {
    return request({
        url: "/api/dict/edit",
        method: 'put',
        data
    })
}

const getDetial = (params: { id: number }) => {
    return request({
        url: "/api/dict/detail",
        method: "GET",
        params
    })
}

const DeleteDict = (id: number) => {
    return request({
        url: "/api/dict/del/" + id,
        method: 'DELETE'
    })
}

const getDictDetailDetail = (id: number) => {
    return request({
        url: "/api/dictdetail/detail",
        method: "get",
        params: { id }
    })
}

const putDictDetail=(data:object)=>{
    return request({
        url:"/api/dictdetail/edit",
        method:"PUT",
        data
    })
}

const delDictDetail=(id:number)=>{
    return request({
        url:"/api/dictdetail/del/"+id,
        method:"DELETE",
    })
}

const postDictDetail=(data:object)=>{
    return request({
        url:"/api/dictdetail/add",
        method:"POST",
        data
    })
}

export {
    getDictList,
    getDictDetail,
    postDict,
    putDict,
    getDetial,
    DeleteDict,
    getDictDetailDetail,
    putDictDetail,
    delDictDetail,
    postDictDetail
}