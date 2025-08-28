<script lang="ts" setup>
import Logo from "@/layout/components/logo/index.vue";
import Aside from "@/layout/layoutTransverse/aside/index";
import Header from "@/layout/components/header/index.vue";
import RouteTag from "@/layout/components/routeTag/index.vue";
import { theme } from "@/store/theme";
import { userstore } from "@/store/expmle";
import RouteMain from "@/layout/components/main/index.vue";
import Cookies from "js-cookie";

const themes = theme();

const store = userstore();
const route = useRoute();

const breaList = reactive<Array<any>>([])

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

    let path = route.path;
    Cookies.set('current', path);
    let title: string = route.meta.title as string;
    let icon: string = route.meta.icon as string;
    let data = { path, title, icon };
    store.setRouteList(data);
})
</script>

<template>
  <div class="container">
    <el-header class="layout-transvers-header">
      <Logo
        :height="60"
        class="layout-transvers-logo"
      />
      <Aside class="layout-transvers-aside" />
      <Header class="layout-transvers-right" />
    </el-header>
    <route-tag />
    <section :class="['route-content', contenClass]">
      <RouteMain />
    </section>
    <footer
      v-if="themes.isFooter"
      class="bottom"
    >
      2025 © vite-Admin By zhaoxunyin Technology.
    </footer>
  </div>
</template>