import { defineStore } from "pinia";
import names from "@/store/store.name";


interface userinfo {
    name:string,
    phone?:number,
    work?:string,
    avatar?:string
}

 export  const userInfo=defineStore(names.INFO,{
 state:()=>{
    return {
        userinfo:<userinfo>{}
    }
 },
 actions:{
    /**
     * 
     * @param obj {name,phone,work}
     */
    setUserInfo(obj:{name:string,phone:number,work:string,avatar:string}){
        const {name,phone,work,avatar}=obj;
        this.userinfo.name=name;
        this.userinfo.phone=phone;
        this.userinfo.work=work;
        this.userinfo.avatar=avatar
    }
 }
})
