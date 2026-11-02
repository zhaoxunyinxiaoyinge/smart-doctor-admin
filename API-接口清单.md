# test_project_production 接口清单

> 本文档由静态扫描 `src/` 生成，用于回答两个问题：**项目里有哪些接口**、**每个接口被哪些页面引用**。
>
> - 扫描范围：`src/` 下全部 `.ts` / `.tsx` / `.vue`（9 个 `api/index.ts` 业务模块 + 组件内直连接口）
> - 统计：模块化业务接口 **53 个**，组件级/外部接口 **7 个**，涉及页面/组件 **25 个**
> - 引用判定包含「作为参数传递」的场景（如 `handleDelete(id, deleteGoodsData, ...)`），不会漏计
> - 行号为静态扫描时的位置，改代码后可能有偏移，以函数名/文件名为准

## 目录

- [一、接口总览](#一接口总览)
- [二、按模块分组明细](#二按模块分组明细)
- [三、组件级 / 非模块化接口](#三组件级--非模块化接口)
- [四、按页面反查（页面 → 接口）](#四按页面反查页面--接口)
- [五、请求封装与全局约定](#五请求封装与全局约定)

## 一、接口总览

共 60 个接口，按「定义模块」排列。

| # | 方法 | 接口路径 | 定义函数 | 被引用页面数 |
| --- | --- | --- | --- | --- |
| 1 | POST | `/api/user/login` | `login`<br/>login/api/index.ts | 1 |
| 2 | GET | `/api/user/logout` | `logout`<br/>api/index.ts | 1 |
| 3 | GET | `（动态：由调用方传入）` | `exportData`<br/>api/index.ts | 1 |
| 4 | POST | `/api/common/stream` | `upload`<br/>api/index.ts | 2 |
| 5 | PUT | `/api/user/avatar` | `changeAvatar`<br/>api/index.ts | 1 |
| 6 | GET | `https://cn.apihz.cn/api/tianqi/tqyb.php` | `getWeather`<br/>api/index.ts | 1 |
| 7 | GET | `/api/menu/list` | `getMenu`<br/>store/api/index.ts | 1 |
| 8 | GET | `/api/menu/all` | `getMenuList`<br/>views/menu/api/index.ts | 2 |
| 9 | POST | `/api/menu/add` | `postMenu`<br/>views/menu/api/index.ts | 1 |
| 10 | PUT | `/api/menu/edit` | `putMenu`<br/>views/menu/api/index.ts | 1 |
| 11 | DELETE | `/api/menu/del/{id}` | `deleteMenu`<br/>views/menu/api/index.ts | 1 |
| 12 | GET | `/api/menu/detail` | `getDetail`<br/>views/menu/api/index.ts | 1 |
| 13 | GET | `/api/role/list` | `getRoleList`<br/>views/role/api/index.ts | 2 |
| 14 | POST | `/api/role/add` | `postRole`<br/>views/role/api/index.ts | 1 |
| 15 | DELETE | `/api/role/del/{id}` | `deleteRole`<br/>views/role/api/index.ts | 1 |
| 16 | GET | `/api/role/detail` | `getDetail`<br/>views/role/api/index.ts | 1 |
| 17 | PUT | `/api/role/update` | `updateRole`<br/>views/role/api/index.ts | 1 |
| 18 | GET | `/api/user/list` | `getUser`<br/>views/welcome/api/index.ts | 1 |
| 19 | GET | `/api/role_user/list` | `getRoleUser`<br/>views/welcome/api/index.ts | 1 |
| 20 | POST | `/api/user/add` | `postUser`<br/>views/welcome/api/index.ts | 1 |
| 21 | PUT | `/api/user/edit` | `putUser`<br/>views/welcome/api/index.ts | 1 |
| 22 | DELETE | `/api/user/del/{id}` | `deleteUser`<br/>views/welcome/api/index.ts | 1 |
| 23 | GET | `/api/dict/list` | `getDictList`<br/>views/dict/api/index.ts | 1 |
| 24 | GET | `/api/dictdetail/list` | `getDictDetail`<br/>views/dict/api/index.ts | 1 |
| 25 | POST | `/api/dict/add` | `postDict`<br/>views/dict/api/index.ts | 1 |
| 26 | PUT | `/api/dict/edit` | `putDict`<br/>views/dict/api/index.ts | 1 |
| 27 | GET | `/api/dict/detail` | `getDetial`<br/>views/dict/api/index.ts | 1 |
| 28 | DELETE | `/api/dict/del/{id}` | `DeleteDict`<br/>views/dict/api/index.ts | 1 |
| 29 | GET | `/api/dictdetail/detail` | `getDictDetailDetail`<br/>views/dict/api/index.ts | 1 |
| 30 | PUT | `/api/dictdetail/edit` | `putDictDetail`<br/>views/dict/api/index.ts | 1 |
| 31 | DELETE | `/api/dictdetail/del/{id}` | `delDictDetail`<br/>views/dict/api/index.ts | 1 |
| 32 | POST | `/api/dictdetail/add` | `postDictDetail`<br/>views/dict/api/index.ts | 1 |
| 33 | GET | `/api/divison/list` | `getDivision`<br/>views/division/api/index.ts | 1 |
| 34 | GET | `/api/divison/detail` | `getDivsionDetail`<br/>views/division/api/index.ts | 1 |
| 35 | POST | `/api/divison/add` | `postDivison`<br/>views/division/api/index.ts | 1 |
| 36 | PUT | `/api/divison/edit` | `putDivison`<br/>views/division/api/index.ts | 1 |
| 37 | DELETE | `/api/divison/del/{id}` | `deleteDivsion`<br/>views/division/api/index.ts | 1 |
| 38 | GET | `/api/babaner` | `getData`<br/>views/goods/api/index.ts | 1 |
| 39 | POST | `/api/babaner` | `postData`<br/>views/goods/api/index.ts | 1 |
| 40 | PUT | `/api/babaner` | `putData`<br/>views/goods/api/index.ts | 1 |
| 41 | DELETE | `/api/babaner/{id}` | `deleteData`<br/>views/goods/api/index.ts | 1 |
| 42 | GET | `/api/category` | `getCategoryData`<br/>views/goods/api/index.ts | 2 |
| 43 | POST | `/api/category` | `postCategoryData`<br/>views/goods/api/index.ts | 1 |
| 44 | PUT | `/api/category` | `putCategoryData`<br/>views/goods/api/index.ts | 1 |
| 45 | DELETE | `/api/category/{id}` | `deleteCategoryData`<br/>views/goods/api/index.ts | 1 |
| 46 | GET | `/api/goods` | `getGoodsData`<br/>views/goods/api/index.ts | 1 |
| 47 | POST | `/api/goods` | `postGoodsData`<br/>views/goods/api/index.ts | 1 |
| 48 | PUT | `/api/goods` | `putGoodsData`<br/>views/goods/api/index.ts | 1 |
| 49 | DELETE | `/api/goods/{id}` | `deleteGoodsData`<br/>views/goods/api/index.ts | 1 |
| 50 | GET | `/api/hots` | `getHostData`<br/>views/goods/api/index.ts | 1 |
| 51 | POST | `/api/hots` | `postHostData`<br/>views/goods/api/index.ts | 1 |
| 52 | PUT | `/api/hots` | `putHostData`<br/>views/goods/api/index.ts | 1 |
| 53 | DELETE | `/api/hots/{id}` | `deleteHostData`<br/>views/goods/api/index.ts | 1 |
| 54 | POST | `/api/common/stream` | 组件/直连 | 4 |
| 55 | POST | `/api/common/upload` | 组件/直连 | 2 |
| 56 | GET | `/api/goods/import` | 组件/直连 | 2 |
| 57 | GET | `/api/user/import` | 组件/直连 | 2 |
| 58 | POST | `/sapi2/chat` | 组件/直连 | 1 |
| 59 | GET | `https://cn.apihz.cn/api/tianqi/tqyb.php` | 组件/直连 | 1 |
| 60 | GET | `/lookDoctor/g2/getOnsInfo?name=disease_h5` | 组件/直连 | 2 |

## 二、按模块分组明细

### 认证 / 会话

**定义文件：`src/login/api/index.ts`**

| 方法 | 接口路径 | 定义函数（参数） | 引用位置 |
| --- | --- | --- | --- |
| POST | `/api/user/login` | `login()`<br/>`data:any` | 用户/权限 Store（`store/expmle.ts:79`）<br/>用户/权限 Store（`store/expmle.ts:80`） |

**定义文件：`src/api/index.ts`**

| 方法 | 接口路径 | 定义函数（参数） | 引用位置 |
| --- | --- | --- | --- |
| GET | `/api/user/logout` | `logout()`<br/>— | 顶栏 · 用户下拉菜单（`layout/components/dropdown/index.vue:41`） |
| GET | `（动态：由调用方传入）` | `exportData()`<br/>`params` | 列表页表头 Hook（导出）（`hooks/userHeader.ts:15`） |
| POST | `/api/common/stream` | `upload()`<br/>`data` | 富文本编辑器（Quill）（`components/vueEditer/index.vue:33` 作为参数传递）<br/>富文本编辑器（Quill）（`components/vueEditer/index.vue:36`）<br/>个人中心（头像上传/裁剪）（`views/stylems/index.vue:26`）<br/>个人中心（头像上传/裁剪）（`views/stylems/index.vue:51` 作为参数传递）<br/>个人中心（头像上传/裁剪）（`views/stylems/index.vue:61` 作为参数传递） |
| PUT | `/api/user/avatar` | `changeAvatar()`<br/>`data` | 个人中心（头像上传/裁剪）（`views/stylems/index.vue:12`） |
| GET | `https://cn.apihz.cn/api/tianqi/tqyb.php` | `getWeather()`<br/>`params` | 顶栏 · 天气组件（`layout/components/header/weather.vue:12`） |

### 菜单与权限（RBAC）

**定义文件：`src/store/api/index.ts`**

| 方法 | 接口路径 | 定义函数（参数） | 引用位置 |
| --- | --- | --- | --- |
| GET | `/api/menu/list` | `getMenu()`<br/>`params:{id:number}` | 用户/权限 Store（`store/expmle.ts:117`） |

**定义文件：`src/views/menu/api/index.ts`**

| 方法 | 接口路径 | 定义函数（参数） | 引用位置 |
| --- | --- | --- | --- |
| GET | `/api/menu/all` | `getMenuList()`<br/>`params: ({}) & { page: number, pageSize: number }` | 菜单管理（`views/menu/index.vue:66`）<br/>角色权限管理（`views/role/index.vue:110`） |
| POST | `/api/menu/add` | `postMenu()`<br/>`data: any` | 菜单管理 · 新增/编辑弹窗（`views/menu/components/addMenu.vue:74`） |
| PUT | `/api/menu/edit` | `putMenu()`<br/>`data: any` | 菜单管理 · 新增/编辑弹窗（`views/menu/components/addMenu.vue:83`） |
| DELETE | `/api/menu/del/{id}` | `deleteMenu()`<br/>`id: number` | 菜单管理（`views/menu/index.vue:127`） |
| GET | `/api/menu/detail` | `getDetail()`<br/>`params: { id: number }` | 菜单管理（`views/menu/index.vue:83`） |

**定义文件：`src/views/role/api/index.ts`**

| 方法 | 接口路径 | 定义函数（参数） | 引用位置 |
| --- | --- | --- | --- |
| GET | `/api/role/list` | `getRoleList()`<br/>`params: any` | 角色权限管理（`views/role/index.vue:97`）<br/>用户管理（`views/welcome/tabels.vue:128`） |
| POST | `/api/role/add` | `postRole()`<br/>`data: any` | 角色权限管理（`views/role/index.vue:188`） |
| DELETE | `/api/role/del/{id}` | `deleteRole()`<br/>`id: number` | 角色权限管理（`views/role/index.vue:177`） |
| GET | `/api/role/detail` | `getDetail()`<br/>`params: { id: number }` | 角色权限管理（`views/role/index.vue:134`） |
| PUT | `/api/role/update` | `updateRole()`<br/>`data:object` | 角色权限管理（`views/role/index.vue:199`） |

### 用户管理

**定义文件：`src/views/welcome/api/index.ts`**

| 方法 | 接口路径 | 定义函数（参数） | 引用位置 |
| --- | --- | --- | --- |
| GET | `/api/user/list` | `getUser()`<br/>`params: { page: number, pageSize: number,[propName:string]:any}` | 用户管理（`views/welcome/tabels.vue:120`） |
| GET | `/api/role_user/list` | `getRoleUser()`<br/>`params: object` | 用户管理（`views/welcome/tabels.vue:136`） |
| POST | `/api/user/add` | `postUser()`<br/>`data:any` | 用户管理（`views/welcome/tabels.vue:224`） |
| PUT | `/api/user/edit` | `putUser()`<br/>`data:any` | 用户管理（`views/welcome/tabels.vue:238`） |
| DELETE | `/api/user/del/{id}` | `deleteUser()`<br/>`id:number` | 用户管理（`views/welcome/tabels.vue:189`） |

### 字典管理

**定义文件：`src/views/dict/api/index.ts`**

| 方法 | 接口路径 | 定义函数（参数） | 引用位置 |
| --- | --- | --- | --- |
| GET | `/api/dict/list` | `getDictList()`<br/>`params: { page: number, pageSize: number } & object` | 字典管理（`views/dict/index.vue:68`） |
| GET | `/api/dictdetail/list` | `getDictDetail()`<br/>`params: { page: number, pageSize: number } & object` | 字典明细（`views/dict/detial.vue:105`） |
| POST | `/api/dict/add` | `postDict()`<br/>`data: { mark: string, type: string }` | 字典管理 · 新增/编辑弹窗（`views/dict/components/add.vue:46`） |
| PUT | `/api/dict/edit` | `putDict()`<br/>`data: any` | 字典管理 · 新增/编辑弹窗（`views/dict/components/add.vue:36`） |
| GET | `/api/dict/detail` | `getDetial()`<br/>`params: { id: number }` | 字典管理（`views/dict/index.vue:98`） |
| DELETE | `/api/dict/del/{id}` | `DeleteDict()`<br/>`id: number` | 字典管理（`views/dict/index.vue:122`） |
| GET | `/api/dictdetail/detail` | `getDictDetailDetail()`<br/>`id: number` | 字典明细（`views/dict/detial.vue:132`） |
| PUT | `/api/dictdetail/edit` | `putDictDetail()`<br/>`data:object` | 字典明细 · 新增/编辑弹窗（`views/dict/components/addDetail.vue:72`） |
| DELETE | `/api/dictdetail/del/{id}` | `delDictDetail()`<br/>`id:number` | 字典明细（`views/dict/detial.vue:156`） |
| POST | `/api/dictdetail/add` | `postDictDetail()`<br/>`data:object` | 字典明细 · 新增/编辑弹窗（`views/dict/components/addDetail.vue:81`） |

### 行政区划

**定义文件：`src/views/division/api/index.ts`**

| 方法 | 接口路径 | 定义函数（参数） | 引用位置 |
| --- | --- | --- | --- |
| GET | `/api/divison/list` | `getDivision()`<br/>`params: any` | 行政区划管理（`views/division/index.vue:49`） |
| GET | `/api/divison/detail` | `getDivsionDetail()`<br/>`params: { id: number }` | 行政区划管理（`views/division/index.vue:78`） |
| POST | `/api/divison/add` | `postDivison()`<br/>`data: any` | 行政区划 · 新增/编辑弹窗（`views/division/components/add.vue:40`） |
| PUT | `/api/divison/edit` | `putDivison()`<br/>`data: any` | 行政区划 · 新增/编辑弹窗（`views/division/components/add.vue:30`） |
| DELETE | `/api/divison/del/{id}` | `deleteDivsion()`<br/>`id: number` | 行政区划管理（`views/division/index.vue:112`） |

### 商品运营

**定义文件：`src/views/goods/api/index.ts`**

| 方法 | 接口路径 | 定义函数（参数） | 引用位置 |
| --- | --- | --- | --- |
| GET | `/api/babaner` | `getData()`<br/>`params` | 首页轮播图（`views/goods/carouse.vue:36`） |
| POST | `/api/babaner` | `postData()`<br/>`data` | 首页轮播图（`views/goods/carouse.vue:67`） |
| PUT | `/api/babaner` | `putData()`<br/>`data` | 首页轮播图（`views/goods/carouse.vue:69`） |
| DELETE | `/api/babaner/{id}` | `deleteData()`<br/>`id` | 首页轮播图（`views/goods/carouse.vue:106` 作为参数传递） |
| GET | `/api/category` | `getCategoryData()`<br/>`params` | 商品分类（`views/goods/category.vue:40`）<br/>商品列表（`views/goods/lists.vue:66`） |
| POST | `/api/category` | `postCategoryData()`<br/>`data` | 商品分类（`views/goods/category.vue:69`） |
| PUT | `/api/category` | `putCategoryData()`<br/>`data` | 商品分类（`views/goods/category.vue:71`） |
| DELETE | `/api/category/{id}` | `deleteCategoryData()`<br/>`id` | 商品分类（`views/goods/category.vue:108` 作为参数传递） |
| GET | `/api/goods` | `getGoodsData()`<br/>`params` | 商品列表（`views/goods/lists.vue:91`） |
| POST | `/api/goods` | `postGoodsData()`<br/>`data: Record<string, any>` | 商品列表（`views/goods/lists.vue:121`） |
| PUT | `/api/goods` | `putGoodsData()`<br/>`data` | 商品列表（`views/goods/lists.vue:123`） |
| DELETE | `/api/goods/{id}` | `deleteGoodsData()`<br/>`id` | 商品列表（`views/goods/lists.vue:155` 作为参数传递） |
| GET | `/api/hots` | `getHostData()`<br/>`params` | 热门推荐（`views/goods/hots.vue:29`） |
| POST | `/api/hots` | `postHostData()`<br/>`data` | 热门推荐（`views/goods/hots.vue:71`） |
| PUT | `/api/hots` | `putHostData()`<br/>`data` | 热门推荐（`views/goods/hots.vue:78`） |
| DELETE | `/api/hots/{id}` | `deleteHostData()`<br/>`id` | 热门推荐（`views/goods/hots.vue:67` 作为参数传递） |

## 三、组件级 / 非模块化接口

这些接口没有写进 `api/index.ts`，而是写在组件 props 默认值、编辑器配置或直接 `fetch` 里，容易漏查。

| 方法 | 接口路径 | 定义位置 | 说明 | 引用页面 |
| --- | --- | --- | --- | --- |
| POST | `/api/common/stream` | components/upload/index.vue（默认 props.url） | 通用文件上传，multipart/form-data，字段名 file | views/uploads/index.vue（上传组件示例页）<br/>views/welcome/tabels.vue（用户管理）<br/>components/forms/index.vue（通用表单组件 → 所有用它的页面：字典/行政区划/商品/轮播图 等）<br/>api/index.ts 的 upload() 同名接口亦指向此地址 |
| POST | `/api/common/upload` | components/editor/index.vue（wangEditor uploadImage.server） | 富文本编辑器插图上传，字段名 file，请求头带 Authorization | components/editor/index.vue（富文本编辑器组件）<br/>经 components/forms 间接被各业务表单页使用 |
| GET | `/api/goods/import` | views/goods/lists.vue（PageHeader 的 url 属性） | 列表导出/下载（responseType: blob，参数 name=goods）；名字叫 import，实际走 exportData | views/goods/lists.vue（商品列表）<br/>经 components/pageHeader → hooks/userHeader.ts 调用 |
| GET | `/api/user/import` | views/welcome/tabels.vue（PageHeader 的 url 属性） | 列表导出/下载（responseType: blob，参数 name=user） | views/welcome/tabels.vue（用户管理）<br/>经 components/pageHeader → hooks/userHeader.ts 调用 |
| POST | `/sapi2/chat` | views/welcome/mcp.vue（fetch 直连） | MCP 对话流式接口，SSE 增量返回 data:{"content":"..."} | views/welcome/mcp.vue（MCP 对话页） |
| GET | `https://cn.apihz.cn/api/tianqi/tqyb.php` | api/index.ts → getWeather() | 第三方天气服务（apihz），非本系统后端 | layout/components/header/weather.vue（顶栏 · 天气组件） |
| GET | `/lookDoctor/g2/getOnsInfo?name=disease_h5` | store/index.ts → mainStore.getXinGuan()（经 serve/http.ts 的 getList 封装） | 第三方疫情数据接口（丁香园），非本系统后端 | store/index.ts（示例 Store）<br/>当前没有任何页面调用 getXinGuan()，属遗留代码 |

## 四、按页面反查（页面 → 接口）

> 「组件路径」是后端菜单表 `component` 字段的取值，路由加载时拼成 `/src{component}.vue`。

### 4.1 业务页面

| 页面 | 文件 | 涉及接口数 |
| --- | --- | --- |
| 字典管理 · 新增/编辑弹窗 | `src/views/dict/components/add.vue` | 2 |
| 字典明细 · 新增/编辑弹窗 | `src/views/dict/components/addDetail.vue` | 2 |
| 字典明细 | `src/views/dict/detial.vue` | 3 |
| 字典管理 | `src/views/dict/index.vue` | 3 |
| 行政区划 · 新增/编辑弹窗 | `src/views/division/components/add.vue` | 2 |
| 行政区划管理 | `src/views/division/index.vue` | 3 |
| 首页轮播图 | `src/views/goods/carouse.vue` | 4 |
| 商品分类 | `src/views/goods/category.vue` | 4 |
| 热门推荐 | `src/views/goods/hots.vue` | 4 |
| 商品列表 | `src/views/goods/lists.vue` | 6 |
| 菜单管理 · 新增/编辑弹窗 | `src/views/menu/components/addMenu.vue` | 2 |
| 菜单管理 | `src/views/menu/index.vue` | 3 |
| 角色权限管理 | `src/views/role/index.vue` | 6 |
| 个人中心（头像上传/裁剪） | `src/views/stylems/index.vue` | 2 |
| 上传组件示例页 | `src/views/uploads/index.vue` | 1 |
| MCP 对话页 | `src/views/welcome/mcp.vue` | 1 |
| 用户管理 | `src/views/welcome/tabels.vue` | 8 |

#### 字典管理 · 新增/编辑弹窗 · 菜单组件路径 `/views/dict/components/add`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/api/dict/add` | `postDict` | 46 |
| PUT | `/api/dict/edit` | `putDict` | 36 |

#### 字典明细 · 新增/编辑弹窗 · 菜单组件路径 `/views/dict/components/addDetail`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| PUT | `/api/dictdetail/edit` | `putDictDetail` | 72 |
| POST | `/api/dictdetail/add` | `postDictDetail` | 81 |

#### 字典明细 · 菜单组件路径 `/views/dict/detial`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/dictdetail/list` | `getDictDetail` | 105 |
| GET | `/api/dictdetail/detail` | `getDictDetailDetail` | 132 |
| DELETE | `/api/dictdetail/del/{id}` | `delDictDetail` | 156 |

#### 字典管理 · 菜单组件路径 `/views/dict/index`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/dict/list` | `getDictList` | 68 |
| GET | `/api/dict/detail` | `getDetial` | 98 |
| DELETE | `/api/dict/del/{id}` | `DeleteDict` | 122 |

#### 行政区划 · 新增/编辑弹窗 · 菜单组件路径 `/views/division/components/add`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/api/divison/add` | `postDivison` | 40 |
| PUT | `/api/divison/edit` | `putDivison` | 30 |

#### 行政区划管理 · 菜单组件路径 `/views/division/index`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/divison/list` | `getDivision` | 49 |
| GET | `/api/divison/detail` | `getDivsionDetail` | 78 |
| DELETE | `/api/divison/del/{id}` | `deleteDivsion` | 112 |

#### 首页轮播图 · 菜单组件路径 `/views/goods/carouse`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/babaner` | `getData` | 36 |
| POST | `/api/babaner` | `postData` | 67 |
| PUT | `/api/babaner` | `putData` | 69 |
| DELETE | `/api/babaner/{id}` | `deleteData` | 106 |

#### 商品分类 · 菜单组件路径 `/views/goods/category`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/category` | `getCategoryData` | 40 |
| POST | `/api/category` | `postCategoryData` | 69 |
| PUT | `/api/category` | `putCategoryData` | 71 |
| DELETE | `/api/category/{id}` | `deleteCategoryData` | 108 |

#### 热门推荐 · 菜单组件路径 `/views/goods/hots`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/hots` | `getHostData` | 29 |
| POST | `/api/hots` | `postHostData` | 71 |
| PUT | `/api/hots` | `putHostData` | 78 |
| DELETE | `/api/hots/{id}` | `deleteHostData` | 67 |

#### 商品列表 · 菜单组件路径 `/views/goods/lists`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/category` | `getCategoryData` | 66 |
| GET | `/api/goods` | `getGoodsData` | 91 |
| POST | `/api/goods` | `postGoodsData` | 121 |
| PUT | `/api/goods` | `putGoodsData` | 123 |
| DELETE | `/api/goods/{id}` | `deleteGoodsData` | 155 |
| GET | `/api/goods/import` | `PageHeader url` | 200 |

#### 菜单管理 · 新增/编辑弹窗 · 菜单组件路径 `/views/menu/components/addMenu`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/api/menu/add` | `postMenu` | 74 |
| PUT | `/api/menu/edit` | `putMenu` | 83 |

#### 菜单管理 · 菜单组件路径 `/views/menu/index`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/menu/all` | `getMenuList` | 66 |
| DELETE | `/api/menu/del/{id}` | `deleteMenu` | 127 |
| GET | `/api/menu/detail` | `getDetail` | 83 |

#### 角色权限管理 · 菜单组件路径 `/views/role/index`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/menu/all` | `getMenuList` | 110 |
| GET | `/api/role/list` | `getRoleList` | 97 |
| POST | `/api/role/add` | `postRole` | 188 |
| DELETE | `/api/role/del/{id}` | `deleteRole` | 177 |
| GET | `/api/role/detail` | `getDetail` | 134 |
| PUT | `/api/role/update` | `updateRole` | 199 |

#### 个人中心（头像上传/裁剪） · 菜单组件路径 `/views/stylems/index`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/api/common/stream` | `upload` | 26 |
| POST | `/api/common/stream` | `upload` | 51 |
| POST | `/api/common/stream` | `upload` | 61 |
| PUT | `/api/user/avatar` | `changeAvatar` | 12 |

#### 上传组件示例页 · 菜单组件路径 `/views/uploads/index`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/api/common/stream` | `经 Upload 组件（默认 url）` | 4 |

#### MCP 对话页 · 菜单组件路径 `/views/welcome/mcp`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/sapi2/chat` | `fetch 直连` | 45 |

#### 用户管理 · 菜单组件路径 `/views/welcome/tabels`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/role/list` | `getRoleList` | 128 |
| GET | `/api/user/list` | `getUser` | 120 |
| GET | `/api/role_user/list` | `getRoleUser` | 136 |
| POST | `/api/user/add` | `postUser` | 224 |
| PUT | `/api/user/edit` | `putUser` | 238 |
| DELETE | `/api/user/del/{id}` | `deleteUser` | 189 |
| POST | `/api/common/stream` | `经 Upload 组件（默认 url）` | — |
| GET | `/api/user/import` | `PageHeader url` | 291 |

#### 无接口调用的页面（纯前端示例/静态页）

`views/datav/index.vue`、`views/goods/components/AddDialog.vue`、`views/goods/components/CarouseEdit.vue`、`views/goods/components/editDialog.vue`、`views/goods/components/viewDialog.vue`、`views/h5/list.vue`、`views/model/components/TestModel.vue`、`views/model/index.vue`、`views/notFound/notFound.vue`、`views/pdf/index.vue`、`views/points/index.vue`、`views/provides/index.vue`、`views/repeat/components/progress.vue`、`views/repeat/index.vue`、`views/tick/printTick.vue`、`views/welcome/components/TableColumn.vue`、`views/welcome/components/test.e.vue`、`views/welcome/customelement.vue`、`views/welcome/icon.vue`、`views/welcome/index.vue`

> 这些页面不请求后端；其中 `views/datav`、`views/points` 为数据可视化示例，`views/model`、`views/repeat`、`views/provides` 为组件特性示例。

### 4.2 公共组件与 Hook（被页面间接使用）

#### 富文本编辑器（wangEditor）

文件：`src/components/editor/index.vue`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/api/common/upload` | `wangEditor 配置` | 86 |

#### 通用上传组件

文件：`src/components/upload/index.vue`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/api/common/stream` | `默认 props.url` | 67 |

#### 富文本编辑器（Quill）

文件：`src/components/vueEditer/index.vue`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/api/common/stream` | `upload` | 33 |
| POST | `/api/common/stream` | `upload` | 36 |

#### 列表页表头 Hook（导出）

文件：`src/hooks/userHeader.ts`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `（动态：由调用方传入）` | `exportData` | 15 |

#### 顶栏 · 用户下拉菜单

文件：`src/layout/components/dropdown/index.vue`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `/api/user/logout` | `logout` | 41 |

#### 顶栏 · 天气组件

文件：`src/layout/components/header/weather.vue`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| GET | `https://cn.apihz.cn/api/tianqi/tqyb.php` | `getWeather` | 12 |

#### 用户/权限 Store

文件：`src/store/expmle.ts`

| 方法 | 接口路径 | 调用函数 | 行号 |
| --- | --- | --- | --- |
| POST | `/api/user/login` | `login` | 79 |
| POST | `/api/user/login` | `login` | 80 |
| GET | `/api/menu/list` | `getMenu` | 117 |

## 五、请求封装与全局约定

| 项 | 说明 |
| --- | --- |
| 统一封装 | `src/serve/index.ts` 导出 `serve`（axios 实例），所有 `api/index.ts` 均 `import { serve as request }` 后调用 |
| 鉴权 | 请求拦截器自动加 `Authorization: <Cookies.get('token')>` |
| 响应约定 | `code === 200` 视为成功；`code === 500` 弹 `ElMessage.error`；`msg === "not login"` 清 token 并跳 `/login` |
| 超时 | 5s（`axios.create({ timeout: 5000 })`） |
| 开发代理 | `/api` → `VITE_API_URL`（默认 `http://localhost:3000`）；`/sapi2` → `http://localhost:7001`（见 `vite.config.ts`） |
| 分页参数 | 列表类接口统一传 `{ page, pageSize, ...查询条件 }` |
| 通用封装 | `serve/http.ts` 的 `getList({ url, method, params })` 可发任意 GET（仅 `store/index.ts` 使用） |
| 未被引用的工具 | `utils/request.ts` 的 `RequestData` / `MockData` 全项目无引用，属示例代码 |
