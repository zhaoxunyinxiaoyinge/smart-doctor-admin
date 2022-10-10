<script lang="ts" setup>
const range = reactive<Array<Date>>([new Date(2022, 7, 4), new Date(2022, 7, 20)]);
const canler = ref<Date>(new Date(2022, 7, 14));
const calendar = ref();
const visible = ref<Boolean>(false);
</script>

<template>
    <el-popover v-model:visible="visible" placement="bottom" :width="'50%'">
        <el-calendar ref="calendar" v-model="canler">
            <template #dateCell="{ data }">
                <p :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split('-').slice(1).join('-') }}
                    {{ data.isSelected ? '✔️' : '' }}
                </p>
            </template>
        </el-calendar>
        <template #reference>
            <el-button :class="rili.ml" @click="visible = true">日期</el-button>
        </template>
    </el-popover>
</template>

<style module="rili" >
.is-selected {
    color: #1989fa;
}

.ml {
    margin-left: 10px;
}
</style>