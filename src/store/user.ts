import { defineStore } from "pinia";
import names from "@/store/store.name";


interface userinfo {
    name:string,
    phone?:string,
    work?:string
}

 export  const userInfo=defineStore(names.INFO,{
 state:()=>{
    return {
        userinfo:<userinfo>{
            name:'xiaomei',
            phone:"17603016347",
            work:'前端工程师'
        }
    }
 }
})
