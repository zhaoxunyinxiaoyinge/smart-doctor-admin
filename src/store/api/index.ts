import { serve as request } from "@/serve/index";
export const getMenu=(params:{id:number})=>{
    return request({
        url:"/api/menu/list",
        method:"get",
        params,
    })
}