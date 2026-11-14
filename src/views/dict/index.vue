<script lang="ts" setup>
import { onMounted } from "vue";
import From from "@/components/forms/index.vue";
import Pagetion from "@/components/pagetions/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import { getDictList, getDetial, DeleteDict } from "@/views/dict/api/index";
import { useRouter } from "vue-router";
import Add from "@/views/dict/components/add.vue";
import Edit from "@/views/dict/components/edit.vue"
import {useTable} from "@/hooks/useTable";

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

const {list,dialogFormVisible,initTableConfig,listQuery,
    isEdit,formData,handleClose,getData,handleAdd,handleDelete,handleEdit}=useTable()

const handleSearch = (val: any) => {
    list.length = 0;
    listQuery.page=1;
    getData(getDictList,val)
}

const handleClick = (row: any, column: any) => {
    if (column.property == "type") {
        router.push({ path: "/menu/dict/detail", query: { dictId: row.id } });
    }
}

const handleUpdate = () => {
    getData(getDictList);
}


onMounted(() => {
    getData(getDictList);
})

</script>

<script lang="ts">
    export default {
        name:'Dict'
    }
</script>

<template>
  <div class="page-column">
  <From
    :form-field="formConfig"
    :inline="true"
    @search="handleSearch"
  />
  <PageHeader
    @add="handleAdd"
  />
  <div class="flex-1">
    <el-table
      :data="list"
      height="100%"
      @cell-click="handleClick"
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
              @click="handleEdit(scope.row.id,getDetial)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              @click="handleDelete(scope.row.id,DeleteDict)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <Add
      :form-data="formData"
      :dialog-visible="dialogFormVisible&&!isEdit"
      :is-edit="isEdit"
      @close="handleClose"
      @update="()=>handleUpdate()"
    />
    <Edit  
      :form-data="formData"
      :dialog-visible="dialogFormVisible&&isEdit"
      :is-edit="isEdit"
      @close="handleClose"
      @update="()=>handleUpdate()"></Edit>
  </div>
  <Pagetion
    :small="true"
    :current-page="listQuery.page"
    :page-size="listQuery.pageSize"
    :total="listQuery.total"
  />
  </div>
</template>