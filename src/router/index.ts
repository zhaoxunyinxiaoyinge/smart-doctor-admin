
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from "vue-router";
 
/**
 * @param  path  路径
 * @param  title 标题
 * @param  hidden 菜单是否显示
 * @param  component 组件
 * @param  redirect 重定向
 * @param  children 嵌套子路由
 */

const routes = <Array<RouteRecordRaw>>[];

// 动态导入路由文件
const modules = await import.meta.glob('./module/route.ts', { import: 'default', eager: true });
Object.keys(modules).forEach(async keys => {
  const res: any = modules[keys];
  res.forEach((item: any) => {
    routes.push(item);
  })
});

// 创建路由实列
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior: function () {
    return { top: 0 };
  },
});
export default router;
export {
  routes
}
