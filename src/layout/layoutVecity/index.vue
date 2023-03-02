<template>
  <div class="content">
    <el-aside class="aside">
      <section class="flex justifly-center align-items">
        <el-image style="height:60px" :fit="'contain'"
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi-1.lanrentuku.com%2F2020%2F11%2F6%2F9232f107-4dac-4006-9c7e-e825df5e52e1.png%3FimageView2%2F2%2Fw%2F500&refer=http%3A%2F%2Fi-1.lanrentuku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659237413&t=b141420c6ec2506048d76681aa122469" />
        <span v-if="!store.isCollapse" class="white">vue3后台</span>
      </section>
      <side-bar></side-bar>
    </el-aside>
    <el-main class="main">
      <div class="header">
        <Header></Header>
        <!-- 路由导航，和展开栏 ,面包屑-->
        <section class="breaum">
          <el-icon @click="toggle" :size="24" style="margin-left: -20px; margin-right: 20px">
            <Expand />
          </el-icon>
          <el-breadcrumb v-if="themes.isBrearum" class="hamburger-container" id="hamburger-container">
            <el-breadcrumb-item :key="item.path" v-for="item in breaList" :to="{ path: item.path }">{{
              item.meta.title
            }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </section>
      </div>

      <!-- <section class='route-list' v-if="themes.tabbar"> -->
      <route-tag></route-tag>
      <!-- </section> -->

      <section :class="['route-content', contenClass]">
        <RouteMain></RouteMain>
      </section>
      <footer class="bottom" v-if="themes.isFooter">
        20224 © vite-Admin By zhaoxunyin Technology.
      </footer>
    </el-main>
  </div>
</template>
<script lang="ts" setup>

import Header from "@/layout/components/header/index.vue";
import SideBar from "@/layout/layoutVecity/aside/index";
import { watchEffect, reactive, watch } from "vue";
import { userstore } from "@/store/expmle";
import { theme } from "@/store/theme";
import { useRoute } from "vue-router"
import { ElBreadcrumb, ElAside, ElBreadcrumbItem, ElMain } from "element-plus";
import RouteTag from "@/layout/components/routeTag/index.vue";
import RouteMain from "@/layout/components/main/index.vue";
import Cookies from "js-cookie"
import { val } from "dom7";

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
  let title: string = route.meta.title as string;
  let icon: string = route.meta.icon as string;
  let data = { path, title, icon };
  store.setRouteList(data);
}, {immediate: true });

</script>

<style scoped lang="scss">
@use "@/assets/scss/layout.module.scss";
</style>
