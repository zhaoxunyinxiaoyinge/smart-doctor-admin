<script lang="ts" setup>
import { theme } from "@/store/theme";
import { userstore } from "@/store/expmle"
import { seetMoveRouteTag } from "@/hooks/useTheme";
import { ScrollbarInstance, IconInstance } from "element-plus/lib/components";
import type { RouteList } from "@/store/expmle"
import Cookies from "js-cookie";

const themes = theme();
const store = userstore();
const router = useRouter();
const route = useRoute();

const activeRoute = ref("");
const left = ref<IconInstance | null>(null);
const right = ref<IconInstance | null>(null);
const srcollBar = ref<ScrollbarInstance | null>(null);

const jumpTo = (val: string) => {
  Cookies.set("current", val);

  store.$patch({
    currentRoute: val
  })
  router.push(val);

}

const delRouter = async (item: { title: string, path: string, icon: string }, event: Event) => {
  event.stopPropagation()
  // 删除路由
  store.deleteRouteItem(item);
  setLastRouter(store.routeList);
}

const setLastRouter = (list: Array<RouteList>) => {
  if (list.length > 0) {
    let last = list[list.length - 1];
    last && router.push({ path: last.path });
    last && Cookies.set("current", last.path);
    last && store.$patch({
      currentRoute: last.path
    })
  } else {
    router.push("/welcome");
    Cookies.set("current", "/welcome");
    store.$patch({
      currentRoute: "/welcome"
    })
  }
}

watchEffect(() => {
  activeRoute.value = route.fullPath;
  if (themes.tabbar) {
    seetMoveRouteTag(left.value as IconInstance, right.value as IconInstance, srcollBar.value as ScrollbarInstance);
  }
})

</script>

<template>
  <section v-if="themes.tabbar" class="route-list">
    <el-icon ref="left">
      <ArrowLeft />
    </el-icon>
    <el-scrollbar ref="srcollBar" class="scroll" :wrap-style="'display:flex;align-items:center;'">
      <div ref="routeTag" class="route-label-list">
        <span v-for="(item) in store.routeList" :key="item.path"
          :class="['route-btn', activeRoute == item.path ? 'active' : '']" @click="() => jumpTo(item.path)">
          {{ item.title }}
          <el-icon class="close" @click.navtive.stop="(event: any) => delRouter(item, event)">
            <Close />
          </el-icon>
        </span>
      </div>
    </el-scrollbar>
    <el-icon ref="right">
      <ArrowRight />
    </el-icon>
  </section>
</template>

<style lang="scss">
@use "@/assets/scss/layout.module.scss";
</style>