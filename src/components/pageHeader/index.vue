<script lang="ts" setup>
import { defineEmits } from "vue";
const emits = defineEmits<{
    (e: 'add'): void
}>();

const handleAdd = () => {
    emits("add");
}
</script>
<template>
    <div class="page-header flex margin-bottom-20 margin-left-20 justifly-betwwen">
        <el-button type="primary" @click="handleAdd"><el-icon>
                <Plus />
            </el-icon>新增</el-button>
        <div class="margin-right-20">
            <el-button type="primary"><el-icon>
                    <Printer />
                </el-icon>打印</el-button>
            <el-button><el-icon>
                    <Files />
                </el-icon>导出</el-button>
        </div>
    </div>
</template>