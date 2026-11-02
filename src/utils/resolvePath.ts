/**
 * 浏览器端的路径拼接工具，用于替代 Node 内置模块 `path` 的 `path.resolve`。
 *
 * 为什么不直接用 `path`：
 * `path` 是 Node 内置模块，打进浏览器包后会退化成 `path-browserify`，
 * 而它在模块初始化阶段就会调用 `process.cwd()` / 读取 `process.platform`。
 * 生产构建（vite build）没有为 `process` 注入任何垫片，因此运行时会抛
 * `Uncaught ReferenceError: process is not defined`，导致整个应用挂载失败、页面白屏。
 *
 * 行为对齐 `path.resolve(base, sub)`：
 * - sub 以 `/` 开头时视为绝对路径，直接覆盖 base
 * - 其余情况拼接后做 `.` / `..` / 重复斜杠的归一化
 * - 结果始终以 `/` 开头
 */
export function resolvePath(base?: string, sub?: string): string {
  const b = (base || '').trim();
  const s = (sub || '').trim();

  // 子路径是绝对路径（或带协议的外链）时，直接返回
  if (!s) return normalizePath(b);
  if (/^([a-z][a-z\d+\-.]*:)?\/\//i.test(s) || /^[a-z][a-z\d+\-.]*:/i.test(s)) return s;
  if (s.startsWith('/')) return normalizePath(s);

  return normalizePath(`${b}/${s}`);
}

/**
 * 归一化路径：合并多余斜杠、处理 `.` 和 `..`，保留开头一个 `/`
 */
export function normalizePath(input: string): string {
  if (!input) return '/';

  const isAbsolute = input.startsWith('/');
  const segments = input.split('/');
  const stack: string[] = [];

  for (const seg of segments) {
    if (!seg || seg === '.') continue;
    if (seg === '..') {
      if (stack.length > 0) stack.pop();
      continue;
    }
    stack.push(seg);
  }

  const joined = stack.join('/');
  if (isAbsolute) return `/${joined}`;
  return joined || '/';
}

export default resolvePath;
