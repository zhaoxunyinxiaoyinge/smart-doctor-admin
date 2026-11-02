/**
 * adminServe 接口 HTTP 封装
 *
 * - 复用全局 serve 实例（src/serve/index.ts）：
 *     · 自动从 cookie 读取管理端 token 放进 Authorization 头
 *     · code===0 && msg==='not login' 时统一清 token 跳登录页
 * - URL 以 /api 开头，vite 代理 ^/api -> http://127.0.0.1:7001（去掉 /api 前缀），
 *   命中 ai-node-serves 的 adminServe 控制器（如 /mobile/order、/mobile/goods）
 * - adminServe 响应体（jresult.ts）：{ code: 1, msg, data }，分页为 MyBatis-Plus 形状
 *   { records, total, size, current, pages }
 */
import { serve } from '@/serve';

/**
 * 进行中的 GET 请求缓存：相同 url+params 的并发请求复用同一个 Promise，只发一次 HTTP。
 *
 * 必须加这个：全局 serve 实例挂着 cancler（src/serve/cancler.ts），它会把
 * 「method + params 完全相同」的后发请求当作重复请求，直接取消先发那个。
 * 首页订单状态模块（status=paid&page=1&pageSize=1）和待办事项模块的请求
 * 参数一模一样且同时并发，互相取消导致模块整体回退到示例数据。
 */
const inflight = new Map<string, Promise<unknown>>();

function buildKey(url: string, params?: Record<string, unknown>): string {
  const qs = Object.keys(params ?? {})
    .sort()
    .map((k) => `${k}=${String((params as Record<string, unknown>)[k])}`)
    .join('&');
  return `${url}?${qs}`;
}

/** 统一 GET：返回后端 body 里的 data 字段 */
export function adminGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const key = buildKey(url, params);
  const hit = inflight.get(key);
  if (hit) return hit as Promise<T>;

  const req = (serve as any)({ url, method: 'get', params })
    .then((res: any) => res.data as T)
    .finally(() => inflight.delete(key));
  inflight.set(key, req);
  return req;
}

/** 统一 POST（预留：首页暂时只读） */
export function adminPost<T>(url: string, data?: unknown): Promise<T> {
  return (serve as any)({ url, method: 'post', data }).then((res: any) => res.data as T);
}

/** Java 风格分页结构 */
export interface JavaPage<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}
