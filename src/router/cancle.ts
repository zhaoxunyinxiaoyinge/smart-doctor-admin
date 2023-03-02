import { RouteRecordRaw, RouteRecordName } from "vue-router";
import {routes} from "@/router/index";

/**
 * 
 * @param route {Array} 路由集合
 * @param _cache {Array} 要被缓存的路由集合
 * @return   string[]
 */
const filterKeepAlive = (_route: RouteRecordRaw[], _cache: RouteRecordName[]) => {
    _route.forEach(element => {
        element.meta?.keepAlive && element.name && _cache.push(element.name);
        element.children && element.children.length != 0 && filterKeepAlive(element.children, _cache);
    });
}

const _cachelist:string[]=[];
filterKeepAlive(routes,_cachelist);
export  {
    _cachelist
}



