declare module 'xlsx/xlsx.mjs';

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  store: object,
  workerSrc:any
}

