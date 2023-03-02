
import { createApp } from 'vue'
import App from '@/App.vue'

import ElementPlus from 'element-plus';
import {i18n} from "@/lang/index"

import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import {directers} from "@/directers/index";

import router from "./router/index"

import '@/assets/element/index.scss';

import "@/assets/scss/common.scss";

//eslint-disable-line
import svgIcon from "@/components/icons/svg-icon.vue"

import 'virtual:svg-icons-register';

import 'element-plus/theme-chalk/dark/css-vars.css'
import "@/assets/scss/var.scss";

import "@/assets/css/reset.css";

import "animate.css";


// import addState from "./../plugins/pina-plugins"
// vue3最新缓存文件
import { createPinia } from 'pinia';


// 使用pina
const pina = createPinia();
// pina.use(addState);

import './perssion.ts'
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// import { setupProdMockServer } from "./createMockServe";
// setupProdMockServer();

console.log(import.meta.env, 666);

// 挂载全局变量使用的函数声明
// declare module "@vue/runtime-core" {
//     export interface ComponentCustomProperties {
// $http: Function,
//         hello: string
//     }
// }


import * as echarts from 'echarts/core';

import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineChart,
  LineSeriesOption,
  PieChart,
  PieSeriesOption
} from 'echarts/charts';
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  // 数据集组件
  DatasetComponent,
  DatasetComponentOption,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  LegendComponent
} from 'echarts/components';

import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | PieSeriesOption
>;

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
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(router);
app.component('svg-icon', svgIcon)
app.use(i18n);
app.use(directers);
app.mount('#app');

