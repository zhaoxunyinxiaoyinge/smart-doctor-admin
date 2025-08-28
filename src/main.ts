window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
});
import { createApp } from 'vue'
import App from '@/App.vue'

import ElementPlus from 'element-plus';
import { i18n } from "@/lang/index"

import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import DataVVue3 from '@kjgl77/datav-vue3'

import { directers } from "@/directers/index";

import router from "./router/index"
import "@/assets/css/reset.css";
import "@/assets/scss/common.scss";
import "@/assets/front/index.css";
import '@/assets/element/index.scss';
import "animate.css";

import print from 'vue3-print-nb';

//eslint-disable-line
import svgIcon from "@/components/icons/svg-icon.vue"

import 'virtual:svg-icons-register';

import 'element-plus/theme-chalk/dark/css-vars.css'
// import "@/assets/scss/var.scss";


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
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
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
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(router);
app.component('SvgIcon', svgIcon)
app.use(i18n);
app.use(directers);
app.use(print);
app.use(DataVVue3);
app.mount('#app');

