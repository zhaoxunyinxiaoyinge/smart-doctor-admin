<script setup lang="ts">
import Form from "@/components/forms/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getCommentPage, deleteCommentData, getUserPage, getGoodsPage } from "./api";

// 搜索条件：用户名 / 评价内容（模糊），用户 / 商品（下拉）
// 注意：width 是 Form 组件里标签的宽度，统一 100 才能对齐（参考 hots.vue 等页面写法）
const formField = reactive([
  { label: "用户名", name: "userName", type: "input", width: 100 },
  { label: "评价内容", name: "content", type: "input", width: 100 },
  { label: "用户", name: "userId", type: "select", width: 100, options: [] as Array<{ label: string; value: number }> },
  { label: "商品", name: "goodsId", type: "select", width: 100, options: [] as Array<{ label: string; value: number }> },
]);

const { initTableConfig, tableConfig } = useTable();

const commentList = ref<any[]>([]);
const form = ref<typeof Form | null>(null);
const listQuery = ref({ pageSize: 10, page: 1, total: 0 });

/** 商品 id -> 标题 映射（拉商品下拉时顺手建好，表格里直接显示标题） */
const goodsMap = ref<Map<number, string>>(new Map());

/** 拉用户 / 商品下拉框数据源（两个请求各自容错，一个失败不影响另一个） */
async function loadOptions() {
  const userTask = getUserPage({ page: 1, pageSize: 500 })
    .then((res) => {
      if (res.code == 1) {
        formField[2].options = (res.data.records || []).map((u: any) => ({
          label: `${u.nickname || "用户" + u.id}（${u.phone}）`,
          value: u.id,
        }));
      }
    })
    .catch(() => {});
  const goodsTask = getGoodsPage({ page: 1, pageSize: 500 })
    .then((res) => {
      if (res.code == 1) {
        const records = res.data.records || [];
        formField[3].options = records.map((g: any) => ({
          label: g.title || `商品#${g.id}`,
          value: g.id,
        }));
        goodsMap.value = new Map(records.map((g: any) => [g.id, g.title || ""]));
      }
    })
    .catch(() => {});
  await Promise.all([userTask, goodsTask]);
}

onMounted(async () => {
  tableConfig.length = 0;
  initTableConfig([
    { label: "id", prop: "id", width: 70 },
    { label: "商品", prop: "goodsId", width: 170, format: (row) =>
        goodsMap.value.get(row.goodsId) || `商品#${row.goodsId}` },
    { label: "用户", prop: "userName", width: 120, format: (row) => row.userName || `#${row.userId}` },
    { label: "评分", prop: "rate", width: 130, format: (row) =>
        "★".repeat(Math.min(Math.max(Number(row.rate) || 0, 0), 5)) +
        "☆".repeat(Math.max(5 - (Number(row.rate) || 0), 0)) },
    { label: "评价内容", prop: "content" },
    { label: "规格", prop: "spec", width: 110 },
    { label: "点赞", prop: "likes", width: 70 },
    { label: "匿名", prop: "isAnonymous", width: 70, format: (row) => (row.isAnonymous ? "是" : "否") },
    { label: "评价时间", prop: "createTime", width: 160, format: (row) =>
        (row.createTime || "").replace("T", " ").slice(0, 19) },
    { label: "操作", prop: "", width: 90, template: true },
  ]);

  loadOptions();
  await getList({ page: listQuery.value.page, pageSize: listQuery.value.pageSize });
})

const getList = async (params) => {
  return getCommentPage(params).then(res => {
    if (res.code == 1) {
      commentList.value = res.data.records;
      listQuery.value.total = res.data.total;
    }
  })
}

/** 过滤掉空串/null 条件（后端按有值才拼 where，这里兜底过滤一次） */
function buildQuery(formData?: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(formData || {}).filter(([, v]) => v !== "" && v !== null && v !== undefined),
  );
}

/** 按当前搜索条件 + 指定页码拉列表（不重置页码） */
const fetchList = (page: number) => {
  const query = buildQuery(form.value?.formData);
  return getList({ ...query, page, pageSize: listQuery.value.pageSize });
}

const handleResh = () => {
  getList({ page: 1, pageSize: listQuery.value.pageSize });
}

/** 点搜索：回到第 1 页再查 */
const handleSearch = (formData) => {
  listQuery.value.page = 1;
  const query = buildQuery(formData);
  getList({ ...query, page: 1, pageSize: listQuery.value.pageSize });
}

const handlePage = (val) => {
  listQuery.value.page = val;
  fetchList(val);
}

const handleSize = (val) => {
  listQuery.value.pageSize = val;
  listQuery.value.page = 1;
  fetchList(1);
}

/* ---------------- 列表只有删除 ---------------- */
const handleDel = (row) => {
  ElMessageBox.confirm(`确定删除这条评价吗？（#${row.id} ${row.content?.slice(0, 20) || ""}）`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const res = await deleteCommentData(row.id);
    if (res.code == 1) {
      ElMessage.success("删除成功");
      // 删的是本页最后一条时回退一页
      if (commentList.value.length === 1 && listQuery.value.page > 1) {
        listQuery.value.page -= 1;
      }
      fetchList(listQuery.value.page);
    }
  }).catch(() => {});
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
  <div class="flex-1">
    <el-table
      ref="multeSelection"
      stripe
      :data="commentList"
      width="100%"
      height="100%"
    >
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
          :width="item.width + 'px'"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="danger"
              @click="handleDel(scope.row)"
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
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
}
</style>
