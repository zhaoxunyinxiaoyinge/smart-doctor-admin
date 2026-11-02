# icon-library（未使用的 SVG 图标备份）

这里是从 `src/icons/` 里移出来的 1371 个未被使用的 svg 图标。

## 为什么要挪出来

`vite.config.ts` 里的 `createSvgIconsPlugin` 会把 `src/icons/` 下的**所有** svg 一起打成
一个 sprite，并在 `main.ts` 里通过 `virtual:svg-icons-register` 同步引入首屏。
原来 1387 个图标合计 4.1 MB，打进主包后占 **1.17 MB**（约为当时主包 1.95 MB 的 60%）。
而实际在用的只有 16 个，所以把其余的挪了出来。

## 当前 `src/icons/` 保留的 16 个图标

后端 `test_project.menu` 表的 icon 字段在用（11 个）：
`home-lg`、`caidan`、`sledding`、`align-center`、`list-ul`、`alarm-clock`、
`dashboard`、`monitor`、`print`、`print-search`、`cart-plus`

前端代码里写死的（5 个）：
`bangzhu`（layout/components/header）、`huanfu`（layout/components/skin）、
`snowflake`（layout/components/draw）、`fullscreen`（layout/components/header/screen）、
`404`（notFound 页备用）

## 需要新增图标时怎么恢复

1. 从本目录把对应的 `<名字>.svg` 拷回 `src/icons/`；
2. 重启 `pnpm dev`（sprite 是在构建期生成的）；
3. 之后菜单里 `icon` 填 `<名字>` 即可。

> 注意：`src/views/welcome/icon.vue` 是图标浏览页，它用 `import.meta.glob('@/icons/*.svg')`
> 枚举 `src/icons/` 目录。所以这里的图标只要没拷回去，浏览页里也不会显示 —— 这是刻意保持一致，
> 避免出现"页面上看得到、实际渲染不出来"的图标。

如果想一次性全部恢复：

```bash
cd /d/project/test_project_production && mv icon-library/*.svg src/icons/
```
