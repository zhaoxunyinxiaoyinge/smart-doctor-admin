<script lang="ts">
import { defineComponent } from "vue";
import {userstore} from "@/store/expmle";
import { ElMessage } from 'element-plus';
import {i18n} from "@/lang/index"
import Cookies from "js-cookie";
export default defineComponent({
  setup() {
    let store=userstore();
    const toggle=()=>{    
        store.setCurrentLang();
        ElMessage.success(`当前语言已切换为${store.lang!=='zh'?'英文':'中文'}`);
        i18n.global.locale=store.lang=="zh"?'zh':'en';
        Cookies.set('lang',store.lang)
    }
    return {
      toggle,
      store,
    }
  },
  components:{
  }
});
</script>
<template>
  <span class="margin-right-10 margin-left-10" @click="toggle()">
      {{ store.lang=="zh"?'中文':'英文'}}
  </span>

</template>

<style lang="scss" scoped>
    @import  "./../../../assets/scss/common.scss";
</style>
