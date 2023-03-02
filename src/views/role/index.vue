<script lang="ts" setup>
import { onMounted } from "vue";
import From from "@/components/forms/index.vue";
import Pagetion from "@/components/pagetions/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import { getRoleList, postRole, deleteRole, getDetail, updateRole } from "@/views/role/api/index";
import { getMenuList } from "@/views/menu/api/index";
import FormId from "@/components/forms/index.vue";
import Tree from "@/components/tree/index.vue";
import { userstore } from "@/store/expmle";
import { ElMessage, ElMessageBox } from "element-plus";
import { jsonToTree } from "@/utils/common"

const store = userstore();
const formatters = (row: { status: number }) => {
    if (row.status === 0) {
        return "正常"
    } else {
        return '停用'
    }
}

const tableConfig = reactive<Array<{ label: string, width?: number | undefined | string, props: string, formatter?: (row: ({ status: number })) => string }>>([
    {
        label: "角色名称",
        width: 'auto',
        props: 'roleName',
    },
    {
        label: "状态",
        width: 'auto',
        props: 'status',
        formatter: formatters
    },
    {
        label: "创建时间",
        props: "createTime",
    },
    {
        label: "更新时间",
        props: "updateTime"
    },
    {
        label: "操作",
        props: ""
    }
])

const formConfig = reactive([
    {
        type: 'input',
        label: "角色名称",
        name: "name",
        width: 100,
        placeholder: "请填写角色名称"
    },
    {
        type: "select",
        label: "使用状态",
        name: "status",
        width: 100,
        options: [
            {
                label: "是",
                value: 0
            },
            {
                label: "否",
                value: 1
            }
        ]
    }
]);

const formEdit = reactive([
    {
        type: 'input',
        label: "角色名称",
        name: "roleName",
        width: 100
    }
])


const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const tableData = reactive<any>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formId = ref<typeof FormId | null>(null);
const tree = ref<typeof Tree | null>(null);
const loading = ref(false);
const menuList = reactive<any>([]);
const defaultCheckedKeys = reactive([]);

const getData = (params: object) => {
    tableData.length = 0;
    loading.value = true;
    getRoleList({ ...params, page: page.value, pageSize: pageSize.value }).then((res: any) => {
        if (res.code == 1) {
            tableData.push(...res.data.records);
            total.value = res.data.total;
            page.value = res.data.current;
            pageSize.value = res.data.size;
        }
    }).finally(() => {
        loading.value = false;
    })
}

const getMenuAll = () => {
    getMenuList({ page: 1, pageSize: 9999 }).then((res: any) => {
        if (res.code == 1) {
            let arr: any[] = []
            arr.push(...res.data.records);
            menuList.push(...jsonToTree(arr, 'id'));
        }
    })
}

const handleSearch = (val: any) => {
    page.value = 1;
    tableData.length = 0;
    getData({ ...val })
}

onMounted(() => {
    getData({});
    getMenuAll();

})

// 编辑弹窗
const handleEdit = (id: number) => {
    isEdit.value = true;
    getDetail({ id }).then((res: any) => {
        if (res.code == 1) {
            dialogVisible.value = true;
            nextTick(() => {
                if (formId.value) {
                    formId.value.formData.roleName = res.data.role.roleName;
                    formId.value.formData.id = res.data.role.id;
                }
                if (tree.value) {
                    tree.value?.setChecked(res.data.ids.sort());
                }
            })


        }
    })

}

// 新增弹框
const handleInscrement = () => {
    isEdit.value = false;
    dialogVisible.value = true;
}

const handleClose = () => {
    tree.value?.clearChecked();
    formId.value != null && (formId.value.formData.roleName = '');
    formId.value != null && (formId.value.formData.id = null);
    dialogVisible.value = false;

}

const handleDelete = (id: number) => {
    ElMessageBox.confirm(
        "确定要删除该条数据",
        "删除",
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(res => {
        return deleteRole(id);
    }).then(res => {
        getData({})
        ElMessage.success("删除成功")
    })
}

const handleCommit = () => {
    let formData = formId.value?.formData;
    let treeData = tree.value?.getCheckedNodeKeys();
    if (!isEdit) {
        postRole({ role: { ...formData, status: 0 }, ids: [...treeData] }).then((res: any) => {
            if (res.code == 1) {
                ElMessage.success("新增角色成功");
            }
        }).finally(() => {
            formId.value != null && (formId.value.formData = {});
            tree.value?.clearChecked();
            dialogVisible.value = false;
            getData({});
        })
    } else {
        updateRole({ role: { ...formData, status: 0 }, ids: [...treeData] }).then((res: any) => {
            if (res.code == 1) {
                ElMessage.success("新增角色成功");
            }
        }).finally(() => {
            formId.value != null && (formId.value.formData = {});
            tree.value?.clearChecked();
            dialogVisible.value = false;
            getData({});
        })
    }


}

const handlePage = (val: number) => {
    page.value = val;
    getData({});
}

const handleSize = (size: number) => {
    pageSize.value = size;
    getData({});
}


</script>

<template>
    <Fragment>
        <From :formField="formConfig" @search="handleSearch" :inline="true"></From>
        <PageHeader @add="handleInscrement"></PageHeader>
        <div class="margin-top-20 margin-left-20 margin-right-20 margin-bottom-20 flex-1">
            <el-table :data="tableData" v-loading="loading" height="100%">
                <template :key="index" v-for="(item, index) in tableConfig">
                    <el-table-column v-if="item.label !== '操作'" :width="item.width" :label="item.label"
                        :formatter="item.formatter" :prop="item.props"></el-table-column>
                    <el-table-column v-else :label="item.label">
                        <template #default="scope">
                            <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
                            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </template>
            </el-table>

            <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑' : '新增'" width="50%" :before-close="handleClose">
                <FormId :form-field="formEdit" :inline="false" ref="formId">
                    <template v-slot:tree>
                        <span style="width:100px;display: inline-block;text-align: center;">
                            <slot name="label">
                                权限列表
                            </slot>

                        </span>
                        <Tree :data="menuList" :default-props="{ label: 'title', child: 'children' }" ref="tree"
                            :defaultCheckedKeys="defaultCheckedKeys">
                        </Tree>
                    </template>
                </FormId>

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
        <Pagetion :small="true" :current-page="page" :page-size="pageSize" :total="total" @page="handlePage"
            @size="handleSize">
        </Pagetion>
    </Fragment>
</template>