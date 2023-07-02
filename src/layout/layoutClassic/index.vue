<script setup lang="ts">
import Header from "@/layout/components/header/index.vue";
import LoGo from "@/layout/components/logo/index.vue";
import Aside from "@/layout/layoutClassic/aside/index";
import RouteTag from "@/layout/components/routeTag/index.vue";
import Crumbs from "@/layout/components/crumbs/index.vue";
import RouteMain from "@/layout/components/main/index.vue";
import Cookies from "js-cookie";

import { theme } from "@/store/theme";
import { userstore } from "@/store/expmle"
const themes = theme();
const store = userstore();
let route = useRoute();
const breaList = reactive<any>([]);

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

watchEffect(() => {
    let len = breaList.length;
    breaList.splice(0, len,)
    route.matched && route.matched.forEach(element => {
        if (!element.meta.hidden && !breaList.includes(element.path)) {
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
  <div class="classic-container">
    <el-header class="classic-header">
      <div class="classic-header-left">
        <lo-go :height="60" />
        <Crumbs />
      </div>
      <Header />
    </el-header>
    <el-main class="classic-main">
      <el-aside class="aside">
        <Aside />
      </el-aside>
      <div class="classic-right">
        <RouteTag />
        <section :class="['route-content', contenClass]">
          <RouteMain />
        </section>
        <footer
          v-if="themes.isFooter"
          class="bottom"
        >
          2022 © vite-Admin By zhaoxunyin Technology.
        </footer>
      </div>
    </el-main>
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/layout.module.scss";
</style>