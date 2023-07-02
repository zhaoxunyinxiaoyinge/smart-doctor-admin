<script lang="ts">
import { defineComponent } from 'vue'
import inli8 from "@/layout/components/in8/index.vue"
import Dropdown from "@/layout/components/dropdown/index.vue"
import screenFull from "@/layout/components/header/screen.vue"
import { useDark, useToggle } from '@vueuse/core'
import Skin from "@/layout/components/skin/index.vue";
import Driver from "driver.js";
import step from "@/config/step";
import "driver.js/dist/driver.min.css";
import { userstore } from "@/store/expmle"
import Cookies from 'js-cookie'

export default defineComponent({
    components: {
        inli8,
        Dropdown,
        screenFull,
        // svgIcon,
        Skin,
    },
    setup() {
        const isDark = useDark()
        const toggleDark = useToggle(isDark)
        let color = ref<string>('#fff');
        let bg = ref(false);
        const store = userstore();
        let drivers: Driver | null;

        const chaneSize = (command: string) => {
            store.setSize(command);
        }

        const handleHelp = () => {
            guild();
        }

        const guild = () => {
            drivers = new Driver();
            drivers != null && drivers.defineSteps(step);
            drivers?.start()
        }
        let img: string = typeof (Cookies.get('userinfo')) !== 'undefined' && JSON.parse(Cookies.get('userinfo') as string).avatar
        const avatar = ref<string>(img)

        return {
            color,
            bg,
            chaneSize,
            store,
            handleHelp,
            isDark,
            toggleDark,
            avatar

        }

    }
})
</script>
<template>
  <section class="flex flex-end align-items justifly-center ">
    <!-- 缩放组件 -->
    <screenFull />
    <!-- <! color -->
    <el-color-picker v-model="color" />

    <!-- 国际化 -->
    <inli8 />

    <!-- 换肤 -->
    <Skin />

    <!-- 通知 -->
    <el-dropdown
      class="margin-right-10"
      @command="chaneSize"
    >
      <span class="el-dropdown-link">
        {{ store.size == "default" ? '默认' : store.size == "large" ? '大' : '小' }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="small">
            小
          </el-dropdown-item>
          <el-dropdown-item command="large">
            大
          </el-dropdown-item>
          <el-dropdown-item command="default">
            默认
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 点击帮助 -->


    <el-button
      type="primary"
      class="margin-right-10"
      @click.stop="handleHelp"
    >
      点击帮助
    </el-button>

    <el-switch
      v-model="isDark"
      size="large"
      inline-prompt
      class="ml-2 margin-right-10"
      active-text="晚"
      inactive-text="白"
      @change="toggleDark"
    />

    <!-- 下拉框 -->
    <Dropdown class="margin-right-10" />
    <el-avatar
      shape="square"
      class="margin-left-10 margin-right-10"
      :size="40"
      :src="avatar"
    />
  </section>
</template>

<style lang="scss"  scoped>
@import "./../../../assets/scss/common.scss";
</style>