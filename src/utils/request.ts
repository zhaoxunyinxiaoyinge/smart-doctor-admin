import axios from "axios";
import { ref, reactive, unref, isRef, Ref, watchEffect } from "vue";

export function RequestData(url: string | Ref<string>): {data:Array<any>,error:Error,loading:Ref<boolean>}
{
    const loading=ref<boolean>(false);
    let data = reactive([]);
    let error = ref<any>(null);
    function getData() {
        loading.value=true;
        fetch(unref(url)).then(res => {
            return res.json();
        }).then(res => {
            data = res;
        }).catch(err => {
            error = err;
        }).finally(()=>{
            loading.value=false;
        })
    }

    if (isRef(url)) {
        watchEffect(getData)
    } else {
        getData();
    }

    return {
        data,
        error,
        loading
    }
}


export function MockData(url:string,data?:object):Promise<{datas:Array<object>,err:null|object,loading:Ref<boolean>,pageSize:number,total:number}>{
    const datas=reactive<Array<object>>([]);
    const loading=ref<boolean>(false);
    const err=ref(null);
    loading.value=true;
   return axios({
        url,
        method:'post',
        data,
    }).then(res=>{
        datas.push(...toRaw(res.data.data.list));
        return Promise.resolve({datas,err:null,loading:loading,pageSize:20,total:res.data.data.total});
        })
    .catch(err=>{
        loading.value=false;
        return Promise.resolve({datas:[],err,loading,pageSize:20,total:0});
    }).finally(()=>{
        loading.value=false;
    })
}