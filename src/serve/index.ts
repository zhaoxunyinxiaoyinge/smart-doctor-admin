import axios from "axios";
import Cookies from "js-cookie";
import { ElMessage, MessageParamsWithType } from 'element-plus';
import router from "@/router/index";
import cancleToken from "./cancler";
// 设置axios的默认配置
/**
 * ts 类型不明确
 * 
 */
// axios.defaults.headers['X-Requested-With']  = 'XMLHttpRequest'
axios.defaults.baseURL = import.meta.env.BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 创建axios配置实列，会覆盖默认值
let serve = axios.create({
  timeout: 5000,
});


serve.interceptors.request.use((config: any) => {
  config.headers.Authorization = Cookies.get('token') || '';
  // 将要取消的请求封装在这里添加到类中
  cancleToken.addPengHttp(config);
  return config
}, (err: any) => {
  return Promise.reject(err);
})

serve.interceptors.response.use((response: { data: { code: number; msg: MessageParamsWithType; }, config: any }) => {
  cancleToken.removePendHttp(response.config);
  if (response.data.code == 500) {
    ElMessage.error(response.data.msg);
    return Promise.reject(response.data.msg)
  }

  if (response.data.code == 0 && response.data.msg == "not login") {
    Cookies.set("token", "");
    router.push("/login");
  }

  if (response.data.code !== 500 && response.data.code !== 1) {
    ElMessage.error(response.data.msg);
    return Promise.reject(response.data.msg)
  }

  return Promise.resolve(response.data);
}, (err: any) => {
  return Promise.reject(err);
})

export {
  serve
}
