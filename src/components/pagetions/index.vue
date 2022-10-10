<script lang="ts" setup>
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
        <el-pagination v-model:currentPage="props.currentPage" v-model:page-size="props.pageSize"
            :page-sizes="[100, 200, 300, 400]" :small="props.small" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>

<style scoped>
    .pagetions {
        margin:10px 0;
        height: 60px;
        display: flex;
        align-items: center;
    }
</style>