/// <reference types="vite/client" />
/// <reference types="element-plus/global.d.ts" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "virtual:svg-icons-register";

// 定义env配置文件的类型提示
interface ViteTypeOptions {
  // 这样就不允许有未知的键值了。
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_PORT:number
  readonly VITE_API_URL:string

  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


