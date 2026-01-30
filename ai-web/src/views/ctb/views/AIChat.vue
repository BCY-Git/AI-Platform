<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="chat-title">
        <el-icon><ChatDotSquare /></el-icon>
        <span>AI工作流</span>
      </div>
      <div class="chat-actions">
        <el-select v-model="currentModel" class="model-select" placeholder="选择模型" size="small">
          <el-option v-for="m in models" :key="m.value" :label="m.label" :value="m.value" />
        </el-select>
        <el-popover placement="bottom-end" width="320" trigger="click">
          <template #reference>
            <el-button type="default" size="small">
              <el-icon><Setting /></el-icon>
              <span style="margin-left:6px">设置</span>
            </el-button>
          </template>
          <div class="settings">
            <div class="setting-item">
              <div class="label">API Key</div>
              <el-input v-model="apiKey" placeholder="输入你的 API Key" />
            </div>
            <div class="setting-item">
              <div class="label">Base URL</div>
              <el-input v-model="baseUrl" placeholder="如 https://api.openai.com" />
            </div>
            <div class="setting-item">
              <div class="label">模型标识</div>
              <el-input v-model="currentModel" placeholder="如 gpt-4o-mini / moonshot-v1-32k" />
            </div>
            <el-button type="primary" size="small">已保存</el-button>
          </div>
        </el-popover>
      </div>
    </div>
    <el-scrollbar class="chat-messages">
      <div v-for="msg in messages" :key="msg.id" class="message" :class="msg.role">
        <div class="avatar">
          <el-avatar :size="28" v-if="msg.role==='assistant'" src="https://cdn-icons-png.flaticon.com/512/4712/4712107.png" />
          <el-avatar :size="28" v-else src="https://avatars.githubusercontent.com/u/0?v=4" />
        </div>
        <div class="bubble">
          <div class="content" v-html="msg.content"></div>
        </div>
      </div>
      <div v-if="messages.length===0" class="chat-empty">
        <div class="empty-title">欢迎使用 AI 工作流</div>
        <div class="empty-sub">问我任何问题，或选择下方示例快速开始</div>
        <div class="suggestions">
          <div class="suggestion" @click="quickAsk('帮我写一段介绍公司业务的文案')">帮我写一段介绍公司业务的文案</div>
          <div class="suggestion" @click="quickAsk('把这段文字整理成待办清单')">把这段文字整理成待办清单</div>
          <div class="suggestion" @click="quickAsk('解释这段代码做了什么')">解释这段代码做了什么</div>
          <div class="suggestion" @click="quickAsk('生成一个周报模板')">生成一个周报模板</div>
        </div>
      </div>
    </el-scrollbar>
    <div class="chat-input">
      <el-input
        v-model="draft"
        class="input"
        :autosize="{ minRows: 1, maxRows: 4 }"
        type="textarea"
        placeholder="输入消息，按 Enter 发送，Shift+Enter 换行"
        @keydown.enter.prevent="handleEnter"
      />
      <el-button type="primary" class="send-btn" :disabled="!draft.trim()" @click="send">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { ChatDotSquare, Setting } from '@element-plus/icons-vue'

const messages = ref([])
const draft = ref('')
const models = [
  { label: 'ZhipuAI: glm-4', value: 'glm-4' },
  { label: 'ZhipuAI: glm-4-plus', value: 'glm-4-plus' },
  { label: 'ZhipuAI: glm-4-flash', value: 'glm-4-flash' },
  { label: 'OpenAI: gpt-4o-mini', value: 'gpt-4o-mini' },
  { label: 'Kimi: moonshot-v1-32k', value: 'moonshot-v1-32k' },
  { label: 'Doubao: doubao-lite-4k', value: 'doubao-lite-4k' }
]
const currentModel = ref(models[0].value)
const apiKey = ref('27b3c0ce73224bf1a83d9a5d8427e383.0nDkT61DTUKAtKIT')
const baseUrl = ref('/zhipu-api/api/paas/v4')
const isStreaming = ref(false)
let abortCtrl = null

const send = async () => {
  const text = draft.value.trim()
  if (!text) return
  if (!apiKey.value) {
    ElMessage.error('请先在设置中填写 API Key')
    return
  }
  messages.value.push({
    id: Date.now() + '-u',
    role: 'user',
    content: text
  })
  draft.value = ''
  const aId = Date.now() + '-a'
  messages.value.push({
    id: aId,
    role: 'assistant',
    content: ''
  })
  isStreaming.value = true
  abortCtrl = new AbortController()
  const payload = {
    model: currentModel.value,
    stream: true,
    messages: messages.value.map(m => ({ role: m.role, content: m.content }))
  }
  try {
    // 自动处理 URL 结尾的斜杠，并移除硬编码的 /v1
    const url = baseUrl.value.replace(/\/$/, '') + '/chat/completions'
    
    await fetchEventSource(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.value}`
      },
      body: JSON.stringify(payload),
      signal: abortCtrl.signal,
      onopen(res) {
        if (res.ok) return
        // 尝试读取错误信息
        if (res.status === 401) {
          throw new Error('API Key 无效或过期')
        }
        if (res.status === 404) {
          throw new Error('接口地址错误 (404)')
        }
        throw new Error(`连接失败: ${res.status} ${res.statusText}`)
      },
      onmessage(ev) {
        if (!ev.data || ev.data === '[DONE]') {
          isStreaming.value = false
          return
        }
        try {
          const json = JSON.parse(ev.data)
          const delta = json?.choices?.[0]?.delta?.content || json?.choices?.[0]?.message?.content || ''
          if (delta) {
            const last = messages.value[messages.value.length - 1]
            if (last && last.id === aId) last.content += delta
          }
        } catch {}
      },
      onerror(err) {
        isStreaming.value = false
        console.error('SSE Error:', err)
        ElMessage.error(err.message || '对话请求失败')
        throw err
      }
    })
  } catch (e) {
    isStreaming.value = false
    // ElMessage 在 onerror 中已经触发过一次，这里避免重复触发，除非是 fetch 还没开始就挂了
    if (!e?.message?.includes('连接失败') && !e?.message?.includes('API Key')) {
       console.error(e)
    }
  }
}

const handleEnter = (e) => {
  if (e.shiftKey) return
  send()
}

const quickAsk = (text) => {
  draft.value = text
  send()
}
</script>

<style lang="scss" scoped>
$bg-color: #09090b; // Zinc 950
$hover-bg: #27272a;
$border-color: #27272a; // Zinc 800
$text-primary: #fafafa; // Zinc 50
$text-secondary: #a1a1aa; // Zinc 400

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
}
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid $border-color;
  border-radius: 12px;
  background-color: $hover-bg;
}
.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.model-select {
  width: 160px;
}
.chat-messages {
  flex: 1;
  border: 1px solid $border-color;
  border-radius: 12px;
  background-color: $hover-bg;
  padding: 16px;
}
.settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.settings .setting-item .label {
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: 6px;
}
.message {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}
.message .avatar {
  flex-shrink: 0;
}
.message .bubble {
  max-width: 70%;
  border: 1px solid $border-color;
  border-radius: 12px;
  padding: 10px 12px;
  line-height: 1.6;
  background-color: $bg-color;
}
.message.user .bubble {
  border-color: $border-color;
  background-color: $bg-color;
}
.message.assistant .bubble {
  border-color: $border-color;
  background-color: $hover-bg;
}
.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
  color: $text-secondary;
}
.chat-empty .empty-title {
  font-size: 18px;
  color: $text-primary;
}
.chat-empty .suggestions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 680px;
  margin-top: 6px;
}
.chat-empty .suggestion {
  padding: 10px 12px;
  border: 1px solid $border-color;
  border-radius: 10px;
  cursor: pointer;
  background-color: $bg-color;
  color: $text-primary;
  transition: background-color 0.2s;
}
.chat-empty .suggestion:hover {
  background-color: $hover-bg;
}
.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}
.chat-input .input {
  flex: 1;
  :deep(.el-textarea__inner) {
    background-color: $bg-color;
    border-radius: 10px;
    border: 1px solid $border-color;
    color: $text-primary;
  }
}
.send-btn {
  align-self: stretch;
}
</style>
