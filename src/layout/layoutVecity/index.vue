<template>
  <div class="content">
    <!-- 宽度跟随折叠状态：展开 220px（留白更宽松），折叠后与菜单条对齐 64px -->
    <el-aside class="aside" :width="store.isCollapse ? '64px' : '220px'">
      <el-scrollbar height="100vh">
        <section
          class="flex justifly-center align-items "
          style="text-align: center;padding: 0;margin:0;height: 69px; border-bottom: 1px solid rgba(255,255,255,0.12);"
        >
          <span class="logo-badge">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path
                d="M6 8h12l-1.2 11.2a1.6 1.6 0 0 1-1.6 1.4H8.8a1.6 1.6 0 0 1-1.6-1.4L6 8Z"
                fill="#fff"
                opacity=".95"
              />
              <path
                d="M9 10V7a3 3 0 0 1 6 0v3"
                stroke="#fff"
                stroke-width="1.8"
                stroke-linecap="round"
                fill="none"
              />
            </svg>
          </span>
          <span
            v-if="!store.isCollapse"
            class="text-black"
            style="color:#ffffff;font-weight:600;font-size:16px;letter-spacing:0.5px;margin-left:10px;"
          >智慧电商系统</span>
        </section>
        <side-bar />
      </el-scrollbar>
    </el-aside>
    <el-main class="main">
      <div class="header">
        <Header />
        <!-- 路由导航，和展开栏 ,面包屑-->
        <section class="breadcrumb">
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
  if (route.matched) route.matched.forEach(element => {
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

/* 侧边栏顶部商务徽标：藏青渐变圆角方块 + 白色购物袋 */
.logo-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 徽标配色跟随侧边栏深红主题（原为蓝色渐变） */
  background: linear-gradient(135deg, #dc2626, #7f1d1d);
  box-shadow: 0 4px 12px -4px rgba(220, 38, 38, 0.4);
  flex: none;
}
</style>
