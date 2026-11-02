# Smart Admin

基于 **Vue 3 + TypeScript + Pinia + Vue Router + Element Plus + Vite** 构建的中后台管理系统模板。

内置了动态路由、权限控制（路由守卫）、国际化（vue-i18n）、ECharts 图表、富文本编辑器、主题切换、Mock 数据等常用能力，可作为业务后台系统的开发底座。

## 技术栈

| 分类 | 技术 |
| ---- | ---- |
| 核心框架 | Vue 3.x（Composition API + `<script setup>`） |
| 语言 | TypeScript 5.x |
| 状态管理 | Pinia 2.x |
| 路由 | Vue Router 4.x |
| UI 组件库 | Element Plus 2.x |
| 构建工具 | Vite 8.x |
| HTTP 请求 | Axios |
| 国际化 | vue-i18n 9.x |
| 图表 | ECharts 5.x |
| 富文本 | WangEditor / Quill |
| 代码规范 | oxlint + commitlint + husky + lint-staged |
| 单元测试 | Vitest + jsdom + @vue/test-utils |

## 环境要求

- **Node.js** >= 20（推荐使用 LTS 版本，Vite 8 要求）
- **pnpm** >= 8（项目使用 `pnpm-lock.yaml` 锁定依赖版本）

```bash
# 安装 pnpm（如已安装可跳过）
npm install -g pnpm
```

## 目录结构

```
├── mock/                    # Mock 数据
├── public/                  # 静态资源
├── src/
│   ├── api/                 # 接口请求封装
│   ├── assets/              # 样式、图片等静态资源
│   ├── components/          # 公共组件
│   ├── config/              # 全局配置
│   ├── directers/           # 自定义指令
│   ├── hooks/               # 组合式函数
│   ├── icons/               # SVG 图标（svg-icons 插件自动注册）
│   ├── lang/                # 国际化语言包
│   ├── layout/              # 页面布局（侧边栏 / 顶栏等）
│   ├── login/               # 登录模块
│   ├── router/              # 路由配置
│   ├── serve/               # 服务相关
│   ├── store/               # Pinia 状态模块
│   ├── utils/               # 工具函数
│   ├── views/               # 业务页面
│   ├── main.ts              # 应用入口
│   └── perssion.ts          # 路由守卫 / 权限逻辑
├── test/                    # 测试用例
├── tools/                   # 辅助脚本
├── .env.development         # 开发环境变量
├── .env.test                # 测试环境变量
├── .env.production          # 生产环境变量
└── vite.config.ts           # Vite 配置
```

## 安装教程

```bash
# 1. 克隆仓库
git clone <仓库地址>
cd test_project_production

# 2. 安装依赖
pnpm install
```

> `pnpm install` 会自动执行 `prepare` 脚本完成 husky Git 钩子的初始化，请确保在 Git 仓库中使用。

### 环境变量配置

依赖安装完成后，可按需修改根目录下的 `.env.*` 文件：

```bash
# .env.development 示例
VITE_BASE_URL="http://127.0.0.1"     # 站点地址
VITE_PORT=8083                        # 开发服务器端口
VITE_USER_NODE_ENV='development'      # 环境标识
VITE_API_URL="http://127.0.0.1:8081"  # 后端接口地址（/api 代理目标）
```

开发模式下，`/api` 前缀的请求会被代理到 `VITE_API_URL`，`/sapi2` 前缀代理到 `http://localhost:7001`，详见 `vite.config.ts` 中 `server.proxy` 配置。

## 使用说明

### 常用命令

| 命令 | 说明 |
| ---- | ---- |
| `pnpm run dev` | 启动开发服务器（自动打开浏览器） |
| `pnpm run build` | 类型检查（vue-tsc）+ 生产构建 |
| `pnpm run builds` | 跳过类型检查，直接生产构建 |
| `pnpm run build:test` | 以 test 模式启动 |
| `pnpm run preview` | 预览生产构建产物 |
| `pnpm run test` | 运行 Vitest 单元测试 |
| `pnpm run test:util` | 以 jsdom 环境运行测试 |
| `pnpm run test:types` | 运行 tsd 类型测试 |

### 启动开发

```bash
pnpm run dev
# 浏览器自动打开 http://localhost:8083
```

### 构建与预览

```bash
# 生产构建（产物输出至 dist/，按 js/css/img 分类，并生成 gzip 压缩文件）
pnpm run build

# 本地预览构建产物
pnpm run preview
```

### 使用示例

**1. 新增一个页面**

在 `src/views/` 下新建目录与组件，并在 `src/router/` 中注册路由（支持懒加载）：

```ts
// src/router/index.ts
{
  path: '/example',
  name: 'Example',
  component: () => import('@/views/example/index.vue'),
}
```

**2. 封装一个接口请求**

在 `src/api/` 中新增接口，使用封装好的 axios 实例：

```ts
// src/api/example.ts
import serve from '@/serve'; // 项目内 axios 封装，按实际情况引入

export const getUserList = (params: object) => {
  return serve.get('/api/user/list', { params });
};
```

**3. 定义一个 Pinia Store**

```ts
// src/store/example.ts
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++; },
  },
});
```

**4. 使用 SVG 图标**

将 `.svg` 文件放入 `src/icons/`，即可通过全局注册的 `<SvgIcon>` 组件使用：

```vue
<template>
  <SvgIcon name="example" />
</template>
```

**5. 运行单元测试**

```bash
# 在 src 或 test 下编写 *.spec.ts 文件后执行
pnpm run test
```

## 参与贡献

欢迎提交 Issue 与 Pull Request，参与前请阅读以下规范：

1. **Fork 本仓库**，并将代码克隆到本地。
2. **创建特性分支** 进行开发（不建议直接在 `dev` 分支上修改）：

   ```bash
   git checkout -b feat/your-feature
   ```

3. **提交代码**。项目使用 [commitlint](./commitlint.config.cjs) + husky 校验提交信息，格式为 `type: 描述`，支持的 type 如下：

   | type | 说明 |
   | ---- | ---- |
   | `feat` | 新功能 |
   | `fix` | 缺陷修复 |
   | `docs` | 文档更新 |
   | `style` | 代码格式调整（不影响逻辑） |
   | `refactor` | 重构 |
   | `test` | 测试相关 |
   | `revert` | 回滚 |

   ```bash
   git commit -m "feat: 新增用户管理页面"
   ```

4. **推送到远程并新建 Pull Request**：

   ```bash
   git push origin feat/your-feature
   ```

   PR 描述中请说明改动内容、影响范围与自测情况，通过审查后会合并至 `dev` 分支。

### 开发约定

- 提交前请确保 `pnpm run test` 与 `pnpm run build` 通过；
- 暂存区代码会在提交时由 lint-staged 触发 `oxlint --fix` 自动修复；
- 遵循现有代码风格（`<script setup>` + TypeScript），公共逻辑优先抽取到 `src/hooks/` 或 `src/utils/`。

## 开源协议

[MIT](./LICENSE)
