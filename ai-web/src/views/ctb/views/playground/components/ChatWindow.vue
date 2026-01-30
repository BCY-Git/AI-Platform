<template>
  <div class="chat-window">
    <div class="chat-header">
      <div class="header-info">
        <h2 class="title">{{ session?.name }}</h2>
        <span class="subtitle" v-if="session?.type === 'group'">Mock Online: 5</span>
      </div>
      <div class="header-actions">
        <el-button link icon="MoreFilled" />
      </div>
    </div>
    
    <div class="chat-content" ref="contentRef">
      <el-scrollbar ref="scrollbarRef">
        <div class="message-list">
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="message-item"
            :class="{ 'is-self': msg.isSelf }"
          >
            <el-avatar :src="msg.avatar" :size="36" class="msg-avatar" />
            <div class="msg-body">
              <div class="msg-meta" v-if="!msg.isSelf">
                <span class="sender-name">{{ msg.senderName }}</span>
                <span class="send-time">{{ formatTime(msg.createdAt) }}</span>
              </div>
              <div class="msg-bubble">
                {{ msg.content }}
              </div>
              <div class="msg-status" v-if="msg.isSelf">
                <span v-if="msg.status === 'sending'">...</span>
                <span v-else-if="msg.status === 'failed'" class="error">!</span>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    
    <div class="chat-footer">
      <div class="toolbar">
        <el-button-group>
          <el-button link icon="Picture" />
          <el-button link icon="Folder" />
          <el-button link icon="VideoCamera" />
        </el-button-group>
      </div>
      <div class="input-area">
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="Enter 发送, Ctrl+Enter 换行"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.ctrl.enter="handleLineBreak"
        />
      </div>
      <div class="footer-actions">
        <span class="tip">Enter 发送</span>
        <el-button type="primary" size="small" @click="handleSend">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { MoreFilled, Picture, Folder, VideoCamera } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const props = defineProps({
  session: {
    type: Object,
    default: () => ({})
  },
  messages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['send'])

const inputText = ref('')
const scrollbarRef = ref(null)

const formatTime = (timestamp) => {
  return dayjs(timestamp).format('HH:mm')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollbarRef.value) {
      const wrap = scrollbarRef.value.wrapRef
      wrap.scrollTop = wrap.scrollHeight
    }
  })
}

const handleSend = () => {
  if (!inputText.value.trim()) return
  emit('send', inputText.value)
  inputText.value = ''
}

const handleLineBreak = (e) => {
  inputText.value += '\n'
}

watch(() => props.messages.length, () => {
  scrollToBottom()
})

watch(() => props.session?.id, () => {
  scrollToBottom()
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
.chat-window {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.chat-header {
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  
  .title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .subtitle {
    font-size: 12px;
    color: #999;
    margin-left: 8px;
  }
}

.chat-content {
  flex: 1;
  overflow: hidden;
  background-color: #f9f9f9;
}

.message-list {
  padding: 20px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  
  &.is-self {
    flex-direction: row-reverse;
    
    .msg-body {
      align-items: flex-end;
    }
    
    .msg-bubble {
      background-color: #95ec69; // WeChat Green
      color: #000;
    }
    
    .msg-avatar {
      margin-left: 10px;
      margin-right: 0;
    }
  }
  
  .msg-avatar {
    margin-right: 10px;
    flex-shrink: 0;
  }
  
  .msg-body {
    display: flex;
    flex-direction: column;
    max-width: 70%;
  }
  
  .msg-meta {
    margin-bottom: 4px;
    font-size: 12px;
    color: #999;
  }
  
  .sender-name {
    margin-right: 8px;
  }
  
  .msg-bubble {
    padding: 10px 14px;
    background-color: #fff;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.5;
    position: relative;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.chat-footer {
  height: 160px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.toolbar {
  padding: 8px 12px;
}

.input-area {
  flex: 1;
  padding: 0 12px;
  
  :deep(.el-textarea__inner) {
    box-shadow: none;
    border: none;
    padding: 0;
    resize: none;
    background: transparent;
    
    &:focus {
      box-shadow: none;
    }
  }
}

.footer-actions {
  padding: 8px 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  
  .tip {
    font-size: 12px;
    color: #ccc;
    margin-right: 10px;
  }
}
</style>
