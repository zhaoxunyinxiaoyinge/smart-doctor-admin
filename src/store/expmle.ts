
import { defineStore } from "pinia";
import names from "./store.name";
import { login } from "@/login/api/index";
import Cookies from "js-cookie";
import { getMenu } from "@/store/api/index";
import { jsonToTree } from "@/utils/common";
import Layout from "@/layout/index.vue";
import _, { template } from "lodash";
import { Component } from "vue";
import { RouteRecordRaw } from "vue-router";

export interface RouteList {
    title: string,
    path: string,
    icon: string
}

export interface MenuList {
    id: number,
    parentId: number,
    path: string,
    children?: MenuList[],
    names: string,
    meta?: {
        title: string,
        icon: string,
        hidden: boolean
    },
    title?: string,
    basePath?: string
}

export const userstore = defineStore(names.USER, {
    state() {
        return {
            isCollapse: <boolean>(false),
            routeList: reactive<Array<RouteList>>([]),
            token: <string>('') || Cookies.get("token"),
            lang: <string>(Cookies.get("lang") || 'zh'),
            size: <'' | 'small' | 'large' | 'default'>('default'),
            menuList: <MenuList[]>[],//生成得菜单
            routers: reactive<(RouteRecordRaw)[]>([]),//生成的路由
            perssions: <string[]>[],
            allMenuList: <MenuList[]>[],
            currentRoute: ref<string>(Cookies.get('current')||'/welcome')
        }
    },

    getters: {
        getCollapseValue(): boolean {
            return this.isCollapse
        }
    },

    actions: {
        setCollapseValue(val: boolean) {
            this.isCollapse = val;
        },

        clearToken() {
            this.token = "";
            Cookies.set("token", "");
        },
        /**
         * 
         * @param {username,password} 
         * 
         */
        async login(username: string, password: string): Promise<any> {
            return login({ userName: username, passWord: password }).then(res => {
                return Promise.resolve({ ...res });
            })
        },

        /**
         * 
         * @param size:string
         * 
         */

        setSize(size: any) {
            this.size = size;
        },

        setRouteList(val: RouteList): void {
            const index = this.routeList.findIndex(item => item.path == val.path);
            if (index == -1) {
                if (this.routeList.length == 10) {
                    this.routeList.shift();
                }
                this.routeList.push(val);
            }
        },

        deleteRouteItem(val: RouteList) {
            const index = this.routeList.findIndex(item => item.path == val.path);
            if (index !== -1) {
                this.routeList.splice(index, 1);
            }
        },

        setCurrentLang() {
            this.lang = this.lang == "zh" ? 'en' : 'zh';
        },

        async getMenuList(id: number) {
            return getMenu({ id }).then(res => {
                const data = res.data.filter((item: any) => item.isMenu !== 2);
                const perssionsList = res.data.filter((item: any) => item.isMenu === 2);
                const buttonData = _.cloneDeep(res.data);
                const allMenuList = jsonToTree(buttonData, "id");
                this.allMenuList = allMenuList

                this.setPerssions(perssionsList);
                const menuList = jsonToTree(data, "id");
                const routeList = this.filterAsyncRoutes(menuList);
                this.menuList = menuList;
                this.routers = routeList;
                return Promise.resolve(true);
            });
        },


        setPerssions(list: Array<any>) {
            list.forEach(item => {
                if (item.perssion) {
                    this.perssions.push(item.perssion);
                }
            })
        },

        filterAsyncRoutes(routes: { hidden: boolean, component: string | Component, parentId: number, children?: any, routePath: string, menuName: string, icon: string }[]) {
            const res: RouteRecordRaw[] = [];
            routes.forEach(route => {
                const tmp: any = {
                    ...route,
                };

                if (tmp.parentId == 0&&(tmp.component=='layout'||tmp.component=='')) {
                    tmp.component = Layout;
                }

                if (tmp.component && tmp.parentId != 0) {
                    const componentPath = typeof tmp.component == 'string' ? _.cloneDeep(tmp.component) : "";
                    tmp.component = this.loadView(componentPath);
                }
                
                if(tmp.component&&tmp.parentId==0&&tmp.component!==Layout){
                    const componentPath = typeof tmp.component == 'string' ? _.cloneDeep(tmp.component) : "";
                    tmp.component = this.loadView(componentPath);
                }

                tmp.meta.title = tmp.menuName;
                tmp.meta.icon = tmp.icon;
                tmp.meta.hidden = tmp.hidden;
                tmp.name = tmp.names;
                delete tmp.menuName;
                delete tmp.routePath;
                delete tmp.names;
                delete tmp.id;
                delete tmp.icon;
                delete tmp.hidden;
                delete tmp.isMenu;
                delete tmp.isOutLink;
                delete tmp.orderNum;
                delete tmp.status;

                if (tmp.children && tmp.children.length > 0) {
                    tmp.children = this.filterAsyncRoutes(_.cloneDeep(tmp.children));
                }
                res.push(tmp);
            });
            return res;
        },

        loadView(componentName: string) {
            return defineAsyncComponent(() => import(/* @vite-ignore */"./.." + componentName + ".vue"));
        }
    }

})