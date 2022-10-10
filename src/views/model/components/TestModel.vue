<script lang="ts" setup>
/**
 * @ 这里主要是外部使用v-model时的指定的属性值
 */
import { ref, reactive, defineProps, defineEmits } from "vue";
const props = withDefaults(defineProps<{modelValue:String,modelModifiers:Function}>(), {
    modelModifiers:()=>({})
});

const emit = defineEmits<{
    (e: "update:modelValue",val:String|undefined|null): void
}>();

const changeValue = (target:Event) => {
    let val=(target.target as HTMLInputElement).value; 
    emit("update:modelValue",val);

}

</script>

<template>
    <input class="input" :value="props.modelValue" @input="changeValue($event)" />
</template>
<style scoped>
    .input {
        height:40px;
        margin:20px;
        width: 600px;
        padding: 0 0  0 30px;
    }
</style>