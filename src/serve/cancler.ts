import { Canceler, AxiosRequestConfig } from "axios";
import qs from "qs";
import axios from "axios";

let map = new Map<string, Canceler>();
const getUrl = (config: AxiosRequestConfig) => {
    // key 必须带 url：不同接口参数相同时（如 user 和 goods 都传 page=1&pageSize=500）
    // 不带 url 会互相取消；带上后仅「同接口+同参数」才视为重复请求
    return [config.url, config.method, qs.stringify(config.data), qs.stringify(config.params)].join("&");
}
class CreateCancle {
    /**
     * @description 添加取消请求
     * @param config AxiosRequestConfig
     */
    public addPengHttp(config: AxiosRequestConfig) {
        this.removePendHttp(config);
        const url: string = getUrl(config);
        config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
            if (!map.has(url)) {
                map.set(url, cancel);
            }
        })
    }

    /**
     * @description 删除指定的key
     * @param config AxiosRequestConfig
     */
    public removePendHttp(config: AxiosRequestConfig) {
        const url: string = getUrl(config);
        if (map.has(url)) {
            const cancel = map.get(url);
            cancel?.();
            map.delete(url);
        }
    }

    reset() {
        map = new Map<string, Canceler>();
    }
}

export default new CreateCancle();

