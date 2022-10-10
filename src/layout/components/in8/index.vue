<script lang="ts">
import { defineComponent } from "vue";
import {userstore} from "@/store/expmle";
import { ElMessage } from 'element-plus';
import svgIcon from "@/components/icons/svg-icon.vue";
export default defineComponent({
  setup() {
    let store=userstore();

    const toggle=()=>{
        store.setCurrentLang();
        ElMessage.success('当前语言已切换')
    }
    return {
      toggle
    }
  },
  components:{
    svgIcon
  }
});
</script>
<template>
  <span class="margin-right-10 margin-left-10" @click="toggle()">
      <svgIcon :names="'ziyuan'"></svgIcon>
  </span>

</template>

<style lang="scss" scoped>
    @import  "./../../../assets/scss/common.scss";
</style>
