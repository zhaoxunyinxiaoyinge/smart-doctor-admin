<template>
  <div class="content">
    <el-aside class="aside">
      <el-scrollbar height="100vh">
        <section
          class="flex justifly-center align-items "
          style="text-align: center;padding: 0;margin:0;height: 69px; border-bottom: 1px solid #eee;"
        >
          <el-image
            style="width:40px"
            :fit="'contain'"
            src="/lion.png"
          />
          <span
            v-if="!store.isCollapse"
            class="white"
          >医疗智慧系统</span>
        </section>
        <side-bar />
      </el-scrollbar>
    </el-aside>
    <el-main class="main">
      <div class="header">
        <Header />
        <!-- 路由导航，和展开栏 ,面包屑-->
        <section class="breaum">
          <el-icon
            id="hamburger-collapse"
            :size="24"
            style="margin-left: -20px; margin-right: 20px"
            @click="toggle"
          >
            <Expand />
          </el-icon>
          <el-breadcrumb
            v-if="themes.isBrearum"
            id="hamburger-container"
            class="hamburger-container"
          >
            <el-breadcrumb-item
              v-for="item in breaList"
              :key="item.path"
              :to="{ path: item.path }"
            >
              {{
                item.meta.title
              }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </section>
      </div>

      <!-- <section class='route-list' v-if="themes.tabbar"> -->
      <route-tag />
      <!-- </section> -->

      <section :class="['route-content', contenClass]">
        <RouteMain />
      </section>
      <footer
        v-if="themes.isFooter"
        class="bottom"
      >
        2025 © vite-Admin By zhaoxunyin Technology.
      </footer>
    </el-main>
  </div>
</template>
<script lang="ts" setup>

import Header from "@/layout/components/header/index.vue";
import SideBar from "@/layout/layoutVecity/aside/index";
import { reactive, watch } from "vue";
import { userstore } from "@/store/expmle";
import { theme } from "@/store/theme";
import { useRoute } from "vue-router"
import { ElBreadcrumb, ElAside, ElBreadcrumbItem, ElMain } from "element-plus";
import RouteTag from "@/layout/components/routeTag/index.vue";
import RouteMain from "@/layout/components/main/index.vue";
import Cookies from "js-cookie"

let route = useRoute();
let store = userstore();
let themes = theme();
const toggle = () => {
  store.setCollapseValue(!store.isCollapse);
};

let breaList = reactive<any>([])
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

watch(route, function () {
  let len = breaList.length;
  breaList.splice(0, len,);
  route.matched && route.matched.forEach(element => {
    if (element.meta.hidden && !breaList.includes(element.path)) {
      breaList.push(element)
    }
  });
  let path = route.path;
  Cookies.set('current', path);

  store.$patch({
    currentRoute: path
  })

  let title: string = route.meta.title as string;
  let icon: string = route.meta.icon as string;
  let data = { path, title, icon };
  store.setRouteList(data);
}, { immediate: true });

</script>

<style scoped lang="scss">
@use "/src/assets/scss/layout.module.scss";
</style>
