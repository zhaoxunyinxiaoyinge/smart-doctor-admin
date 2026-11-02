<script setup lang="ts">
import { getCurrentInstance, onMounted, onUnmounted, ref } from "vue";
// DataV 整包约 872 KB，原先在 main.ts 里 app.use(DataVVue3) 全局注册，
// 会被打进首屏包。这里改成进入本页面时才注册，插件 use 是幂等的，重复进入不会重复安装。
import DataVVue3 from "@kjgl77/datav-vue3";
import * as echarts from "echarts/core";
import { serve } from "@/serve";
getCurrentInstance()?.appContext.app.use(DataVVue3);

/* ------------------------------------------------------------------ *
 * 电商数据大屏 —— 只做 3 个板块（1 行 3 列）：
 *   1. 商品销量 TOP5（柱形图）  2. 评论数 TOP5 商品（柱形图）  3. 支付方式分布（环形图，全量不聚合）
 * 数据源：/api/mobile/stats/*、/api/mobile/review、/api/mobile/goods，管理端 token 自动携带。
 * 评论 TOP5 不做后端聚合：分页拉评论列表，前端按 goodsId 分组统计。
 * 柱状图用 echarts（dv-charts 对 option 更新不做深度响应，异步数据到了不重渲染）。
 * ------------------------------------------------------------------ */

/** Java 风格分页结构（adminServe 通用返回） */
interface JavaPage<T> {
  records: T[];
  total: number;
}

const loading = ref(true);

// echarts 图表容器与实例
const goodsChartRef = ref<HTMLDivElement>();
const reviewChartRef = ref<HTMLDivElement>();
let chartInstances: echarts.ECharts[] = [];

// 支付方式分布（环形，DataV 配置型组件，config 更新会自动重渲染）
const payChannelConfig = ref({
  data: [] as Array<{ name: string; value: number }>,
  digitalFlopStyle: { fill: "#fff" },
  radius: "65%",
  activeRadius: "72%",
});

/* ---------------- echarts 深色主题工具 ---------------- */
const AXIS_LABEL = { color: "#9db5d8", fontSize: 11 };
const SPLIT_LINE = { lineStyle: { color: "#22365c", type: "dashed" as const } };

function barOption(title: string, names: string[], data: number[]) {
  return {
    title: { text: title, left: "center", textStyle: { color: "#fff", fontSize: 14 } },
    tooltip: { trigger: "axis" },
    grid: { left: 44, right: 16, top: 44, bottom: 58 },
    xAxis: {
      type: "category",
      data: names,
      axisLine: { lineStyle: { color: "#44618e" } },
      axisTick: { show: false },
      axisLabel: { ...AXIS_LABEL, rotate: 24, interval: 0, formatter: (v: string) => (v.length > 6 ? v.slice(0, 6) + "…" : v) },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: AXIS_LABEL,
      splitLine: SPLIT_LINE,
    },
    series: [
      {
        name: title,
        type: "bar",
        barWidth: 30,
        data,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "#3de7c9" },
              { offset: 1, color: "rgba(59,108,255,.35)" },
            ],
          },
        },
      },
    ],
  };
}

function mountChart(elRef: typeof goodsChartRef, option: echarts.EChartsCoreOption) {
  if (!elRef.value) return;
  const chart = echarts.init(elRef.value);
  chart.setOption(option);
  chartInstances.push(chart);
}

/* ---------------- 数据加载 ---------------- */
// 读取 cookie 里的管理端 token（和 welcome/api/http.ts 同一套逻辑）
function getCookieToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * 请求 JSON。先走 serve（vite 代理 /api -> 127.0.0.1:7001）；
 * 代理失败（502/网络错误）时兜底直连后端，后端 CORS 全放开，带上管理端 token 即可。
 */
async function getJson<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const res = await (serve as any)({ url, method: "get", params, timeout: 5000 });
    return res.data as T;
  } catch (err) {
    const qs = params ? "?" + new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString() : "";
    const target = `http://127.0.0.1:7001${url.replace(/^\/api/, "")}${qs}`;
    console.warn(`[datav] 代理请求失败，直连后端兜底：${target}`);
    const resp = await fetch(target, { headers: { Authorization: getCookieToken() } });
    if (!resp.ok) throw new Error(`直连后端失败：HTTP ${resp.status}`);
    return (await resp.json()) as T;
  }
}

/** 1. 商品销量 TOP5 */
async function loadTopGoods() {
  const res = await getJson<Array<{ name: string; value: number }>>("/api/mobile/stats/top-goods");
  mountChart(
    goodsChartRef,
    barOption("商品销量 TOP5", res.map((i) => i.name), res.map((i) => i.value)),
  );
}

/** 2. 评论数 TOP5 商品 —— 分页拉评论列表，前端按 goodsId 分组统计 */
async function loadTopReview() {
  // 商品标题映射：一次拉一页商品列表即可
  const goodsRes = await getJson<JavaPage<{ id: number; title: string }>>(
    "/api/mobile/goods", { page: 1, pageSize: 500 });
  const titleMap = new Map<number, string>();
  for (const g of goodsRes.records || []) titleMap.set(Number(g.id), g.title);

  // 评论分页循环拉全量（每页 200 条，最多 50 页兜底）
  const counts = new Map<number, number>();
  const pageSize = 200;
  for (let page = 1; page <= 50; page++) {
    const res = await getJson<JavaPage<{ goodsId: number }>>(
      "/api/mobile/review", { page, pageSize });
    for (const r of res.records || []) {
      const gid = Number(r.goodsId);
      if (gid) counts.set(gid, (counts.get(gid) || 0) + 1);
    }
    const total = Number(res.total || 0);
    if (!res.records?.length || page * pageSize >= total) break;
  }

  const top = [...counts.entries()]
    .map(([goodsId, value]) => ({ goodsId, value, title: titleMap.get(goodsId) || `商品#${goodsId}` }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  mountChart(
    reviewChartRef,
    barOption("评论数 TOP5 商品", top.map((t) => t.title), top.map((t) => t.value)),
  );
}

/** 3. 支付方式分布（全量，不按时间聚合） */
async function loadPayChannel() {
  const res = await getJson<Array<{ name: string; value: number }>>("/api/mobile/stats/pay-channel");
  const list = res
    .map((it) => ({ name: it.name || "未支付", value: it.value }))
    .sort((a, b) => b.value - a.value);
  payChannelConfig.value = { ...payChannelConfig.value, data: list };
}

function handleResize() {
  chartInstances.forEach((c) => c.resize());
}

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  try {
    await Promise.all([loadTopGoods(), loadTopReview(), loadPayChannel()]);
  } catch (e) {
    console.warn("[datav] 大屏数据加载失败：", e);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  chartInstances.forEach((c) => c.dispose());
  chartInstances = [];
});

</script>

<template>
  <div class="box">
    <div
      v-loading="loading"
      class="grid"
    >
      <!-- 1. 商品销量 TOP5 -->
      <div class="cell">
        <dv-border-box-8 class="cell-box">
          <div
            ref="goodsChartRef"
            class="chart"
          />
        </dv-border-box-8>
      </div>

      <!-- 2. 评论数 TOP5 商品 -->
      <div class="cell">
        <dv-border-box-9 class="cell-box">
          <div
            ref="reviewChartRef"
            class="chart"
          />
        </dv-border-box-9>
      </div>

      <!-- 3. 支付方式分布 -->
      <div class="cell">
        <dv-border-box-1 class="cell-box">
          <dv-active-ring-chart
            :config="payChannelConfig"
            class="chart"
          />
        </dv-border-box-1>
      </div>
    </div>
  </div>
</template>

<style lang="scss"  scope>
.box {
  color: #fff;
  height: 100%;
  background-color: rgba(4, 20, 46, 0.847);

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(300px, 1fr);
    gap: 14px;
    height: 100%;
    padding: 14px;
  }

  .cell {
    display: flex;
    min-height: 0;
  }

  .cell-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 280px;
  }

  .chart {
    width: 92%;
    height: 86%;
  }

  @media (max-width: 1100px) {
    .grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
