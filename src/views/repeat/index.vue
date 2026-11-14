<script lang="ts" setup>

import content from "@/assets/scss/layout.module.scss";
import BpmnJS from 'bpmn-js'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import leaveXml from './file.bpmn?raw'
import Modeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

const container=ref<HTMLDivElement|null>(null)
onMounted(async()=>{

  const viewer = new Modeler({
    container:container.value as HTMLDivElement
});
try {
  const { warnings } = await viewer.importXML(leaveXml);  // 强制把内容缩放到可视区
  if(container.value){
    const canvas=viewer.get("canvas") 
    canvas.zoom('fit-viewport', 'auto') ;
     for (const id of ['StartEvent_1', 'Task_Apply']) {
      if(container.value){
          canvas.addMarker(id, 'is-done') 
      }
      }     
  canvas.addMarker('Task_Manager', 'is-current')
  canvas.addMarker('Flow_3', 'is-current-flow')  // 正在走的线：流动
  }

  console.log('rendered');
} catch (err) {
  console.log('error rendering', err);
}


  // 当前停留的节点标蓝
 
})



</script>

<template>
    <div class="container" ref="container" id="canvas">
    </div>
</template>

<style scoped lang="css">
.el-card {
  margin: 5px;
  padding-top: 10px;
}

.container {
  height: 100%;
  min-height: 500px;
}

/* scoped 里要用 :deep() 穿透 */
:deep(.is-done .djs-visual > :nth-child(1)) {
  fill: #eaf3de !important;      /* 底色淡绿 */
  stroke: #639922 !important;    /* 边框绿 */
}
:deep(.is-current .djs-visual > :nth-child(1)) {
  fill: #e6f1fb !important;
  stroke: #185fa5 !important;
  stroke-width: 2.5px !important;  /* 加粗边框，视觉焦点 */
}
/* 走过的连线也变色 */
:deep(.is-done .djs-visual > path) {
  stroke: #639922 !important;
}


:deep(.is-current-flow .djs-visual > path) {
  stroke: #185fa5 !important;
  stroke-dasharray: 6 4;
  animation: flow 1s linear infinite;
}
:deep(.is-done .djs-visual > :nth-child(1)) {
  fill: #eaf3de !important;
  stroke: #639922 !important;
}
:deep(.is-done .djs-visual > path) {
  stroke: #639922 !important;
}

/* 画布：淡网格背景，替代死灰 */
:deep(.djs-container) {
  background-color: #fafbfc;
  background-image:
    linear-gradient(#eef0f2 1px, transparent 1px),
    linear-gradient(90deg, #eef0f2 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 节点文字加大加粗一点 */
:deep(.djs-label) {
  font-size: 13px !important;
  font-weight: 500;
  fill: #333;
}


@keyframes flow {
  to { stroke-dashoffset: -20; }
}

</style>