<script setup lang="ts">
import { onMounted} from "vue";
import {previewPdf} from "@/hooks/usePdf";

const {loadFile}=previewPdf();
onMounted(async() => {
  const canvas=document.getElementById("canvas");
   await loadFile('http://localhost:8083/public/test.pdf',canvas as HTMLCanvasElement);
})
</script>

<template>
  <el-scrollbar height="100%">
    <div
      id="contaniner"
      class="pdf"
    >
      <canvas
        id="canvas"
        ref="canvas"
      />
    </div>
  </el-scrollbar>
</template>

<style scoped>
.pdf {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>