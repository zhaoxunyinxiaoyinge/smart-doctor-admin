<script lang="ts" setup>
import Form from "@/components/forms/index.vue";
import { postDivison, putDivison } from "@/views/division/api/index";
import { ElMessage } from "element-plus";
import { withDefaults } from "vue";
const formConfig = reactive([
    {
        type: 'input',
        name: "name",
        label: "部门名称",
        width: 100
    },
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
        putDivison({ ...data }).then((res: any) => {
            if (res.code == 1) {
                ElMessage.success("编辑成功");
                eimt("update")
            }
        }).finally(() => {
            eimt("close");
        })
    } else {
        const data = formId.value?.formData;
        postDivison({ ...data }).then((res: any) => {
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

    if (!props.dialogVisible) {
        if (formId.value) {
            Object.keys(formId.value.formData).length > 0 && Object.keys(formId.value.formData).forEach(item => {
                if (formId.value) {
                    formId.value.formData[item] = "";
                }
            })
        }
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