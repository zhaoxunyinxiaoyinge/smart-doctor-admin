<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile, UploadInstance } from 'element-plus'
import {
  ArrowDown,
  Close,
  CopyDocument,
  Delete,
  PictureFilled,
  Promotion,
  RefreshRight,
  Service,
} from '@element-plus/icons-vue'

/* ------------------------------------------------------------------
 * MCP 对话页：标准聊天框布局
 * - 左侧为助手（系统）消息，右侧为用户消息
 * - 支持图片上传（本地预览 → 随消息一并提交）
 * - 保留原有流式接口契约：POST /sapi2/chat，SSE 增量返回 { content }
 * ---------------------------------------------------------------- */

type Role = 'user' | 'assistant'
type Status = 'loading' | 'done' | 'error'

interface ChatImage {
  id: string
  name: string
  size: number
  type: string
  dataUrl: string
}

interface Message {
  id: number
  role: Role
  content: string
  images: ChatImage[]
  status: Status
  time: string
  /** 助手消息指向它所回应的用户消息 id，用于失败重试 */
  replyTo?: number
}

/** 后端流式对话地址（沿用原接口，未改动契约） */
const CHAT_ENDPOINT = '/sapi2/chat'
/** SSE 结束标记 */
const DONE_FLAG = '[DONE]'

const MAX_PENDING = 4
const MAX_FILE_SIZE = 5 * 1024 * 1024
const COMPRESS_THRESHOLD = 1 * 1024 * 1024
const ACCEPTED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

const suggestions = [
  '你好，请介绍一下你能做什么',
  '帮我梳理一次 MCP 工具调用的完整链路',
  '接口偶发超时，一般从哪里开始排查',
]

const msg = ref('')
const messages = ref<Message[]>([])
const pendingImages = ref<ChatImage[]>([])
const sending = ref(false)
const shouldStick = ref(true)

const uploadRef = ref<UploadInstance>()
const scrollRef = ref<HTMLElement | null>(null)

let seed = 0
let controller: AbortController | null = null
let rafId = 0

const nextId = () => ++seed

const stamp = () =>
  new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

const canSend = computed(
  () => !sending.value && (msg.value.trim().length > 0 || pendingImages.value.length > 0),
)

const statusText = computed(() => (sending.value ? '正在生成' : '在线'))

/* ------------------------------ 滚动 ------------------------------ */

const scrollToBottom = () => {
  const el = scrollRef.value
  if (el) el.scrollTop = el.scrollHeight
}

const scheduleScroll = () => {
  if (!shouldStick.value || rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    scrollToBottom()
  })
}

const onBodyScroll = () => {
  const el = scrollRef.value
  if (!el) return
  shouldStick.value = el.scrollHeight - el.scrollTop - el.clientHeight < 80
}

const stickToBottom = () => {
  shouldStick.value = true
  const el = scrollRef.value
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
}

/* ------------------------------ 图片处理 ------------------------------ */

const isImageFile = (file: File) =>
  ACCEPTED_MIME.includes(file.type) || /\.(png|jpe?g|webp|gif)$/i.test(file.name)

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('读取图片失败'))
    reader.readAsDataURL(file)
  })

/**
 * 大图压缩：超过阈值时按最长边 1600px 等比缩放并转 JPEG，
 * 避免 base64 体积过大把请求撑爆。GIF 保留原图以免丢失动画。
 */
const maybeCompress = (file: File, dataUrl: string) => {
  if (file.type === 'image/gif' || file.size <= COMPRESS_THRESHOLD) return Promise.resolve(dataUrl)

  return new Promise<string>((resolve) => {
    const image = new Image()
    image.onload = () => {
      try {
        const scale = Math.min(1, 1600 / Math.max(image.width, image.height))
        if (scale >= 1) {
          resolve(dataUrl)
          return
        }
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(dataUrl)
          return
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      } catch {
        resolve(dataUrl)
      }
    }
    image.onerror = () => resolve(dataUrl)
    image.src = dataUrl
  })
}

const handleFileChange = async (uploadFile: UploadFile) => {
  // el-upload 以「累积列表」方式回调，处理完即清空内部列表，保证同一文件可重复选择
  nextTick(() => uploadRef.value?.clearFiles())

  const raw = uploadFile.raw
  if (!raw) return

  if (!isImageFile(raw)) {
    ElMessage.warning(`「${raw.name}」不是受支持的图片格式`)
    return
  }
  if (raw.size > MAX_FILE_SIZE) {
    ElMessage.warning(`「${raw.name}」超过 ${MAX_FILE_SIZE / 1024 / 1024}MB 限制`)
    return
  }
  if (pendingImages.value.length >= MAX_PENDING) {
    ElMessage.warning(`最多上传 ${MAX_PENDING} 张图片`)
    return
  }

  try {
    const original = await readAsDataURL(raw)
    const dataUrl = await maybeCompress(raw, original)
    pendingImages.value.push({
      id: `${raw.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: raw.name,
      size: raw.size,
      type: dataUrl.startsWith('data:image/jpeg') ? 'image/jpeg' : raw.type,
      dataUrl,
    })
  } catch {
    ElMessage.error(`「${raw.name}」读取失败，请重试`)
  }
}

const removeImage = (id: string) => {
  pendingImages.value = pendingImages.value.filter((item) => item.id !== id)
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.ceil(bytes / 1024)}KB`

/* ------------------------------ 流式对话 ------------------------------ */

/** 解析单个 SSE 事件块，取出 delta 文本 */
const parseSseBlock = (block: string) => {
  let out = ''
  for (const line of block.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('data:')) continue
    const payload = trimmed.slice(5).trim()
    if (!payload || payload === DONE_FLAG) continue
    if (!payload.startsWith('{')) {
      // 兼容服务端直接下发纯文本分片的情况
      out += payload
      continue
    }
    try {
      const data = JSON.parse(payload) as { content?: unknown }
      if (data && typeof data.content === 'string' && data.content !== DONE_FLAG) out += data.content
    } catch {
      // 分片不完整，丢弃即可，下一轮会补齐
    }
  }
  return out
}

const patchAssistant = (id: number, patch: (target: Message) => void) => {
  const target = messages.value.find((item) => item.id === id)
  if (target) patch(target)
}

/* ------------------------ Markdown 渲染 ------------------------ */
// 大模型返回的是 Markdown，按纯文本渲染会出现 **加粗**、- 列表 等符号原样显示的问题。
// 先整体 HTML 转义防注入，再做受限的 Markdown 转换，只输出本组件自定义的标签与 class。
const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** 行内转换；行内代码先摘出占位，避免代码里的 * 号被误转换 */
const renderInlineMd = (text: string) => {
  const codes: string[] = []
  let out = text.replace(/`([^`]+)`/g, (_match, code: string) => {
    codes.push(code)
    return `\u0000${codes.length - 1}\u0000`
  })
  out = out
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a class="md-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
  // oxlint-disable-next-line no-control-regex —— \u0000 是刻意的占位符标记，用于找回被保护的代码段
  return out.replace(/\u0000(\d+)\u0000/g, (_match, index: string) =>
    `<code class="md-inline-code">${codes[Number(index)]}</code>`,
  )
}

/** 块级解析；入参必须是「已经转义过」的行 */
const parseMdBlocks = (lines: string[]) => {
  const html: string[] = []
  let i = 0

  const isUlItem = (line: string) => /^\s*[-*+]\s+/.test(line)
  const isOlItem = (line: string) => /^\s*\d+[.)]\s+/.test(line)
  const isTableRow = (line: string) => /^\s*\|.*\|\s*$/.test(line)
  const isTableDivider = (line: string) =>
    /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line)
  const splitRow = (line: string) =>
    line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim())

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }

    // 围栏代码块（流式输出时可能尚未闭合，剩余内容按代码处理）
    if (/^\s*```/.test(line)) {
      const lang = line.replace(/^\s*```/, '').trim()
      i++
      const buf: string[] = []
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        buf.push(lines[i])
        i++
      }
      if (i < lines.length) i++ // 跳过结束的 ```
      html.push(
        `<pre class="md-pre"><code${lang ? ` data-lang="${escapeHtml(lang)}"` : ''}>${buf.join('\n')}</code></pre>`,
      )
      continue
    }

    // 标题（# 的层级映射为 h3 起步，避免气泡内标题过大）
    const heading = line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (heading) {
      const level = Math.min(heading[1].length + 2, 6)
      html.push(`<h${level} class="md-heading">${renderInlineMd(heading[2])}</h${level}>`)
      i++
      continue
    }

    // 分隔线
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      html.push('<hr class="md-hr" />')
      i++
      continue
    }

    // 引用（转义后 > 变成 &gt;）
    if (/^\s*&gt;\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\s*&gt;\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*&gt;\s?/, ''))
        i++
      }
      html.push(`<blockquote class="md-quote">${parseMdBlocks(buf)}</blockquote>`)
      continue
    }

    // 表格
    if (isTableRow(line) && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const header = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]))
        i++
      }
      html.push(
        '<div class="md-table-wrap"><table class="md-table"><thead><tr>' +
          header.map((cell) => `<th>${renderInlineMd(cell)}</th>`).join('') +
          '</tr></thead><tbody>' +
          rows
            .map(
              (row) =>
                '<tr>' +
                header.map((_cell, index) => `<td>${renderInlineMd(row[index] ?? '')}</td>`).join('') +
                '</tr>',
            )
            .join('') +
          '</tbody></table></div>',
      )
      continue
    }

    // 列表
    if (isUlItem(line) || isOlItem(line)) {
      const ordered = isOlItem(line) && !isUlItem(line)
      const items: string[] = []
      while (i < lines.length && (ordered ? isOlItem(lines[i]) : isUlItem(lines[i]))) {
        items.push(lines[i].replace(/^\s*(?:[-*+]|\d+[.)])\s+/, ''))
        i++
      }
      const tag = ordered ? 'ol' : 'ul'
      html.push(
        `<${tag} class="md-list">${items.map((item) => `<li>${renderInlineMd(item)}</li>`).join('')}</${tag}>`,
      )
      continue
    }

    // 段落：连续非空行合并，单行换行用 <br /> 保留
    const buf: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*(#{1,6}\s|```|&gt;)/.test(lines[i]) &&
      !isUlItem(lines[i]) &&
      !isOlItem(lines[i]) &&
      !isTableRow(lines[i])
    ) {
      buf.push(lines[i].trim())
      i++
    }
    if (buf.length) {
      html.push(`<p class="md-p">${renderInlineMd(buf.join('<br />'))}</p>`)
    }
  }
  return html.join('')
}

const renderMarkdown = (source: string) => parseMdBlocks(escapeHtml(source).split('\n'))

/** 发起一次流式请求，userMsg 为本次要回应的用户消息 */
const runStream = async (userMsg: Message) => {
  sending.value = true
  shouldStick.value = true

  const assistantId = nextId()
  messages.value.push({
    id: assistantId,
    role: 'assistant',
    content: '',
    images: [],
    status: 'loading',
    time: stamp(),
    replyTo: userMsg.id,
  })
  await nextTick()
  scrollToBottom()

  controller = new AbortController()
  const payload: { input: string; images?: Array<Pick<ChatImage, 'name' | 'type' | 'dataUrl'>> } = {
    input: userMsg.content,
  }
  if (userMsg.images.length) {
    payload.images = userMsg.images.map(({ name, type, dataUrl }) => ({ name, type, dataUrl }))
  }

  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    // if (!response.ok) throw new Error(`服务返回 ${response.status}`)

    const reader = response.body?.getReader()
    if (!reader) throw new Error('当前浏览器不支持流式响应')

    const decoder = new TextDecoder()
    let buffer = ''

    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split('\n\n')
      buffer = blocks.pop() ?? ''
      let piece = ''
      for (const block of blocks) piece += parseSseBlock(block)
      if (piece) {
        patchAssistant(assistantId, (item) => {
          item.content += piece
        })
        scheduleScroll()
      }
    }

    buffer += decoder.decode()
    const rest = buffer.trim()
    if (rest) {
      const piece = parseSseBlock(rest)
      if (piece) {
        patchAssistant(assistantId, (item) => {
          item.content += piece
        })
      }
    }

    patchAssistant(assistantId, (item) => {
      item.status = 'done'
      if (!item.content) item.content = '（本次未返回内容）'
    })
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === 'AbortError'
    patchAssistant(assistantId, (item) => {
      if (aborted) {
        item.status = 'done'
        if (!item.content) item.content = '（已停止生成）'
      } else {
        item.status = 'error'
        const detail = error instanceof Error ? error.message : '未知错误'
        item.content = item.content || `请求失败：${detail}`
      }
    })
  } finally {
    controller = null
    sending.value = false
    await nextTick()
    scrollToBottom()
  }
}

const send = async () => {
  if (!canSend.value) return
  const content = msg.value.trim()
  const images = pendingImages.value.slice()

  const userMsg: Message = {
    id: nextId(),
    role: 'user',
    content,
    images,
    status: 'done',
    time: stamp(),
  }
  messages.value.push(userMsg)
  msg.value = ''
  pendingImages.value = []

  await runStream(userMsg)
}

const stop = () => {
  controller?.abort()
}

const retry = async (target: Message) => {
  const userMsg = messages.value.find((item) => item.id === target.replyTo)
  if (!userMsg || sending.value) return
  const index = messages.value.findIndex((item) => item.id === target.id)
  if (index > -1) messages.value.splice(index, 1)
  await runStream(userMsg)
}

const onKeydown = (evt: Event | KeyboardEvent) => {
  const event = evt as KeyboardEvent
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return
  event.preventDefault()
  send()
}

const useSuggestion = (text: string) => {
  msg.value = text
  send()
}

const copyText = async (text: string) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动选中复制')
  }
}

const clearAll = () => {
  if (!messages.value.length) return
  ElMessageBox.confirm('清空后当前对话记录将无法恢复，确定继续吗？', '清空对话', {
    type: 'warning',
    confirmButtonText: '清空',
    cancelButtonText: '取消',
  })
    .then(() => {
      messages.value = []
      ElMessage.success('对话已清空')
    })
    .catch(() => {
      /* 用户取消 */
    })
}

onBeforeUnmount(() => {
  controller?.abort()
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="mcp-chat">
    <header class="chat-header">
      <div class="chat-ident">
        <div class="brand-avatar">
          <img
            src="/lion.png"
            alt="MCP"
          />
        </div>
        <div class="chat-title">
          <h3>MCP 智能助手</h3>
          <p>智慧电商系统 · 基于 MCP 协议的对话服务</p>
        </div>
      </div>
      <div class="chat-actions">
        <span
          class="status-pill"
          :class="{ 'is-busy': sending }"
        >
          <i class="dot" />
          {{ statusText }}
        </span>
        <el-button
          text
          :disabled="!messages.length"
          @click="clearAll"
        >
          <el-icon><Delete /></el-icon>
          <span>清空对话</span>
        </el-button>
      </div>
    </header>

    <div class="chat-body-wrap">
      <div
        ref="scrollRef"
        class="chat-body"
        @scroll.passive="onBodyScroll"
      >
        <div
          v-if="!messages.length"
          class="chat-empty"
        >
          <div class="empty-logo">
            <el-icon :size="34"><Service /></el-icon>
          </div>
          <h4>开始一段新对话</h4>
          <p>输入问题，或上传图片让助手一起看</p>
          <div class="suggest-list">
            <button
              v-for="item in suggestions"
              :key="item"
              class="suggest-item"
              type="button"
              @click="useSuggestion(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <div
          v-for="item in messages"
          :key="item.id"
          class="msg-row"
          :class="item.role"
        >
          <div class="avatar">
            <img
              v-if="item.role === 'assistant'"
              src="/lion.png"
              alt="助手"
            />
            <span v-else>我</span>
          </div>

          <div class="msg-main">
            <div
              class="bubble"
              :class="{ 'is-error': item.status === 'error' }"
            >
              <div
                v-if="item.images.length"
                class="bubble-images"
                :class="{ 'is-single': item.images.length === 1 }"
              >
                <el-image
                  v-for="(img, index) in item.images"
                  :key="img.id"
                  class="bubble-image"
                  :src="img.dataUrl"
                  :preview-src-list="item.images.map((one) => one.dataUrl)"
                  :initial-index="index"
                  fit="cover"
                  preview-teleported
                />
              </div>

              <span
                v-if="item.status === 'loading' && !item.content"
                class="typing"
              >
                <i />
                <i />
                <i />
              </span>
              <div
                v-else-if="item.content"
                class="bubble-text"
                :class="{ 'md-body': item.role === 'assistant' }"
              >
                <span v-if="item.role === 'user'">{{ item.content }}</span>
                <!-- 助手消息按 Markdown 渲染；内容已整体转义，无注入风险 -->
                <div
                  v-else
                  v-html="renderMarkdown(item.content)"
                />
              </div>
            </div>

            <div class="msg-meta">
              <span class="time">{{ item.time }}</span>
              <el-button
                v-if="item.role === 'assistant' && item.status === 'done' && item.content"
                text
                size="small"
                @click="copyText(item.content)"
              >
                <el-icon><CopyDocument /></el-icon>
                <span>复制</span>
              </el-button>
              <el-button
                v-if="item.status === 'error'"
                text
                size="small"
                class="retry-btn"
                :disabled="sending"
                @click="retry(item)"
              >
                <el-icon><RefreshRight /></el-icon>
                <span>重新生成</span>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <transition name="fade-up">
        <button
          v-if="!shouldStick && messages.length"
          class="to-bottom"
          type="button"
          @click="stickToBottom"
        >
          <el-icon><ArrowDown /></el-icon>
        </button>
      </transition>
    </div>

    <footer class="chat-footer">
      <div
        v-if="pendingImages.length"
        class="pending-list"
      >
        <div
          v-for="img in pendingImages"
          :key="img.id"
          class="pending-item"
          :title="`${img.name} · ${formatSize(img.size)}`"
        >
          <img
            :src="img.dataUrl"
            :alt="img.name"
          />
          <button
            class="pending-remove"
            type="button"
            @click="removeImage(img.id)"
          >
            <el-icon><Close /></el-icon>
          </button>
        </div>
      </div>

      <div class="input-row">
        <el-upload
          ref="uploadRef"
          class="upload-trigger"
          :auto-upload="false"
          :show-file-list="false"
          :multiple="true"
          accept="image/png,image/jpeg,image/webp,image/gif"
          :on-change="handleFileChange"
        >
          <button
            class="tool-btn"
            type="button"
            :disabled="pendingImages.length >= MAX_PENDING"
          >
            <el-icon><PictureFilled /></el-icon>
            <span>图片</span>
          </button>
        </el-upload>

        <el-input
          v-model="msg"
          class="chat-input"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 5 }"
          resize="none"
          placeholder="输入内容，Enter 发送，Shift + Enter 换行"
          @keydown="onKeydown"
        />

        <el-button
          v-if="!sending"
          type="primary"
          class="send-btn"
          :disabled="!canSend"
          @click="send"
        >
          <el-icon><Promotion /></el-icon>
          <span>发送</span>
        </el-button>
        <el-button
          v-else
          class="send-btn stop-btn"
          @click="stop"
        >
          <span class="stop-square" />
          <span>停止</span>
        </el-button>
      </div>

      <div class="input-tip">
        支持 PNG / JPG / WEBP / GIF，最多 {{ MAX_PENDING }} 张，单张不超过 5MB；大图会自动压缩
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.mcp-chat {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  text-align: left; /* 防止外层容器继承的居中影响消息排版 */
  background-color: var(--app-bg-page);
  border: 1px solid var(--app-border);
  border-radius: 10px;
}

/* ------------------------------ 顶部 ------------------------------ */
.chat-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 18px;
  background-color: var(--app-bg-surface);
  border-bottom: 1px solid var(--app-border);
}

.chat-ident {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: var(--app-primary-softer);
  border: 1px solid var(--app-primary-soft);

  img {
    width: 26px;
    height: 26px;
    object-fit: contain;
  }
}

.chat-title {
  min-width: 0;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--app-text-primary);
    letter-spacing: 0.3px;
  }

  p {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--app-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--app-primary-strong);
  background-color: var(--app-primary-softer);
  border: 1px solid var(--app-primary-soft);

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--app-primary);
  }

  &.is-busy {
    color: var(--app-text-regular);
    background-color: var(--app-border-soft);
    border-color: var(--app-border);

    .dot {
      background-color: var(--el-color-warning);
      animation: pulse 1.2s infinite ease-in-out;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* ------------------------------ 消息区 ------------------------------ */
.chat-body-wrap {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
}

.chat-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 18px 8px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
  min-height: 260px;
  text-align: center;

  .empty-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 18px;
    color: var(--app-primary-strong);
    background-color: var(--app-primary-softer);
    border: 1px solid var(--app-primary-soft);
  }

  h4 {
    margin: 6px 0 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--app-text-primary);
  }

  p {
    margin: 0;
    font-size: 13px;
    color: var(--app-text-muted);
  }
}

.suggest-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 620px;
  margin-top: 8px;
}

.suggest-item {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  line-height: 1.4;
  cursor: pointer;
  color: var(--app-text-regular);
  background-color: var(--app-bg-surface);
  border: 1px solid var(--app-border);
  transition: all 0.18s ease;

  &:hover {
    color: var(--app-primary-strong);
    background-color: var(--app-primary-softer);
    border-color: var(--app-primary);
  }
}

.msg-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 18px;

  &.user {
    flex-direction: row-reverse;

    .msg-main {
      align-items: flex-end;
    }

    .avatar {
      background-color: var(--app-primary-strong);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
    }

    .bubble {
      background-color: var(--app-primary-strong);
      color: #fff;
      border-color: transparent;
      border-top-right-radius: 2px;
    }

    .msg-meta {
      justify-content: flex-end;
    }
  }

  &.assistant {
    .avatar {
      background-color: var(--app-bg-surface);
      border: 1px solid var(--app-border);
    }

    .avatar img {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }

    .bubble {
      background-color: var(--app-bg-surface);
      color: var(--app-text-primary);
      border-color: var(--app-border);
      border-top-left-radius: 2px;
    }
  }
}

.avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
}

.msg-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 76%;
  min-width: 0;
}

.bubble {
  max-width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 14px;
  line-height: 1.75;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

  &.is-error {
    border-color: var(--el-color-danger);
    background-color: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
  }
}

.bubble-text {
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
}

/* Markdown 正文（v-html 内容不带 scoped 标记，必须用 :deep 穿透） */
.bubble-text.md-body {
  white-space: normal;
  min-width: 0;

  :deep(.md-p) {
    margin: 0 0 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.md-heading) {
    font-weight: 600;
    line-height: 1.5;
    margin: 12px 0 6px;

    &:first-child {
      margin-top: 0;
    }
  }

  :deep(h3.md-heading) {
    font-size: 15px;
  }

  :deep(h4.md-heading) {
    font-size: 14px;
  }

  :deep(h5.md-heading),
  :deep(h6.md-heading) {
    font-size: 14px;
    font-weight: 600;
    color: var(--app-text-regular);
  }

  :deep(.md-list) {
    margin: 0 0 8px;
    padding-left: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    li {
      margin: 4px 0;
    }
  }

  :deep(.md-pre) {
    margin: 8px 0;
    padding: 10px 12px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 12.5px;
    line-height: 1.6;
    font-family: Consolas, Monaco, 'Courier New', monospace;
    background-color: #0f172a;
    color: #e2e8f0;
  }

  :deep(.md-inline-code) {
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 13px;
    font-family: Consolas, Monaco, 'Courier New', monospace;
    background-color: var(--app-border-soft);
    color: var(--app-primary-strong);
  }

  :deep(.md-quote) {
    margin: 8px 0;
    padding: 6px 12px;
    border-left: 3px solid var(--app-primary);
    border-radius: 0 6px 6px 0;
    background-color: var(--app-primary-softer);
    color: var(--app-text-regular);
  }

  :deep(.md-hr) {
    border: none;
    border-top: 1px solid var(--app-border);
    margin: 12px 0;
  }

  :deep(.md-link) {
    color: var(--app-primary-strong);
    text-decoration: underline;
  }

  :deep(.md-table-wrap) {
    margin: 8px 0;
    overflow-x: auto;
  }

  :deep(.md-table) {
    border-collapse: collapse;
    font-size: 13px;

    th,
    td {
      padding: 6px 10px;
      border: 1px solid var(--app-border);
      text-align: left;
      white-space: nowrap;
    }

    th {
      background-color: var(--app-border-soft);
      font-weight: 600;
    }
  }

  :deep(strong) {
    font-weight: 600;
  }
}

.bubble-images {
  display: grid;
  grid-template-columns: repeat(2, 110px);
  gap: 6px;

  &.is-single {
    grid-template-columns: minmax(0, 180px);
  }

  & + .bubble-text {
    margin-top: 8px;
  }
}

.bubble-image {
  width: 100%;
  height: 110px;
  border-radius: 8px;
  overflow: hidden;
  cursor: zoom-in;
  background-color: var(--app-border-soft);
}

.bubble-images.is-single .bubble-image {
  height: 150px;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--app-text-muted);

  :deep(.el-button) {
    height: 22px;
    padding: 0 4px;
    font-size: 12px;
    color: var(--app-text-muted);
  }

  :deep(.el-button:hover) {
    color: var(--app-primary-strong);
  }

  :deep(.retry-btn) {
    color: var(--el-color-danger);
  }
}

/* 打字指示器 */
.typing {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 20px;

  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--app-primary);
    animation: typing 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%,
  80%,
  100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.to-bottom {
  position: absolute;
  right: 18px;
  bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--app-primary-strong);
  background-color: var(--app-bg-surface);
  border: 1px solid var(--app-border);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.2s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* ------------------------------ 输入区 ------------------------------ */
.chat-footer {
  flex-shrink: 0;
  padding: 10px 18px 12px;
  background-color: var(--app-bg-surface);
  border-top: 1px solid var(--app-border);
}

.pending-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.pending-item {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--app-border);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.pending-remove {
  position: absolute;
  top: 3px;
  right: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  background-color: rgba(15, 23, 42, 0.6);
  font-size: 10px;

  &:hover {
    background-color: var(--el-color-danger);
  }
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.upload-trigger {
  flex-shrink: 0;

  :deep(.el-upload) {
    display: block;
  }
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 34px;
  padding: 0 12px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  color: var(--app-text-regular);
  background-color: var(--app-bg-surface);
  border: 1px solid var(--app-border);
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    color: var(--app-primary-strong);
    background-color: var(--app-primary-softer);
    border-color: var(--app-primary);
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--app-text-muted);
    background-color: var(--app-border-soft);
  }
}

.chat-input {
  flex: 1 1 auto;

  :deep(.el-textarea__inner) {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid var(--app-border);
    box-shadow: none;
    font-size: 14px;
    line-height: 1.6;
    color: var(--app-text-primary);
    background-color: var(--app-bg-surface);
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }

  :deep(.el-textarea__inner:hover) {
    border-color: var(--app-primary);
  }

  :deep(.el-textarea__inner:focus) {
    border-color: var(--app-primary);
    box-shadow: 0 0 0 3px var(--app-primary-softer);
  }
}

.send-btn {
  flex-shrink: 0;
  height: 36px;
  padding: 0 18px;

  &.stop-btn {
    color: var(--el-color-danger);
    background-color: var(--el-color-danger-light-9);
    border-color: var(--el-color-danger-light-7);

    &:hover {
      color: #fff;
      background-color: var(--el-color-danger);
      border-color: var(--el-color-danger);
    }
  }
}

.stop-square {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 4px;
  border-radius: 2px;
  background-color: currentColor;
}

.input-tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--app-text-muted);
}
</style>
