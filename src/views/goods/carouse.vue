<script setup>
import Form from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive } from "vue";
import Edit from "./components/CarouseEdit.vue";
import { getData, postData, putData } from "@/views/goods/api/index";


onMounted(() => {
  getList({});
})

const listQuery = reactive({ page: 1, pageSize: 10, total: 0 });
const form = ref(null);

const list = reactive([]);
const formField = reactive([{ label: "babaner名称", name: "name", type: "input", width: 100 },
{ label: "是否可用", name: 'status', type: 'select', width: 100, options: [{ label: "是", value: 1 }, { label: '否', value: 0 }] }]);
const { initTableConfig, tableConfig } = useTable();

const dialogVisible = ref(false);
const title = ref("新增");
const editConfig = reactive([{ label: '名称', name: 'name', type: "input", width: 100 }, {
  width: 100, type: "select", label: "状态", name: "status",
  options: [{ label: "是", value: 1 }, { label: "否", value: 0 }]
}, { width: 100, label: "图标", name: "imgUrl", type: 'upload' }]);

const editData = reactive({});

onMounted(() => {
  tableConfig.length = 0;
  initTableConfig([{ label: "id", prop: "id" }, { label: "name", prop: "name" },
  { label: "status", prop: "status", format: (row) => row.status == 1 ? '正在使用' : '未使用' }, { label: "icon", prop: "imgUrl" }, { label: "updateTime", width: 150, prop: "updateTime" }, { label: "createTime", width: 150, prop: "createTime" }
  ]);
})

const getList = async (params) => {
  list.length = 0;
  let res = await getData({ ...params, page: listQuery.page, pageSize: listQuery.pageSize });
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
  console.log(formData, "456789")
  getList(formData);
}

const handleAdd = () => {
  title.value = '新增'
  dialogVisible.value = true;
}

const handleClose = () => {
  dialogVisible.value = false;
}

const handleConfirm = async (data) => {
  if (title.value == '新增') {
    await postData(data);
  } else {
    await putData(data);
  }

  dialogVisible.value = false;
  await getList(form.value.formData);
}

const handlePage = (val) => {
  listQuery.page = val;
  getList(form.value.formData);
}

const handleSize = (val) => {
  listQuery.pageSize = val;
  getList(form.value.formData);
}

const handleEdit = (row) => {
  dialogVisible.value = true;
  title.value = '编辑'
  let arr = Object.keys(row);
  arr.forEach(item => {
    editData[item] = row[item];
  })
}

const handleDelete = () => {
  console.log(23456);
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
      <template v-for="item in tableConfig">
        <el-table-column
          v-if="item.label == 'icon'"
          :key="item.label"
          :width="item.width"
          :label="item.label"
          :prop="item.prop"
        >
          <template #default="scope">
            <span v-show-image>
              <el-image
                :src="scope.row['imgUrl']"
                style="width:100px"
              />
            </span>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="!item.template"
          :key="item.label"
          :formatter="item.format"
          :width="item.width"
          :label="item.label"
          :prop="item.prop"
        />
      </template>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            @click="handleEdit(scope.row)"
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
    </el-table>
  </div>
  <Pagetions
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