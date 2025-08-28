<script setup lang="ts">
import Form from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive } from "vue";
import { getHostData,postHostData,deleteHostData, putHostData} from "./api";
import AddDialog from "./components/AddDialog.vue"
import editDialog  from "./components/editDialog.vue";

const formField = reactive([{ label: "商品名称",name:"name", value: "name", type: "input", width: 100 }]);
const addFormField=ref([{ label: "商品名称", value: "name",name:"name", type: "input", width: 100 },{ label: "商品价格", value: "price",name:"price" ,type: "input-number", width: 100 },{ label: "商品数量",name:"mount" ,value: "mount", type: "input", width: 100 },{width: 100, label: "图标", value:"imgUrl",name: "imgUrl", type: 'upload'}],);
const { initTableConfig, tableConfig,handleDelete } = useTable();
onMounted(async () => {
  tableConfig.length = 0;
  initTableConfig([{ label: "id", prop: "id" }, { label: "name", prop: "name" }, { label: "price", prop: "price" },
  { label: "mount", prop: "mount", }, { label: "icon", prop: "imgUrl" }, { label: "updateTime", width: 150, prop: "updateTime" }, { label: "createTime", width: 150, prop: "createTime" }
  , { label: "操作", prop: "", width: 200, template: true }]);

  await getList({page:listQuery.value.page,pageSize:listQuery.value.pageSize});
})
const hotList=ref([]);
const form=ref<typeof Form|null>(null);
const listQuery=ref({pageSize:10,page:1,total:0})
const dialogVisible=ref(false);
const editVisible=ref(false);
const editData=ref({});
const getList= async (params)=>{
   return  getHostData(params).then(res=>{
    if(res.code==1){
      hotList.value=res.data.records;
      listQuery.value.total=res.data.total;
    }
})
}

const handleAdd=()=>{
  dialogVisible.value=true;
};

const handleResh=()=>{
  getList({page:1,pageSize:10});
}

const handleSearch=(formData)=>{
  listQuery.value.page = 1;
  console.log(formData, "456789")
  getList({...formData,page:listQuery.value.page,pageSize:listQuery.value.pageSize});
}

const handleColse=()=>{
  dialogVisible.value=false;
  editVisible.value=false;
}

const handleEdit = (row) => {
  editVisible.value=true;
  editData.value=row;
  console.log(editData,"editData")
};

const handleDeletes = (id) => {
  let  querySelectData={pageSize:listQuery.value.pageSize,page:1}
  if(form.value!=null){
      querySelectData={...form.value.formData,...querySelectData}
  }
  handleDelete(id,deleteHostData,getList,querySelectData);
};

const handleAddConfirm= async(data)=>{
   let res=await postHostData(data);
   if(res.code==1){
    getList({page:listQuery.value.page,pageSize:listQuery.value.pageSize});
   }
}

const handleEditConfirm= async(data)=>{
  let res=await putHostData(data);
  if(res.code==1){
    getList({page:listQuery.value.page,pageSize:listQuery.value.pageSize});
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
            <span
              v-if="item.prop == 'imgUrl'"
              v-show-image
            >
              <el-image
                style="width:50px"
                :src="scope.row.imgUrl"
              />
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
  />
  <AddDialog
    :dialog-visible="dialogVisible"
    :add-config="addFormField"
    :title="'添加商品'"
    @update:dialogVisible="handleColse"
    @add:form-data="handleAddConfirm"
  />
  <editDialog
    :title="'编辑商品'"
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
