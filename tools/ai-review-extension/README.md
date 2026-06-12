# AI Review Shortcut (示例扩展)

这是一个最小的 VS Code 扩展示例，实现“选中文件右键 → 请求 AI 审查”的工作流。

快速使用：

1. 打开扩展文件夹 `tools/ai-review-extension`。
2. 运行 `npm install`（会安装 dev 依赖如 typescript）。
3. 运行 `npm run compile` 编译 TypeScript。
4. 在 VS Code 中按 `F5` 启动 Extension Development Host 测试。\n
配置：
- 在设置中添加 `aiReview.apiEndpoint`（后端地址），可选 `aiReview.apiKey`（Bearer token）。

注意：为了安全，建议把模型密钥保存在后端，由后端调用模型。