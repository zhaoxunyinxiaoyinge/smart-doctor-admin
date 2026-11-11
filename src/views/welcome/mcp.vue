<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { ref } from 'vue'
import { DefaultChatTransport } from 'ai'

const input = ref('')
const { messages, sendMessage, status, stop, error, regenerate } = useChat({
  transport: new DefaultChatTransport({
    api: 'sapi2/chat',
  }),
})

function onSubmit() {
  sendMessage({ text: input.value })
  input.value = ''
}

// 纯静态展示配置：不是响应式状态，也没有新增方法
const models = [
  { id: 'deepseek', name: 'DeepSeek V3.2', desc: '中文 · 性价比高（默认）', active: true },
  { id: 'auto', name: '自动选择', desc: '由服务端决定模型', active: false },
  { id: 'gpt', name: 'GPT-5', desc: '通用对话 · 推理强', active: false },
  { id: 'claude', name: 'Claude Sonnet 4.5', desc: '长文本 · 代码理解', active: false },
  { id: 'gemini', name: 'Gemini 2.5 Pro', desc: '多模态 · 超长上下文', active: false },
  { id: 'qwen', name: '通义千问 Max', desc: '中文 · 工具调用', active: false },
  { id: 'kimi', name: 'Kimi K2', desc: '长文档 · 中文阅读', active: false },
  { id: 'glm', name: 'GLM-4.6', desc: '国产 · 稳定', active: false },
]
</script>

<template>
  <section class="chat-page">
    <!-- 左侧：模型 / 会话信息 -->
    <aside class="side">
      <div class="side-brand">
        <div class="brand-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
            <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
          </svg>
        </div>
        <div class="brand-text">
          <h1>AI 助手</h1>
          <p>MCP 智能对话</p>
        </div>
      </div>

      <div class="side-block">
        <p class="side-label">常用模型</p>
        <ul class="model-list">
          <li
            v-for="model in models"
            :key="model.id"
            class="model-item"
            :class="{ 'is-active': model.active }"
          >
            <span class="model-dot" />
            <span class="model-text">
              <strong>{{ model.name }}</strong>
              <small>{{ model.desc }}</small>
            </span>
            <svg v-if="model.active" class="model-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </li>
        </ul>
      </div>

      <div class="side-block side-meta">
        <p class="side-label">当前会话</p>
        <div class="meta-row">
          <span>消息数</span>
          <b>{{ messages.length }}</b>
        </div>
        <div class="meta-row">
          <span>状态</span>
          <b v-if="status === 'submitted'" class="is-thinking">思考中</b>
          <b v-else-if="status === 'streaming'" class="is-thinking">输出中</b>
          <b v-else>已就绪</b>
        </div>
      </div>

      <div class="side-foot">
        <span class="foot-dot" />
        接口 sapi2/chat
      </div>
    </aside>

    <!-- 右侧：对话主区 -->
    <main class="main">
      <header class="chat-head">
        <div class="head-title">
          <h2>新对话</h2>
          <p>用一句话描述你的问题</p>
        </div>
        <div class="head-actions">
          <span v-if="status === 'submitted'" class="status-pill is-thinking">
            <i class="dot" /><i class="dot" /><i class="dot" />
            <span>思考中</span>
          </span>
          <span v-else-if="status === 'streaming'" class="status-pill is-streaming">
            <i class="pulse" />
            <span>输出中</span>
          </span>
          <span v-else class="status-pill">
            <i class="ready" />
            <span>已就绪</span>
          </span>

          <el-button v-if="status === 'streaming'" class="stop-btn" text @click="stop">停止</el-button>
        </div>
      </header>

      <div class="chat-body">
        <div v-if="!messages.length" class="empty">
          <div class="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.4-8.4 8.4 8.4 0 0 1 8.6 7.7Z" />
            </svg>
          </div>
          <p class="empty-title">今天想聊点什么？</p>
          <p class="empty-desc">输入你的问题，我会尽量给出清晰的回答</p>
        </div>

        <div
          v-for="m in messages"
          :key="m.id"
          class="row"
          :class="m.role === 'user' ? 'is-user' : 'is-ai'"
        >
          <div class="avatar">{{ m.role === 'user' ? '我' : 'AI' }}</div>
          <div class="bubble">
            <template v-for="(part, i) in m.parts" :key="i">
              
              <span v-if="part.type === 'text'" class="text">{{ part.text }}</span>
              
              <div v-else-if="part.type === 'tool-searchProducts'"
                class="tool-chip">
                  正在查询商品：{{ part.input?.keyword }}
            </div>

            </template>
            <span
              v-if="status === 'streaming' && m.role !== 'user' && m.id === messages[messages.length - 1].id"
              class="caret"
            />
          </div>
        </div>

        <div v-if="status === 'submitted'" class="row is-ai">
          <div class="avatar">AI</div>
          <div class="bubble typing">
            <i /><i /><i />
          </div>
        </div>


        <div v-if="error" class="error-box">
          <div class="error-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4.5M12 16h.01" />
            </svg>
          </div>
          <div class="error-text">
            <p class="error-title">请求失败了</p>
            <p class="error-msg">{{ error.message }}</p>
          </div>
          <el-button class="retry-btn" @click="regenerate()">重试</el-button>
        </div>
      </div>

      <form class="composer" @submit.prevent="onSubmit">
        <input
          v-model="input"
          class="composer-input"
          :disabled="status !== 'ready'"
          placeholder="给 AI 发送消息…"
          autocomplete="off"
        />
        <button class="send" type="submit" :disabled="status !== 'ready' || !input.trim()" aria-label="发送">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h13M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
      <p class="composer-tip">Enter 发送 · 内容由 AI 生成，请自行判断准确性</p>
    </main>
  </section>
</template>

<style scoped lang="scss">
.chat-page {
  --bubble-ai-bg: var(--app-bg-surface, #fff);
  --bubble-ai-border: var(--app-border, #e8edf2);
  --line-soft: var(--app-border-soft, #f1f5f9);
  --side-width: 248px;

  box-sizing: border-box;
  display: flex;
  width: 100%;
  max-width: 100%;
  height: calc(100vh - 20px);
  height: calc(100dvh - 20px);
  min-height: 560px;
  min-width: 0;
  overflow: hidden;
  text-align: left;
  background: var(--app-bg-surface, #fff);
  border: 1px solid var(--app-border, #e8edf2);
  border-radius: 16px;
  box-shadow: 0 20px 50px -28px rgba(30, 58, 138, 0.35);
}

/* ---------- 左侧栏 ---------- */
.side {
  display: flex;
  flex: none;
  flex-direction: column;
  width: var(--side-width);
  padding: 16px 12px 12px;
  overflow-y: auto;
  background: linear-gradient(180deg, var(--app-primary-softer, #eff6ff) 0%, var(--app-bg-page, #f5f7fa) 42%, var(--app-bg-page, #f5f7fa) 100%);
  border-right: 1px solid var(--app-border, #e8edf2);
  box-shadow: 1px 0 0 rgba(15, 23, 42, 0.02), 6px 0 18px -18px rgba(15, 23, 42, 0.5);

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.4);
    border-radius: 999px;
  }
}

.side-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px 16px;
}

.brand-logo {
  display: grid;
  flex: none;
  place-items: center;
  width: 36px;
  height: 36px;
  color: #fff;
  border-radius: 10px;
  background: linear-gradient(140deg, var(--app-primary, #2563eb), var(--app-primary-deep, #1e3a8a));
  box-shadow: 0 6px 14px -7px rgba(37, 99, 235, 0.7);

  svg {
    width: 19px;
    height: 19px;
  }
}

.brand-text {
  min-width: 0;

  h1 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--app-text-primary, #1e293b);
  }

  p {
    margin: 1px 0 0;
    font-size: 11px;
    color: var(--app-text-muted, #94a3b8);
  }
}

.side-block {
  margin-bottom: 18px;
}

.side-label {
  margin: 0 0 8px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--app-text-muted, #94a3b8);
  text-transform: uppercase;
}

.model-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.model-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: default;
  transition: background-color 0.16s ease, border-color 0.16s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.75);
  }

  &.is-active {
    background: var(--app-bg-surface, #fff);
    border-color: var(--app-primary-soft, #dbeafe);
    box-shadow: 0 6px 16px -14px rgba(37, 99, 235, 0.9);

    .model-dot {
      background: var(--app-primary, #2563eb);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
    }

    strong {
      color: var(--app-primary-strong, #1d4ed8);
    }
  }
}

.model-dot {
  flex: none;
  width: 7px;
  height: 7px;
  background: #cbd5e1;
  border-radius: 50%;
}

.model-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;

  strong {
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.35;
    color: var(--app-text-primary, #1e293b);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    overflow: hidden;
    font-size: 11px;
    line-height: 1.4;
    color: var(--app-text-muted, #94a3b8);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.model-check {
  flex: none;
  width: 14px;
  height: 14px;
  color: var(--app-primary, #2563eb);
}

.side-meta {
  padding: 12px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid var(--line-soft);
  border-radius: 12px;

  .side-label {
    padding: 0;
  }
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 12px;
  color: var(--app-text-regular, #475569);

  b {
    font-weight: 600;
    color: var(--app-text-primary, #1e293b);

    &.is-thinking {
      color: var(--app-primary-strong, #1d4ed8);
    }
  }
}

.side-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding: 8px 6px 2px;
  font-size: 11px;
  color: var(--app-text-muted, #94a3b8);
}

.foot-dot {
  width: 5px;
  height: 5px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

/* ---------- 右侧主区 ---------- */
.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding: 14px 22px;
  border-bottom: 1px solid var(--line-soft);
}

.head-title {
  min-width: 0;

  h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--app-text-primary, #1e293b);
  }

  p {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--app-text-muted, #94a3b8);
  }
}

.head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--app-text-regular, #475569);
  background: var(--app-bg-page, #f5f7fa);
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  white-space: nowrap;

  .ready {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.16);
  }

  &.is-thinking,
  &.is-streaming {
    color: var(--app-primary-strong, #1d4ed8);
    background: var(--app-primary-soft, #dbeafe);
    border-color: transparent;
  }

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
    animation: bounce 1.1s infinite ease-in-out;
  }

  .dot:nth-child(2) {
    animation-delay: 0.16s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.32s;
  }

  .pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 1.2s infinite ease-in-out;
  }
}

.stop-btn {
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
  color: var(--app-text-regular, #475569);
  border: 1px solid var(--app-border, #e8edf2);
  border-radius: 999px;
}

.chat-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  padding: 24px 28px;
  overflow-x: hidden;
  overflow-y: auto;
  background:
    radial-gradient(720px 240px at 100% 0%, rgba(37, 99, 235, 0.05), transparent 70%),
    var(--app-bg-page, #f5f7fa);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.45);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  // 消息少时贴底显示，避免底部留出大片空白
  > :first-child {
    margin-top: auto;
  }
}

.empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 12px;
  text-align: center;
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin-bottom: 8px;
  color: var(--app-primary, #2563eb);
  background: var(--app-primary-soft, #dbeafe);
  border-radius: 17px;

  svg {
    width: 28px;
    height: 28px;
  }
}

.empty-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--app-text-primary, #1e293b);
}

.empty-desc {
  margin: 0;
  font-size: 13px;
  color: var(--app-text-muted, #94a3b8);
}

.row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 100%;
  min-width: 0;

  &.is-user {
    flex-direction: row-reverse;

    .avatar {
      color: var(--app-primary-strong, #1d4ed8);
      background: var(--app-primary-soft, #dbeafe);
      border-color: transparent;
    }

    .bubble {
      color: #fff;
      background: linear-gradient(140deg, var(--app-primary, #2563eb), var(--app-primary-strong, #1d4ed8));
      border-color: transparent;
      border-radius: 16px 16px 5px 16px;
      box-shadow: 0 12px 26px -16px rgba(37, 99, 235, 0.9);
    }
  }

  &.is-ai .bubble {
    border-radius: 16px 16px 16px 5px;
    box-shadow: 0 10px 24px -20px rgba(15, 23, 42, 0.7);
  }
}

.avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 34px;
  height: 34px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(140deg, #64748b, #475569);
  border: 1px solid transparent;
  border-radius: 11px;
}

.bubble {
  max-width: min(74%, 680px);
  padding: 11px 15px;
  font-size: 14px;
  line-height: 1.75;
  text-align: left;
  color: var(--app-text-primary, #1e293b);
  background: var(--bubble-ai-bg);
  border: 1px solid var(--bubble-ai-border);
  border-radius: 16px;
  word-break: break-word;

  .text {
    white-space: pre-wrap;
  }
}

.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: -2px;
  background: currentColor;
  border-radius: 1px;
  animation: blink 1s steps(2, start) infinite;
}

.typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 15px 17px;

  i {
    width: 6px;
    height: 6px;
    background: var(--app-text-muted, #94a3b8);
    border-radius: 50%;
    animation: bounce 1.1s infinite ease-in-out;
  }

  i:nth-child(2) {
    animation-delay: 0.16s;
  }

  i:nth-child(3) {
    animation-delay: 0.32s;
  }
}

/* ---------- 错误 ---------- */
.error-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
}

.error-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 30px;
  color: #dc2626;
  background: #fee2e2;
  border-radius: 9px;

  svg {
    width: 17px;
    height: 17px;
  }
}

.error-text {
  flex: 1;
  min-width: 0;
}

.error-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #b91c1c;
}

.error-msg {
  margin: 2px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #dc2626;
  word-break: break-word;
}

.retry-btn {
  flex: none;
  height: 30px;
  padding: 0 14px;
  font-size: 12px;
  color: #b91c1c;
  background: #fff;
  border: 1px solid #fecaca;
  border-radius: 8px;

  &:hover {
    color: #fff;
    background: #dc2626;
    border-color: #dc2626;
  }
}

/* ---------- 输入区 ---------- */
.composer {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 14px 22px 0;
  border-top: 1px solid var(--line-soft);
}

.composer-input {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 44px;
  padding: 0 18px;
  font-size: 14px;
  color: var(--app-text-primary, #1e293b);
  background: var(--app-bg-page, #f5f7fa);
  border: 1px solid var(--app-border, #e8edf2);
  border-radius: 999px;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;

  &::placeholder {
    color: var(--app-text-muted, #94a3b8);
  }

  &:focus {
    background: var(--app-bg-surface, #fff);
    border-color: var(--app-primary, #2563eb);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.send {
  display: grid;
  flex: none;
  place-items: center;
  width: 44px;
  height: 44px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(140deg, var(--app-primary, #2563eb), var(--app-primary-strong, #1d4ed8));
  border: 0;
  border-radius: 50%;
  box-shadow: 0 8px 18px -10px rgba(37, 99, 235, 0.9);
  transition: transform 0.16s ease, box-shadow 0.16s ease, opacity 0.16s ease;

  svg {
    width: 19px;
    height: 19px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 22px -10px rgba(37, 99, 235, 0.95);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
    box-shadow: none;
  }
}

.composer-tip {
  margin: 0;
  padding: 4px 22px 8px;
  font-size: 11px;
  text-align: center;
  color: var(--app-text-muted, #94a3b8);
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.55;
  }

  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.45);
  }

  50% {
    opacity: 0.6;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0);
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

/* ---------- 响应式 ---------- */
@media (max-width: 900px) {
  .chat-page {
    height: calc(100vh - 80px);
  }

  .chat-body {
    padding: 18px;
  }

  .bubble {
    max-width: 82%;
  }
}

@media (max-width: 720px) {
  .side {
    display: none;
  }

  .composer {
    padding: 12px 14px 0;
  }

  .composer-tip {
    padding: 6px 14px 10px;
  }
}
</style>
