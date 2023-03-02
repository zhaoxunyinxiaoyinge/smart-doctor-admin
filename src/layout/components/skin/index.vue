<script   lang="ts" setup>
    import svgIcon from '@/components/icons/svg-icon.vue';
    import Bus from "@/views/provides/bus";

    const handleDrawVisble=()=>{
        Bus.emit('visable',true);
    }
</script>

<template>
    <div class="margin-right-10 margin-left-10" @click="handleDrawVisble">
        <svg-icon :names="'huanfu'"></svg-icon>
    </div>
</template>