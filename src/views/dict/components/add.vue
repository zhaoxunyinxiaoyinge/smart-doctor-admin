<script lang="ts" setup>
import Form from "@/components/forms/index.vue";
import { postDict, putDict } from "@/views/dict/api/index";
import { ElMessage } from "element-plus";
import { defineEmits, withDefaults } from "vue";
const formConfig = reactive([
    {
        type: 'input',
        name: "type",
        label: "字典类型",
        width: 100
    },
    {
        type: 'input',
        name: "mark",
        label: "备注",
        width: 100
    }
])

const eimt = defineEmits<
    {
        (e: "close"): void,
        (e: "update"): void
    }
>()

const formId = ref<typeof Form | null>(null);

const handleClose = () => {
    eimt("close");
}

const handleCommit = () => {
    if (props.isEdit) {
        const data = formId.value?.formData;
        putDict({ ...data }).then((res: any) => {
            if (res.code == 1) {
                ElMessage.success("编辑成功");
                eimt("update")
            }
        }).finally(() => {
            eimt("close");
        })
    } else {
        const data = formId.value?.formData;
        postDict({ ...data }).then((res: any) => {
            if (res.code == 1) {
                ElMessage.success("新增成功");
                eimt("update")
            }
        }).finally(() => {
            if (formId.value) {
                Object.keys(formId.value.formData).forEach(item => {
                    if (formId.value) {
                        formId.value.formData[item] = "";
                    }

                })
            }
            eimt("close");
        })
    }

}

const props = withDefaults(defineProps<{
    dialogVisible: boolean,
    isEdit: boolean,
    formData: any
}>(), {
    dialogVisible: false,
    isEdit: false,
    formData: {}
})

watch(() => props.dialogVisible, () => {
    if (props.dialogVisible && props.isEdit) {
        nextTick(() => {
            Object.keys(props.formData).forEach(name => {
                if (formId.value) {
                    formId.value.formData[name] = props.formData[name];
                }

            })
        })

    }

})

</script>
<template>
    <el-dialog :model-value="dialogVisible" :title="props.isEdit ? '编辑' : '新增'" width="50%" :before-close="handleClose">
        <Form ref="formId" :form-field="formConfig"></Form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleCommit">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>