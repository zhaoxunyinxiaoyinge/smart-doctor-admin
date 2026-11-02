
import { defineStore } from "pinia";
import names from "./store.name";
import { login } from "@/login/api/index";
import Cookies from "js-cookie";
import { getMenu } from "@/store/api/index";
import { jsonToTree } from "@/utils/common";
import Layout from "@/layout/index.vue";
import _ from "lodash";
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
            routeList: <Array<RouteList>>[],
            token: Cookies.get("token")||<string>(''),
            lang: <string>(Cookies.get("lang") || 'zh'),
            size: <'' | 'small' | 'large' | 'default'>('default'),
            menuList: <MenuList[]>[],//生成得菜单
            routers: <(RouteRecordRaw)[]>([]),//生成的路由
            perssions: <string[]>[],
            allMenuList: <MenuList[]>[],
            currentRoute:<string>(Cookies.get('current')||'/welcome')
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

        clearMenuList(){
            this.$reset();
        },

        setToken(token: string) {
            this.token = token;
            Cookies.set("token", token);
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
                const perssionsList = res.data.filter((item: any) => item.isMenu === 2&&item.status===1);
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
          const modules = import.meta.glob([
                '/src/views/**/*.vue',
                '!/src/views/**/components/**',   // 局部组件目录
                '!/src/views/**/*.spec.vue',
                ]);
            const res: RouteRecordRaw[] = [];
            routes.forEach(route => {
                const tmp: any = {
                    ...route,
                };

                if (tmp.component === null || tmp.component === undefined || tmp.component === '' || tmp.component === 'layout') {
                    tmp.component = Layout;
                }

                const wrapLayout = tmp.parentId == 0 && typeof tmp.component === 'string' && !tmp.isOutLink;

                if (typeof tmp.component === 'string') {
                    tmp.component =this.loadviewPath(_.cloneDeep(tmp.component),modules);
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

                if (wrapLayout) {
                    tmp.children = [{ ...tmp, path: '', name: undefined }];
                    tmp.component = Layout;
                }
                res.push(tmp);
            });
            return res;
        },

        loadviewPath(componentName:string,modules){
            const componentPath=`/src${componentName}.vue`;
            return modules[componentPath]??(() => defineAsyncComponent(() => import('@/views/notFound/notFound.vue'))); 
        }

    }

})