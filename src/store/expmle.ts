
import { defineStore } from "pinia";
import names from "./store.name";

export interface RouteList {
    title: string,
    path: string,
    icon:string
}

export const userstore = defineStore(names.USER, {
    state() {
        return {
            isCollapse: <Boolean>(false),
            routeList: <Array<RouteList>>[],
            token: <string>(''),
            lang: <string>('en'),
            size:<''|'small'|'large'|'default'>('small')
        }
    },

    getters: {
        getCollapseValue(): Boolean {
            return this.isCollapse
        }
    },

    actions: {
        setCollapseValue(val: Boolean) {
            this.isCollapse = val;
        },

        clearToken() {
            this.token = "";
        },
        /**
         * 
         * @param {username,password} 
         * 
         */
        async login(username:string,password:string):Promise<{code:number,token:string}> {
            return  new Promise((resolve,reject)=>{
                resolve({token:'erjwerkerkwejfkfjskf',code:0})
            })
        },

        /**
         * 
         * @param size:string
         * 
         */

        setSize(size:any){
            this.size=size;
        },

        setRouteList(val: RouteList): void {
            let index = this.routeList.findIndex(item => item.path == val.path);
            if (index == -1) {
                if (this.routeList.length > 10) {
                    this.routeList.shift();
                }
                this.routeList.push(val);
            }
        },

        deleteRouteItem(val: RouteList) {
            let index = this.routeList.findIndex(item => item.path != val.path);
            if (index !== -1) {
                this.routeList.splice(index, 1);
            }
        },

        setCurrentLang() {
            this.lang = this.lang == "zh-cn" ? 'en' : 'zh-cn';
        }
    }

})