<script lang="ts" setup>
const symbolId = computed(() => { return `#icon-${propsData.names}` })
const propsData = defineProps(
    {
        names: { type: String, required: true },
        prefix: {
            type: String,
            default: 'icon'
        }
    }
);

</script>

<template>
    <svg class="svg-size">
        <use :xlink:href="symbolId"/>
    </svg>
</template>

<style scoped>
.svg-size {
    font-size: 16px;
    height: 20px;
    width: 20px;
    color:#fff
}

.icons {
    color:#fff
}
</style>