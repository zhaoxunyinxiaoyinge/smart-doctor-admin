<template >
    <!-- 这里是原生插槽的写法 -->
    <div @click="triggerEvent"><slot name="my-text" >My default text</slot>
    </div>
</template>
<script lang="ts" setup>
const emits=defineEmits(['testss']);
defineProps({
    title: String
})

const triggerEvent = () => {
    emits('testss', 'googo');
}
</script>