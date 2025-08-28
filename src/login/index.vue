<template>
  <div
    ref="div"
    class="contanier"
  >
    <div class="fixed">
      <el-image
        class="logo"
        :src="Logo"
      />

      <div class="login">
        <el-image
          class="login-img"
          :src="loginImg"
        />
        <div class="tab">
          <span
            :class="!isPhoneLogin ? 'active' : ''"
            @click="toggleLogin(false, canvas as HTMLCanvasElement)"
          >账号密码登录</span>
          <span
            :class="isPhoneLogin ? 'active' : ''"
            @click="toggleLogin(true, canvas as HTMLCanvasElement)"
          >手机号登录</span>
        </div>

        <el-form
          v-if="!isPhoneLogin"
          ref="formEl"
          class="form"
          :model="formData"
          :rules="rules"
        >
          <el-form-item
            class="form-item"
            prop="username"
          >
            <el-input
              v-model="formData.username"
              placeholder="请输入您的账号"
              size="default"
            />
          </el-form-item>

          <el-form-item
            class="form-item"
            prop="password"
          >
            <el-input
              v-model="formData.password"
              placeholder="请输入密码"
              type="password"
              size="default"
              show-password
            />
          </el-form-item>

          <el-form-item
            class="form-item"
            style="width: 100%;"
            label="验证码"
          >
            <div
              class="flex"
              style="justify-content: flex-start;width:100%;align-items: center;"
            >
              <ValidCode />
            </div>
          </el-form-item>

          <div class="wan">
            忘记密码？
          </div>

          <el-form-item class="form-item btn-left">
            <el-button
              class="btn"
              type="primary"
              size="default"
              @click="login(formEl)"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <el-form
          v-else
          ref="formEl"
          :model="formData"
          :rules="rules"
        >
          <el-form-item
            class="form-item"
            prop="phone"
          >
            <el-input
              v-model="formData.phone"
              placeholder="请输入您的手机号"
              size="default"
            />
          </el-form-item>

          <el-form-item
            class="form-item"
            prop="code"
          >
            <el-input
              v-model="formData.code"
              placeholder="请输入验证码"
              type="input"
              size="default"
            >
              <template #append>
                <span @click="handleCode">{{ isCode ? '当前还有' + time + '秒钟' : '点击获取验证码'
                }}</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="form-item btn-left">
            <el-button
              class="btn"
              type="primary"
              size="default"
              @click="login(formEl)"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { ElInput, ElForm, ElFormItem, ElButton, FormInstance, ElImage } from "element-plus";
import Logo from "@/assets/login/logo.png";
import loginImg from "@/assets/login/login.png";
import { getOtherQuery, useLogin, handleCode, toggleLogin } from "@/hooks/useLogin";
import ValidCode from "@/components/validCode/index.vue";



let div = ref<any>(null);
let formEl = ref<FormInstance>();
const canvas = ref<HTMLCanvasElement | null>(null);
const { formData, rules, redirect, otherQuery, isCode, isPhoneLogin, time, login } = useLogin();
const routes = useRoute();

onMounted(() => {
  const height = document.documentElement.clientHeight;
  div.value.style.height = height + "px";
});

watchEffect(() => {
  redirect.value = routes.query.redirect || null;
  otherQuery.value = getOtherQuery(routes.query);
})

</script>

<style lang="scss" scoped>
.contanier {
  background: url("@/assets/login/welcome.png") no-repeat;
  background-size: 100%;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}


.fixed {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1280px;
  height: 700px;
  border-radius: 14px;
  background: #fff;
}

.logo {
  width: 604px;
  height: 452px;
  margin-left: -12px;
  margin-right: 104px;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 550px;
  height: 570px;
  margin-right: 66px;
  box-shadow: 0px 0px 6.67px 0px rgba(0, 0, 0, 0.1);
  border: 1.33px solid rgba(245, 245, 245, 1);
  background: rgba(255, 255, 255, 1);
}

.login-img {
  padding-top: 51px;
  width: 130px;
  height: 30px;
}

.tab {
  width: 282px;
  display: flex;
  justify-content: space-between;
  margin-top: 63px;

  span {
    font-size: 18px;
    color: rgba(102, 102, 102, 1);
    padding-bottom: 21px;

    &.active {
      border-bottom: 3px solid rgba(0, 84, 254, 1);
    }
  }

}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  box-sizing: border-box;
}

.form-item {
  margin-top: 20px;
}

:deep(.el-input) {
  height: 50px;
  width: 385px;
}

.wan {
  width: 100%;
  text-align: right;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);

}



.btn {
  width: 385px;
  height: 50px;
  font-size: 16px;
}

.login :deep(.el-form-item__label) {
  color: #000;
  font-weight: 700;
}
</style>
