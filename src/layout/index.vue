<template>
  <div class="content">
    <el-aside class="aside">
      <section class="flex justifly-center align-items">
        <el-image style="height:60px" :fit="'contain'"
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi-1.lanrentuku.com%2F2020%2F11%2F6%2F9232f107-4dac-4006-9c7e-e825df5e52e1.png%3FimageView2%2F2%2Fw%2F500&refer=http%3A%2F%2Fi-1.lanrentuku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659237413&t=b141420c6ec2506048d76681aa122469">
        </el-image>
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
          <el-breadcrumb>
            <!-- <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item> -->
            <el-breadcrumb-item v-for="item in breaList" :to="{ path: item.path }">{{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </section>
      </div>

      <!-- 路由列表的操作 -->
      <section class='route-list'>
        <span class="route-btn" type="primary" @click="() => jumpTo(item.path)" v-for="item in  routeList">
          <svgIconVue :names="item.icon"></svgIconVue>{{ item.title }}
        </span>
      </section>

      <section class="route-content">
          <transition name="show">
              <router-view></router-view>
          </transition>
      </section>
      <footer class="bottom">
        2022 © vite-Admin By zhaoxunyin Technology.
      </footer>
    </el-main>
  </div>
</template>
<script lang="ts">
import Header from "@/layout/components/header/index.vue";
import SideBar from "@/layout/components/aside/index";
import { ArrowRight } from "@element-plus/icons-vue";
import { defineComponent, watchEffect, reactive } from "vue";
import { userstore } from "@/store/expmle";
import { RouteLocationRaw, useRoute } from "vue-router"
import { ElBreadcrumb, ElButton, ElAside, ElBreadcrumbItem, ElHeader, ElMain } from "element-plus";
import svgIconVue from "@/components/icons/svg-icon.vue";

import Cookies from "js-cookie"

export default defineComponent({
  setup() {
    let route = useRoute();
    let router = useRouter();
    let store = userstore();
    const toggle = () => {
      store.setCollapseValue(!store.isCollapse);
    };
    let breaList = reactive<any>([])

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

    const jumpTo = (val: RouteLocationRaw) => {
      router.push(val);
    }

    return {
      ArrowRight,
      toggle,
      jumpTo,
      routeList: store.routeList,
      breaList,
      store
    };
  },
  components: {
    Header,
    SideBar,
    ElBreadcrumb,
    ElButton, ElAside, ElBreadcrumbItem, ElHeader, ElMain,
    svgIconVue
  },
});
</script>

<style scoped lang="scss">
@import "./../assets/scss/layout.module.scss";
</style>
