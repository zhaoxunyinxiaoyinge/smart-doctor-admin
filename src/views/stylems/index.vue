<script lang="ts" setup>
import { userInfo } from "@/store/user";
import {upload,changeAvatar} from "@/api/index";
import Cookies from "js-cookie";
let user = userInfo();

const handleSuccess=async(res)=>{
   changeAvatar({
    avatar:res.data,
    id:user.userinfo.id
   }).then(()=>{
      const users={...user.userinfo,avatar:res.data};
      Cookies.set("userinfo",JSON.stringify(users),{expires:7});
      user.setUserInfo(users);
   })
}

const myUpload=async(res)=>{
  const formData= new FormData();
  formData.append("file",res.file);
  return await  upload(formData);
}
</script>
<template>
  <div class="">
    <el-card
      class="box-card"
      :body-style="{textAlign:'left',lineHeight:2.5,fontWeight:'bold'}"
    >
      <template #header>
        <div
          class="card-header  justifly-start "
          style="text-align: left;"
        >
          <span id="list">用户个人中心</span>
        </div>
      </template>
      <div>
        <el-image
          :src="user.userinfo.avatar"
          width="256px"
        />
      </div>
      <div>
        <el-upload
          name="file"
          class="upload-demo"
          action="#"
          :show-file-list="false"
          :http-request="myUpload"
          :limit="1"
          @success="handleSuccess"
        >
          <el-button type="primary">
            点击更换图像
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500KB.
            </div>
          </template>
        </el-upload>
      </div>
      <div><span>姓名:</span><span>{{ user.userinfo.name }}</span></div>
      <div><span>职务:</span><span>{{ user.userinfo.work }}</span></div>
      <div><span>联系方式:</span><span>{{ user.userinfo.phone }}</span></div>
    </el-card>
  </div>
</template>

<style scoped>
  #list {
    color:#333;
    initial-letter: 2 2;
    user-select: none;
    font-weight: bold;
  }
</style>