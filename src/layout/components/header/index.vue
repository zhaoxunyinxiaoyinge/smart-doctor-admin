<script lang="ts">
import { defineComponent } from 'vue'

import inli8 from "@/layout/components/in8/index.vue"
import Dropdown from "@/layout/components/dropdown/index.vue"
import screenFull from "@/layout/components/header/screen.vue"
import CanleDaner from "@/layout/components/header/caledaner.vue";
import svgIcon from '@/components/icons/svg-icon.vue';

import { userstore } from "@/store/expmle"


import { useDark, useToggle } from '@vueuse/core'

export default defineComponent({
    setup() {
        let color = ref<string>('#fff');
        let bg = ref(false);
        const store = userstore();
        const isDark = useDark({
        });
        const toggleDark =useToggle(isDark); 
        const chaneSize = (command: string) => {
            store.setSize(command);
        }

        return {
            color,
            bg,
            toggleDark,
            chaneSize,
            store
        }

    },
    components: {
        inli8,
        Dropdown,
        screenFull,
        CanleDaner,
        svgIcon
    }
})
</script>
<template>
    <section class="flex flex-end align-items justifly-center ">
        <!-- 缩放组件 -->
        <screenFull></screenFull>
        <!-- <! color -->
        <el-color-picker v-model="color" />

        <!-- 日期组件 -->
        <CanleDaner></CanleDaner>
        <!-- 全屏组件 -->

        <!-- 字体选择 -->

        <!-- 国际化 -->
        <inli8></inli8>

        <!-- 通知 -->
        <el-dropdown @command="chaneSize" class="margin-right-10">
            <span class="el-dropdown-link">
                {{ store.size }}
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="small">small</el-dropdown-item>
                    <el-dropdown-item command="large">large</el-dropdown-item>
                    <el-dropdown-item command="default">default</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>

        <!-- 点击帮助 -->


        <el-button type="primary" class="margin-right-10">点击帮助</el-button>

        <el-badge :value="12" class="item badge" >
            <el-icon class="margin-right-10" :size='24'>
                <svgIcon :names="'bell'"></svgIcon>
            </el-icon>
        </el-badge>


        <!-- 下拉框 -->
        <Dropdown class="margin-right-10"></Dropdown>

        <el-switch @change="toggleDark" v-model="bg"></el-switch>

        <el-avatar shape="square"  class="margin-left-10" :size="40"
            :src="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'" />
    </section>
</template>

<style lang="scss"  scoped>
@import "./../../../assets/scss/common.scss";
</style>