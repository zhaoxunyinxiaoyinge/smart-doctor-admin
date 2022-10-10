<script setup lang="ts">
const props = withDefaults(defineProps<{ columnField: any, show: boolean }>(), {
    columnField:[],
    show: false
})
</script>

<template>
    <transition :enter-active-class="show?'animate__animated bounce':''" :leave-active-class="show?'animate__animated bounce':''">
        <div v-if="show" class="table-column">
            <div v-for=" item in  props.columnField" class="table-column-item">
                <span>{{item.label}}</span>
                <el-checkbox :label="item.value"></el-checkbox>
            </div>
        </div>
    </transition>

</template>

<style lang="scss" scoped>
.table-column {
    position: absolute;
    left: 0;
    background-color: #fff;
    z-index: 5;
    display: flex;
    flex-direction: column;
    width: 250px;
    border: 1px solid #ccc;
    min-height: 300px;

    .table-column-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        height: 40px;
        padding: 0px 10px;
    }
}
</style>