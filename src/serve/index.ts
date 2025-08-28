import axios,{AxiosInstance} from "axios";
import Cookies from "js-cookie";
import { ElMessage } from 'element-plus';
import router from "@/router/index";
import cancleToken from "./cancler";
// 创建axios配置实列，会覆盖默认值
const serve: AxiosInstance = axios.create({
  timeout: 5000,
});

serve.defaults.headers.post['Content-Type'] = 'application/json';
serve.defaults.baseURL ="/";


serve.interceptors.request.use((config: any) => {
  config.headers.Authorization = Cookies.get('token') || '';
  // 将要取消的请求封装在这里添加到类中
  cancleToken.addPengHttp(config);
  return config
}, (err: any) => {
  return Promise.reject(err);
})

serve.interceptors.response.use((response) => {  
  cancleToken.removePendHttp(response.config);
  if (response.config.responseType == 'blob') {
    return Promise.resolve(response.data);
  }
  if (response.data.code == 500) {
    ElMessage.error(response.data.msg);
    return Promise.reject(response.data.msg)
  }

  if (response.data.code === 0 && response.data.msg == "not login") {
    Cookies.set("token", "");
    router.push("/login");
  }

    if (response.data.code == 200) {
    return Promise.resolve({data:{...response.data}})
  }

  if (response.data.code !== 500 && response.data.code !== 1&&response.data) {
    return Promise.reject(response.data.msg)
  }


  if(!response.data){
    return Promise.reject(JSON.stringify(response));
  }

  return Promise.resolve(response.data);
  
}, (err: any) => {
  return Promise.reject(err);
})

export {
  serve
}
