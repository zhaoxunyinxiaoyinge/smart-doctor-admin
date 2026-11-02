<script setup lang="ts">
import Form from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { getCouponPage, postCouponData, putCouponData, deleteCouponData } from "./api";
import ViewDialog from "./components/viewDialog.vue"

// 搜索条件：名称 / 状态（对应 /api/mobile/coupon 的 name、status 查询参数）
// width 是标签宽度，全项目统一 100 才能对齐
const formField = reactive([{ label: "名称", name: "name", type: "input", width: 100 },
{ label: "状态", name: "status", type: "select", width: 100, options: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }] }]);
// 新增/编辑弹窗字段：对应 coupons 表（id/name/amount/threshold/status）
const addFormField = ref([{ label: "优惠券名称", name: "name", type: "input", width: 100 },
{ label: "面额（元）", name: "amount", type: "input-number", width: 100 },
{ label: "使用门槛（满 X 元可用）", name: "threshold", type: "input-number", width: 100 },
{ width: 100, label: "状态", name: "status", type: 'select', options: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }] }]);
const { initTableConfig, tableConfig, handleDelete } = useTable();

const couponList = ref<any[]>([]);
const form = ref<typeof Form | null>(null);
const listQuery = ref({ pageSize: 10, page: 1, total: 0 });

onMounted(async () => {
  tableConfig.length = 0;
  initTableConfig([{ label: "id", prop: "id", width: 80 }, { label: "优惠券名称", prop: "name" },
  { label: "面额（元）", prop: "amount", width: 120 },
  { label: "使用门槛", prop: "threshold", width: 140, format: (row) => row.threshold > 0 ? `满 ${row.threshold} 元可用` : '无门槛' },
  { label: "状态", prop: "status", width: 100, format: (row) => row.status == 1 ? '启用' : '禁用' }
  , { label: "操作", prop: "", width: 200, template: true }]);

  await getList({ page: listQuery.value.page, pageSize: listQuery.value.pageSize });
})

const dialogVisible = ref(false);
const editVisible = ref(false);
const editData = ref<{ [key: string]: any }>({});

const getList = async (params) => {
  return getCouponPage(params).then(res => {
    if (res.code == 1) {
      couponList.value = res.data.records;
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
  handleDelete(id, deleteCouponData, getList, querySelectData);
};

const handleAddConfirm = async (data) => {
  if (!data.name) {
    ElMessage.warning('请填写优惠券名称');
    return;
  }
  const payload = { ...data, amount: Number(data.amount) || 0, threshold: Number(data.threshold) || 0, status: Number(data.status) || 0 };
  const res = await postCouponData(payload);
  if (res.code == 1) {
    ElMessage.success('新增成功');
    getList({ page: listQuery.value.page, pageSize: listQuery.value.pageSize });
  }
}

const handleEditConfirm = async (data) => {
  // 表单数据里没有 id（Form 只初始化 formField 声明的字段），从 editData 取
  if (!editData.value?.id) return;
  if (!data.name) {
    ElMessage.warning('请填写优惠券名称');
    return;
  }
  const payload = { ...data, id: editData.value.id, amount: Number(data.amount) || 0, threshold: Number(data.threshold) || 0, status: Number(data.status) || 0 };
  const res = await putCouponData(payload);
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
      :data="couponList"
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
  <!-- 新增/编辑统一走 viewDialog：表单每次打开重新挂载，编辑数据经 init-data 回填 -->
  <ViewDialog
    :dialog-visible="dialogVisible"
    :add-config="addFormField"
    :title="'新增优惠券'"
    @update:dialogVisible="handleColse"
    @confirm="handleAddConfirm"
  />
  <ViewDialog
    :title="'编辑优惠券'"
    :dialog-visible="editVisible"
    :add-config="addFormField"
    :init-data="editData"
    @update:dialogVisible="handleColse"
    @confirm="handleEditConfirm"
  />
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
}
</style>
