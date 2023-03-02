<template>
    <el-upload :file-list="fileList" class="upload-demo" :action="props.url" :on-preview="handlePreview"
        :auto-upload="props.autoUpload" :show-file-list='props.showFileList' list-type="picture-card" :name="name"
        :on-success="onsuccess" :on-remove="handleRemove" :before-remove="beforeRemove" :limit="props.limit"
        :on-exceed="handleExceed" :headers="headers">
        <el-button type="primary" v-if="props.plus">点击上传</el-button>
        <el-icon v-else>
            <Plus />
        </el-icon>
        <template #tip>
            <div class="el-upload__tip">
                {{ props.tips }}
            </div>
        </template>
    </el-upload>
</template>

<script setup lang="ts">
import { ElButton, ElMessage, ElUpload, UploadUserFile } from 'element-plus';
import { defineEmits, withDefaults } from "vue";

import type { success } from "./index";

type fun = () => ({});

const emit = defineEmits<{
    (e: "success", picture: success): void
}>()


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
    url: "/api/common/upload",
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
const handlePreview = () => {
    console.log("123");
}

const handleRemove = () => {
    console.log("123");
}

const beforeRemove = () => {
    return true
}

const handleExceed = () => {
    ElMessage.warning("当前上传图片的数量超过最大上传量");
}

const onsuccess = (data: success) => {
    emit("success", data);
}

</script>