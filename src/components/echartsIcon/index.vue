<script setup lang="ts">
import * as echarts from "echarts";
import { defineProps, withDefaults, onMounted, nextTick, onUnmounted } from "vue";

let dom: HTMLElement | null;
let domCharts: any;

const props = withDefaults(defineProps<{
    id: string,
    options: echarts.EChartsCoreOption|undefined,
    styles: string
}>(), {
    id: "",
    options:undefined,
    styles: ""
})

onMounted(() => {
    nextTick(() => {
        dom = document.getElementById("source");
        domCharts = echarts.init(dom as HTMLElement);
        window.addEventListener("resize", bindMethod, false);
        domCharts.setOption(props.options);
    })

})

const bindMethod = () => {
    domCharts.resize();
}



onUnmounted(() => {
    window.removeEventListener('resize', bindMethod);
})

</script>

<template>
  <div
    :id="props.id"
    :style="props.styles"
  />
</template>

<style scoped>
</style>