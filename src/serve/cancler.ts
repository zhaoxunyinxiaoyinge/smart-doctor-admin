import { Canceler, AxiosRequestConfig } from "axios";
import qs from "qs";
import axios from "axios";

let map = new Map<string, Canceler>();
const getUrl = (config: AxiosRequestConfig) => {
    return [config.method, qs.stringify(config.data), qs.stringify(config.params)].join("&");
}
class CreateCancle {
    /**
     * @description 添加取消请求
     * @param config AxiosRequestConfig
     */
    public addPengHttp(config: AxiosRequestConfig) {
        this.removePendHttp(config);
        let url: string = getUrl(config);
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
        let url: string = getUrl(config);
        if (map.has(url)) {
            let cancel = map.get(url);
            cancel && cancel();
            map.delete(url);
        }
    }

    reset() {
        map = new Map<string, Canceler>();
    }
}

export default new CreateCancle();

