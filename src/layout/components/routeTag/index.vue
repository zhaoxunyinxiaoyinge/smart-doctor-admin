<script lang="ts" setup>
import { theme } from "@/store/theme";
import { userstore } from "@/store/expmle"
import { RouteLocationRaw } from "vue-router";
import { seetMoveRouteTag } from "@/hooks/useTheme";
import { ScrollbarInstance, IconInstance } from "element-plus/lib/components";
import type { RouteList } from "@/store/expmle"

const themes = theme();
const store = userstore();
const router = useRouter();
const route = useRoute();

const activeRoute = ref("");
const left = ref<IconInstance | null>(null);
const right = ref<IconInstance | null>(null);
const srcollBar = ref<ScrollbarInstance | null>(null);

const jumpTo = (val: RouteLocationRaw) => {
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
  } else {
    router.push("/welcome");
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

  <section class='route-list' v-if="themes.tabbar">
    <el-icon ref="left">
      <ArrowLeft />
    </el-icon>
    <el-scrollbar class="scroll" :wrap-style="'display:flex;align-items:center;'" ref="srcollBar">
      <div class="route-label-list" ref="routeTag">
        <span :class="['route-btn', activeRoute == item.path ? 'active' : '']" @click="() => jumpTo(item.path)"
          :key="item.path" v-for="(item) in  store.routeList">
          {{ item.title }}
          <el-icon @click.navtive.stop="(event: any) => delRouter(item, event)">
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