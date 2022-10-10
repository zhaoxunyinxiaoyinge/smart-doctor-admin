<script lang="ts" setup>
import {ref} from "vue"
import Bus from "./bus";

let flag = ref<boolean>(false);
Bus.emit("flag", flag);
</script>
<template>
  <div></div>
</template>
