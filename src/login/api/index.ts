import {serve as request} from "@/serve/index";

export const login=(data:any)=>{
    return request({
        method:'post',
        url:"/api/user/login",
        data
    })
}

export const getCatcha=()=>{
    return request({
        method:"get",
        url:"/api/user/catcha"
    })
}