<script lang="ts" setup>
import { ElDialog, ElForm, ElFormItem, ElRadioGroup, ElRadio, ElInput, ElButton, ElMessage } from 'element-plus';
import { postMenu, putMenu } from "@/views/menu/api/index";
import _ from "lodash";
import { withDefaults, defineEmits } from "vue";

let form = reactive<{
    status: number, isMenu: number, parentMenu: string | number, routePath: string, menuName: string, icon: string, names: string, component: string,
    redirect?: string, isOutLink: number, hidden: number, perssion: string, id?: number | null
} | any>({
    id: null,
    isMenu: 0,
    parentMenu: 'layout',
    routePath: "",
    menuName: "",
    icon: "",
    names: "",
    component: '',
    redirect: "",
    status: 1,
    isOutLink: 1,
    hidden: 1,
    perssion: ''
});


let coypyForm: any = {
    id: null,
    isMenu: 0,
    parentMenu: 'Layout',
    routePath: "",
    menuName: "",
    icon: "",
    names: "",
    component: '',
    redirect: "",
    status: 1,
    isOutLink: 1,
    hidden: 1,
    perssion: ''
};

const propss = withDefaults(defineProps<{ dialogVisible: boolean, isEdit: boolean, opearte: boolean, formData: any, selectData: [] | null }>(), {
    dialogVisible: false,
    isEdit: false,
    opearte: false,
    formData: {},
    selectData: null
})

const emit = defineEmits<{
    (e: 'close'): void
}>()

const handleClose = () => {
    emit("close");
}

const handleCommit = () => {
    let data = {};
    let coypForm = _.cloneDeep(toRaw(form)) as Partial<{
        status: number, isMenu: number, parentMenu: string, routePath: string, menuName: string, icon: string, names: string, component: string,
        redirect?: string, isOutLink: number, hidden: number, perssion: string
    }>;
    if (form.parentMenu == 0 || form.parentMenu == 'Layout') {
        delete coypForm.parentMenu;
        data = { ...coypForm, parentId: null };
    } else {
        let parentId = form.parentMenu;
        delete coypForm.parentMenu;
        data = { ...coypForm, parentId: parentId }
    }
    if (!propss.isEdit) {

        postMenu(data).then((res: any) => {
            if (res.code == 1) {
                ElMessage.success("新增菜单成功");
            }
        }).finally(() => {
            emit("close");
        })
    } else {
        // 这里处理编辑的情况   
        putMenu(data).then((res: any) => {
            if (res.code == 1) {
                ElMessage.success("编辑菜单成功");
            }
        }).finally(() => {
            emit("close");
        })
    }
}

watch(() => propss.dialogVisible, (current, old) => {
    // 对新增和不同的编辑值进行赋值
    if (current) {
        if (!propss.isEdit) {
            form.parentMenu = "layout";
            Object.keys(form).forEach(item => {
                form[item] = coypyForm[item];
            })
        }
        else {
            //编辑菜单页面
            nextTick(() => {
                Object.keys(form).forEach((item: string) => {
                    if (item == 'parentMenu') {
                        if (!propss.formData["parentId"]) {
                            form['parentMenu'] = 0;
                        } else {
                            form['parentMenu'] = propss.formData["parentId"];;
                        }

                    } else {
                        form[item] = propss.formData[item];
                    }
                })
            })
        }
    }
}, {
    immediate: true,
})


</script>

<template>
    <div>
        <el-dialog :dialogVisible="propss.dialogVisible" :title="propss.isEdit ? '编辑' : '新增'" width="50%"
            :before-close="handleClose">
            <el-form :inline="false" label-width="100px">
                <el-form-item label="选项">
                    <el-radio-group v-model="form.isMenu" :disabled="isEdit">
                        <el-radio :label="0"> 目录</el-radio>
                        <el-radio :label="1">菜单</el-radio>
                        <el-radio :label="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="上级菜单">
                    <el-tree-select v-if="propss.selectData" :disabled="isEdit" required clearable
                        :propss="{ label: 'title', children: 'children' }" :node-key="'id'" v-model="form.parentMenu"
                        :data="[{ title: 'Layout', id: 0 }, ...propss.selectData]" check-strictly
                        :render-after-expand="false" />
                </el-form-item>

                <el-form-item label="路由路径" v-if="form.isMenu == 0 || form.isMenu == 1">
                    <el-input v-model="form.routePath"></el-input>
                </el-form-item>

                <el-form-item label="图标" v-if="form.isMenu == 0 || form.isMenu == 1">
                    <el-input v-model="form.icon"></el-input>
                </el-form-item>

                <el-form-item label="菜单">
                    <el-input v-model="form.menuName"></el-input>
                </el-form-item>

                <el-form-item label="组件名称">
                    <el-input v-model="form.names"></el-input>
                </el-form-item>

                <el-form-item label="组件地址" v-if="form.isMenu == 1">
                    <el-input v-model="form.component"></el-input>
                </el-form-item>

                <el-form-item label="重定向地址" v-if="form.isMenu == 0">
                    <el-input v-model="form.redirect"></el-input>
                </el-form-item>

                <el-form-item label="是否停用">
                    <el-radio v-model="form.status" :label="0">是</el-radio>
                    <el-radio v-model="form.status" :label="1">否</el-radio>
                </el-form-item>


                <el-form-item label="是否外链" v-if="form.isMenu == 0 || form.isMenu == 1">
                    <el-radio v-model="form.isOutLink" :label="1">否</el-radio>
                    <el-radio v-model="form.isOutLink" :label="0">是</el-radio>
                </el-form-item>

                <el-form-item label="是隐藏" v-if="form.isMenu == 0 || form.isMenu == 1">
                    <el-radio v-model="form.hidden" :label="0">是</el-radio>
                    <el-radio v-model="form.hidden" :label="1">否</el-radio>
                </el-form-item>
                <el-form-item label="权限" v-if="form.isMenu == 2">
                    <el-input v-model="form.perssion"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleCommit">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>