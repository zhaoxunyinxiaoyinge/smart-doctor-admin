<script setup lang="ts">
import Form from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive } from "vue";
import Edit from "./components/CarouseEdit.vue";
import { getGoodsData, putGoodsData, getCategoryData, postGoodsData } from "@/views/goods/api/index";
import type { TableInstance } from "element-plus"

onMounted(() => {
  getList({});
})

const listQuery = reactive({ page: 1, pageSize: 10, total: 0 });
const form = ref<typeof Form | null>(null);
const list = reactive([]);
const cateGoryList = reactive<Array<{ id: number, name: string, [key: string]: any }>>([]);
const multeSelection = ref<TableInstance | null>(null)
const selectList = reactive<{ id: number, categoryId: number, [key: string]: any }[]>([]);


const formField = reactive([{ label: "商品名称", name: "name", type: "input", width: 100 },
{ label: "商品描述", name: 'desc', type: 'input', width: 100 },
{ label: '是否可用', width: 100, name: "status", type: "select", options: [{ label: "是", value: 1 }, { label: "否", value: 0 }] },
{ label: '分类', width: 100, name: "categoryId", type: "select", options: <{ label: string, value: number }|any[]>[] },
]);
const { initTableConfig, tableConfig } = useTable();

const dialogVisible = ref(false);
const title = ref("新增");
const editConfig = reactive([{ label: '名称', name: 'name', type: "input", width: 100 }, {
  width: 100, type: "select", label: "状态", name: "status",
  options: [{ label: "是", value: 1 }, { label: "否", value: 0 }]
}, { type: "select", label: "分类", options: [], width: 100, name: "categoryId" }, { type: "input", width: 100, label: "价格", name: "price" },
{ type: "input", width: 100, label: "数量", name: "mount" },
{ width: 100, label: "图标", name: "imgUrl", type: 'upload' }, { type: "editor", label: "描述", name: "descrtion" }]);

const editData = reactive({});

onMounted(() => {
  getCategoryList();
  tableConfig.length = 0;
  getList({});
  initTableConfig([{ label: "id", prop: "id" }, { label: "name", prop: "name" }, { label: "price", prop: "price" },
  { label: "mount", prop: "mount", }, { label: "imgUrl", prop: "imgUrl" }, { label: "status", prop: "status", format: getStatusText }, { label: "categoryId", prop: "categoryId", format: getFormat }, { label: "updateTime", width: 150, prop: "updateTime" }, { label: "createTime", width: 150, prop: "createTime" }
  ]);
})

const getFormat = (row: { categoryId: number, id: number }): string => {
  if (row.categoryId) {
    let index = cateGoryList.findIndex(item => item.id == row.categoryId);
    if (index != -1) {
      return cateGoryList[index].name;
    }
    return "";
  }
  return ""
}

const getStatusText = (row) => {
  return row.status === 1 ? '上线' : "下线"
}

const getCategoryList = async () => {
  let res = await getCategoryData({ page: 1, pageSize: 100 });
  if (res.code == 1) {
    cateGoryList.push(...res.data.records);

    editConfig.forEach(item => {
      if (item.label == '分类') {
        res.data.records.forEach(sItem => {
          (item.options as Array<{label:string,value:number}>).push({ label: sItem.name, value: sItem.id })
        })
      }
    })

    formField.forEach(item => {
      if (item.label == '分类') {
        res.data.records.forEach(sItem => {
          (item.options as Array<{label:string,value:number}>).push({ label: sItem.name, value: sItem.id })
        })
      }
    })

  }
}


const getList = async (params) => {
  list.length = 0;
  let res = await getGoodsData({ ...params, page: listQuery.page, pageSize: listQuery.pageSize });
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
  console.log(data, "data")
  if (title.value == '新增') {
    await postGoodsData(data);
  } else {
    await putGoodsData(data);
  }

  dialogVisible.value = false;
  await getList((form.value as typeof Form).formData);
}

const handlePage = (val) => {
  listQuery.page = val;
  getList((form.value as typeof Form).formData);
}

const handleSize = (val) => {
  listQuery.pageSize = val;
  getList((form.value as typeof Form).formData);
}

const handleEdit = (row) => {
  dialogVisible.value = true;
  title.value = '编辑'
  let arr = Object.keys(row);
  arr.forEach(item => {
    editData[item] = row[item];
  })
}

const handleDelete = (id) => {
  console.log(23456);
}

const handleSelect = (selection: Array<any>, row) => {
  selection.forEach(item => {
    let index = selectList.findIndex(item => item.id == item.id);
    if (index == -1) {
      selectList.push(item);
    }

  })
}

const handleSelectAll = (selection) => {
  selection.forEach(item => {
    let index = selectList.findIndex(item => item.id == item.id);
    if (index == -1) {
      selectList.push(item);
    }
  })
}

const toggleSelection = () => {
  selectList.forEach(item => {
    (multeSelection.value as TableInstance).toggleRowSelection(item, true);
  })
}


const clearTables = () => {
  (multeSelection.value as TableInstance).clearSelection();
}

</script>

<template>
  <Form ref="form" :inline="true" :form-field="formField" @refsh="handleResh" @search="handleSearch" />
  <PageHeader @add="handleAdd" :export="true" url="/api/goods/import" name="goods" />
  <div class="flex-1">
    <el-table ref="multeSelection" @select="handleSelect" stripe :data="list" width="100%" height="100%" row-key="id"
      @select-all="handleSelectAll">
      <el-table-column type="selection" width="55" />
      <template v-for="item in tableConfig" :key="item.label">
        <el-table-column v-if="item.label == 'imgUrl'" :width="item.width" :label="item.label" :prop="item.prop">
          <template #default="scope">
            <span v-show-image>
              <el-image :src="scope.row[item.prop]" style="width:100px" />
            </span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="!item.template" :formatter="item.format" :width="item.width" :label="item.label"
          :prop="item.prop" />
      </template>
      <el-table-column label="操作" fixed="right" width="200px">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <Pagetions :current-page="listQuery.page" :page-size="listQuery.pageSize" :total="listQuery.total" @page="handlePage"
    @size="handleSize" />
  <Edit :dialog-visible="dialogVisible" :title="title" :edit-config="editConfig" :edit-data="editData"
    @close="handleClose" @confirm="handleConfirm" />
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
}
</style>
