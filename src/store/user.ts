import { defineStore } from "pinia";
import names from "@/store/store.name";


export  interface userinfos {
    name:string,
    phone?:string,
    work?:string,
    avatar?:string,
    id:number
}


 export  const userInfo=defineStore(names.INFO,{
 state:()=>{
    return {
        userinfo:<userinfos>{
            name:"",
            phone:"",
            work:"",
            avatar:"",
            id:0
        }
    }
 },
 actions:{
    /**
     * 
     * @param obj {name,phone,work}
     */
    setUserInfo(obj:{name:string,phone?:string,work?:string,avatar:string,id:number}){
        const {name,phone,work,avatar,id}=obj;
        this.userinfo.name=name;
        this.userinfo.phone=phone;
        this.userinfo.work=work;
        this.userinfo.avatar=avatar
        this.userinfo.id=id;
    }
 }
})
