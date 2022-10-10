<script lang="ts">
import screenfull from "screenfull";
import svgIconVue  from "@/components/icons/svg-icon.vue";

export default defineComponent({
  components:{
    svgIconVue
  },
  setup() {
    const toggleScreen = () => {
      if (!screenfull.isEnabled) {
        screenfull.toggle();
      } else {
        screenfull.toggle();
      }
    }

    const changescreen = () => {

    }

    return {
      toggleScreen
    }
  }
})

</script>

<template>
    <span class="fullscreen"   @click="toggleScreen">
          <svgIconVue :names='"fullscreen"'  />
    </span>
</template>

<style lang="scss">
  @import "@/assets/scss/layout.module.scss";
</style>
