<script lang="ts" setup>
import { theme } from "@/store/theme";
import { userstore } from "@/store/expmle"
import { Component } from "vue"
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
const themes = theme();
const store = userstore();

const toggle = () => {
  store.setCollapseValue(!store.isCollapse);
}

const breaList = inject<Array<List>>('breakList');
</script>

<template>
  <section class="breaum">
    <el-icon @click="toggle" :size="24" style="margin-left: -20px; margin-right: 20px">
      <Expand />
    </el-icon>
    <el-breadcrumb v-if="themes.isBrearum">
      <el-breadcrumb-item :key="item.path" v-for="item in breaList" :to="{ path: item.path }">{{
        item.meta.title
      }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </section>
</template>