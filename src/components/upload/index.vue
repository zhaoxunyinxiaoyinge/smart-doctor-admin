<template>
  <el-upload
    ref="upload"
    :file-list="fileList"
    class="upload-demo"
    :action="props.url"
    :auto-upload="props.autoUpload"
    :show-file-list="props.showFileList"
    list-type="picture-card"
    :name="name"
    :on-success="onsuccess"
    :limit="props.limit"
    :on-exceed="handleExceed"
    :headers="headers"
  >
    <el-icon v-if="props.fileList.length==0">
      <Plus />
    </el-icon>
    <!-- <template
      v-if="props.fileList.length>0"
      #file="{ file }"
    >
      <div> -->
    <img
      v-if="props.fileList.length>0"
      width="100px"
      class="el-upload-list__item-thumbnail"
      :src="props.fileList[0].url"
      alt=""
    >
    <!-- </div>
    </template> -->
  </el-upload>
</template>

<script setup lang="ts">
import { ElUpload, UploadUserFile } from 'element-plus';
import type { UploadInstance } from "element-plus"
import { ref } from "vue";
import type { success } from "./index";
import { UploadRawFile } from 'element-plus/lib/components';

type fun = () => ({});

const emit = defineEmits<{
  (e: "success", picture: success): void
}>()

const upload = ref<UploadInstance | null>(null);

const props = withDefaults(defineProps<{
  limit?: number,
  tips?: string,
  url?: string,
  autoUpload?: boolean,
  httpRequest?: fun,
  disabled?: boolean,
  showFileList: boolean,
  name?: string,
  multiple?: boolean,
  method?: string
  headers?: any,
  fileList?: UploadUserFile[] | [],
  plus?: boolean
}>(), {
  tips: 'jpg/png files with a size less than 500KB.',
  url: "/api/common/stream",
  autoUpload: true,
  httpRequest: () => ({}),
  disabled: false,
  showFileList: false,
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

const handleExceed = (files:Array<File>) => {
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

const handleStart=(file:UploadRawFile)=>{
  (upload.value as UploadInstance).handleStart(file);
}

defineExpose({
  clearFile,
  upload,
  handleStart
})

</script>