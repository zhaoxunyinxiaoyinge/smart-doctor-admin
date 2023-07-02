<script lang="ts" setup>
import { onMounted } from "vue";
import From from "@/components/forms/index.vue";
import Pagetion from "@/components/pagetions/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import { getDivision, getDivsionDetail, deleteDivsion } from "@/views/division/api/index";
import Add from "@/views/division/components/add.vue";
import { ElMessage, ElMessageBox } from "element-plus";


const tableConfig = reactive<Array<{ label: string, width?: number | undefined | string, props: string }>>([
    {
        label: "部门名称",
        width: 'auto',
        props: 'name',
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
        label: "部门名称",
        name: "name",
        width: 100
    },
]);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const tableData = reactive<any>([]);
const dialogVisible = ref(false);
const formData = reactive<any>({});
const isEdit = ref(false);

const getData = (params: object) => {
    tableData.length = 0;
    getDivision({ ...params, page: page.value, pageSize: pageSize.value }).then((res: any) => {
        if (res.code == 1) {
            tableData.push(...res.data.records);
            total.value = res.data.total;
            page.value = res.data.current;
            pageSize.value = res.data.size;
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
})

const handleAdd = () => {
    isEdit.value = false;
    dialogVisible.value = true;
    Object.keys(formData).length > 0 && Object.keys(formData).forEach(item => {
        formData[item] = '';
    })
}

const handleEdit = (id: number) => {
    getDivsionDetail({ id }).then((res: any) => {
        if (res.code == 1) {
            dialogVisible.value = true;
            isEdit.value = true;
            nextTick(() => {
                Object.keys(res.data).forEach((name: any) => {
                    if (name != 'id' || name != "createTime" || name != "updateTime") {
                        formData[name] = res.data[name];
                    }
                })
            })
        }
    })

}

const handleUpdate = () => {
    getData({})
}

const handleClose = () => {
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
    ).then(() => {
        return deleteDivsion(id);
    }).then(() => {
        getData({})
        ElMessage.success("删除成功")
    })
}

const handlePage = (val: number) => {
    page.value = val;
    getData({})
}

const handleSize = (size: number) => {
    pageSize.value = size;
    getData({})
}

</script>

<template>
  <From
    :form-field="formConfig"
    :inline="true"
    @search="handleSearch"
  />
  <PageHeader @add="handleAdd" />
  <div class=" flex-1">
    <el-table
      :data="tableData"
      height="100%"
    >
      <template
        v-for="(item, index) in tableConfig"
        :key="index"
      >
        <el-table-column
          v-if="item.label !== '操作'"
          :width="item.width"
          :label="item.label"
          :prop="item.props"
        />
        <el-table-column
          v-else
          :label="item.label"
        >
          <template #default="scope">
            <el-button
              type="primary"
              @click="handleEdit(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <Add
      :is-edit="isEdit"
      :dialog-visible="dialogVisible"
      :form-data="formData"
      @close="handleClose"
      @update="handleUpdate"
    />
  </div>
  <Pagetion
    :small="true"
    :current-page="page"
    :page-size="pageSize"
    :total="total"
    @page="handlePage"
    @size="handleSize"
  />
</template>