<script lang="ts" setup>
import TestModel from "./components/TestModel.vue";
const val = ref<string>("");
</script>
<template>
  <div>
    <TestModel
      v-model.lazy="val"
    />
    <div>{{ val }}</div>
  </div>
</template>