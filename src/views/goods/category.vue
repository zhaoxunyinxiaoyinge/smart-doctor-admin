<script setup lang="ts">
import Form from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable, } from "@/hooks/useTable";
import { onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import Edit from "./components/CarouseEdit.vue";
import { getCategoryMobileData, postCategoryMobileData, putCategoryMobileData, deleteCategoryMobileData } from "@/views/goods/api/index";



const listQuery = reactive({ page: 1, pageSize: 10, total: 0 });
const form = ref<typeof Form|null>(null);

const list = reactive<any>([]);
// 搜索条件：分类标识 kind（/api/mobile/category 列表目前只支持 kind 筛选）
const formField = reactive([{ label: "分类标识", name: "kind", type: "input", width: 100 }]);
const { initTableConfig, tableConfig,handleDelete } = useTable();

const dialogVisible = ref(false);
const title = ref("新增");
// 编辑弹窗字段：对应 categories 表（id/name/icon/kind/sort/status）
const editConfig = reactive([{ label: '名称', name: 'name', type: "input", width: 100 },
{ label: '分类标识', name: 'kind', type: "input", width: 100 },
{ label: '排序', name: 'sort', type: "input", width: 100 },
{ width: 100, type: "select", label: "状态", name: "status",
  options: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }]
}, { width: 100, label: "图标", name: "icon", type: 'upload' }]);

const editData = reactive({});

onMounted(() => {
  tableConfig.length = 0;
  initTableConfig([{ label: "id", prop: "id", width: 80 }, { label: "名称", prop: "name" },
  { label: "分类标识", prop: "kind", width: 120 }, { label: "排序", prop: "sort", width: 80 },
  { label: "状态", prop: "status", width: 90, format: (row) => row.status == 1 ? '启用' : '禁用' },
  { label: "图标", prop: "icon", width: 110 }
  ]);
  getList({});
})

const getList = async (params) => {
  list.length = 0;
  let res = await getCategoryMobileData({ ...params, page: listQuery.page, pageSize: listQuery.pageSize });
  if (res.code == 1) {
    list.push(...res.data.records);
    listQuery.page = res.data.current;
    listQuery.pageSize = res.data.size;
    listQuery.total = res.data.total
  }
}

const handleResh = () => {
  getList({});
};
const handleSearch = (formData) => {
  listQuery.page = 1;
  getList(formData);
}

const handleAdd = () => {
  title.value = '新增'
  // 清掉上一次编辑残留的数据，避免新增时带出旧值
  Object.keys(editData).forEach(key => delete editData[key]);
  dialogVisible.value = true;
}

const handleClose = () => {
  dialogVisible.value = false;
}

const handleConfirm = async (data) => {
  // 必填校验：categories 表 name 不允许为空
  if (!data.name) {
    ElMessage.warning('请填写分类名称');
    return;
  }
  const payload: Record<string, any> = {
    ...data,
    sort: Number(data.sort) || 0,
    status: Number(data.status) || 0,
  };

  if (title.value == '新增') {
    await postCategoryMobileData(payload);
    ElMessage.success('新增成功');
  } else {
    await putCategoryMobileData(payload);
    ElMessage.success('编辑成功');
  }

  dialogVisible.value = false;
  if(form.value!=null){
    await getList(form.value.formData);
  }
}

const handlePage = (val) => {
  listQuery.page = val;
  if(form.value!=null){
     getList(form.value.formData);
  }
}

const handleSize = (val) => {
  listQuery.pageSize = val;
  if(form.value!=null){
     getList(form.value.formData);
  }
}

const handleEdit = (row) => {
  dialogVisible.value = true;
  title.value = '编辑'
  let arr = Object.keys(row);
  arr.forEach(item => {
    editData[item] = row[item];
  })
}

const handleDeletes =  async(id: number) => {
  let  querySelectData={pageSize:listQuery.pageSize,page:1}
  if(form.value!=null){
      querySelectData={...form.value.formData,...querySelectData}
  }
  handleDelete(id,deleteCategoryMobileData,getList,querySelectData);
}

const handleSelectionChange=()=>{
  console.log("被选中了的选项")
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
      :data="list"
      width="100%"
      height="100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <template v-for="(item,index) in tableConfig">
        <el-table-column
          v-if="item.label == '图标'"
          :key="item.label"
          :width="typeof item.width === 'function' ? undefined : item.width"
          :label="String(item.label)"
          :prop="String(item.prop)"
        >
          <template #default="scope">
            <span v-show-image>
              <el-image
                :src="scope.row['icon']"
                style="width:50px"
              />
            </span>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="!item.template"
          :key="index"
          :formatter="item.format"
          :width="typeof item.width === 'function' ? undefined : item.width"
          :label="String(item.label)"
          :prop="String(item.prop)"
        />
      </template>
      <el-table-column label="操作"
      fixed="right"
      width="200px">
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
    </el-table>
  </div>
  <Pagetions
    :small="false"
    :current-page="listQuery.page"
    :page-size="listQuery.pageSize"
    :total="listQuery.total"
    @page="handlePage"
    @size="handleSize"
  />
  <Edit
    :dialog-visible="dialogVisible"
    :title="title"
    :edit-config="editConfig"
    :edit-data="editData"
    @close="handleClose"
    @confirm="handleConfirm"
  />
</template>
