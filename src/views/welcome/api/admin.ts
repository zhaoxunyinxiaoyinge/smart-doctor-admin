/**
 * 管理端接口定义（对应 ai-node-serves/app/module/adminServe 下带 mobile 的控制器）
 *
 *   order.mobile.controller.ts       /mobile/order       订单表分页（GET/POST/PUT/DELETE）
 *   order-item.mobile.controller.ts  /mobile/order-item  订单明细表分页
 *   user.mobile.controller.ts        /mobile/user        用户表分页
 *   shop.mobile.controller.ts        /mobile/goods       商城商品表分页（含 goods_detail/spec/images 联写）
 *   banner.mobile.controller.ts      /mobile/banner      轮播图表
 *   category.mobile.controller.ts    /mobile/category    分类表
 *
 * 全部走管理端 token（登录后自动携带），分页结构为 { records, total, size, current, pages }。
 * 后续要接别的表，按同样的方式在下面补函数即可。
 */
import { adminGet, type JavaPage } from './http';

/* ------------------------------------------------------------------ *
 * 订单（/mobile/order）
 * ------------------------------------------------------------------ */

/** orders 表行（jresult.toCamel 转成驼峰） */
export interface AdminOrderRow {
  id: number;
  orderNo: string;
  userId: number;
  status: string; // pending | paid | shipping | done | cancel
  total: number;
  freight: number;
  discount: number;
  payAmount: number;
  payChannel: string;
  expressNo: string;
  remark: string;
  addressName: string;
  addressPhone: string;
  addressRegion: string;
  addressDetail: string;
  createTime: string;
}

/** 订单分页（可按订单号/用户/状态筛选） */
export function getOrderPage(params: {
  page?: number;
  pageSize?: number;
  orderNo?: string;
  userId?: number;
  status?: string;
}): Promise<JavaPage<AdminOrderRow>> {
  return adminGet('/api/mobile/order', params);
}

/* ------------------------------------------------------------------ *
 * 订单明细（/mobile/order-item）
 * ------------------------------------------------------------------ */

export interface AdminOrderItemRow {
  id: number;
  orderId: number;
  goodsId: number;
  spec: string;
  count: number;
  price: number;
  /** 下单时的商品标题/封面快照 */
  title: string;
  cover: string;
}

export function getOrderItems(params: {
  orderId: number;
  page?: number;
  pageSize?: number;
}): Promise<JavaPage<AdminOrderItemRow>> {
  return adminGet('/api/mobile/order-item', params);
}

/* ------------------------------------------------------------------ *
 * 商城商品（/mobile/goods）
 * ------------------------------------------------------------------ */

export interface AdminGoodsRow {
  id: number;
  title: string;
  sub: string;
  price: number;
  originPrice: number;
  sales: number;
  stock: number;
  cover: string;
  status: number;
  categoryId: number;
}

export function getGoodsPage(params: {
  page?: number;
  pageSize?: number;
  title?: string;
  status?: number;
  /** 库存预警：只查 stock < stockLt 的商品 */
  stockLt?: number;
}): Promise<JavaPage<AdminGoodsRow>> {
  return adminGet('/api/mobile/goods', params);
}

/** 库存预警阈值：stock 低于该值视为不足 */
export const LOW_STOCK_THRESHOLD = 10;

/* ------------------------------------------------------------------ *
 * 用户（/mobile/user）—— 首页只用来取总数
 * ------------------------------------------------------------------ */

export function getUserTotal(): Promise<number> {
  return adminGet<JavaPage<unknown>>('/api/mobile/user', { page: 1, pageSize: 1 }).then(
    (r) => r.total,
  );
}

/* ------------------------------------------------------------------ *
 * KPI 汇总（/mobile/stats/summary —— stats.mobile.controller.ts）
 * ------------------------------------------------------------------ */

export interface StatsSummary {
  /** 今日成交额（已支付订单实付合计） */
  todayAmount: number;
  yesterdayAmount: number;
  /** 今日订单量（含未支付） */
  todayOrders: number;
  yesterdayOrders: number;
  todayNewUsers: number;
  yesterdayNewUsers: number;
  /** 待发货（status = paid） */
  paidCount: number;
  /** 已发货（status = shipping） */
  shippingCount: number;
  userTotal: number;
}

export function getStatsSummary(): Promise<StatsSummary> {
  return adminGet('/api/mobile/stats/summary');
}

/** 销售趋势（按天聚合，含上周同期对比）GET /api/mobile/stats/trend */
export function getTrend(days = 7): Promise<{ days: string[]; current: number[]; previous: number[] }> {
  return adminGet('/api/mobile/stats/trend', { days });
}

/** 支付方式分布（按 pay_channel 分组，name 为空串 = 未支付）GET /api/mobile/stats/pay-channel */
export function getPayChannel(days = 7): Promise<Array<{ name: string; value: number }>> {
  return adminGet('/api/mobile/stats/pay-channel', { days });
}
