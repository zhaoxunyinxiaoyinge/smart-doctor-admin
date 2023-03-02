<script lang="ts" setup>
    import {withDefaults} from "vue";
    const props=withDefaults(defineProps<{height:number}>(),{
        height:60
    });
</script>

<template>
    <div class="logo" :style="{width:'200px'}">
        <el-image fit="contain" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi-1.lanrentuku.com%2F2020%2F11%2F6%2F9232f107-4dac-4006-9c7e-e825df5e52e1.png%3FimageView2%2F2%2Fw%2F500&refer=http%3A%2F%2Fi-1.lanrentuku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659237413&t=b141420c6ec2506048d76681aa122469"  :style="{height:props.height+'px'}"></el-image>
        <span>vite后台</span>
    </div>
</template>

<style lang="scss" scoped>
    .logo {
        width: auto;
        display: flex;
        align-items: center;
    }
</style>