<template>
    <div class="container">
        <Upload @success="handleSuccess" :tips="tips" :show-file-list="true"></Upload>
    </div>
</template>
<script lang="ts" setup>
import Upload from "@/components/upload/index.vue";
import type { success } from "@/components/upload/index"

const tips = ref("请上传一张图片");
const fileList: Array<string> = [];
const handleSuccess = (res: success) => {
    console.log(res.data);
}
</script>

<style scoped  lang="scss">
.container {
    padding: 20px;
    display: flex;
    justify-content: flex-start;
}
</style>