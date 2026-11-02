<script lang="ts" setup>
import { theme } from "@/store/theme";
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
const breaList = inject<Array<List>>('breakList');
</script>

<template>
  <section class="breadcrumb">
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
</template>