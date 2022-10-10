<script lang="ts" setup>
   import { ElConfigProvider } from 'element-plus'
   import zhCn from 'element-plus/lib/locale/lang/zh-cn' 
   import en from 'element-plus/lib/locale/lang/en' ;
   import {userstore} from './store/expmle';
   const {lang,size}=toRefs(userstore());
</script>
<template>
<el-config-provider :size="size" :locale="lang=='en'?en:zhCn">
  <div class="app">
      <router-view></router-view>
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