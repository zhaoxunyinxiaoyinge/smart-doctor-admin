<script lang="ts" setup>
import { userInfo } from "@/store/user";
import { upload, changeAvatar } from "@/api/index";
import Cookies from "js-cookie";
import VueCopper from "./../../components/vuecropper/index.vue";
import { ref } from "vue";

let user = userInfo();
let file = ref();

const handleSuccess = async (res) => {
  changeAvatar({
    avatar: res.data,
    id: user.userinfo.id
  }).then(() => {
    const users = { ...user.userinfo, avatar: res.data };
    Cookies.set("userinfo", JSON.stringify(users), { expires: 7 });
    user.setUserInfo(users);
  })
}

const myUpload = async (res) => {
  const formData = new FormData();
  formData.append("file", res.file);
  file.value = await fileBase(res.file);
  return await upload(formData);
}

const fileBase = (file: any) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result);
    reader.readAsDataURL(file);
  })
}

</script>
<template>
  <div class="boxs">
    <el-card class="box-card" :body-style="{ textAlign: 'left', lineHeight: 2.5, fontWeight: 'bold' }">
      <template #header>
        <div class="card-header  justifly-start " style="text-align: left;">
          <span id="list">用户个人中心</span>
        </div>
      </template>
      <div class="img-box">
        <el-image :src="user.userinfo.avatar" style="width: 260px;margin-right: 50px;" />
        <!-- 这里功能不完善，暂时关闭 -->
        <!-- <VueCopper :file="file" :url="user.userinfo.avatar" /> -->
      </div>
      <div>
        <el-upload name="file" class="upload-demo" action="#" :show-file-list="false" :http-request="myUpload"
          @success="handleSuccess">
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
  color: #333;
  initial-letter: 2 2;
  user-select: none;
  font-weight: bold;
}

.boxs {
  display: flex;
}

.img-box {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>