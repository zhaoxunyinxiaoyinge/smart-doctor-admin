import { userstore } from "@/store/expmle";
import { userInfo } from "@/store/user";
import { ElMessage, FormInstance } from "element-plus";
import Cookies from "js-cookie";
import { LocationQueryValue, useRouter } from "vue-router";
import { createValiteCode } from "@/utils/common";
import { ref, reactive } from "vue"
import { getCatcha } from "@/login/api/index"

interface formFileds {
  username?: string,
  password?: string,
  answaner?: string
}

interface queryType {
  [key: string]: string
}

const isPhoneLogin = ref(false);
const otherQuery = ref<{
  [key: string]: string | string[] | null
}>({});
const store = userstore();
const user = userInfo();
const isCode = ref(false);
const time = ref(60);
const formData = reactive<formFileds>({ username: "", password: "", answaner: "" });
const redirect = ref<string | null | Array<LocationQueryValue>>("");
const rules = reactive({
  username: [{ required: true, message: "请选择用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请选择用户密码", trigger: "blur" },
  ],
  answaner: [{ required: true, message: "请输入验证码", trigger: "blur" }]
});

const isGetLoadingCahtcha = ref(false);

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
  if (formData.answaner === "") { return }
  getCode();
}


export const toggleLogin = (loginMethod: boolean, canvas: HTMLCanvasElement) => {
  if (loginMethod) {
    isPhoneLogin.value = loginMethod;
  } else {
    isPhoneLogin.value = loginMethod;
    console.log(canvas, "canvas")
    nextTick(() => {
      getValiteCode(canvas);
    })

  }
}

//新增获取验证码接口
const getCatchas = async () => {
  isGetLoadingCahtcha.value = true;
  try {
    let res = await getCatcha();
    isGetLoadingCahtcha.value = false;
    return res;
  } catch (e) {
    console.log(e)
  }
}
//  aptchaId= str(body.aptchaId);
//     const answaner=str(body.answaner);

export const useLogin = () => {
  const router = useRouter();
  const login = (formEl: FormInstance | undefined, captcha) => {
    const { username, password, answaner } = formData;
    if (!formEl) return
    formEl.validate((res: any) => {
      if (res) {
        store.login(username as string, password as string, answaner as string, captcha.aptchaId).then(
          (res) => {
            if (res.code == 1) {
              const date = new Date(res.data.expiresAt)
              date.setMinutes(date.getMinutes() + 15);
              console.log(res.data.token)
              Cookies.set('token', res.data.token, { expires: date });
              const resfshTime = new Date(res.data.refeshExpire);
              resfshTime.setDate(resfshTime.getDate() + 7);
              Cookies.set("refeshTokn", res.data.refeshTokn, { expires: resfshTime })
              delete res.data.token;
              delete res.data.refeshTokn;
              localStorage.setItem("userinfo", JSON.stringify(res.data));
              store.$patch({ token: res.data.token });
              user.setUserInfo({ name: res.data.userName, phone: res.data.phone, work: res.data.work, avatar: res.data.avatar, id: res.data.id });
              router.push({
                path: redirect.value as string || "/",
                query: otherQuery.value
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
    getCatchas,

    formData,
    rules,
    redirect,
    otherQuery,
    isCode,
    isPhoneLogin,
    time,
    isGetLoadingCahtcha
  }
}