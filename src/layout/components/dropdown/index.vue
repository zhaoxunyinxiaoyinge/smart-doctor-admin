import Cookies from "js-cookie";
<script lang="ts" >
import { defineComponent } from "vue";
import { userstore } from "@/store/expmle";
import { userInfo } from "@/store/user"
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { logout } from "@/api/index";

export default defineComponent({
  setup() {
    const store = userstore();
    const router = useRouter();
    const user = userInfo();
    const handleCommand = (command: string | number | object) => {
      if (command == 'exit') {
        handleExit().then(res => {
          store.clearToken();
          Cookies.set('token', "");
          router.push({ path: '/login' });
        }).catch(err => {
          console.log("退出失败");
        })
      } else if (command == 'center') {
        router.push({ path: "/stylems/index" });
      }
    }

    const handleExit = (): Promise<any> => {
      return logout();
    }

    return {
      handleCommand,
      user
    }
  },
});
</script>

<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      {{ user.userinfo.name }}
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
