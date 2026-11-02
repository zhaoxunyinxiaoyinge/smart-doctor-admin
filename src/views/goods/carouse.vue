<script setup lang="ts">
import Form from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import Edit from "./components/CarouseEdit.vue";
import { getBannerData, postBannerData, putBannerData, deleteBannerData } from "@/views/goods/api/index";

const listQuery = reactive({ page: 1, pageSize: 10, total: 0 });
const form = ref<typeof Form>();

const list = reactive<Array<{[key:string]:any}>>([]);
// 搜索条件：标题 / 状态（对应 /api/mobile/banner 的 title、status 查询参数）
const formField = reactive([{ label: "标题", name: "title", type: "input", width: 100 },
{ label: "状态", name: 'status', type: 'select', width: 100, options: [{ label: "启用", value: 1 }, { label: '禁用', value: 0 }] }]);
const { initTableConfig, tableConfig,handleDelete } = useTable();

const dialogVisible = ref(false);
const title = ref("新增");
// 编辑弹窗字段：对应 banners 表（id/image/goods_id/title/sub_title/sort/status）
const editConfig = reactive([{ label: '标题', name: 'title', type: "input", width: 100 },
{ label: '副标题', name: 'subTitle', type: "input", width: 100 },
{ label: '商品ID', name: 'goodsId', type: "input", width: 100 },
{ label: '排序', name: 'sort', type: "input", width: 100 },
{ width: 100, type: "select", label: "状态", name: "status",
  options: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }]
}, { width: 100, label: "图片", name: 'image', type: 'upload' }]);

const editData = reactive({});

onMounted(async () => {
  initTableConfig([{ label: "id", prop: "id", width: 80 }, { label: "标题", prop: "title" },
  { label: "副标题", prop: "subTitle" }, { label: "商品ID", prop: "goodsId", width: 90 },
  { label: "排序", prop: "sort", width: 80 },
  { label: "状态", prop: "status", width: 90, format: (row) => row.status == 1 ? '启用' : '禁用' },
  { label: "图片", prop: "image", width: 110 }
  ]);
  await getList({});
})

const getList = async (params) => {
  list.length = 0;
  getBannerData({ ...params, page: listQuery.page, pageSize: listQuery.pageSize }).then(res => {
    if (res.code == 1) {
      list.push(...res.data.records);
      listQuery.page = res.data.current;
      listQuery.pageSize = res.data.size;
      listQuery.total = res.data.total
    }
  }).catch(err => {
    console.log(err, '请求失败');
  })
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
  // 必填校验：banners 表 title / image 不允许为空
  if (!data.title) {
    ElMessage.warning('请填写标题');
    return;
  }
  if (!data.image) {
    ElMessage.warning('请上传图片');
    return;
  }
  // 后端 banners 表列名是 snake_case，提交前转换
  const payload: Record<string, any> = {
    ...data,
    goods_id: Number(data.goodsId) || 0,
    sub_title: data.subTitle ?? '',
    sort: Number(data.sort) || 0,
    status: Number(data.status) || 0,
  };
  delete payload.goodsId;
  delete payload.subTitle;

  if (title.value == '新增') {
    await postBannerData(payload);
    ElMessage.success('新增成功');
  } else {
    await putBannerData(payload);
    ElMessage.success('编辑成功');
  }

  dialogVisible.value = false;
  if(form.value!=undefined){
    await getList(form.value.formData);
  }
}

const handlePage = (val) => {
  listQuery.page = val;
    if(form.value!=undefined){
    getList(form.value.formData);
    }
}

const handleSize = (val) => {
  listQuery.pageSize = val;
    if(form.value!=undefined){
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

const handleDeletes = (id) => {
  let  querySelectData={pageSize:listQuery.pageSize,page:1}
  if(form.value!=null){
      querySelectData={...form.value.formData,...querySelectData}
  }
  handleDelete(id,deleteBannerData,getList,querySelectData);
}

const handleSelectionChange=()=>{
  console.log("选中的数据");
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
          v-if="item.label == '图片'"
          :key="item.label"
          :width="item.width"
          :label="item.label"
          :prop="item.prop"
        >
          <template #default="scope">
            <span v-show-image>
              <el-image
                :src="scope.row.image"
                style="width:80px"
              />
            </span>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="!item.template"
          :key="index"
          :formatter="item.format"
          :width="item.width"
          :label="item.label"
          :prop="item.prop"
        />
      </template>
      <el-table-column label="操作" width="180"  fixed="right">
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
