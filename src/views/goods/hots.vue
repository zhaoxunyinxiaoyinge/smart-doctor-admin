<script setup>
import Form from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive } from "vue";

const formField = reactive([{ label: "商品名称", value: "name", type: "input", width: 100 }]);
const { initTableConfig, tableConfig } = useTable();
onMounted(() => {
  tableConfig.length = 0;
  initTableConfig([{ label: "id", prop: "id" }, { label: "name", prop: "name" }, { label: "price", prop: "price" },
  { label: "mount", prop: "mount", }, { label: "icon", prop: "icon" }, { label: "updateTime", width: 150, prop: "updateTime" }, { label: "createTime", width: 150, prop: "createTime" }
  ]);
})


</script>

<template>
  <Form :inline="true" :form-field="formField" />
  <PageHeader />
  <div class="flex-1">
    <el-table ref="multeSelection" stripe :data="[]" width="100%" height="100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="55" label="#" />
      <template v-for="item in tableConfig">
        <el-table-column v-if="!item.template" :key="item.label" :width="item.width" :label="item.label"
          :prop="item.prop">
          <template #default="scope">
            <span v-if="item.prop == 'avatar'" v-show-image>
              <el-image :src="scope.row.avatar" />
            </span>
            <span v-else>
              {{ item.prop && scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-else :key="item.prop" :label="item.label">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" @click="handleDelete(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

  </div>

  <Pagetions />
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
}
</style>
