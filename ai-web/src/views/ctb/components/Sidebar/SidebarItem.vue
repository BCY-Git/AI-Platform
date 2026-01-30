<template>
  <div
    v-if="hasPermission"
    class="nav-item"
    :class="{ active: isActive }"
    @click="handleClick"
    :data-path="item.path"
  >
    <el-icon><component :is="item.icon" /></el-icon>
    <span v-show="!collapsed">{{ item.title }}</span>
    
    <!-- Extra slot for things like dropdowns (used in Projects) -->
    <slot name="extra" v-if="!collapsed"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const hasPermission = computed(() => {
  if (!props.item.permission) return true
  // Check for super admin wildcard or specific permission
  return userStore.getPermissions?.has('*:*:*') || userStore.getPermissions?.has(props.item.permission)
})

const isActive = computed(() => {
  if (props.item.active) return true
  if (!props.item.path) return false
  // Simple exact match for now, can be improved to startsWith if needed
  return route.path === props.item.path
})

const handleClick = () => {
  if (props.item.path) {
    if (props.item.openWindow) {
      const url = props.item.path.startsWith('http')
        ? props.item.path
        : router.resolve(props.item.path).href
      // Use a specific name to try to reuse the window if possible, or _blank
      window.open(url, 'ctb-playground-window', props.item.windowFeatures || 'width=1200,height=800,menubar=no,toolbar=no')
    } else if (props.item.path.startsWith('http')) {
      window.open(props.item.path, '_blank')
    } else {
      // Use router.push, catch errors if route doesn't exist
      router.push(props.item.path).catch(err => {
        console.warn('Navigation failed:', err)
      })
    }
  }
  emit('click', props.item)
}
</script>

<style lang="scss" scoped>
$text-secondary: #a1a1aa;
$text-primary: #fafafa;
$hover-bg: #27272a;

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  color: $text-secondary;
  transition: all 0.2s;
  margin-bottom: 2px;
  position: relative;

  &:hover {
    background-color: $hover-bg;
    color: $text-primary;
    
    :deep(.more-actions) {
      opacity: 1;
    }
  }

  &.active {
    background-color: transparent; // Disable default active background for Gooey effect
    color: #000000; // Change text to black to contrast with the white Gooey blob
    // Ensure text is above the gooey effect
    z-index: 2;
    font-weight: 500;
    
    // Override hover when active
    &:hover {
      background-color: transparent;
      color: #000000;
    }
  }
  
  // Ensure z-index context
  z-index: 2;

  .el-icon {
    font-size: 18px;
    margin-right: 12px;
  }

  span {
    font-size: 18px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
