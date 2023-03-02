<script  lang="ts" setup>

import LayoutVecity from "@/layout/layoutvecity/index.vue";
import LayoutTransverse from "@/layout/layoutTransverse/index.vue";
import LayoutColums from "@/layout/layoutColums/index.vue";
import LayoutClassic from "@/layout/layoutClassic/index.vue";
import Draws from "@/layout/components/draw/index.vue";
import { theme } from "@/store/theme";

const store = theme();

const layComponent: any = {
  vertical: LayoutVecity,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColums
}

</script>

<template>
  <div>
    <component :is="layComponent[store.layoutName]" />
    <Draws></Draws>
  </div>
</template>
