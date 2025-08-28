<script setup lang="ts">
import ViewDialog from "./viewDialog.vue"
//新增逻辑
const props=withDefaults(defineProps<{
  dialogVisible:boolean,
  title: string,
  addConfig: {[key:string]:any}[],
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