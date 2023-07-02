<template>
  <el-upload ref="upload"
   :file-list="fileList" class="upload-demo" :action="props.url" :auto-upload="props.autoUpload"
    :show-file-list="props.showFileList" list-type="picture-card" :name="name" :on-success="onsuccess"
    :limit="props.limit" :on-exceed="handleExceed" :headers="headers">
    <el-icon>
      <Plus />
    </el-icon>
    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ElUpload, UploadUserFile } from 'element-plus';
import type { UploadInstance } from "element-plus"
import { withDefaults } from "vue";
import type { success } from "./index";
import { UploadRawFile } from 'element-plus/lib/components';

type fun = () => ({});

const emit = defineEmits<{
  (e: "success", picture: success): void
}>()

const upload = ref<UploadInstance | null>(null);

const props = withDefaults(defineProps<{
  limit: number,
  tips: string,
  url: string,
  autoUpload: boolean,
  httpRequest: fun,
  disabled: boolean,
  showFileList: boolean,
  name: string,
  multiple: boolean,
  method: string
  headers: any,
  fileList: UploadUserFile[] | [],
  plus: boolean
}>(), {
  tips: 'jpg/png files with a size less than 500KB.',
  url: "/api/common/stream",
  autoUpload: true,
  httpRequest: () => ({}),
  disabled: false,
  showFileList: true,
  name: "file",
  multiple: false,
  method: 'post',
  headers: {
  },
  limit: 1,
  fileList: () => ([]),
  plus: true
})

/*
  自动义上传规则
*/

const handleExceed = (files) => {
  upload.value?.clearFiles();
  const file = files[0] as UploadRawFile;
  upload.value?.handleStart(file);
  upload.value?.submit();
}

const onsuccess = (data: success) => {
  emit("success", data);
}

const clearFile = () => {
  (upload.value as UploadInstance).clearFiles();
}

const handleStart=(file)=>{
  (upload.value as UploadInstance).handleStart(file);
}

defineExpose({
  clearFile,
  upload,
  handleStart
})

</script>