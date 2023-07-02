import { exportData } from "@/api/index";
import { javaDown } from "@/utils/common";
import { ref } from "vue";

/**
 * @description export data
 * @param props { url } url -请求地址
 * @param props { name } name -传入名称
 * @returns handleImport {Function}
 */
export function useHeader(props: { name: string, url: string }) {
    const loading = ref(false);
    const handleImport = () => {
        loading.value = true;
        exportData({ url: props.url, query: { name: props.name } }).then(res => {
            javaDown(res, props.name);
            loading.value = false;
        })
    }
    return [handleImport]
}

