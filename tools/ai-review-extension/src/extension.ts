import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand('aiReview.requestReview', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return vscode.window.showInformationMessage('请先打开要审查的文件。');

    const text = editor.document.getText();
    const option = await vscode.window.showQuickPick(
      ['vue-best-practices', '代码风格', '类型检查'],
      { placeHolder: '选择审查规则' }
    );
    if (!option) return;

    await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: '请求 AI 审查...' }, async () => {
      try {
        const result = await callAiReview(option, editor.document.fileName, text);
        const doc = await vscode.workspace.openTextDocument({ content: result, language: 'markdown' });
        await vscode.window.showTextDocument(doc, { preview: false });
      } catch (err: any) {
        vscode.window.showErrorMessage('AI 审查失败：' + String(err.message ?? err));
      }
    });
  });
  context.subscriptions.push(cmd);
}

async function callAiReview(rule: string, fileName: string, content: string): Promise<string> {
  // 占位实现：优先建议把真实调用放到后端，以便保护密钥。
  // 扩展可在 settings 中配置 apiEndpoint/apiKey。
  const config = vscode.workspace.getConfiguration('aiReview');
  const endpoint: string | undefined = config.get('apiEndpoint');
  const apiKey: string | undefined = config.get('apiKey');

  if (!endpoint) {
    return `# AI 审查结果（${rule}）\n\n未配置 apiEndpoint。请在设置中配置插件的 apiEndpoint。`;
  }

  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({ rule, fileName, content })
    });
    if (!resp.ok) throw new Error(`后端返回 ${resp.status}`);
    const data = await resp.text();
    return data;
  } catch (err: any) {
    return `# AI 审查结果（${rule}）\n\n调用后端失败：${String(err.message ?? err)}`;
  }
}

export function deactivate() {}
