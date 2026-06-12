<script setup lang="ts">
import ViewDialog from "./viewDialog.vue"
import type { prop as Addconfig } from '@/components/forms/index.vue';
//新增逻辑
const props=withDefaults(defineProps<{
  dialogVisible:boolean,
  title: string,
  addConfig: Addconfig['formField'],
  formData:object
}>(),{
  dialogVisible:false,
  title:"编辑",
  addConfig:()=>([]),
  formData:()=>({})
});


const emit=defineEmits<{
  (e: 'update:dialogVisible', value: boolean): void
  (e: 'confirm', value: any): void
}>()  


const handleClose=()=>{
  emit("update:dialogVisible",false)
}


</script>

<template>
  <ViewDialog
    :dialog-visible="props.dialogVisible"
    :add-config="props.addConfig"
    :title="'编辑'"
    :init-data="props.formData"
    @update:dialogVisible="handleClose"
  />
</template>