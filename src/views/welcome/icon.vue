<script lang="ts" setup>
import SvgIcon from '@/components/icons/svg-icon.vue';
import content from "@/assets/scss/layout.module.scss";
import { copy } from "@/utils/common"


const list = reactive<Array<string>>([])
const svgList = import.meta.glob("@/icons/*.svg");
let svgKey = Object.keys(svgList);

let reg = /\/src\/icons\/(.+)\.svg$/ig;
svgKey.forEach(item => {
    let names = reg.exec(item);
    if (names) {
        list.push(names[1]);
    }
})


let copys = function (obj: string, text: string) {
    copy(obj, text)
}


</script>
<template>
    <el-scrollbar :height="content.routeContentHeight">
        <div style="display:flex;justify-content:flex-start;padding:10px;height: 100%;box-sizing: border-box;flex-wrap: wrap;">
            <div :id="item" @click="()=>{copys('#'+item,item)}"
                :style="{display:'inline-flex',width:'100px',height:'70px',flexDirection:'column',alignItems:'center'}"
                v-for="item in list" :key="item">
                <svg-icon :names="item"></svg-icon>
                <span :style="{fontSize:'12px'}">{{item}}</span>
            </div>
        </div>
    </el-scrollbar>

</template>
