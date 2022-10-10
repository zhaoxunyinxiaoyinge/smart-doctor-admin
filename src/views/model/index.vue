<script lang="ts" setup>
import TestModel from "./components/TestModel.vue";
const val = ref<String>("");
const getCurrentVal = (str: String|null|undefined) => {
    val.value = str as string;
}
</script>
<template>
    <div>
        <TestModel v-model.capitalize="val" @update:modelValue="getCurrentVal"></TestModel>
        <div>{{val}}</div>
    </div>
</template>