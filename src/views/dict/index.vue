<script lang="ts" setup>
import { onMounted } from "vue";
import From from "@/components/forms/index.vue";
import Pagetion from "@/components/pagetions/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import { getDictList, getDetial, DeleteDict } from "@/views/dict/api/index";
import { useRouter } from "vue-router";
import Add from "@/views/dict/components/add.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();

const tableConfig = reactive<Array<{ label: string, width?: number | undefined | string, props: string }>>([
    {
        label: "编号",
        width: "auto",
        props: "id",
    },
    {
        label: "字典类型",
        width: 'auto',
        props: 'type',
    },
    {
        label: "备注",
        width: 'auto',
        props: 'mark',
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
        label: "字典类型",
        name: "type",
        width: 100
    },
    {
        type: 'input',
        label: "备注",
        name: "mark",
        width: 100
    }
]);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const tableData = reactive<any>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formData = reactive<any>({});

const getData = (params: object) => {
    tableData.length = 0;
    getDictList({ ...params, page: page.value, pageSize: pageSize.value }).then((res: any) => {
        if (res.code == 1) {
            tableData.push(...res.data.records);
            total.value = res.data.total;
            page.value = res.data.current;
            pageSize.value = res.data.size;
        }
    })
}

const handleSearch = (val: any) => {
    tableData.length = 0;
    page.value = 1;
    getData({ ...val })
}

const handleClick = (row: any, column: any, cell: any, event: any) => {
    if (column.property == "type") {
        router.push({ path: "/menu/dict/detail", query: { dictId: row.id } });
    }
}

const handleAdd = () => {
    dialogVisible.value = true;
    Object.keys(formData).length > 0 && Object.keys(formData).forEach(item => {
        formData[item] = '';
    })
}

const handleEdit = (val: number) => {
    getDetial({ id: val }).then((res: any) => {
        if (res.code == 1) {
            Object.keys(res.data).forEach((name: any) => {
                if (name != 'id' || name != "createTime" || name != "updateTime") {
                    formData[name] = res.data[name];
                }
            })
            dialogVisible.value = true;
            isEdit.value = true

        }
    })
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
        return DeleteDict(id);
    }).then(res => {
        getData({})
        ElMessage.success("删除成功")
    })
}

const handleClose = () => {
    dialogVisible.value = false;

}

const handleUpdate = () => {
    getData({});
}


onMounted(() => {
    getData({});
})

</script>

<template>
    <Fragment>
        <From :formField="formConfig" :inline="true" @search="handleSearch"></From>
        <PageHeader @add="handleAdd"></PageHeader>
        <div class="margin-top-20 margin-left-20 margin-right-20 margin-bottom-20 flex-1">
            <el-table :data="tableData" @cell-click="handleClick" height="100%">
                <template v-for="(item, index) in tableConfig">
                    <el-table-column :key="index" v-if="item.label !== '操作'" :width="item.width" :label="item.label"
                        :prop="item.props"></el-table-column>
                    <el-table-column v-else :label="item.label" :key="index">
                        <template #default="scope">
                            <el-button type="primary" @click='handleEdit(scope.row.id)'>编辑</el-button>
                            <el-button type="danger" @click='handleDelete(scope.row.id)'>删除</el-button>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <Add :formData="formData" :dialog-visible="dialogVisible" :is-edit="isEdit" @close="handleClose"
                @update="handleUpdate"></Add>

        </div>
        <Pagetion :small="true" :current-page="page" :page-size="pageSize" :total="total"></Pagetion>
    </Fragment>
</template>