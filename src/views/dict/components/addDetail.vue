<script lang="ts" setup>
import Form from "@/components/forms/index.vue";
import { putDictDetail, postDictDetail } from "@/views/dict/api/index";
import { ElMessage } from "element-plus";
import { defineEmits, withDefaults } from "vue";

type fun = () => ({});

const formConfig = reactive([
    {
        type: 'input',
        label: "字典标签",
        name: "dictLabel",
        width: 100
    },
    {
        type: 'input',
        label: "英文标签",
        name: "dictLabelEn",
        width: 100
    },
    {
        type: 'input',
        label: "字典值",
        name: "dictValue",
        width: 100
    },
    {
        type: 'input',
        label: "字典排序",
        name: "dictOrder",
        width: 100
    },
    {
        type: 'select',
        label: "字典状态",
        name: "dictLabelStatus",
        width: 100,
        options: [
            {
                label: '是',
                value: 1
            },
            {
                label: '否',
                value: 0
            }
        ]
    },
    {
        type: 'input',
        label: '字典注释',
        name: 'dictLabelComment',
        width: 100
    }
])

const formId = ref<typeof Form | null>(null);

const emits = defineEmits<{ (e: "close"): void, (e: 'update'): void }>();

const propss = withDefaults(defineProps<{ dialogVisible: boolean, isEdit: boolean, deitalData: null | { id?: number, dictLabe: string, dictLabelEn: string, dictValue: number, dictOrder: number, dictLabelStatus: number, dictLabelComment: string } }>(), {
    dialogVisible: false,
    isEdit: false,
    deitalData: null
})

const handleClose = () => {
    emits("close");
}

const handleCommit = () => {
    let data = formId.value?.formData;
    if (propss.isEdit) {
        putDictDetail(data).then((res: any) => {
            if (res.code == 1) {
                ElMessage.success("更新成功");
            }

            emits("close");
            emits("update");
        })
    } else {
        postDictDetail(data).then((res: any) => {
            if (res.code == 1) {
                ElMessage.success("添加成功");
            }
            emits("close");
            emits("update");
        })
    }

}


watch(() => propss.dialogVisible, (cur, old) => {
    if (propss.isEdit && cur) {
        nextTick(() => {
            propss.deitalData && Object.keys(propss.deitalData).forEach(name => {
                if (formId.value && propss.deitalData) {
                    formId.value.formData[name] = propss.deitalData[name];
                }

            })
        })
    }

    if (!propss.isEdit) {
        nextTick(() => {
            propss.deitalData && Object.keys(propss.deitalData).forEach(name => {
                if (formId.value && propss.deitalData) {
                    formId.value.formData[name] = propss.deitalData[name];
                }

            })
        })
    }
}, {
    immediate: true,
    deep: true
})


</script>
<template>
    <el-dialog :dialogVisible="propss.dialogVisible" :title="propss.isEdit ? '编辑' : '新增'" width="50%"
        :before-close="handleClose">
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