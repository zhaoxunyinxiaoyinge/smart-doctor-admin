<script lang="ts" setup>
import { userInfo } from "@/store/user";
let user = userInfo();
</script>
<template>
  <div class="">
    <el-card class="box-card" :body-style="{textAlign:'left',lineHeight:2.5,fontWeight:'bold'}">
      <template #header>
        <div class="card-header  justifly-start " style="text-align: left;">
          <span>用户个人中心</span>
        </div>
      </template>
      <div><el-image :src="user.userinfo.avatar" width="256px"> </el-image></div>
      <div><span>姓名:</span><span>{{user.userinfo.name}}</span></div>
      <div><span>职务:</span><span>{{user.userinfo.work}}</span></div>
      <div><span>联系方式:</span><span>{{user.userinfo.phone}}</span></div>
    </el-card>
  </div>
</template>