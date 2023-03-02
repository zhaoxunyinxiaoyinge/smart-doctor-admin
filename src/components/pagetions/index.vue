<script lang="ts" setup>
import { defineEmits, withDefaults } from "vue";
const props = withDefaults(defineProps<{
    currentPage: number,
    pageSize: number,
    small: boolean,
    total: number
}>(), {
    currentPage: 1,
    pageSize: 10,
    small: true,
    total: 0
})

const emits = defineEmits<{
    (e: "page", page: number): void,
    (e: 'size', size: number): void
}>();

const background = ref(false);

const handleSizeChange = (page: number) => {
    emits("size", page);
}
const handleCurrentChange = (size: number) => {
    emits("page", size);
}
</script>

<template>
    <div class="pagetions">
        <el-pagination :currentPage="props.currentPage" :page-size="props.pageSize" :page-sizes="[10, 20, 30, 40]"
            :small="props.small" :background="background" layout="total, sizes, prev, pager, next, jumper"
            :total="props.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>

<style scoped>
.pagetions {
    margin: 0 20px;
    height: 50px;
    display: flex;
    align-items: center;
}
</style>