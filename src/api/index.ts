import { serve as request } from "@/serve/index";

export const logout = (): Promise<{ code: number, data: object, message: string } & any> => {
    return request({
        url: "/api/user/logout",
        method: "GET"
    })
}

export const exportData = (params) => {
    return request({
        url: params.url,
        method: "get",
        params: params.query,
        responseType: 'blob'
    })
}


export const upload=(data)=>{
    return request({
        url:"/api/common/stream",
        method:'post',
        headers: {
            'Content-Type': 'multipart/form-data'
          },
        data
    })
}