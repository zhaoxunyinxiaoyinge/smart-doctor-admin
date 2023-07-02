import { userstore } from "@/store/expmle";
import { userInfo } from "@/store/user";
import { ElMessage, FormInstance } from "element-plus";
import Cookies from "js-cookie";
import { LocationQueryValue,useRouter } from "vue-router";
import { createValiteCode } from "@/utils/common";

interface formFileds {
  username?: string,
  password?: string,
  phone?: string,
  code?: string
}

interface queryType {
  [key: string]: string
}

const isPhoneLogin = ref(false);
const otherQuery = ref<any>({});
const store = userstore();
const user = userInfo();
const isCode = ref(false);
const time = ref(60);
const formData = reactive<formFileds>({ username: "", password: "", phone: "", code: "" });
const redirect = ref<string | null | Array<LocationQueryValue>>("");
const rules = reactive({
  username: [{ required: true, message: "请选择用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请选择用户密码", trigger: "blur" },
  ],
  phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
});

export const getValiteCode = (canvas: HTMLCanvasElement) => {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
  createValiteCode(canvas, ctx, 4, ["a", "b", "c", 'e', "f", "j", "h", "i", "k", "x", "z", "g", "l", "y"]);
}

export const getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((cur: queryType, next) => {
    if (next != "redirect") {
      cur[next] = query[next];
    }
    return cur;
  }, {});
};


export const getCode = () => {
  isCode.value = true;
  if (time.value == 0) {
    isCode.value = false;
    time.value = 60;
  } else {
    setTimeout(() => {
      time.value--;
      getCode();
    }, 1000)
  }
}


export const handleCode = () => {
  if (isCode.value || formData.phone === "") { return }
  getCode();
}


export const toggleLogin = (loginMethod: boolean, canvas: HTMLCanvasElement) => {
  if (loginMethod) {
    isPhoneLogin.value = loginMethod;
  } else {
    isPhoneLogin.value = loginMethod;
    console.log(canvas,"canvas")
    nextTick(() => {
      getValiteCode(canvas);
    })

  }
}

export const useLogin = () => {
  const router = useRouter();
  const login = (formEl: FormInstance | undefined) => {
    const { username, password } = formData;
    if (!formEl) return
    formEl.validate((res: any) => {
      if (res) {
        store.login(username as string, password as string).then(
          (res) => {
            if (res.code == 1) {
              const date = new Date(res.updateTime)
              Cookies.set('token', res.data.token, { expires: date.setDate(date.getDate() + 10) });
              Cookies.set('userinfo', JSON.stringify(res.data))
              store.$patch({ token: res.data.token });
              user.setUserInfo({ name: res.data.userName, phone: res.data.phone, work: res.data.work, avatar: res.data.avatar });
              router.push({
                path: redirect.value as string || "/",
                query: otherQuery,
              });
              ElMessage.success("登录成功");
            }
          },
          (err) => {
            ElMessage.error("登录失败" + err);
          }
        );
      }
    });
  }
  return {
    login,
    formData,
    rules,
    redirect,
    otherQuery,
    isCode,
    isPhoneLogin,
    time
  }
}