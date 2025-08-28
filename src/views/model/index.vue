<script lang="ts" setup>
import TestModel from "./components/TestModel.vue";
const val = ref<string>("");
const getCurrentVal = (str: string|null|undefined) => {
    val.value = str  as string ;
}
</script>
<template>
  <div>
    <TestModel
      v-model="val"
      @update:modelValue="getCurrentVal"
    />
    <div>{{ val }}</div>
  </div>
</template>