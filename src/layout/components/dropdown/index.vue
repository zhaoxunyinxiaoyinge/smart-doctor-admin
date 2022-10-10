import Cookies from "js-cookie";
<script lang="ts" >
import { defineComponent } from "vue";
import { userstore } from "@/store/expmle";
import Cookies from "js-cookie";
import { useRouter } from "vue-router"

export default defineComponent({
  setup() {
    const store = userstore();
    const router = useRouter();

    const handleCommand = (command: string | number | object) => {
      if (command == 'exit') {
        store.clearToken();
        Cookies.set('token', "");
        router.push({ path: '/login' });
      }
    }

    return {
      handleCommand
    }
  },
});
</script>

<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      赵训银
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>        
        <el-dropdown-item command="toggle">切换普通会员</el-dropdown-item>
        <el-dropdown-item command="center">个人中心</el-dropdown-item>
        <el-dropdown-item command="exit">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
