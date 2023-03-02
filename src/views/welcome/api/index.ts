import { serve as request } from "@/serve/index";

export const getUser = (params: { page: number, pageSize: number }) => {
   return request({
      url: "/api/user/list",
      method: "GET",
      params
   })
}

export const getRoleUser = (params: object) => {
   return request({
      url: "/api/role_user/list",
      method: "GET",
      params
   })
}

export const postUser=(data:any)=>{
   return request({
      url:"/api/user/add",
      method:"post",
      data
   })
}


export const putUser=(data:any)=>{
   return request({
      url:"/api/user/edit",
      method:"put",
      data
   })
}


export const deleteUser=(id:number)=>{
      return request({
         url:"/api/user/del/"+id,
         method:"delete"
      })
}