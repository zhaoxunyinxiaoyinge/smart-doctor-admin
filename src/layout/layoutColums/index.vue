<script lang="ts" setup>
import { Component } from "vue";
import SvgIcon from "@/components/icons/svg-icon.vue";
import Header from "@/layout/components/header/index.vue";
import RouteTag from "@/layout/components/routeTag/index.vue";
import Crumbs from "@/layout/components/crumbs/index.vue";
import Aside from "@/layout/layoutColums/aside/index";
import { userstore } from "@/store/expmle"
import type { InjectionKey } from 'vue'
import RouteMain from "@/layout/components/main/index.vue";

import { theme } from "@/store/theme";
import Cookies from "js-cookie";
import path from "path";

type List = {
    path: string,
    children?: Array<List>;
    basePath?: string,
    meta: {
        title: string;
        hidden: boolean;
        icon?: string
    };
    component?: Component;
    redirect?: string;
    levelT?: string
};


const breaList = reactive<any>([]);

const router = useRouter();

const route = useRoute();

const store = userstore();

const activeManMenu = ref('');

const key = Symbol("breakList") as InjectionKey<string>

provide('breakList', breaList);

const themes = theme();

const mainList = computed(() => {
    return store.menuList.map((item) => {
        if (item.children && item.children.length > 1) {
            return { path: item.path, meta: item.meta, children: item.children, levelT: item.path }
        } else if (item.children && item.children.length == 1) {
            return {
                path: item.children[0].path,
                meta: item.children[0].meta,
                children: item.children[0].children,
                levelT: path.resolve(item.path, item.children[0].path),
                basePath: item.path
            }
        } else {
            return "";
        }
    })
})

const contenClass = computed(() => {
    if (!themes.tabbar && !themes.isFooter) {
        return "route-list-and-footer-none"
    } else if (!themes.tabbar) {
        return "route-list-none"
    } else if (!themes.isFooter) {
        return "footer-none"
    } else {
        return ""
    }
})

const activeMainMenuList = computed(() => {
    let route: any[] = [];
    mainList.value.length > 0 && mainList.value.forEach(items => {
        if (items && activeManMenu.value === (items.levelT) && items.path != '/') {
            activeManMenu.value = items.levelT;
            items.children && route.push(...items.children);
        } else if (activeManMenu.value == '/' && items && items.path == '/') {
            items.children && items.children.forEach((sItem) => {
                sItem.basePath = items.levelT as string
            })
            items.children && route.push(...items.children);
        }
    })
    return route;
})

const handleMenu = (val: List) => {
    activeManMenu.value = val.levelT as string;
    if (val.children && val.children.length == 0 || !val.children) {
        val.levelT && router.push(val.levelT);
    }
}

watchEffect(() => {
    let len = breaList.length;
    breaList.splice(0, len,)
    route.matched && route.matched.forEach(element => {
        if (element.meta.hidden && !breaList.includes(element.path)) {
            breaList.push(element)
        }
    });
    const path = route.path;
    Cookies.set('current', path);
    let title: string = route.meta.title as string;
    let icon: string = route.meta.icon as string;
    let data = { path, title, icon };
    store.setRouteList(data);
})

</script>
<template>
    <div class="layout-columns-container">
        <div class="layout-columns-main-menu">
            <div class="layout-columns-img">
                <el-image style="height:60px" :fit="'contain'"
                    src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi-1.lanrentuku.com%2F2020%2F11%2F6%2F9232f107-4dac-4006-9c7e-e825df5e52e1.png%3FimageView2%2F2%2Fw%2F500&refer=http%3A%2F%2Fi-1.lanrentuku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659237413&t=b141420c6ec2506048d76681aa122469" />
            </div>
            <div :key="sIndex" v-for="(sItem, sIndex) in (mainList as Array<List>) "
                :class="['layout-columns-menu-item', activeManMenu == sItem.levelT ? 'layout-column-active' : '']"
                @click="handleMenu(sItem)">
                <svg-icon class="icons" :names="(sItem.meta.icon as string)"></svg-icon>
                <span class="layout-columns-title">{{ sItem.meta.title }}</span>
            </div>
        </div>
        <div class="layout-columns-right">
            <Aside class="layout-columns-aside" :menuList="activeMainMenuList" v-if="activeMainMenuList.length > 0">
            </Aside>
            <div class="layout-column-content">
                <div class="layou-columns-header">
                    <Crumbs></Crumbs>
                    <Header></Header>
                </div>
                <route-tag></route-tag>

                <section :class="['route-content', contenClass]">
                    <RouteMain></RouteMain>
                </section>
                <footer class="bottom" v-if="themes.isFooter">
                    2022 © vite-Admin By zhaoxunyin Technology.3
                </footer>

            </div>

        </div>
    </div>
</template>

<style scoped>
.layout-columns-menu-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 50px;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.icons+span {
    margin-left: 0;
}
</style>
