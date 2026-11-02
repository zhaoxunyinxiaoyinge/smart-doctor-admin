/**
 * 数据工作台 · 首页模拟数据
 * 后续对接真实接口时，把这里的导出逐个替换成接口返回即可，
 * 页面结构不需要改动。
 */

/** KPI 指标卡 */
export interface KpiItem {
  label: string;
  value: string;
  unit: string;
  /** 涨：'up'（红），跌：'down'（绿） */
  trend: 'up' | 'down';
  /** 环比百分比，如 12.6 */
  rate: number;
  desc: string;
  /** 迷你折线数据 */
  spark: number[];
  /** KPI 卡右上角光晕颜色 */
  tint: string;
}

export const kpis: KpiItem[] = [
  {
    label: '今日成交额',
    value: '286,430',
    unit: '元',
    trend: 'up',
    rate: 12.6,
    desc: '较昨日 ¥254,180',
    spark: [15, 12, 14, 8, 10, 4, 6],
    tint: 'rgba(228, 57, 60, .12)',
  },
  {
    label: '今日订单量',
    value: '1,842',
    unit: '单',
    trend: 'up',
    rate: 8.2,
    desc: 'APP 1,068 · 小程序 774',
    spark: [14, 15, 10, 11, 7, 8, 3],
    tint: 'rgba(59, 108, 255, .12)',
  },
  {
    label: '新增用户',
    value: '326',
    unit: '人',
    trend: 'down',
    rate: 2.1,
    desc: '首单转化率 41.7%',
    spark: [6, 9, 5, 12, 10, 14, 12],
    tint: 'rgba(18, 164, 90, .12)',
  },
  {
    label: '待处理事项',
    value: '44',
    unit: '项',
    trend: 'up',
    rate: 0,
    desc: '售后 18 · 待发货 26 · 库存预警 4',
    spark: [8, 6, 9, 7, 10, 8, 11],
    tint: 'rgba(245, 166, 35, .14)',
  },
];

/** 销售趋势（近 7 天） */
export const trend = {
  days: ['10/14', '10/15', '10/16', '10/17', '10/18', '10/19', '10/20'],
  /** 本周成交额（万元） */
  amount: [18.2, 21.5, 19.8, 26.4, 24.1, 31.2, 28.6],
  /** 上周同期成交额（万元） */
  lastWeek: [16.4, 18.9, 17.2, 22.8, 21.5, 27.9, 25.4],
  range: '2026-10-14 至 2026-10-20',
};

/** 渠道分布（订单来源） */
export const channel = {
  total: 8642,
  items: [
    { name: 'APP', value: 5012, color: '#3b6cff' },
    { name: '小程序', value: 3630, color: '#07c160' },
  ],
  /** 小程序占比环比提升 */
  wxRateUp: 3.4,
};

/** 订单状态分布（近 7 天） */
export interface StatusItem {
  name: string;
  count: number;
  color: string;
}
export const orderStatus: StatusItem[] = [
  { name: '待付款', count: 312, color: '#f5a623' },
  { name: '待发货', count: 526, color: '#3b6cff' },
  { name: '已发货', count: 438, color: '#7f8ea8' },
  { name: '已完成', count: 374, color: '#12a45a' },
  { name: '退款中', count: 42, color: '#e4393c' },
];

/** 热销商品 TOP5 */
export interface TopGoods {
  name: string;
  stock: number;
  price: number;
  salesAmount: number;
  salesCount: number;
  /** 缩略图渐变色 */
  thumb: string;
}
export const topGoods: TopGoods[] = [
  { name: '阿拉斯加帝王蟹 1.2kg 礼盒装', stock: 128, price: 399, salesAmount: 86420, salesCount: 216, thumb: 'linear-gradient(135deg,#ffd6a5,#ff8a4c)' },
  { name: '深海大西洋三文鱼刺身 500g', stock: 342, price: 168, salesAmount: 62940, salesCount: 375, thumb: 'linear-gradient(135deg,#b9e7ff,#5aa9e6)' },
  { name: '阳澄湖大闸蟹 4 对装 公3.5两', stock: 96, price: 288, salesAmount: 48960, salesCount: 170, thumb: 'linear-gradient(135deg,#ffe0e6,#ff8fa3)' },
  { name: '厄瓜多尔白虾 2kg 冷冻', stock: 210, price: 129, salesAmount: 31318, salesCount: 243, thumb: 'linear-gradient(135deg,#d8f5d0,#7fc76a)' },
  { name: '北海道扇贝柱 1kg 原装', stock: 64, price: 219, salesAmount: 24528, salesCount: 112, thumb: 'linear-gradient(135deg,#e3dcff,#8f7bff)' },
];

/** 待办事项 */
export interface TodoItem {
  title: string;
  desc: string;
  count: string;
  /** 徽标颜色 */
  level: 'red' | 'orange' | 'blue' | 'green';
  icon: string;
}
export const todos: TodoItem[] = [
  { title: '待发货订单', desc: '最早下单 2 小时前', count: '26 单', level: 'blue', icon: 'send' },
  { title: '售后退款待审核', desc: '超时 4 单，剩余 6 小时', count: '18 单', level: 'red', icon: 'refund' },
  { title: '库存不足预警', desc: '北海道扇贝柱 仅剩 64', count: '4 项', level: 'orange', icon: 'warn' },
  { title: '限时秒杀即将开始', desc: '今日 20:00 · 12 个商品', count: '查看', level: 'green', icon: 'promo' },
];

/** 最新订单 */
export type OrderStatus = 'wait-pay' | 'wait-send' | 'sent' | 'done' | 'refund' | 'cancel';
export interface OrderItem {
  id: string;
  goods: string;
  thumb: string;
  channel: string;
  buyer: string;
  amount: number;
  status: OrderStatus;
  time: string;
}
export const orderStatusText: Record<OrderStatus, string> = {
  'wait-pay': '待付款',
  'wait-send': '待发货',
  'sent': '已发货',
  'done': '已完成',
  'refund': '退款中',
  'cancel': '已取消',
};
export const orderStatusTag: Record<OrderStatus, string> = {
  'wait-pay': 'warning',
  'wait-send': 'primary',
  'sent': 'info',
  'done': 'success',
  'refund': 'danger',
  'cancel': 'info',
};

export const latestOrders: OrderItem[] = [
  {
    id: 'NO.20261020184432',
    goods: '阿拉斯加帝王蟹 1.2kg 礼盒装 等 2 件',
    thumb: 'linear-gradient(135deg,#ffd6a5,#ff8a4c)',
    channel: 'APP',
    buyer: '陈**（138****6621）',
    amount: 798,
    status: 'wait-send',
    time: '16:42:08',
  },
  {
    id: 'NO.20261020184107',
    goods: '深海大西洋三文鱼刺身 500g',
    thumb: 'linear-gradient(135deg,#b9e7ff,#5aa9e6)',
    channel: '小程序',
    buyer: '林**（wx_8f2a）',
    amount: 336,
    status: 'wait-pay',
    time: '16:38:51',
  },
  {
    id: 'NO.20261020183965',
    goods: '阳澄湖大闸蟹 4 对装 公3.5两',
    thumb: 'linear-gradient(135deg,#ffe0e6,#ff8fa3)',
    channel: 'APP',
    buyer: '王**（159****3308）',
    amount: 576,
    status: 'sent',
    time: '16:31:20',
  },
  {
    id: 'NO.20261020183744',
    goods: '厄瓜多尔白虾 2kg 冷冻 等 3 件',
    thumb: 'linear-gradient(135deg,#d8f5d0,#7fc76a)',
    channel: '小程序',
    buyer: '赵**（wx_2c91）',
    amount: 387,
    status: 'refund',
    time: '16:24:03',
  },
  {
    id: 'NO.20261020183512',
    goods: '北海道扇贝柱 1kg 原装',
    thumb: 'linear-gradient(135deg,#e3dcff,#8f7bff)',
    channel: 'APP',
    buyer: '刘**（137****9012）',
    amount: 219,
    status: 'done',
    time: '16:11:47',
  },
];

/** 通知数量（顶栏用，可接消息接口） */
export const noticeCount = 6;
