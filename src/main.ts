
import { createApp, type Component } from 'vue'
import App from '@/App.vue'
// 说明：Element Plus 组件在 .vue 文件里由 vite.config.ts 的
// unplugin-vue-components + unplugin-auto-import 按需自动导入，不再全量 app.use(ElementPlus)。
// 但该插件默认只处理 .vue，不处理 .tsx / .ts，且不解析指令，所以下面手动补三处：
//   1. ElLoading —— v-loading 指令（src/views/role/index.vue 在用）
//   2. ElMenu / ElMenuItem / ElSubMenu —— 8 个 layout/*.tsx 侧边栏文件在用
import { ElLoading, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus';

import { i18n } from "@/lang/index"

// 原来这里是 import * as ElementPlusIconsVue，会把 1465 个图标全部打进包里。
// 改为只引入模板里实际用到的图标（清单见下方 app.component 注册处）。
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Close,
  Edit,
  Expand,
  Files,
  Plus,
  Printer,
  SuccessFilled,
  Upload,
} from '@element-plus/icons-vue';

import { directers } from "@/directers/index";

import router from "./router/index"
import "@/assets/css/reset.css";
import "@/assets/scss/common.scss";
import "@/assets/front/index.css";
// 全站颜色/主题样式统一入口（合并自原 element/index.scss + scss/var.scss）
import '@/assets/css/index.scss';
// 原来引用的是全量 animate.css（485 KB），项目实际只用了 animate__animated / fadeIn / fadeOut
import "@/assets/css/animate-lite.css";

import print from 'vue3-print-nb';

//eslint-disable-line
import svgIcon from "@/components/icons/svg-icon.vue"

import 'virtual:svg-icons-register';

import 'element-plus/theme-chalk/dark/css-vars.css'


// vue3最新缓存文件
import { createPinia } from 'pinia';


// 使用pina
const pina = createPinia();

import './perssion.ts'
const app = createApp(App);

// Sentry.init({
//   app,
//  integrations: [
//     Sentry.browserTracingIntegration({ router }),
//     Sentry.replayIntegration(),
//   ],
//   tracesSampleRate: 1.0,
//   replaysSessionSampleRate: 0.1,
// }); 

// Sentry.captureException(new Error("本地测试错误"));
// 只注册模板中实际用到的 Element Plus 图标（原来这里遍历注册了全部 1465 个）
const usedIcons: Record<string, Component> = {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Close,
  Edit,
  Expand,
  Files,
  Plus,
  Printer,
  SuccessFilled,
  Upload,
};
for (const [key, component] of Object.entries(usedIcons)) {
  app.component(key, component)
}


// import { setupProdMockServer } from "./createMockServe";
// setupProdMockServer();

import * as echarts from 'echarts/core';

import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  // BarSeriesOption,
  LineChart,
  // LineSeriesOption,
  PieChart,
  // PieSeriesOption
} from 'echarts/charts';
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  // TitleComponentOption,
  TooltipComponent,
  // TooltipComponentOption,
  GridComponent,
  // GridComponentOption,
  // 数据集组件
  DatasetComponent,
  // DatasetComponentOption,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  LegendComponent
} from 'echarts/components';

import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  PieChart
]);

// 设置全局属性
app.config.globalProperties.$http = () => { console.log("我是函数") }
app.config.globalProperties.hello = 'hello';
app.config.globalProperties.echarts = echarts;
app.use(pina)
window.store=pina
// 原来的 app.use(ElementPlus, { size: 'small', zIndex: 3000 }) 已移除：
//   - size 由 App.vue 的 el-config-provider 统一控制（现状即为 'default'）
//   - zIndex 迁移到 App.vue 的 el-config-provider 上，值保持 3000 不变
app.use(ElLoading); // 注册 v-loading 指令
app.component('ElMenu', ElMenu);
app.component('ElMenuItem', ElMenuItem);
app.component('ElSubMenu', ElSubMenu);
app.use(router);
app.component('SvgIcon', svgIcon)
app.use(i18n);
app.use(directers);
app.use(print);
// DataVVue3 已下移到 src/views/datav/index.vue 内按需注册，避免被打进首屏包
app.mount('#app');

