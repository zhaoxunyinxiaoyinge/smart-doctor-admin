<script lang="ts" setup>
import { ModelRef } from 'vue';

/**
 * @ 这里主要是外部使用v-model时的指定的属性值
 */
const model = defineModel();
const modelValue=computed(()=>model.value?model.value:"");
</script>

<template>
  <input
    type="text"
    class="input"
    v-model="modelValue"
  >
</template>
<style scoped>
    .input {
        height:40px;
        margin:20px;
        width: 600px;
        padding: 0 0  0 30px;
    }
</style>