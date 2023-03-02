<script lang="ts" setup>
import { Fragment, isProxy, onMounted } from "vue";
import { getMenuList, deleteMenu } from "@/views/menu/api/index";
import { jsonToTree } from "@/utils/common";
import From from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Add from "@/views/menu/components/addMenu.vue";
import { ElMessageBox, ElMessage, ElTable, ElTableColumn, ElButton } from "element-plus";
import { getDetail } from "@/views/menu/api/index";

import { TableColumnCtx } from "element-plus/lib/components/table/src/table-column/defaults";

type Menu = {
    id: number; menuName: string; routhPath: string; names: string; parentId: number; icon: string; status: number; hidden: boolean; isOutLink: boolean; orderNumber: number; isMenu: number; component: string; redirect: string
}

onMounted(() => {
    getData({});
})

let tableData = reactive<any>([]);
const currentPage = ref(1);
const total = ref(0);
const pageSize = ref(10);
const dialogVisible = ref(false);
const isEdit = ref(false);
const opearte = ref(false);
const selectData = reactive<any>([]);
const formData = reactive<Menu | any>({
    id: 0,
    menuName: "",
    routhPath: "",
    names: "",
    parentId: 0,
    icon: "",
    status: 0,
    hidden: false,
    isOutLink: false,
    orderNumber: 0,
    isMenu: 0,
    component: "",
    redirect: ""
});

const formConfig = reactive([
    {
        type: 'input',
        label: "菜单名称",
        name: "menuName",
        width: 120
    },
    {
        type: 'input',
        label: "组件名称",
        name: "name",
        width: 120
    },
    {
        type: 'input',
        label: "路由路径",
        name: "routePath",
        width: 120
    }
]);


const getData = (data: object) => {
    getMenuList({ ...data, page: 1, pageSize: 500 }).then((res: any) => {
        if (res.code == 1) {
            let data = jsonToTree(res.data.records, "id");
            data.forEach((item: any) => {
                tableData.push(item);
                selectData.push(item);
            }
            );
            currentPage.value = res.data.current;
            pageSize.value = res.data.size;
            total.value = res.data.total;
        }
    })
}


const getDetails = (id: number) => {
    getDetail({ id }).then((res: any & { code: number, data: Menu, msg: string }) => {
        console.log(res, "res")
        if (res.code == 1) {
            let arrs: Array<string> = Object.keys(res.data);
            arrs.forEach((item) => {
                formData[item] = res.data[item]
            })
            dialogVisible.value = true;
            isEdit.value = true;
        }
    })
}

const handleSearch = (val: any) => {
    tableData.length = 0;
    selectData.length = 0;
    getData({ ...val })
}

const handleAdd = () => {
    dialogVisible.value = true;
    isEdit.value = false;
    opearte.value = true;
}

const handleIncrement = () => {
    dialogVisible.value = true;
    isEdit.value = false;

}

const handleEdit = (id: number) => {
    getDetails(id)
}

const handleDelete = (_id: number) => {
    ElMessageBox.confirm(
        "确定要删除该条数据",
        "删除",
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(_res => {
        return deleteMenu(_id)
    }).then(_res => {
        getData({})
        ElMessage.success("删除成功")
    })
}

</script>

<template>
    <Fragment>
        <From :formField="formConfig" @search="handleSearch" :inline="true"></From>
        <div class="margin-left-20 margin-right-20 margin-top-20 margin-bottom-20 flex-1">
            <PageHeader @add="handleAdd"></PageHeader>
            <el-table :data="tableData" style="width: 100%" row-key="id" height="100%">
                <el-table-column prop="menuName" label="菜单名称" />
                <el-table-column prop="routePath" label="路由路径" />
                <el-table-column prop="names" label="name名称" />
                <el-table-column prop="icon" label="图标" />
                <el-table-column prop="status" label="状态" :formatter="(row: any, _column: TableColumnCtx<any>, _cellValue: any, _index: number) => {
                    return row.status == 1 ? '正常' : '暂停'
                }" />
                <el-table-column prop="component" label="组件路径" />
                <el-table-column label="操作" width="250" fixed="right">
                    <template #default="scope">
                        <div class="flex">
                            <el-button type="primary" @click="handleIncrement">新增</el-button>
                            <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
                            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                        </div>

                    </template>
                </el-table-column>
            </el-table>
            <Add :dialogVisible="dialogVisible" :is-edit="isEdit" @close="dialogVisible = false" :opearte="opearte"
                :formData="formData" :selectData="selectData"></Add>
        </div>
    </Fragment>
</template>