<template>
    <el-upload v-model:file-list="props.fileList" class="upload-demo"
        :action="url" multiple :on-preview="handlePreview"
        :auto-upload="autoUpload"
        :show-file-list	='showFileList'
        :on-remove="handleRemove" :before-remove="beforeRemove" :limit="limit" :on-exceed="handleExceed">
        <el-button type="primary" @click="handleUpload">Click to upload</el-button>
        <template #tip>
            <div class="el-upload__tip">
               {{tips}}
            </div>
        </template>
    </el-upload>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    fileList:null|Array<string>
    limit: number,
    tips: string,
    url:string,
    autoUpload:boolean,
    httpRequest:Function,
    disabled:boolean,
    showFileList:boolean,
    name:string,
    multiple:boolean,
    method:string
    headers: any
}>(), {
    tips:'jpg/png files with a size less than 500KB.',
    fileList:null,
    url:"https://localhost:80/egg/uploadImage",
    autoUpload:true,
    httpRequest:()=>{},
    disabled:false,
    showFileList:false,
    name:"file",
    multiple:true,
    method:'post',
    headers:{}
})

/*
  自动义上传规则
*/
const handleUpload=()=>{}

const handlePreview = () => { }

const handleRemove = () => { }

const beforeRemove = () => { }

const handleExceed = () => {

}

</script>