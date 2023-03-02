import { serve as request } from "@/serve/index";

const getDivision = (params: any) => {
    return request({
        url: "/api/divison/list",
        method: "GET",
        params
    })
}

const getDivsionDetail = (params: { id: number }) => {
    return request({
        url: "/api/divison/detail",
        method: "GET",
        params
    })
}

const postDivison = (data: any) => {
    return request({
        url: "/api/divison/add",
        method: 'POST',
        data
    })
}

const putDivison = (data: any) => {
    return request({
        url: "/api/divison/edit",
        method: "PUT",
        data
    })
}

const deleteDivsion = (id: number) => {
    return request({
        url: "/api/divison/del/" + id,
        method: 'delete'
    })
}

export {
    getDivision,
    getDivsionDetail,
    postDivison,
    putDivison,
    deleteDivsion
}