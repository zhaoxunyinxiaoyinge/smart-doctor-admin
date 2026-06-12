<script setup lang="ts">
import ViewDialog from "./viewDialog.vue"
import type { prop as Addconfig } from '@/components/forms/index.vue';
//新增逻辑
const props=withDefaults(defineProps<{
  dialogVisible:boolean,
  title: string,
  addConfig: Addconfig['formField'],
}>(),{
  dialogVisible:false,
  title:"新增",
  addConfig:()=>[]
}) ;


const emit=defineEmits<{
  (e: 'update:dialogVisible', value: boolean): void
  (e: 'confirm', value: any): void
  (e:"add:formData",value:any):void
}>()  


const handleClose=(flag)=>{
  emit("update:dialogVisible",flag)
}

const handleAddConfirm=(formData)=>{
    emit("add:formData",formData);
}

</script>

<template>
  <ViewDialog
    :dialog-visible="props.dialogVisible"
    :add-config="props.addConfig"
    :title="'新增'"
    @update:dialogVisible="handleClose"
    @confirm="handleAddConfirm"
  />
</template>