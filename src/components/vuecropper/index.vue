<template>
  <div id="copper" ref="container" style="width: 200px;height:200px;" />
</template>
<script setup lang="ts">
import { onActivated, ref, onDeactivated, computed, watchEffect } from 'vue';
import Cropper from "cropperjs";
const container = ref();
let cropper: any = null;

let url = computed(() => {
  return porps.url ?? porps.file;
})
onActivated(() => {
  createImage();
})

const createImage =async () => {
  let img = new Image();
  img.crossOrigin="anonymous";
  img.src =await loadImage(url.value+"?t="+Date.now())
  img.onload = () => {
    initImage(img);
  }
  container.value?.append(img);
}

const loadImage=async(url:string)=>{
  let resp=await fetch(url,{
    method:"get",
  });
  return URL.createObjectURL(await resp.blob());
}

const initImage =  async(img: HTMLImageElement) => {
  if (porps.file || porps.url) {
    if (cropper) {
      cropper = null;
    }
    cropper = new Cropper(img, {
      // aspectRatio: NaN,
      // viewMode: 1, // Restricts the crop box to the image boundaries
      // guides: true, // Shows the grid lines，
      // cropBoxResizable: true,
      // dragMode: 'crop',
    });
    let canvas = cropper.getCropperCanvas();
    canvas.style.height = "200px";
  }
}


onDeactivated(() => {
  container.value.replaceChildren();
})

const porps = defineProps<{
  file: any,
  url?: string
}>();

watchEffect(() => porps.url,
  {
    onTrigger() {
      container.value.replaceChildren();
      createImage();
    }
  }
)
</script>
<style lang="scss" scoped></style>