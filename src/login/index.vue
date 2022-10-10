<template>
  <div class="contanier" ref="div">
    <div class="login">
      <el-form class="form" label-width="80px" :model="formData" :rules="rules" ref="formEl">
        <el-form-item label="用户名" class="form-item" prop="username">
          <el-input size="default" v-model="formData.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" class="form-item" prop="password">
          <el-input type="password" size="default" v-model="formData.password" show-password></el-input>
        </el-form-item>

        <el-form-item class="form-item btn-left">
          <el-button type="primary" @click="login(formEl)" size="default">登录</el-button>
          <el-button type="default" @click="clear(formEl)" size="default">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 添加其他登录方式 -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { ElMessage, ElInput, ElForm, ElFormItem, ElButton, FormInstance } from "element-plus";
import { userstore } from "./../store/expmle"
import Cookies from "js-cookie"
import type { LocationQueryRaw, LocationQueryValue } from "vue-router"

interface formFileds {
  username: string,
  password: string
}

interface queryType {
  [key: string]: string
}

let div = ref<any>(null);
let formEl = ref<FormInstance>();
let redirect = ref<string | null | Array<LocationQueryValue>>("");
let otherQuery = ref<any>({});

const router = useRouter();

const routes = useRoute();

const store = userstore();

let formData = reactive<formFileds>({ username: "", password: "" });

let rules = reactive({
  username: [{ required: true, message: "请选择用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请选择用户密码", trigger: "blur" },
  ],
});

onMounted(() => {
  const height = document.documentElement.clientHeight;
  div.value.style.height = height + "px";
});

/**
 * @params {usernmae,password}
 * 
 * @return  {null}
 * 表单提交
 */
const login = (formEl: FormInstance | undefined) => {
  let { username, password } = formData;
  if (!formEl) return
  formEl.validate((res: any) => {
    if (res) {
      // 触发用户登录
      store.login(username, password).then(
        (res) => {
          if (res.code == 0) {
            window.localStorage.setItem("token", res.token);
            Cookies.set('token', res.token);
            store.$patch({ token: res.token });
            router.push({
              path: redirect.value as string || "/",
              query: otherQuery,
            });
            ElMessage.success("登录成功");
          }
        },
        (err) => {
          ElMessage.error("登录失败");
        }
      );
    }
  });
};

/***
 * 
 * subscribe
 */

const unsubscribe = store.$onAction(({
  name, // name of the action
  store, // store instance, same as `someStore`
  args, // array of parameters passed to the action
  after, // hook after the action returns or resolves
  onError, // hook if the action throws or rejects
}) => {

  console.log(name, store, args, after, "这是状态修改额监听");
})

// unsubscribe();
/**
 * @params query:object
 * @return cur:queryType
 * 
 */
const getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((cur: queryType, next) => {
    if (next != "redirect") {
      cur[next] = query[next];
    }
    return cur;
  }, {});
};

/**
 * 
 * 
 */

watchEffect(() => {
  redirect.value = routes.query.redirect || null;
  otherQuery = getOtherQuery(routes.query);
})


// 登录表单重置
const clear = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
};
</script>

<style lang="scss" scoped>
.contanier {
  display: flex;
  align-items: center;
  padding-left: 300px;
  background: url('https://img.tukuppt.com/ad_preview/00/04/75/5c98c7eb09f48.jpg!/fw/980') no-repeat;
  background-size: 100%;
  filter: blur(50);
}


.login {
  display: flex;
  flex: 12;
  justify-content: center;
  align-items: center;
  color: #000;
  height: 500px;
  margin-right: 200px;
}

.form {
  box-sizing: border-box;
  padding: 30px;
  width: 700px;
}

.form-item {
  margin-top: 30px;
}

.btn-left {
  text-align: left;
}

.login ::v-deep .el-form-item__label {
  color: #fff;
  font-weight: 700;
}
</style>
