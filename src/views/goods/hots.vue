<script setup lang="ts">
import Form from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getHotKeywordPage, postHotKeywordData, deleteHotKeywordData, putHotKeywordData } from "./api";
import AddDialog from "./components/AddDialog.vue"
import editDialog  from "./components/editDialog.vue";

// 搜索条件：关键词 / 状态（对应 /api/mobile/hot-keyword 的 keyword、status 查询参数）
const formField = reactive([{ label: "关键词", name: "keyword", type: "input", width: 100 },
{ label: "状态", name: "status", type: "select", width: 100, options: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }] }]);
// 新增/编辑弹窗字段：对应 hot_keywords 表（id/keyword/sort/status）
const addFormField = ref([{ label: "关键词", name: "keyword", type: "input", width: 100 },
{ label: "排序", name: "sort", type: "input-number", width: 100 },
{ width: 100, label: "状态", name: "status", type: 'select', options: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }] }]);
const { initTableConfig, tableConfig, handleDelete } = useTable();

const hotList = ref<any[]>([]);
const form = ref<typeof Form | null>(null);
const listQuery = ref({ pageSize: 10, page: 1, total: 0 });

onMounted(async () => {
  tableConfig.length = 0;
  initTableConfig([{ label: "id", prop: "id", width: 80 }, { label: "关键词", prop: "keyword" },
  { label: "排序", prop: "sort", width: 100 },
  { label: "状态", prop: "status", width: 100, format: (row) => row.status == 1 ? '启用' : '禁用' }
  , { label: "操作", prop: "", width: 200, template: true }]);

  await getList({ page: listQuery.value.page, pageSize: listQuery.value.pageSize });
})

const dialogVisible = ref(false);
const editVisible = ref(false);
const editData = ref({});

const getList = async (params) => {
  return getHotKeywordPage(params).then(res => {
    if (res.code == 1) {
      hotList.value = res.data.records;
      listQuery.value.total = res.data.total;
    }
  })
}

const handleAdd = () => {
  dialogVisible.value = true;
};

const handleResh = () => {
  getList({ page: 1, pageSize: listQuery.value.pageSize });
}

const handleSearch = (formData) => {
  listQuery.value.page = 1;
  getList({ ...formData, page: listQuery.value.page, pageSize: listQuery.value.pageSize });
}

const handlePage = (val) => {
  listQuery.value.page = val;
  if (form.value != null) {
    getList({ ...form.value.formData, page: listQuery.value.page, pageSize: listQuery.value.pageSize });
  }
}

const handleSize = (val) => {
  listQuery.value.pageSize = val;
  if (form.value != null) {
    getList({ ...form.value.formData, page: listQuery.value.page, pageSize: listQuery.value.pageSize });
  }
}

const handleColse = () => {
  dialogVisible.value = false;
  editVisible.value = false;
}

const handleEdit = (row) => {
  editVisible.value = true;
  editData.value = row;
};

const handleDeletes = (id) => {
  let querySelectData = { pageSize: listQuery.value.pageSize, page: 1 }
  if (form.value != null) {
    querySelectData = { ...form.value.formData, ...querySelectData }
  }
  handleDelete(id, deleteHotKeywordData, getList, querySelectData);
};

const handleAddConfirm = async (data) => {
  if (!data.keyword) {
    ElMessage.warning('请填写关键词');
    return;
  }
  const payload = { ...data, sort: Number(data.sort) || 0, status: Number(data.status) || 0 };
  const res = await postHotKeywordData(payload);
  if (res.code == 1) {
    ElMessage.success('新增成功');
    getList({ page: listQuery.value.page, pageSize: listQuery.value.pageSize });
  }
}

const handleEditConfirm = async (data) => {
  if (!data.id) return;
  const payload = { ...data, sort: Number(data.sort) || 0, status: Number(data.status) || 0 };
  const res = await putHotKeywordData(payload);
  if (res.code == 1) {
    ElMessage.success('编辑成功');
    getList({ page: listQuery.value.page, pageSize: listQuery.value.pageSize });
  }
}

</script>

<template>
  <Form
    ref="form"
    :inline="true"
    :form-field="formField"
    @refsh="handleResh"
    @search="handleSearch"
  />
  <PageHeader @add="handleAdd" />
  <div class="flex-1">
    <el-table
      ref="multeSelection"
      stripe
      :data="hotList"
      width="100%"
      height="100%"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        type="index"
        width="55"
        label="#"
      />
      <template v-for="item in tableConfig">
        <el-table-column
          v-if="!item.template"
          :key="item.prop + '-default'"
          :width="typeof item.width === 'function' ? item.width + 'px' : item.width"
          :label="typeof item.label === 'string' ? item.label : undefined"
        >
          <template #default="scope">
            <span v-if="item.format">
              {{ item.format(scope.row, scope.column, scope.row[item.prop]) }}
            </span>
            <span v-else>
              {{ typeof item.prop === 'string' && scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.label"
          :label="item.label"
          width="200px"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="primary"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              @click="handleDeletes(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>

  <Pagetions
    :small="false"
    :page-size="listQuery.pageSize"
    :current-page="listQuery.page"
    :total="listQuery.total"
    @page="handlePage"
    @size="handleSize"
  />
  <AddDialog
    :dialog-visible="dialogVisible"
    :add-config="addFormField"
    :title="'新增热搜词'"
    @update:dialogVisible="handleColse"
    @add:form-data="handleAddConfirm"
  />
  <editDialog
    :title="'编辑热搜词'"
    :dialog-visible="editVisible"
    :add-config="addFormField"
    :form-data="editData"
    @update:dialogVisible="handleColse"
    @add:form-data="handleEditConfirm"
  />
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
}
</style>
