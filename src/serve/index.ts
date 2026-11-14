import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { ElMessage } from 'element-plus';
import router from "@/router/index";
import cancleToken from "./cancler";

// 创建axios配置实列，会覆盖默认值
const serve: AxiosInstance = axios.create({
  timeout: 5000,
});

serve.defaults.headers.post['Content-Type'] = 'application/json';
serve.defaults.baseURL = '/';

const requestApi = (url, headers) => {
  return axios({
    url,
    method: "GET",
    headers
  })
}

let restry = false;
let quelet: Array<(newToken: string) => void> = [];
serve.interceptors.request.use((config: any) => {
  config.headers.Authorization = Cookies.get('token') || "";
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
    Cookies.remove("token");
    router.push("/login");
  }

  if (response.data.code == 200) {
    return Promise.resolve({ code: 1, data: { ...response.data } })
  }

  if (response.data.code !== 500 && response.data.code !== 1 && response.data) {
    return Promise.reject(response.data.msg)
  }


  if (!response.data) {
    return Promise.reject(JSON.stringify(response));
  }

  return Promise.resolve(response.data);

}, async (err) => {
  const { response, config } = err;
  const isAuthError = response?.status === 401

  if(config?.url?.includes("api/user/refsh")){
    // 这里是重复刷新接口
      Cookies.remove("token");
      Cookies.remove("refeshTokn");
      router.push("/login");
      return Promise.reject(err);
  }

  if (isAuthError && config && !restry) {
    if (restry) {
      return new Promise((resolve, reject) => {
        quelet.push((newToken: string) => {
          if (newToken) {
            config.headers.Authorization = newToken;
            resolve(serve(config))
          } else {
            reject(new Error("resfresh Faild"))
          }
        })
      })
    }

    restry = true;
    let headers = { authorization: Cookies.get("refeshTokn") };
    const result = await requestApi("/api/user/refsh", headers);
    try {
      if (result.data.code === 1) {
        quelet.forEach((cb) => cb(result.data.data.token.token));
        let configs = {};
        const date = new Date(result.data.data.token.expiresAt)
        date.setMinutes(date.getMinutes() + 15);
        Cookies.set("token", result.data.data.token.token, { expires: date });
        configs = {
          url: config.url,
          method: config.method,
          headers: {
            ...config.headers,
            Authorization: result.data.data.token.token
          }
        }
        return serve(configs);
      } else {
        throw new Error("刷新错误");
      }
    } catch (e) {
        quelet.forEach(cb => cb(""));
        quelet = [];
        Cookies.remove("token");
        Cookies.remove("refeshTokn");
        router.push("/login");
        return Promise.reject(e);
    }
    finally{
        restry = false;
    }

  }
  return Promise.reject(err);
})

export {
  serve
}
