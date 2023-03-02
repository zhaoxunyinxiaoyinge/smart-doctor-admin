<script>
import WangDeit from "./../../components/editor/index.vue"
export default {
    name: 'editor',
    components: {
        WangDeit
    },
    setup() {

        const getValue = (val) => {
            console.log(val, "富文文本编辑器传过来的值");
        }

        const handleRest = () => {
            console.log("harst")
        }

        const handleAdd = () => {
            console.log("harst")
        }
        return {
            getValue,
            handleRest,
            handleAdd
        }
    }
}
</script>

<template>
    <div class="padding-left-10 padding-right-10 padding-top-10 padding-bottom-10">
        <wang-deit @current-val="getValue"></wang-deit>
        <div class="flex margin-top-10">
            <el-button type="primary" @click="handleAdd">添加</el-button>
            <el-button type="primary" @click="handleRest">重置</el-button>
        </div>
    </div>
</template>