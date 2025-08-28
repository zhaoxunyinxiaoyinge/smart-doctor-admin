<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import { computed } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { userstore } from './store/expmle';
import { dictMap } from "@/lang/common";
import Cookies from 'js-cookie';
const store = userstore();
const lang = computed(() => store.lang);
const size = computed(() => store.size);
Cookies.set("lang", lang.value);
</script>

<template>
  <el-config-provider
    :size="size"
    :button="{ autoInsertSpace: true }"
    :locale="lang == 'en' ? { ...dictMap.en, ...en } : { ...zhCn, ...dictMap.ch }"
  >
    <div class="app">
      <router-view />
    </div>
  </el-config-provider>
</template>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /* margin-top: 60px; */
}
</style>