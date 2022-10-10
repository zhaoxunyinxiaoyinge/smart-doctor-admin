/// <reference path = "index.d.ts" /> 
import axios,{AxiosDefaults} from "axios";
import Cookies from "js-cookie";
import { ElMessage } from 'element-plus'

let token=Cookies.get('token')||'';
// 设置axios的默认配置
/**
 * ts 类型不明确
 * 
 */
// axios.defaults.headers['X-Requested-With']  = 'XMLHttpRequest'
axios.defaults.baseURL = import.meta.env.BASE_URL;
axios.defaults.headers.common['Authorization'] = token;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 创建axios配置实列，会覆盖默认值
let serve = axios.create({
  timeout: 5000,
});

serve.interceptors.request.use((config)=>{ 
    return config
},(err)=>{
  return Promise.reject(err);
})

serve.interceptors.response.use((response)=>{
    if(response.data.code==500){
      ElMessage.error(response.data.msg);
      return Promise.reject(response.data.msg)
    }
    
    if(response.data.code!==500&&response.data.code!==200){
      ElMessage.error(response.data.msg);
      return Promise.reject(response.data.msg)
    }

    return Promise.resolve(response.data);
},(err)=>{
    return Promise.reject(err);
})

export  {
  serve
}
