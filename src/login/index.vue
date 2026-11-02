<template>
  <div
    ref="div"
    class="login-page"
  >
    <div class="login-card">
      <!-- 左：品牌区（藏青蓝，企业商务风） -->
      <div class="brand">
        <div class="brand-badge">
          <span class="brand-badge__dot" />SHOP ADMIN · 电商中台
        </div>

        <h1 class="brand-title">
          新零售电商<br>运营管理系统
        </h1>
        <p class="brand-sub">
          订单 · 商品 · 会员 · 营销，一站式经营管理后台
        </p>

        <ul class="feats">
          <li>
            <span class="feats__ic"><el-icon><TrendCharts /></el-icon></span>
            <div>
              <b>实时数据看板</b>
              <small>成交、客流、转化，经营状况一目了然</small>
            </div>
          </li>
          <li>
            <span class="feats__ic"><el-icon><Van /></el-icon></span>
            <div>
              <b>订单全流程追踪</b>
              <small>待发货、物流、售后，环环相扣不遗漏</small>
            </div>
          </li>
          <li>
            <span class="feats__ic"><el-icon><ShoppingCart /></el-icon></span>
            <div>
              <b>商品营销一体</b>
              <small>库存预警、优惠券、秒杀活动统一管理</small>
            </div>
          </li>
        </ul>

        <p class="brand-foot">PROFESSIONAL · RELIABLE · EFFICIENT</p>
      </div>

      <!-- 右：登录区 -->
      <div class="login">
        <h2 class="login-title">欢迎登录</h2>

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

        <!-- 账号密码登录 -->
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

          <div class="form-extra">
            <span class="forgot">忘记密码？</span>
          </div>

          <el-form-item class="form-item form-item--btn">
            <el-button
              class="btn"
              type="primary"
              size="default"
              @click="login(formEl)"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 手机号登录 -->
        <el-form
          v-else
          ref="formEl"
          class="form"
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

          <el-form-item class="form-item form-item--btn">
            <el-button
              class="btn"
              type="primary"
              size="default"
              @click="login(formEl)"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="safe-tip">
          <el-icon><Lock /></el-icon>
          企业级数据加密，保障账号安全
        </div>
      </div>
    </div>

    <div class="copyright">
      © 2026 SHOP ADMIN · 让电商经营更简单
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { ElInput, ElForm, ElFormItem, ElButton, FormInstance } from "element-plus";
import { ShoppingCart, Van, TrendCharts, Lock } from "@element-plus/icons-vue";
import { getOtherQuery, useLogin, handleCode, toggleLogin } from "@/hooks/useLogin";

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
/* ========== 页面：浅灰蓝底，居中卡片 ========== */
.login-page {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  /* 极浅暖灰：与深红同色系但明度拉开，安静衬托主体 */
  background: linear-gradient(180deg, #f7f5f5 0%, #f0ecec 100%);
}

.login-card {
  display: flex;
  box-sizing: border-box;
  width: 880px;
  max-width: 100%;
  min-height: 560px;
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    0 2px 8px rgba(23, 43, 77, 0.06),
    0 20px 56px -24px rgba(23, 43, 77, 0.32);
}

/* ========== 左：品牌区（深红商务风） ========== */
.brand {
  box-sizing: border-box;
  width: 410px;
  flex: none;
  padding: 48px 40px 36px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  background:
    radial-gradient(460px 340px at 118% -12%, rgba(224, 96, 96, 0.26), transparent 62%),
    radial-gradient(340px 280px at -14% 114%, rgba(0, 0, 0, 0.35), transparent 60%),
    linear-gradient(160deg, #481111 0%, #380b0b 55%, #2a0707 100%);
  position: relative;

  /* 顶部一条金色细线：商务感的点睛，仅 1 处 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 40px;
    width: 56px;
    height: 3px;
    background: linear-gradient(90deg, #d4b06a, #b8934a);
  }

  .brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    align-self: flex-start;
    padding: 5px 12px;
    font-size: 12px;
    letter-spacing: 1px;
    color: #b8c8e6;
    border: 1px solid rgba(232, 200, 200, 0.35);
    border-radius: 3px;

    &__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #d4b06a;
    }
  }

  .brand-title {
    margin: 34px 0 0;
    font-size: 27px;
    line-height: 1.5;
    font-weight: 600;
    letter-spacing: 2.5px;
  }

  .brand-sub {
    margin: 14px 0 0;
    font-size: 13px;
    line-height: 1.6;
    letter-spacing: 0.5px;
    color: rgba(232, 200, 200, 0.75);
  }
}

.feats {
  list-style: none;
  margin: 46px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 26px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &__ic {
    flex: none;
    width: 36px;
    height: 36px;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.09);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 4px;
  }

  b {
    display: block;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  small {
    display: block;
    margin-top: 3px;
    font-size: 12px;
    line-height: 1.5;
    color: rgba(232, 200, 200, 0.68);
  }
}

.brand-foot {
  margin: auto 0 0;
  padding-top: 28px;
  font-size: 11px;
  letter-spacing: 2.5px;
  color: rgba(232, 200, 200, 0.5);
}

/* ========== 右：登录区 ========== */
.login {
  flex: 1;
  box-sizing: border-box;
  padding: 52px 56px 32px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.login-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #1f2937;
  text-align: center;
}

/* 切换标签：等分 + 下划线 */
.tab {
  display: flex;
  margin-top: 30px;
  border-bottom: 1px solid #ebedf0;

  span {
    position: relative;
    flex: 1;
    padding-bottom: 12px;
    text-align: center;
    font-size: 14px;
    color: #8a94a6;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #1f2937;
    }

    &.active {
      color: #300404;
      font-weight: 500;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 2px;
        background-color: #300404;
      }
    }
  }
}

/* 表单 */
.form {
  margin-top: 26px;
  width: 100%;
}

.form-item {
  margin-bottom: 18px;
}

.form-item--btn {
  margin-top: 28px;
  margin-bottom: 0;
}

/* 输入框：方角描边，聚焦加深边框 */
:deep(.el-input) {
  height: 44px;
  width: 100%;
}

:deep(.el-input__wrapper) {
  padding: 1px 12px;
  border-radius: 4px;
  background: #f8fafc;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: box-shadow 0.2s, background 0.2s;

  &:hover {
    background: #ffffff;
    box-shadow: 0 0 0 1px #c9b0b0 inset;
  }

  &.is-focus {
    background: #ffffff;
    box-shadow: 0 0 0 1px #300404 inset;
  }
}

:deep(.el-input__inner) {
  font-size: 14px;
  color: #1f2937;

  &::placeholder {
    color: #b4bccc;
  }
}

.form-extra {
  display: flex;
  justify-content: flex-end;
  margin-top: -6px;
}

.forgot {
  font-size: 13px;
  color: #8a94a6;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #300404;
  }
}

/* 登录按钮：深红纯色 */
.btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  letter-spacing: 6px;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  background-color: #300404;
  transition: background-color 0.2s;

  &:hover,
  &:focus {
    background-color: #481212;
  }

  &:active {
    background-color: #240202;
  }
}

.safe-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 24px;
  font-size: 12px;
  color: #a3aab8;

  .el-icon {
    font-size: 13px;
    color: #9aa3b2;
  }
}

.copyright {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: #a3aab8;
  pointer-events: none;
}

/* ========== 窄屏：隐藏品牌区 ========== */
@media (max-width: 760px) {
  .brand {
    display: none;
  }

  .login {
    padding: 40px 28px 24px;
  }
}
</style>
