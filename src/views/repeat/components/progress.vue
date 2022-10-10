
<script lang="ts" setup>
const emits = defineEmits(['submit']);

let res = (): Promise<number> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(456)
        }, 2000);
    })
}
defineProps({
    width: {
        type: Number,
        required: true
    },
    percentage: Number,
    status: {
        type: String,
        required: true
    }
})
await res();
const slot = useSlots();
const attrs = useAttrs();

const handleCommitEvent = () => {
    emits('submit', { name: 'emits' })
}

defineExpose({
    width: 40,
    percentage: 12,
})



</script>
<template>
    <div>
        <el-progress :text-inside="true" :stroke-width="width" :percentage="percentage" status="success">
            <template #default="{ percentage }">
                <span>{{ percentage }}%</span>
            </template>
        </el-progress>
        <slot :text="'xiaomei'" name="header"></slot>
        <el-button @click="handleCommitEvent">查看一下</el-button>
    </div>
</template>