<template>
  <div class="playground-app">
    <div class="app-sidebar">
      <SessionList 
        :sessions="sessions" 
        :current-session-id="currentSessionId"
        @select="selectSession"
      />
    </div>
    <div class="app-main">
      <ChatWindow 
        v-if="currentSession"
        :session="currentSession"
        :messages="currentMessages"
        @send="sendMessage"
      />
      <div v-else class="empty-state">
        <el-empty description="Select a chat to start messaging" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SessionList from './components/SessionList.vue'
import ChatWindow from './components/ChatWindow.vue'
import { useChat } from './composables/useChat'

const { 
  sessions, 
  currentSessionId, 
  currentSession, 
  currentMessages, 
  selectSession, 
  sendMessage 
} = useChat()

</script>

<style lang="scss" scoped>
.playground-app {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.app-sidebar {
  width: 280px;
  flex-shrink: 0;
  height: 100%;
}

.app-main {
  flex: 1;
  height: 100%;
  min-width: 0;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}
</style>
