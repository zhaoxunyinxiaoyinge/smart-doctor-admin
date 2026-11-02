<template>
  <el-upload
    ref="upload"
    :file-list="fileList"
    class="upload-demo"
    :class="{ 'upload-hide-trigger': props.fileList.length > 0 }"
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
    <template
      v-if="props.fileList.length>0"
      #file="{ file }"
    >
      <div class="upload-cover-item">
        <img
          class="el-upload-list__item-thumbnail"
          :src="props.fileList[0].url"
          alt=""
        >
        <span
          class="upload-cover-actions"
          title="点击重新上传"
          @click="openFileDialog"
        >
          <el-icon><RefreshRight /></el-icon>
          <span class="upload-cover-text">重新上传</span>
        </span>
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ElUpload, UploadUserFile } from 'element-plus';
import type { UploadInstance } from "element-plus"
import { ref } from "vue";
import { RefreshRight } from "@element-plus/icons-vue";
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

/** 重新上传：程序化打开文件选择框（触发框在有图时已隐藏） */
const openFileDialog = () => {
  const input = (upload.value as unknown as { $el?: HTMLElement })?.$el?.querySelector('input[type="file"]');
  if( (input)!=null){
      (input as HTMLElement).click();
  }
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

<style scoped>
/* 已有图片时隐藏 el-upload 的空触发框（空虚线卡片） */
.upload-hide-trigger :deep(.el-upload--picture-card) {
  display: none;
}

/* 缩略图 hover 遮罩：重新上传 */
.upload-cover-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.upload-cover-item .el-upload-list__item-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.upload-cover-actions {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}

.upload-cover-item:hover .upload-cover-actions {
  display: flex;
}

.upload-cover-text {
  font-size: 12px;
}
</style>