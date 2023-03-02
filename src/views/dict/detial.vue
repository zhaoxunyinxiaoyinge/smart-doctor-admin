<script lang="ts" setup>
import { reactive, onMounted, } from "vue";
import { useRoute } from "vue-router";
import From from "@/components/forms/index.vue";
import Pagetion from "@/components/pagetions/index.vue";
import { getDictDetail, getDictDetailDetail, delDictDetail } from "@/views/dict/api/index";
import PageHeader from "@/components/pageHeader/index.vue";
import DictDetail from "@/views/dict/components/addDetail.vue";
import { ElMessageBox, ElMessage } from "element-plus";


const route = useRoute();
const formatStatus = (row: any) => {
    return row.dictLabelStatus == 0 ? '停用' : '正常'
}
const tableConfig = reactive([
    {
        label: "字典编码",
        prop: "dictId",
        width: "auto"
    },
    {
        label: "字典标签",
        prop: "dictLabel",
        width: "auto"
    },
    {
        label: "英文标签",
        prop: "dictLabelEn",
        width: "auto"
    },
    {
        label: "字典键值",
        prop: "dictValue",
        width: "auto"
    },
    {
        label: "字典排序",
        prop: "dictOrder",
        width: "auto"
    },
    {
        label: "状态",
        prop: "dictLabelStatus",
        width: "auto",
        formatter: formatStatus
    },
    {
        label: "备注",
        prop: "dictLabelComment",
        width: "200"
    },
    {
        label: "创建时间",
        prop: "createTime",
        width: "200"

    },
    {
        label: "更新时间",
        prop: "updateTime",
        width: "200"

    },
    {
        label: "操作",
        labelWidth: 250
    },
])

const listQuery = reactive({
    page: 1,
    pageSize: 10,
    total: 0
})

const formField = reactive([{
    type: 'input',
    name: "dictLabel",
    label: "字典标签",
    width: 100
}, {
    type: "input",
    name: "dictLabelEn",
    label: "英文标签",
    width: 100,
}
])

const tableData = reactive<any>([]);

const dialogVisible = ref(false);
const isEdit = ref(false);
const deitalData = reactive<any>({});
const formId = ref<typeof From | null>(null);


onMounted(() => {
    const query = route.query.dictId ? route.query : { dictId: 1 };
    getData({ ...query })
})

const getData = (params: object) => {
    tableData.length = 0;
    getDictDetail({ page: listQuery.page, pageSize: listQuery.pageSize, ...params }).then((res: any) => {
        if (res.code == 1) {
            tableData.push(...res.data.records);
            listQuery.total = res.data.total;
            listQuery.page = res.data.current;
            listQuery.pageSize = res.data.size;
        }
    })
}

const handleSearch = (val: object) => {
    tableData.length = 0;
    listQuery.page = 1;
    const query = route.query.dictId ? route.query : { dictId: 1 };
    console.log(query, "query")
    getData({ ...val, ...query })
}


const handleAdd = () => {
    dialogVisible.value = true;
    isEdit.value = false;
    const query = route.query.dictId ? route.query : { dictId: 1 };
    deitalData.dictId = query.dictId;
}

const handleEdit = (id: number) => {
    getDictDetailDetail(id).then((res: any) => {
        if (res.code == 1) {
            Object.keys(res.data).forEach(name => {
                if (name !== "createTime" && name !== 'updateTime') {
                    deitalData[name] = res.data[name];
                    dialogVisible.value = true;
                    isEdit.value = true;
                }
            })
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
        return delDictDetail(id);
    }).then(res => {
        const formData = formId.value && formId.value.formData;
        const query = route.query ? route.query : { dictId: 1 };
        getData({ page: listQuery.page, pageSize: listQuery.pageSize, ...query, ...formData })
        ElMessage.success("删除成功")
    })
}

const handleClose = () => {
    Object.keys(deitalData).forEach(item => {
        deitalData[item] = "";
    })
    dialogVisible.value = false;

}

const handleUpdate = () => {
    const formData = formId.value && formId.value.formData;
    const query = route.query.dictId ? route.query : { dictId: 1 };
    getData({ page: listQuery.page, pageSize: listQuery.pageSize, ...query, ...formData })
}

const handlePage = (page: number) => {
    listQuery.page = page;
    const formData = formId.value && formId.value.formData;
    const query = route.query.dictId ? route.query : { dictId: 1 };
    getData({ page: listQuery.page, pageSize: listQuery.pageSize, ...query, ...formData })
}


const handleSize = (size: number) => {
    listQuery.pageSize = size;
    const formData = formId.value && formId.value.formData;
    const query = route.query.dictId ? route.query : { dictId: 1 };
    getData({ page: listQuery.page, pageSize: listQuery.pageSize, ...query, ...formData })
}



</script>
<template>
    <div class="margin-top-20 margin-left-20 margin-right-20 margin-bottom-20">
        <From :form-field="formField" :inline="true" @search="handleSearch" ref="formId"></From>
        <PageHeader @add="handleAdd"></PageHeader>
        <el-table :data="tableData">
            <template :key="sIndex" v-for="(item, sIndex) in tableConfig">
                <el-table-column v-if="item.label !== '操作'" :label="item.label" :prop="item.prop" :width="item.width"
                    :formatter="item.formatter"></el-table-column>
                <el-table-column v-else :label="item.label" fixed="right" width="200">
                    <template #default="scope">
                        <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
                        <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <DictDetail @update="handleUpdate" :deitalData="deitalData" :dialogVisible="dialogVisible" @close="handleClose"
            :is-edit="isEdit">
        </DictDetail>
        <Pagetion @page="handlePage" @size="handleSize" :small="false" :page-size="listQuery.pageSize"
            :total="listQuery.total" :page="listQuery.page">
        </Pagetion>
    </div>
</template>