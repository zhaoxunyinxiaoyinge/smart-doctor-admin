<script setup lang="ts">
import Form from "@/components/forms/index.vue";
import Pagetions from "@/components/pagetions/index.vue";
import { useTable } from "@/hooks/useTable";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { getOrderPage, putOrderData, getUserPage } from "./api";

/** orders 表状态 -> 文案 / el-tag 类型 */
const statusOptions = [
  { label: "待付款", value: "pending" },
  { label: "待发货", value: "paid" },
  { label: "已发货", value: "shipping" },
  { label: "已完成", value: "done" },
  { label: "已取消", value: "cancel" },
];
const statusText: Record<string, string> = Object.fromEntries(statusOptions.map((s) => [s.value, s.label]));
const statusTag: Record<string, string> = {
  pending: "warning",
  paid: "primary",
  shipping: "info",
  done: "success",
  cancel: "danger",
};
/** 支付方式文案：key 与移动端收银台 PayView 的 CHANNELS 对齐（wechat/alipay/card） */
const channelText: Record<string, string> = {
  wechat: "微信支付",
  alipay: "支付宝",
  ali: "支付宝", // 历史数据兼容
  card: "银行卡",
  balance: "余额支付", // 历史数据兼容
};
/** 取消来源文案（仅已取消订单有意义，空串为历史数据） */
const cancelSourceText: Record<string, string> = {
  user: "用户取消",
  admin: "管理员取消",
};

// 搜索条件：订单号 / 状态 / 下单用户（下拉 options 从用户表拉取）
// width 是 Form 组件里标签的宽度，统一 100 才能对齐
const formField = reactive([
  { label: "订单号", name: "orderNo", type: "input", width: 100 },
  { label: "状态", name: "status", type: "select", width: 100, options: statusOptions },
  { label: "下单用户", name: "userId", type: "select", width: 100, options: [] as Array<{ label: string; value: number }> },
]);

const { initTableConfig, tableConfig } = useTable();

const orderList = ref<any[]>([]);
const form = ref<typeof Form | null>(null);
const listQuery = ref({ pageSize: 10, page: 1, total: 0 });

/** 用户 id -> 昵称 映射（下拉拉用户时顺手建好，表格里直接显示昵称） */
const userMap = ref<Map<number, string>>(new Map());

/** 拉用户表：填「下单用户」下拉框 + 建昵称映射 */
async function loadUserOptions() {
  const res = await getUserPage({ page: 1, pageSize: 500 });
  if (res.code != 1) return;
  const records = res.data.records || [];
  formField[2].options = records.map((u: any) => ({
    label: `${u.nickname || "用户" + u.id}（${u.phone}）`,
    value: u.id,
  }));
  userMap.value = new Map(records.map((u: any) => [u.id, u.nickname || ""]));
}

onMounted(async () => {
  tableConfig.length = 0;
  initTableConfig([
    { label: "id", prop: "id", width: 80 },
    { label: "订单号", prop: "orderNo", width: 200 },
    { label: "下单用户", prop: "userId", width: 150, format: (row) => {
        const nick = userMap.value.get(row.userId);
        return nick ? `${nick}（#${row.userId}）` : `#${row.userId}`;
      } },
    { label: "商品金额", prop: "total", width: 110, format: (row) => `¥${row.total}` },
    { label: "实付金额", prop: "payAmount", width: 110, format: (row) => `¥${row.payAmount}` },
    { label: "支付方式", prop: "payChannel", width: 110, format: (row) =>
        // 有支付渠道才翻译，真没付过钱（pending 单）才显示未支付
        row.payChannel ? (channelText[row.payChannel] || row.payChannel) : "未支付" },
    { label: "状态", prop: "status", width: 100, template: "tag" },
    { label: "取消来源", prop: "cancelSource", width: 110, format: (row) =>
        row.status === "cancel"
          ? cancelSourceText[row.cancelSource] || "—"
          : "—" },
    { label: "快递单号", prop: "expressNo", width: 160 },
    { label: "下单时间", prop: "createTime", width: 170, format: (row) => (row.createTime || "").replace("T", " ").slice(0, 19) },
    { label: "操作", prop: "", width: 120, template: true },
  ]);

  loadUserOptions();
  await getList({ page: listQuery.value.page, pageSize: listQuery.value.pageSize });
})

const getList = async (params) => {
  return getOrderPage(params).then(res => {
    if (res.code == 1) {
      orderList.value = res.data.records;
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

/* ---------------- 编辑（改状态/填快递单号/备注），无新增无删除 ---------------- */
const editVisible = ref(false);
const editData = ref<any>({});

const handleEdit = (row) => {
  editData.value = { ...row };
  editVisible.value = true;
};

const handleColse = () => {
  editVisible.value = false;
};

const handleEditConfirm = async () => {
  const d = editData.value;
  if (!d.id) return;
  if (d.status === "shipping" && !String(d.expressNo || "").trim()) {
    ElMessage.warning("标记为已发货时请填写快递单号");
    return;
  }
  // 后端 OrderBody 是 snake_case
  const payload = {
    id: d.id,
    status: d.status,
    express_no: d.expressNo || "",
    remark: d.remark || "",
  };
  const res = await putOrderData(payload);
  if (res.code == 1) {
    ElMessage.success("编辑成功");
    editVisible.value = false;
    getList({ ...form.value?.formData, page: listQuery.value.page, pageSize: listQuery.value.pageSize });
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
  <div class="flex-1">
    <el-table
      ref="multeSelection"
      stripe
      :data="orderList"
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
        <!-- 状态列：彩色标签 -->
        <el-table-column
          v-else-if="item.template === 'tag'"
          :key="item.label"
          :label="item.label"
          :width="item.width + 'px'"
        >
          <template #default="scope">
            <el-tag
              :type="(statusTag[scope.row.status] || 'info') as any"
              effect="light"
              round
            >
              {{ statusText[scope.row.status] || scope.row.status }}
            </el-tag>
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
              type="primary"
              @click="handleEdit(scope.row)"
            >
              编辑
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

  <!-- 编辑订单：改状态 / 填快递单号 / 备注 -->
  <el-dialog
    :model-value="editVisible"
    :title="`编辑订单 ${editData.orderNo || ''}`"
    width="480px"
    @update:model-value="handleColse"
  >
    <el-form
      label-width="90px"
    >
      <el-form-item label="订单状态">
        <el-select
          v-model="editData.status"
          style="width: 100%;"
        >
          <el-option
            v-for="s in statusOptions"
            :key="s.value"
            :label="s.label"
            :value="s.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号">
        <el-input
          v-model="editData.expressNo"
          placeholder="标记为已发货时必填"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="editData.remark"
          type="textarea"
          :rows="2"
          placeholder="订单备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleColse">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="handleEditConfirm"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
}
</style>
