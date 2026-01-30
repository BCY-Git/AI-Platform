<template>
  <div class="session-list">
    <div class="search-bar">
      <el-input
        v-model="searchText"
        placeholder="搜索"
        prefix-icon="Search"
        clearable
      />
    </div>
    <el-scrollbar class="list-scroll">
      <div
        v-for="session in filteredSessions"
        :key="session.id"
        class="session-item"
        :class="{ active: currentSessionId === session.id }"
        @click="$emit('select', session.id)"
      >
        <el-badge :value="session.unreadCount" :hidden="session.unreadCount === 0" class="avatar-badge">
          <el-avatar :src="session.avatar" :size="40" shape="square" />
        </el-badge>
        
        <div class="session-info">
          <div class="session-header">
            <span class="session-name">{{ session.name }}</span>
            <span class="session-time" v-if="session.lastMessage">{{ formatTime(session.lastMessage.time) }}</span>
          </div>
          <div class="session-preview" v-if="session.lastMessage">
            {{ session.lastMessage.content }}
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const props = defineProps({
  sessions: {
    type: Array,
    required: true
  },
  currentSessionId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select'])

const searchText = ref('')

const filteredSessions = computed(() => {
  if (!searchText.value) return props.sessions
  return props.sessions.filter(s => s.name.toLowerCase().includes(searchText.value.toLowerCase()))
})

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = dayjs(timestamp)
  const now = dayjs()
  if (date.isSame(now, 'day')) {
    return date.format('HH:mm')
  } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return '昨天'
  } else {
    return date.format('MM-DD')
  }
}
</script>

<style lang="scss" scoped>
.session-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  
  // Dark mode adaptation
  :deep(.dark) & {
    background-color: #18181b; // zinc-900
    border-right-color: #27272a; // zinc-800
  }
}

.search-bar {
  padding: 12px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;

  :deep(.el-input__wrapper) {
    background-color: #e5e5e5;
    box-shadow: none;
  }
}

.list-scroll {
  flex: 1;
}

.session-item {
  display: flex;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e6e6e6;
  }
  
  &.active {
    background-color: #cce7ff; // Active color
    
    // Dark mode active
    :deep(.dark) & {
      background-color: #27272a;
    }
  }
}

.avatar-badge {
  margin-right: 12px;
}

.session-info {
  flex: 1;
  min-width: 0; // For text-overflow
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.session-name {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.session-time {
  font-size: 12px;
  color: #999;
}

.session-preview {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
