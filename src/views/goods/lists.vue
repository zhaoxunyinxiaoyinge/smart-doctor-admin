<script setup lang="ts">
import Form from "@/components/forms/index.vue";
import PageHeader from "@/components/pageHeader/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive } from "vue";
import AddDialog from "./components/AddDialog.vue";
import ViewDialog from "./components/viewDialog.vue";
import { getGoodsData, getGoodsDetailData, putGoodsData, postGoodsData, deleteGoodsData, getCategoryMobileData } from "@/views/goods/api/index";
import { type TableColumnCtx, type TableInstance } from "element-plus"
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import Upload from "@/components/upload/index.vue"
import Cookies from "js-cookie";
onMounted(() => {
  getList({});
})

const listQuery = reactive({ page: 1, pageSize: 10, total: 0 });
const form = ref<typeof Form | null>(null);
const list = reactive<any[]>([]);
const selectList = reactive<{ id: number, categoryId: number, [key: string]: any }[]>([]);

// 获取图片上传的token
const uploadCofig = reactive({
  authorization: Cookies.get("token")
})


const formField = reactive([{ label: "商品名称", name: "title", type: "input", width: 100 },
{ label: "商品描述", name: 'sub', type: 'input', width: 100 },
{ label: '是否可用', width: 100, name: "status", type: "select", options: <{ label: string | number, value: number | string }[] | any[] | undefined>[{ label: "是", value: 1 }, { label: "否", value: 0 }] }
]);
const { initTableConfig, tableConfig, handleDelete } = useTable();

const dialogVisible = ref(false);
const dislogVisbleAdd = ref(false);
const title = ref("新增");
// 添加弹框配置
const editConfig = reactive([{ label: '标题', name: 'title', type: "input", width: 100 },
{ label: '子标题', name: 'sub', type: "input", width: 100 },
{ label: '价格', name: 'price', type: "input-number", width: 100 },
{ label: '源价格', name: 'origin_price', type: "input-number", width: 100 },
{ label: "出售数量", name: "sales", type: "input-number", width: 100 },
{ label: "标签", name: "tags", type: "input", width: 100 },
{ label: "服务承诺", name: "services", type: "input", width: 100 },
{ width: 100, label: "商品图片", name: "cover", type: 'upload' },
{ width: 100, label: "库存", name: "stock", type: "input-number" },
{
  width: 100, type: "select", label: "状态", name: "status",
  options: [{ label: "是", value: 1 }, { label: "否", value: 0 }]
}, { type: "select", label: "分类", options: [], width: 100, name: "category_id" }]);

const editData = ref<GoodsType>({
  title: "",
  origin_price: 0,
  stock: 0,
  sub: "",
  price: 0,
  sales: 0,
  tags: "",
  services: "",
  cover: "",
  status: 1,
  kind: "",
  category_id: 0,
  goods_spec: [{ name: "", options: "", sort: 1 }],
  goods_detail: [{
    content: "",
    image: '',
    sort: 1
  }],
  goods_images: [
    {
      url: "",
      sort: 1
    }
  ]
});

// 新增内型接口
interface GoodsType {
  id?: number,
  title: string,
  origin_price: number,
  stock: number,
  sub: string,
  price: number,
  sales: number,
  tags: string,
  services: string,
  cover: string,
  status: number,
  kind: string,
  category_id: number|string,
  goods_spec: Array<{ id?: number, goods_id?: number, name: string, options: string, sort: number }>,
  goods_detail: Array<{
    id?: number,
    goods_id?: number,
    content: string,
    image: string,
    sort: number
  }>,
  goods_images: Array<{
    id?: number,
    goods_id?: number,
    url: string,
    sort: number
  }>
}



onMounted(async () => {
  // 重新接入移动端商品接口，移除公众号接口
  await getCategoryList();
  tableConfig.length = 0;
  await getList({});
  initTableConfig([
    { label: "title", prop: "title", width: 150 },
    { label: "sub", prop: "sub", width: 150 },
    { label: "originPrice", prop: "originPrice", format: getFormat },
    { label: "sales", prop: "sales" },
    { label: "rating", prop: "rating", width: 150 },
    { label: "tags", prop: "tags", width: 150 },
    { label: "reviewCount", prop: "reviewCount" },
    { label: "services", width: 150, prop: "services" },
    { label: "kind", width: 150, prop: "kind" },
    { label: "cover", width: 150, prop: "cover" },
    { label: "stock", width: 150, prop: "stock", format: getFormat },
    { label: "sort", width: 150, prop: "sort" },
    { label: "status", width: 150, prop: "status", format: getStatusText },
    { label: "createTime", width: 150, prop: "createTime" },
    { label: "updateTime", width: 150, prop: "updateTime" },
  ]);
})



const getFormat = (row: GoodsType, col: TableColumnCtx<GoodsType>, cellValue): string => {
  return parseFloat(cellValue).toFixed(2).toString()
}

const getStatusText: (row: any) => string = (row): string => {
  return row.status === 1 ? '上线' : "下线"
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

const getCategoryList = async () => {
  let res = await getCategoryMobileData({ page: 1, pageSize: 10 });
  if (res.code == 1) {
    let options = res.data.records;
    let index = editConfig.findIndex(item => item.label == "分类");
    if (index != -1) {
      editConfig[index].options = options.map(item => { return { id: item.id, label: item.name, value: `${item.id}-${item.kind}` } });
    }
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
  // 重置为空模板，避免上一次编辑残留的子表数据带进新增
  editData.value = {
    title: "",
    origin_price: 0,
    stock: 0,
    sub: "",
    price: 0,
    sales: 0,
    tags: "",
    services: "",
    cover: "",
    status: 1,
    kind: "",
    category_id: 0,
    goods_spec: [{ name: "", options: "", sort: 1 }],
    goods_detail: [{ content: "", image: "", sort: 1 }],
    goods_images: [{ url: "", sort: 1 }]
  };
  dislogVisbleAdd.value = true;
}

const handleAddClose = () => {
  dislogVisbleAdd.value = false;
}

const handleAddConfirm = async (data) => {
  //获取表单数据，同时，获取solt里面的数据
  let postData = Object.assign(editData.value, data);
  let {category_id}=postData
    postData.category_id=category_id.split('-')[0];
    postData.kind=category_id.split('-')[1];

  // 图片集：C 端轮播必需，至少一张有效图片（过滤掉没传过的空行）
  postData.goods_images = (postData.goods_images || []).filter((i: any) => i.url);
  if (!postData.goods_images.length) {
    ElMessage.warning("商品图片集至少上传一张图片");
    return;
  }
  // 规格 / 详情允许不填：整行都没填内容的空行不提交，后端按空数组跳过
  postData.goods_spec = (postData.goods_spec || []).filter((i: any) => i.name || i.options).map(item=>{
    item.options=JSON.stringify(item.options.split(","));
    return item
  });
  postData.goods_detail = (postData.goods_detail || []).filter((i: any) => i.content || i.image);

   let res= await postGoodsData(postData);
   if(res.code==1){
      ElMessage.success("新增成功");
     await getList((form.value as typeof Form).formData);
   }
  dislogVisbleAdd.value = false;
}

/** 删除图片集里的某一张（仅移除未保存项；已入库的保存时由后端整体重建） */
const handleRemoveImage = (index: number) => {
  editData.value.goods_images.splice(index, 1);
}

/** 清空某条详情的图片（清空后重新出现上传框） */
const handleClearDetailImage = (item: any) => {
  item.image = "";
}

// 根据当前的图片生成的
const handleSuccess = async (desc, pic, index) => {
  if (desc == 'goods_detail') {
    editData.value.goods_detail[index].image = pic.data;
  } else if (desc == 'goods_image') {
    // 有空占位项则填充它，否则追加一张（编辑回填多张后仍能继续追加）
    const emptyIdx = editData.value.goods_images.findIndex((i: any) => !i.url);
    if (emptyIdx != -1) {
      editData.value.goods_images[emptyIdx] = { url: pic.data, sort: emptyIdx + 1 };
    } else {
      editData.value.goods_images.push({ url: pic.data, sort: editData.value.goods_images.length + 1 });
    }
  }
}

/** 新增一条商品详情（goods_detail 是数组，可多条图文） */
const handleAddDetail = () => {
  editData.value.goods_detail.push({ content: "", image: "", sort: editData.value.goods_detail.length + 1 });
}

/** 删除某一条商品详情 */
const handleRemoveDetail = (index: number) => {
  editData.value.goods_detail.splice(index, 1);
}

/** 新增一条商品规格（goods_spec 是数组） */
const handleAddSpec = () => {
  editData.value.goods_spec.push({ name: "", options: "", sort: editData.value.goods_spec.length + 1 });
}

/** 删除某一条商品规格 */
const handleRemoveSpec = (index: number) => {
  editData.value.goods_spec.splice(index, 1);
}


const handleClose = () => {
  dialogVisible.value = false;
}

// 修改接口
const handleConfirm = async (data) => {
  // 表单只含主表字段；id 与三个子表从 editData 取（编辑打开时按商品 id 拉取的完整数据）
  let { category_id } = data;
  const kindArr = String(category_id ?? "").split("-");
  const postData = {
    ...data,
    id: editData.value.id,
    category_id: kindArr[0],
    kind: kindArr[1] ?? "",
    // 带子表一起提交：后端按 id 更新/新增、整体重建图集；空行过滤掉
    goods_images: (editData.value.goods_images || []).filter((i: any) => i.url),
    goods_detail: (editData.value.goods_detail || []).filter((i: any) => i.content || i.image),
    goods_spec:(editData.value.goods_spec || []).filter((i: any) => i.name || i.options).map(item=>{
    item.options=JSON.stringify(item.options.split(","));
    return item
  })
  };
  let res: any = await putGoodsData(postData);
  if (res.code == 1) {
    ElMessage.success("修改成功");
    await getList((form.value as typeof Form).formData);
  } else {
    ElMessage.error(res.msg || "修改失败");
  }
}

const handlePage = (val) => {
  listQuery.page = val;
  getList((form.value as typeof Form).formData);
}

const handleSize = (val) => {
  listQuery.pageSize = val;
  getList((form.value as typeof Form).formData);
}

const handleEdit = async (row) => {
  title.value = '编辑'
  // 按商品 id 拉取完整详情：主表 + 图集/规格/详情三张子表
  // 注意：必须先拉数据填好 editData 再打开弹框——Form 挂载时会把 initData 拷进表单，
  // 先开弹框的话挂载到的是空数据，接口回来也不会回填
  const res: any = await getGoodsDetailData(row.id);
  if (res.code != 1) {
    ElMessage.error(res.msg || "获取商品详情失败");
    return;
  }
  const d = res.data;
  editData.value = {
    id: d.id,
    title: d.title ?? "",
    sub: d.sub ?? "",
    price: d.price ?? 0,
    origin_price: d.originPrice ?? 0,
    sales: d.sales ?? 0,
    tags: d.tags ?? "",
    services: d.services ?? "",
    cover: d.cover ?? "",
    stock: d.stock ?? 0,
    status: d.status ?? 1,
    kind: d.kind ?? "",
    // 分类下拉的 value 是 `${id}-${kind}` 格式，回显要拼回去
    category_id: d.categoryId != null ? `${d.categoryId}-${d.kind ?? ""}` : 0,
    goods_spec: (d.goodsSpec || []).map((i: any) => ({ id: i.id, goods_id: i.goods_id ?? i.goodsId, name: i.name ?? "", options:JSON.parse(i.options).join(",") ?? "", sort: i.sort ?? 1 })),
    goods_detail: (d.goodsDetail || []).map((i: any) => ({ id: i.id, goods_id: i.goods_id ?? i.goodsId, content: i.content ?? "", image: i.image ?? "", sort: i.sort ?? 1 })),
    goods_images: (d.goodsImages || []).map((i: any) => ({ id: i.id, goods_id: i.goods_id ?? i.goodsId, url: i.url ?? "", sort: i.sort ?? 1 }))
  };
  dialogVisible.value = true;
}

const handleDeletes = (id) => {
  let querySelectData = { pageSize: listQuery.pageSize, page: 1 }
  if (form.value != null) {
    querySelectData = { ...form.value.formData, ...querySelectData }
  }
  handleDelete(id, deleteGoodsData, getList, querySelectData);
}

const handleSelect = (selection: Array<any>) => {
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

</script>

<template>
  <Form ref="form" :inline="true" :form-field="formField" @refsh="handleResh" @search="handleSearch" />
  <PageHeader :export="true" url="/api/goods/import" name="goods" @add="handleAdd" />
  <div class="flex-1">
    <el-table ref="multeSelection" stripe :default-sort="{ prop: 'sort', order: 'ascending' }" :data="list" width="100%"
      height="100%" row-key="id" @select="handleSelect" @select-all="handleSelectAll">
      <el-table-column type="selection" width="55" />
      <template v-for="item in tableConfig" :key="item.label">
        <el-table-column v-if="item.label == 'cover'" :width="(item.width as number)" :label="item.label"
          :prop="(item.prop as string)">
          <template #default="scope">
            <span v-show-image>
              <el-image :src="scope.row[item.prop as string]" style="width:50px" alt="图片暂时不可显示" />
            </span>
          </template>
        </el-table-column>

        <el-table-column v-else-if="item.label == 'rating'" :width="(item.width as number)" :label="item.label"
          :prop="(item.prop as string)">
          <template #default="scope">
            <el-rate allow-half :model-value="scope.row[item.label]"></el-rate>
          </template>
        </el-table-column>
        <el-table-column v-else-if="!item.template" :formatter="(item.format as () => string)"
          :width="(item.width as number)" :label="(item.label as string)" :prop="(item.prop as string)" />
      </template>
      <el-table-column label="操作" fixed="right" width="150px">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" @click="handleDeletes(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <Pagetions :current-page="listQuery.page" :page-size="listQuery.pageSize" :total="listQuery.total" :small="false"
    @page="handlePage" @size="handleSize" />
  <!-- 新增逻辑 -->
  <AddDialog :dialog-visible="dislogVisbleAdd" :inline="false" :title="title" :add-config="editConfig"
    @update:dialogVisible="handleAddClose" @add:formData="handleAddConfirm">
    <div class="margin-left:100px">
      <el-form-item label="商品详情表" :label-width="100" label-position="right">
        <div style="width: 400px;margin-bottom: 8px;">
          <el-button type="primary" size="small" @click="handleAddDetail">新增一条详情</el-button>
        </div>
        <div class="goods_detail solid" v-for="(item, index) in editData.goods_detail" v-if="editData?.goods_detail"
          style="display: flex;padding: 12px;flex-direction: column;width: 400px;border: 1px dashed #ccc;border-radius: 4px;margin-bottom: 10px;">
          <div style="display: flex;justify-content: flex-end;margin-bottom: 8px;">
            <el-button type="danger" size="small" text bg @click="handleRemoveDetail(index)">删除</el-button>
          </div>
          <div class="goods_deatil_wrap">
            <div style="display: flex;margin-bottom: 10px;align-items: center;"><span style="width: 80px;text-align: right;padding-right: 10px;">内容</span><el-input
                style="width: 280px;" v-model="item.content"></el-input></div>
            <div style="display: flex;margin-bottom: 10px;align-items: center;"><span style="width: 80px;text-align: right;padding-right: 10px;">图片</span>
              <!-- 有图显示缩略图（hover 可删除），没图才显示上传框 -->
              <div v-if="item.image" class="goods-sub-img">
                <img :src="item.image" alt="">
                <span class="goods-sub-img-del" title="删除图片" @click="handleClearDetailImage(item)">
                  <el-icon><Delete /></el-icon>
                </span>
              </div>
              <Upload v-else :headers="uploadCofig" :limit="1" show-file-list
                @success="(pic) => { handleSuccess('goods_detail', pic, index) }"></Upload>
            </div>
            <div class="sort" style="display: flex;align-items: center;">
              <span style="width: 80px;text-align: right;padding-right: 10px;">排序</span>
              <el-input type="number" min="1" style="width: 280px;" v-model="item.sort"></el-input>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="商品规格表" :label-width="100" label-position="right">
        <div style="width: 400px;margin-bottom: 8px;">
          <el-button type="primary" size="small" @click="handleAddSpec">新增一条规格</el-button>
        </div>
        <div class="goods_spec solid" v-for="(item, index) in editData.goods_spec" v-if="editData?.goods_spec"
          style="display: flex;padding: 12px;flex-direction: column;width: 400px;border: 1px dashed #ccc;border-radius: 4px;margin-bottom: 10px;">
          <div style="display: flex;justify-content: flex-end;margin-bottom: 8px;">
            <el-button type="danger" size="small" text bg @click="handleRemoveSpec(index)">删除</el-button>
          </div>
          <div class="goods_spec_wrap">
            <div style="display: flex;margin-bottom: 10px;align-items: center;"><span style="width: 80px;text-align: right;padding-right: 10px;">名称</span><el-input type="text"
                style="width: 280px;" v-model="item.name"></el-input></div>
            <div style="display: flex;margin-bottom: 10px;align-items: center;"><span style="width: 80px;text-align: right;padding-right: 10px;">规格</span><el-input type="text"
                style="width: 280px;" v-model="item.options"></el-input></div>
            <div class="sort" style="display: flex;align-items: center;">
              <span style="width: 80px;text-align: right;padding-right: 10px;">排序</span>
              <el-input type="number" min="1" style="width: 280px;" v-model="item.sort"></el-input>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label-width="100" label="商品图片集" label-position="right">
        <div style="display: flex;flex-wrap: wrap;gap: 10px;align-items: center;">
          <!-- 已有图片：缩略图 + hover 删除 -->
          <template v-for="(img, idx) in editData.goods_images" :key="idx">
            <div v-if="img.url" class="goods-sub-img">
              <img :src="img.url" alt="">
              <span class="goods-sub-img-del" title="删除图片" @click="handleRemoveImage(idx)">
                <el-icon><Delete /></el-icon>
              </span>
            </div>
          </template>
          <!-- 追加新图 -->
          <Upload :headers="uploadCofig" :limit="100" show-file-list
            @success="(pic) => { handleSuccess('goods_image', pic, 0) }"></Upload>
        </div>
      </el-form-item>
    </div>
  </AddDialog>

  <!-- 编辑逻辑：统一走 viewDialog（编辑数据经 init-data 传入，表单每次打开重新挂载） -->
  <ViewDialog :dialog-visible="dialogVisible" :title="title" :add-config="editConfig" :init-data="editData" :inline="false"
    @update:dialogVisible="handleClose" @confirm="handleConfirm">
    <div class="margin-left:100px">
      <el-form-item label="商品详情表" :label-width="100" label-position="right">
        <div style="width: 400px;margin-bottom: 8px;">
          <el-button type="primary" size="small" @click="handleAddDetail">新增一条详情</el-button>
        </div>
        <div class="goods_detail solid" v-for="(item, index) in editData.goods_detail" v-if="editData?.goods_detail"
          style="display: flex;padding: 12px;flex-direction: column;width: 400px;border: 1px dashed #ccc;border-radius: 4px;margin-bottom: 10px;">
          <div style="display: flex;justify-content: flex-end;margin-bottom: 8px;">
            <el-button type="danger" size="small" text bg @click="handleRemoveDetail(index)">删除</el-button>
          </div>
          <div class="goods_deatil_wrap">
            <div style="display: flex;margin-bottom: 10px;align-items: center;"><span style="width: 80px;text-align: right;padding-right: 10px;">内容</span><el-input
                style="width: 280px;" v-model="item.content"></el-input></div>
            <div style="display: flex;margin-bottom: 10px;align-items: center;"><span style="width: 80px;text-align: right;padding-right: 10px;">图片</span>
              <!-- 有图显示缩略图（hover 可删除），没图才显示上传框 -->
              <div v-if="item.image" class="goods-sub-img">
                <img :src="item.image" alt="">
                <span class="goods-sub-img-del" title="删除图片" @click="handleClearDetailImage(item)">
                  <el-icon><Delete /></el-icon>
                </span>
              </div>
              <Upload v-else :headers="uploadCofig" :limit="1" show-file-list
                @success="(pic) => { handleSuccess('goods_detail', pic, index) }"></Upload>
            </div>
            <div class="sort" style="display: flex;align-items: center;">
              <span style="width: 80px;text-align: right;padding-right: 10px;">排序</span>
              <el-input type="number" min="1" style="width: 280px;" v-model="item.sort"></el-input>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="商品规格表" :label-width="100" label-position="right">
        <div style="width: 400px;margin-bottom: 8px;">
          <el-button type="primary" size="small" @click="handleAddSpec">新增一条规格</el-button>
        </div>
        <div class="goods_spec solid" v-for="(item, index) in editData.goods_spec" v-if="editData?.goods_spec"
          style="display: flex;padding: 12px;flex-direction: column;width: 400px;border: 1px dashed #ccc;border-radius: 4px;margin-bottom: 10px;">
          <div style="display: flex;justify-content: flex-end;margin-bottom: 8px;">
            <el-button type="danger" size="small" text bg @click="handleRemoveSpec(index)">删除</el-button>
          </div>
          <div class="goods_spec_wrap">
            <div style="display: flex;margin-bottom: 10px;align-items: center;"><span style="width: 80px;text-align: right;padding-right: 10px;">名称</span><el-input type="text"
                style="width: 280px;" v-model="item.name"></el-input></div>
            <div style="display: flex;margin-bottom: 10px;align-items: center;"><span style="width: 80px;text-align: right;padding-right: 10px;">规格</span><el-input type="text"
                style="width: 280px;" v-model="item.options"></el-input></div>
            <div class="sort" style="display: flex;align-items: center;">
              <span style="width: 80px;text-align: right;padding-right: 10px;">排序</span>
              <el-input type="number" min="1" style="width: 280px;" v-model="item.sort"></el-input>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label-width="100" label="商品图片集" label-position="right">
        <div style="display: flex;flex-wrap: wrap;gap: 10px;align-items: center;">
          <!-- 已有图片：缩略图 + hover 删除 -->
          <template v-for="(img, idx) in editData.goods_images" :key="idx">
            <div v-if="img.url" class="goods-sub-img">
              <img :src="img.url" alt="">
              <span class="goods-sub-img-del" title="删除图片" @click="handleRemoveImage(idx)">
                <el-icon><Delete /></el-icon>
              </span>
            </div>
          </template>
          <!-- 追加新图 -->
          <Upload :headers="uploadCofig" :limit="100" show-file-list
            @success="(pic) => { handleSuccess('goods_image', pic, 0) }"></Upload>
        </div>
      </el-form-item>
    </div>
  </ViewDialog>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
}

/* 子表缩略图（详情图片 / 图片集共用）：100x100 圆角卡片，hover 出删除遮罩 */
.goods-sub-img {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e5e7eb;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .goods-sub-img-del {
    position: absolute;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 22px;
    cursor: pointer;
  }

  &:hover .goods-sub-img-del {
    display: flex;
  }
}
</style>
