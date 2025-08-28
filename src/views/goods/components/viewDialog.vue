<script setup lang="ts">
// 视图部分只包含纯正的展示，不区分新增和编辑
import DefineForm from '@/components/forms/index.vue'
const props=withDefaults(defineProps<{
  dialogVisible:boolean,
  title: string,
  addConfig: {[key:string]:any}[],
  initData?:object
}>(),{
  dialogVisible:false,
  title:"新增",
  addConfig:()=>[],
  initData:()=>({})
}) ;

const form=ref<typeof DefineForm>();
const emit=defineEmits<{
  (e: 'update:dialogVisible', value: boolean): void
  (e: 'confirm', value: any): void
}>()  

const handleClose=()=>{
  emit('update:dialogVisible', false)
}

const handleConfirm=()=>{
  emit('confirm', (form.value as typeof DefineForm).formData);
  emit('update:dialogVisible', false)
}


</script>

<template>
  <el-dialog
    :model-value="props.dialogVisible"
    :title="props.title"
    width="50%"
  >
    <DefineForm
      v-if="props.dialogVisible"
      ref="form"
      :inline="false"
      :init-data="props.initData"
      :form-field="props.addConfig"
    /> 
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>