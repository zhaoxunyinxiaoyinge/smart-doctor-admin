import {serve as request} from "@/serve/index";

export const login=(data:any)=>{
    return request({
        method:'post',
        url:"/api/user/login",
        data
    })
}