<template>
  <el-scrollbar :height="content.routeContentHeight">
    <div class="dashboard" :style="{'height':content.routeContentHeight}">

      <!-- ============ KPI 指标卡 ============ -->
      <section class="kpi-grid">
        <el-card
          v-for="k in kpiList"
          :key="k.label"
          shadow="never"
          class="kpi-card"
          :body-style="{ padding: '16px 16px 14px' }"
        >
          <div class="kpi-card__glow" :style="{ background: k.tint }" />
          <div class="kpi-top">
            <span class="kpi-label">{{ k.label }}</span>
            <span
              v-if="k.rate"
              class="chip"
              :class="k.trend === 'up' ? 'chip--up' : 'chip--down'"
            >
              {{ k.trend === 'up' ? '▲' : '▼' }} {{ k.rate }}%
            </span>
            <span v-else class="chip chip--blue">需关注</span>
          </div>
          <div class="kpi-value num">
            {{ k.value }}<small>{{ k.unit }}</small>
          </div>
          <div class="kpi-foot">
            <svg width="62" height="20" viewBox="0 0 62 20">
              <polyline
                :points="sparkPoints(k.spark)"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span>{{ k.desc }}</span>
          </div>
        </el-card>
      </section>

      <!-- ============ 销售趋势 + 渠道分布 ============ -->
      <section class="row-b">
        <el-card shadow="never" :body-style="{ padding: '0 14px 14px' }">
          <template #header>
            <div class="card-head">
              <div class="card-head__title">
                <h3>销售趋势</h3>
                <span class="sub">{{ realTrend ? '近 7 天 · 管理端实时' : trend.range + ' · 示例数据' }}</span>
              </div>
              <div class="legend">
                <span><i style="background:#3b6cff" />成交额（万元）</span>
                <span><i style="background:#c9d5f2" />上周同期</span>
              </div>
            </div>
          </template>
          <div ref="trendRef" class="chart chart--trend" />
        </el-card>

        <el-card shadow="never" :body-style="{ padding: '6px 18px 16px' }">
          <template #header>
            <div class="card-head">
              <div class="card-head__title">
                <h3>支付方式分布</h3>
                <span class="sub">{{ realChannel ? '近 7 天 · 管理端实时' : '订单来源 · 示例数据' }}</span>
              </div>
            </div>
          </template>
          <div class="donut-box">
            <div class="donut-wrap">
              <div ref="channelRef" class="chart chart--donut" />
              <div class="donut-center num">
                <b>{{ channelTotal.toLocaleString() }}</b>
                <small>近 7 天总订单</small>
              </div>
            </div>
            <div class="donut-legend">
              <div v-for="c in channelItems" :key="c.name" class="dl">
                <span class="sq" :style="{ background: c.color }" />
                <span class="name">{{ c.name }}</span>
                <span class="bar">
                  <i :style="{ width: (c.value / (channelTotal || 1) * 100).toFixed(1) + '%', background: c.color }" />
                </span>
                <b class="num">{{ (c.value / (channelTotal || 1) * 100).toFixed(0) }}%</b>
                <span class="num gray">{{ c.value.toLocaleString() }} 单</span>
              </div>
            </div>
            <div class="donut-tip">
              <el-icon><TrendCharts /></el-icon>
              <span>{{ channelTip }}</span>
            </div>
          </div>
        </el-card>
      </section>

      <!-- ============ 订单状态 / 热销 / 待办 ============ -->
      <section class="row-c">
        <el-card shadow="never" :body-style="{ padding: '14px 18px 18px' }">
          <template #header>
            <div class="card-head">
              <div class="card-head__title">
                <h3>订单状态</h3>
                <span class="sub">{{ realCount ? '管理端实时' : '近 7 天 · 示例数据' }}</span>
              </div>
            </div>
          </template>
          <div class="status-list">
            <div v-for="s in orderStatus" :key="s.name" class="status-row">
              <div class="status-row__top">
                <span class="sq" :style="{ background: s.color }" />
                {{ s.name }}
                <b class="num">{{ s.count }}</b>
                <em class="num">{{ (s.count / statusTotal * 100).toFixed(1) }}%</em>
              </div>
              <div class="track">
                <i :style="{ width: (s.count / statusTotal * 100).toFixed(1) + '%', background: s.color }" />
              </div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" :body-style="{ padding: '14px 18px 18px' }">
          <template #header>
            <div class="card-head">
              <div class="card-head__title">
                <h3>热销商品 TOP 5</h3>
                <span class="sub">{{ realHot ? '管理端实时' : '示例数据' }}</span>
              </div>
              <el-link type="primary" :underline="false" @click="router.push('/goods/list')">全部商品 ›</el-link>
            </div>
          </template>
          <div class="tops">
            <div v-for="(g, i) in topGoods" :key="g.name" class="top-item">
              <span class="rank" :class="rankClass(i)">{{ i + 1 }}</span>
              <span class="thumb" :style="{ background: g.thumb }" />
              <div class="ti-t">
                <p>{{ g.name }}</p>
                <small>库存 {{ g.stock }} · 客单价 ¥{{ g.price }}</small>
              </div>
              <div class="ti-n num">
                <b>¥{{ g.salesAmount.toLocaleString() }}</b>
                <small>{{ g.salesCount }} 件</small>
              </div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" :body-style="{ padding: '14px 18px 18px' }">
          <template #header>
            <div class="card-head">
              <div class="card-head__title">
                <h3>待办事项</h3>
                <span class="sub">{{ realTodo ? `${todoTotal} 项未处理` : '44 项未处理 · 示例数据' }}</span>
              </div>
            </div>
          </template>
          <div class="todo">
            <div v-for="t in todoList" :key="t.title" class="todo-item">
              <span class="ti-ic" :class="`ti-ic--${t.level}`">
                <el-icon><component :is="todoIcon(t.icon)" /></el-icon>
              </span>
              <div class="todo-txt">
                <p>{{ t.title }}</p>
                <small>{{ t.desc }}</small>
              </div>
              <el-tag
                size="small"
                effect="plain"
                :type="tagType(t.level)"
                round
              >{{ t.count }}</el-tag>
            </div>
          </div>
        </el-card>
      </section>

      <!-- ============ 最新订单 ============ -->
      <el-card shadow="never" :body-style="{ padding: '6px 0 0' }">
        <template #header>
          <div class="card-head">
            <div class="card-head__title">
              <h3>最新订单</h3>
              <span class="sub">{{ realOrders ? '管理端实时数据' : '示例数据' }}</span>
            </div>
            <div class="card-head__right">
              <el-tag type="primary" effect="light" round>
                今日 {{ statsSummary ? statsSummary.todayOrders.toLocaleString() : '1,842' }} 单
              </el-tag>
              <el-link type="primary" :underline="false" @click="router.push('/oders/index')">查看全部 ›</el-link>
            </div>
          </div>
        </template>

        <el-table :data="latestOrders" style="width: 100%" size="large">
          <el-table-column prop="id" label="订单号" min-width="170">
            <template #default="{ row }">
              <span class="oid num">{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" min-width="260">
            <template #default="{ row }">
              <div class="goods-cell">
                <span class="thumb thumb--sm" :style="{ background: row.thumb }" />
                <span class="goods-name">{{ row.goods }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="支付方式" width="110">
            <template #default="{ row }">
              <span class="ch" :class="channelClass(row.channel)">
                <i />{{ row.channel }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="buyer" label="买家" min-width="170" />
          <el-table-column label="实付金额" width="110" sortable>
            <template #default="{ row }">
              <span class="amt num">¥{{ row.amount.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" width="100">
            <template #default="{ row }">
              <el-tag :type="(orderStatusTag as any)[row.status]" effect="light" round>
                {{ orderStatusText[row.status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="下单时间" width="110" />
          <el-table-column label="操作" width="130" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 'wait-send'"
                link type="primary" size="small"
              >发货</el-button>
              <el-button
                v-if="row.status === 'wait-pay'"
                link type="primary" size="small"
              >催付</el-button>
              <el-button
                v-if="row.status === 'sent'"
                link type="primary" size="small"
              >物流</el-button>
              <el-button
                v-if="row.status === 'refund'"
                link type="primary" size="small"
              >审核</el-button>
              <el-button link type="info" size="small">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="t-foot">
          <span class="num">显示第 {{ (orderPage - 1) * 5 + 1 }}-{{ Math.min(orderPage * 5, orderTotal) }} 条，共 {{ orderTotal.toLocaleString() }} 条</span>
          <el-pagination
            layout="prev, pager, next"
            :total="orderTotal"
            :page-size="5"
            :pager-count="5"
            :current-page="orderPage"
            @current-change="(p: number) => loadLatestOrders(p)"
          />
        </div>
      </el-card>

    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts/core';
import {
  TrendCharts,
  Van,
  RefreshLeft,
  Warning,
  Timer,
} from '@element-plus/icons-vue';
import content from '@/assets/scss/layout.module.scss';
import {
  kpis,
  trend,
  channel,
  orderStatus as mockOrderStatus,
  topGoods as mockTopGoods,
  todos,
  latestOrders as mockLatestOrders,
  orderStatusText,
  orderStatusTag,
  type OrderStatus,
  type StatusItem,
  type TopGoods,
  type OrderItem,
  KpiItem,
} from './dashboardData';
import {
  getOrderPage,
  getOrderItems,
  getGoodsPage,
  getStatsSummary,
  getTrend,
  getPayChannel,
  LOW_STOCK_THRESHOLD,
  type AdminOrderRow,
  type AdminOrderItemRow,
  type StatsSummary,
} from './api/admin';

const router = useRouter();

/* ------------------------------------------------------------------ *
 * 列表数据：默认取模拟数据，接口拉到真实数据后原地替换，失败自动回退
 * ------------------------------------------------------------------ */
const kpiList = ref<KpiItem[]>(kpis.map((k) => ({ ...k })));
const topGoods = ref<TopGoods[]>([...mockTopGoods]);
const orderStatus = ref<StatusItem[]>([...mockOrderStatus]);
const latestOrders = ref<OrderItem[]>([...mockLatestOrders]);
const todoList = ref([...todos]);

/** 订单总数（最新订单卡片底部分页用） */
const orderTotal = ref(1842);
/** 当前页码 */
const orderPage = ref(1);
/** KPI 汇总（最新订单卡片的「今日 N 单」用） */
const statsSummary = ref<StatsSummary | null>(null);

/** 数据源标记：true = 已接通 adminServe 真实接口 */
const realKpi = ref(false);
const realHot = ref(false);
const realCount = ref(false);
const realOrders = ref(false);
const realTodo = ref(false);
const realTrend = ref(false);
const realChannel = ref(false);

/** 支付方式分布（接口成功后覆盖 mock 的渠道数据） */
const channelItems = ref(channel.items.map((c) => ({ ...c })));
const channelTotal = ref(channel.total);
const channelTip = ref(`小程序占比环比提升 ${channel.wxRateUp}%`);

/** 待办总数：真实项（待发货/库存预警）取接口值，售后暂为示例值 18 */
const todoTotal = computed(() => {
  // count 是 "199 单" / "3 项" 这种带单位的字符串，parseInt 取数字部分
  const num = (c: unknown) => parseInt(String(c ?? ''), 10) || 0;
  return num(todoList.value[0]?.count) + num(todoList.value[1]?.count) + num(todoList.value[2]?.count);
});

/** orders 表状态 -> 页面状态标签 */
const statusMap: Record<string, OrderStatus> = {
  pending: 'wait-pay',
  paid: 'wait-send',
  shipping: 'sent',
  done: 'done',
  cancel: 'cancel',
};

/** 兜底缩略图（接口没图时用渐变占位） */
const fallbackThumbs = [
  'linear-gradient(135deg,#ffd6a5,#ff8a4c)',
  'linear-gradient(135deg,#b9e7ff,#5aa9e6)',
  'linear-gradient(135deg,#ffe0e6,#ff8fa3)',
  'linear-gradient(135deg,#d8f5d0,#7fc76a)',
  'linear-gradient(135deg,#e3dcff,#8f7bff)',
];

function fallbackThumb(i: number): string {
  return fallbackThumbs[i % fallbackThumbs.length];
}

function maskName(name: string): string {
  return name ? `${name.slice(0, 1)}**` : '—';
}

function maskPhone(phone: string): string {
  return phone && phone.length >= 7 ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : phone || '—';
}

function timeStr(value: string | number): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const p = (n: number) => String(n).padStart(2, '0');
  // 订单可能跨天，带上月日更直观
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** pay_channel 是支付渠道，不是下单来源，按支付方式展示。
 *  key 与移动端收银台 PayView 的 CHANNELS 对齐：wechat / alipay / card */
function channelLabel(payChannel: string): string {
  const c = (payChannel || '').toLowerCase();
  if (c.includes('wx') || c.includes('wechat')) return '微信支付';
  if (c.includes('ali')) return '支付宝';
  if (c === 'card') return '银行卡';
  if (c.includes('balance') || c.includes('wallet')) return '余额支付';
  if (c.includes('app')) return 'APP';
  if (c.includes('mini')) return '小程序';
  // 未知渠道原样展示（灰色徽标），出现新支付方式时在上面补一行映射即可
  return payChannel || '—';
}

function channelClass(channel: string): string {
  const c = channel || '';
  if (c === '小程序' || c.includes('微信')) return 'ch--wx';
  if (c === 'APP' || c.includes('支付宝')) return 'ch--app';
  return 'ch--mute';
}

/** 环比：今日 vs 昨日，返回百分比数值（昨日为 0 时给 0） */
function rateOf(today: number, yesterday: number): number {
  if (!yesterday) return 0;
  return Math.round((Math.abs(today - yesterday) / yesterday) * 1000) / 10;
}

function trendOf(today: number, yesterday: number): 'up' | 'down' {
  return today >= yesterday ? 'up' : 'down';
}

/** KPI 四卡：GET /api/mobile/stats/summary */
async function loadKpis() {
  try {
    const s = await getStatsSummary();
    statsSummary.value = s;
    kpiList.value = [
      {
        ...kpiList.value[0],
        value: Math.round(s.todayAmount).toLocaleString(),
        trend: trendOf(s.todayAmount, s.yesterdayAmount),
        rate: rateOf(s.todayAmount, s.yesterdayAmount),
        desc: `较昨日 ¥${Math.round(s.yesterdayAmount).toLocaleString()}`,
      },
      {
        ...kpiList.value[1],
        value: s.todayOrders.toLocaleString(),
        trend: trendOf(s.todayOrders, s.yesterdayOrders),
        rate: rateOf(s.todayOrders, s.yesterdayOrders),
        desc: `较昨日 ${s.yesterdayOrders} 单`,
      },
      {
        ...kpiList.value[2],
        value: s.todayNewUsers.toLocaleString(),
        trend: trendOf(s.todayNewUsers, s.yesterdayNewUsers),
        rate: rateOf(s.todayNewUsers, s.yesterdayNewUsers),
        desc: `昨日新增 ${s.yesterdayNewUsers} 人 · 用户总数 ${s.userTotal}`,
      },
      {
        ...kpiList.value[3],
        value: (s.paidCount + s.shippingCount).toLocaleString(),
        trend: 'up',
        rate: 0,
        desc: `待发货 ${s.paidCount} · 已发货 ${s.shippingCount}`,
      },
    ];
    realKpi.value = true;
  } catch (e) {
    console.warn('[dashboard] KPI 汇总接口失败，使用示例数据：', e);
  }
}

/** 热销 TOP5：GET /api/mobile/goods，前端按销量排序取前 5 */
async function loadHotGoods() {
  try {
    const res = await getGoodsPage({ page: 1, pageSize: 50 });
    topGoods.value = [...res.records]
      .sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0))
      .slice(0, 5)
      .map((g, i) => ({
        name: g.title || '—',
        stock: g.stock ?? 0,
        price: g.price ?? 0,
        // 后端暂无销售额字段，先用 客单价 × 销量 估算
        salesAmount: Math.round((g.price ?? 0) * (g.sales ?? 0)),
        salesCount: g.sales ?? 0,
        thumb: g.cover || fallbackThumb(i),
      }));
    realHot.value = true;
  } catch (e) {
    console.warn('[dashboard] 商品接口失败，使用示例数据：', e);
  }
}

/** 订单状态分布：/api/mobile/order?status=x&pageSize=1，用 total 当各状态数量 */
async function loadOrderCount() {
  try {
    const statuses = [
      { key: 'pending', name: '待付款', color: '#f5a623' },
      { key: 'paid', name: '待发货', color: '#3b6cff' },
      { key: 'shipping', name: '已发货', color: '#7f8ea8' },
      { key: 'done', name: '已完成', color: '#12a45a' },
      { key: 'cancel', name: '已取消', color: '#c0c8d4' },
    ] as const;
    const counts = await Promise.all(
      statuses.map((s) => getOrderPage({ status: s.key, page: 1, pageSize: 1 }).then((r) => r.total)),
    );
    orderStatus.value = statuses.map((s, i) => ({ name: s.name, count: counts[i], color: s.color }));
    realCount.value = true;
  } catch (e) {
    console.warn('[dashboard] 订单统计接口失败，使用示例数据：', e);
  }
}

/** 最新订单：GET /api/mobile/order + 每单明细 GET /api/mobile/order-item */
async function loadLatestOrders(page = 1) {
  try {
    const res = await getOrderPage({ page, pageSize: 5 });
    orderTotal.value = res.total;
    orderPage.value = page;
    const rows = await Promise.all(
      res.records.map(async (o: AdminOrderRow, i) => {
        let items: AdminOrderItemRow[] = [];
        try {
          items = (await getOrderItems({ orderId: o.id, page: 1, pageSize: 20 })).records;
        } catch {
          /* 单个订单明细失败不影响整表 */
        }
        const goodsTitle = items[0]?.title || '—';
        const more = items.length > 1 ? ` 等 ${items.length} 件` : '';
        return {
          id: o.orderNo,
          goods: `${goodsTitle}${more}`,
          thumb: items[0]?.cover || fallbackThumb(i),
          channel: channelLabel(o.payChannel),
          buyer: o.addressName
            ? `${maskName(o.addressName)}（${maskPhone(String(o.addressPhone ?? ''))}）`
            : '—',
          amount: o.payAmount ?? 0,
          status: statusMap[o.status] ?? 'done',
          time: timeStr(o.createTime),
        };
      }),
    );
    latestOrders.value = rows;
    realOrders.value = true;
  } catch (e) {
    console.warn('[dashboard] 最新订单接口失败，使用示例数据：', e);
  }
}

/** 拉取真实数据（各请求互相独立，谁成功用谁，失败回退模拟数据） */
function loadRealData() {
  loadKpis();
  loadHotGoods();
  loadOrderCount();
  loadLatestOrders();
  loadTodos();
  loadTrend();
  loadPayChannel();
}

/** 销售趋势：GET /api/mobile/stats/trend（按天聚合，单位转成万元对齐 mock 口径） */
async function loadTrend() {
  try {
    const res = await getTrend(7);
    const toWan = (v: number) => Math.round((v / 10000) * 100) / 100;
    renderTrend(res.days, res.current.map(toWan), res.previous.map(toWan));
    realTrend.value = true;
  } catch (e) {
    console.warn('[dashboard] 销售趋势接口失败，使用示例数据：', e);
  }
}

/** 支付方式分布：GET /api/mobile/stats/pay-channel */
async function loadPayChannel() {
  try {
    const res = await getPayChannel(7);
    if (!res.length) throw new Error('近 7 天无订单');
    renderChannel(res);
    realChannel.value = true;
  } catch (e) {
    console.warn('[dashboard] 支付方式分布接口失败，使用示例数据：', e);
  }
}

/**
 * 待办事项：只接「待发货订单」和「库存不足预警」两项真实数据，
 * 售后（无售后表）和秒杀（无活动表）保持示例数据。
 */
async function loadTodos() {
  try {
    const [paidRes, lowStockRes] = await Promise.all([
      getOrderPage({ status: 'paid', page: 1, pageSize: 1 }),
      getGoodsPage({ stockLt: LOW_STOCK_THRESHOLD, page: 1, pageSize: 5 }),
    ]);

    // 待发货订单
    todoList.value[0] = {
      ...todoList.value[0],
      count: `${paidRes.total} 单`,
      desc: '已支付未发货，请尽快安排',
    };

    // 库存不足预警：列出库存最低的商品
    const lowStockGoods = [...lowStockRes.records].sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
    const lowest = lowStockGoods[0];
    todoList.value[2] = {
      ...todoList.value[2],
      count: `${lowStockRes.total} 项`,
      desc: lowest ? `${lowest.title} 仅剩 ${lowest.stock}` : `库存低于 ${LOW_STOCK_THRESHOLD} 的商品`,
    };

    realTodo.value = true;
  } catch (e) {
    console.warn('[dashboard] 待办接口失败，使用示例数据：', e);
  }
}

/* ================= KPI 迷你折线 ================= */
function sparkPoints(data: number[]): string {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  return data
    .map((v, i) => `${(i / (data.length - 1)) * 62},${16 - ((v - min) / span) * 12}`)
    .join(' ');
}

/* ================= 订单状态汇总 ================= */
const statusTotal = computed(() =>
  orderStatus.value.reduce((s, it) => s + it.count, 0)
);

/* ================= 热销排名样式 ================= */
function rankClass(i: number) {
  return i < 3 ? `rank--r${i + 1}` : '';
}

/* ================= 待办图标 ================= */
const iconMap: Record<string, any> = {
  send: Van,
  refund: RefreshLeft,
  warn: Warning,
  promo: Timer,
};
function todoIcon(icon: string) {
  return iconMap[icon] ?? Timer;
}
function tagType(level: string) {
  const map: Record<string, string> = {
    red: 'danger',
    orange: 'warning',
    blue: 'primary',
    green: 'success',
  };
  return (map[level] ?? 'info') as any;
}

/* ================= ECharts ================= */
const trendRef = ref<HTMLDivElement>();
const channelRef = ref<HTMLDivElement>();
let trendChart: echarts.ECharts | null = null;
let channelChart: echarts.ECharts | null = null;

/** 构建趋势图配置（初始用 mock，接口成功后用真实数据重画） */
function trendOption(days: string[], amount: number[], prev: number[]) {
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#161d2e',
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 12 },
      valueFormatter: (v: any) => `${v} 万元`,
    },
    legend: {
      show: false, // 图例放在卡片头部，保持与设计稿一致
    },
    grid: { left: 44, right: 20, top: 24, bottom: 30 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: days,
      axisLine: { lineStyle: { color: '#e9edf6' } },
      axisTick: { show: false },
      axisLabel: { color: '#8e98ab', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f0f3f9' } },
      axisLabel: { color: '#8e98ab', fontSize: 11 },
    },
    series: [
      {
        name: '成交额',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: amount,
        lineStyle: { width: 2.6, color: '#3b6cff' },
        itemStyle: { color: '#3b6cff', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59,108,255,.22)' },
            { offset: 1, color: 'rgba(59,108,255,0)' },
          ]),
        },
      },
      {
        name: '上周同期',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: prev,
        lineStyle: { width: 2, color: '#c9d5f2', type: 'dashed' },
      },
    ],
  };
}

function renderTrend(days: string[], amount: number[], prev: number[]) {
  if (!trendRef.value) return;
  if (!trendChart) trendChart = echarts.init(trendRef.value);
  trendChart.setOption(trendOption(days, amount, prev));
}

function initTrendChart() {
  renderTrend(trend.days, trend.amount, trend.lastWeek);
}

function initChannelChart() {
  renderChannel(channel.items.map((c) => ({ name: c.name, value: c.value })));
}

/** 支付方式对应的环形图配色（名称与 channelLabel 输出对齐） */
function payChannelColor(name: string): string {
  if (name === '微信支付') return '#07c160';
  if (name === '支付宝') return '#3b6cff';
  if (name === '银行卡') return '#0f766e';
  if (name === '余额支付') return '#f5a623';
  return '#8e98ab';
}

function renderChannel(items: Array<{ name: string; value: number }>) {
  const list = items
    .map((it) => ({ name: it.name || '未支付', value: it.value, color: payChannelColor(it.name || '未支付') }))
    .sort((a, b) => b.value - a.value);
  channelTotal.value = list.reduce((s, x) => s + x.value, 0);
  channelItems.value = list;
  const top = list[0];
  channelTip.value = top ? `${top.name}占比 ${Math.round((top.value / (channelTotal.value || 1)) * 100)}%` : '暂无支付数据';

  if (!channelRef.value) return;
  if (!channelChart) channelChart = echarts.init(channelRef.value);
  channelChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}：{c} 单（{d}%）',
    },
    series: [
      {
        type: 'pie',
        radius: ['58%', '78%'],
        center: ['50%', '50%'],
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
        itemStyle: { borderRadius: 4 },
        data: list.map((x) => ({ name: x.name, value: x.value, itemStyle: { color: x.color } })),
      },
    ],
  });
}

function handleResize() {
  trendChart?.resize();
  channelChart?.resize();
}

onMounted(async () => {
  await nextTick();
  initTrendChart();
  initChannelChart();
  loadRealData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  trendChart?.dispose();
  channelChart?.dispose();
  trendChart = null;
  channelChart = null;
});
</script>

<style lang="scss" scoped>
.dashboard {
  --dash-bg: #f4f6fb;
  --dash-ink: #161d2e;
  --dash-ink2: #586378;
  --dash-ink3: #8e98ab;
  --dash-line: #e9edf6;
  --dash-brand: #3b6cff;
  --dash-up: #e4393c;   /* 涨：红（国内习惯） */
  --dash-down: #12a45a; /* 跌：绿 */

  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px 28px;
  background: var(--dash-bg);
  min-width: 960px;
  font-size: 13px;
  color: var(--dash-ink);

  .num { font-variant-numeric: tabular-nums; }
  .up { color: var(--dash-up); }

  /* ---------- 通用卡片头 ---------- */
  :deep(.el-card) {
    border-radius: 14px;
    border-color: var(--dash-line);
    box-shadow: 0 1px 2px rgba(22, 35, 64, 0.04),
      0 10px 30px -16px rgba(22, 35, 64, 0.18);
  }
  :deep(.el-card__header) { padding: 14px 18px; border-bottom: none; }

  .card-head {
    display: flex;
    align-items: center;
    gap: 10px;

    &__title {
      display: flex;
      align-items: baseline;
      gap: 8px;

      h3 { margin: 0; font-size: 14px; font-weight: 600; }
      .sub { font-size: 11px; color: var(--dash-ink3); }
    }
    &__right {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .legend {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 11px;
    color: var(--dash-ink2);

    i {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 2px;
      margin-right: 5px;
    }
  }

  .sq {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 2px;
  }

  /* ---------- KPI ---------- */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .kpi-card {
    position: relative;
    overflow: hidden;

    &__glow {
      position: absolute;
      right: -30px;
      top: -30px;
      width: 96px;
      height: 96px;
      border-radius: 50%;
      pointer-events: none;
    }
  }

  .kpi-top {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--dash-ink2);
    font-size: 12px;
  }

  .chip {
    margin-left: auto;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 600;

    &--up { color: var(--dash-up); background: #fdeceb; }
    &--down { color: var(--dash-down); background: #e9f8ef; }
    &--blue { color: var(--dash-brand); background: #edf2ff; font-weight: 500; }
  }

  .kpi-value {
    margin: 10px 0 0;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.15;

    small {
      font-size: 13px;
      font-weight: 600;
      color: var(--dash-ink2);
      margin-left: 2px;
    }
  }

  .kpi-foot {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    font-size: 11px;
    color: var(--dash-ink3);

    svg { color: #f0a09e; flex: none; }
  }

  /* ---------- 趋势 + 渠道 ---------- */
  .row-b {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 16px;
  }

  .chart--trend { width: 100%; height: 300px; }
  .chart--donut { width: 100%; height: 200px; }

  .donut-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .donut-wrap {
    position: relative;
    width: 100%;
  }

  .donut-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    line-height: 1.35;

    b { font-size: 20px; font-weight: 700; }
    small { font-size: 10.5px; color: var(--dash-ink3); }
  }

  .donut-legend {
    width: 100%;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .dl {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 12px;

    .name { color: var(--dash-ink2); }
    .bar {
      flex: 1;
      height: 6px;
      border-radius: 4px;
      background: #f2f5fa;
      overflow: hidden;

      i { display: block; height: 100%; border-radius: 4px; }
    }
    b { font-weight: 600; width: 44px; text-align: right; }
    .gray { width: 56px; text-align: right; color: var(--dash-ink3); font-size: 11px; }
  }

  .donut-tip {
    width: 100%;
    margin-top: 14px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f8fafd;
    border: 1px solid #eff3fa;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--dash-ink2);

    .el-icon { color: var(--dash-brand); }
    b { font-weight: 600; }
  }

  /* ---------- 订单状态 ---------- */
  .row-c {
    display: grid;
    grid-template-columns: 1fr 1.15fr 1fr;
    gap: 16px;
  }

  .status-list {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .status-row__top {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    margin-bottom: 6px;

    b { margin-left: auto; font-weight: 600; }
    em { font-style: normal; color: var(--dash-ink3); font-size: 11px; width: 46px; text-align: right; }
  }

  .track {
    height: 7px;
    border-radius: 5px;
    background: #f2f5fa;
    overflow: hidden;

    i { display: block; height: 100%; border-radius: 5px; }
  }

  /* ---------- 热销 TOP5 ---------- */
  .tops {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .top-item {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .rank {
    width: 18px;
    height: 18px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f5fa;
    color: var(--dash-ink3);
    flex: none;

    &--r1 { background: linear-gradient(135deg, #ff8a3d, #ff5b2e); color: #fff; }
    &--r2 { background: linear-gradient(135deg, #9db4ff, #6b8bff); color: #fff; }
    &--r3 { background: linear-gradient(135deg, #ffd06b, #f5a623); color: #fff; }
  }

  .thumb {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    flex: none;

    &--sm { width: 30px; height: 30px; border-radius: 7px; }
  }

  .ti-t {
    flex: 1;
    min-width: 0;

    p {
      margin: 0;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    small { font-size: 10px; color: var(--dash-ink3); }
  }

  .ti-n {
    text-align: right;
    line-height: 1.3;

    b { font-size: 12px; font-weight: 600; display: block; }
    small { font-size: 10px; color: var(--dash-ink3); }
  }

  /* ---------- 待办 ---------- */
  .todo {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 11px;
    border-radius: 10px;
    background: #f8fafd;
    border: 1px solid #f0f4fa;
  }

  .ti-ic {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    &--blue { background: #eaf1ff; color: #3068e0; }
    &--red { background: #fdeeec; color: #d5342f; }
    &--orange { background: #fff5e8; color: #e08a1e; }
    &--green { background: #e9f8ef; color: #0d9450; }
  }

  .todo-txt {
    flex: 1;
    min-width: 0;

    p { margin: 0; font-size: 12px; font-weight: 500; }
    small { font-size: 10px; color: var(--dash-ink3); }
  }

  /* ---------- 最新订单表格 ---------- */
  .oid {
    color: var(--dash-ink);
    font-weight: 600;
    font-size: 12px;
  }

  .goods-cell {
    display: flex;
    align-items: center;
    gap: 9px;

    .goods-name {
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--dash-ink);
    }
  }

  .ch {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 20px;

    i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

    &--app { background: #eef2ff; color: #3b6cff; }
    &--wx { background: #e8f9ee; color: #07974d; }
    &--mute { background: #f2f5fa; color: #8e98ab; }
  }

  .amt {
    color: var(--dash-ink);
    font-weight: 600;
  }

  .t-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    font-size: 11px;
    color: var(--dash-ink3);
  }

  /* ---------- 响应式 ---------- */
  @media (max-width: 1500px) {
    .row-c { grid-template-columns: 1fr 1fr; }
    .row-c .el-card:last-child { grid-column: span 2; }
  }
  @media (max-width: 1200px) {
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .row-b { grid-template-columns: 1fr; }
    .row-c { grid-template-columns: 1fr; }
    .row-c .el-card:last-child { grid-column: auto; }
  }
}
</style>
