<template>
  <div class="ctb-wrapper">
    <Sidebar
      v-model:collapsed="isCollapsed"
      :mobile-open="isMobileOpen"
      @project-click="handleProjectClick"
    />

    <!-- Mobile Overlay -->
    <div 
      class="mobile-overlay" 
      v-if="isMobileOpen" 
      @click="isMobileOpen = false"
    ></div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="header">
        <div class="header-left">
           <button class="sidebar-trigger" @click="toggleSidebar">
             <el-icon><Expand v-if="isCollapsed" /><Fold v-else /></el-icon>
           </button>
           <div class="breadcrumb">
             <span class="crumb-item">Building Your Application</span>
             <el-icon><ArrowRight /></el-icon>
             <span class="crumb-item active">{{ route.meta.title || 'Data Fetching' }}</span>
           </div>
        </div>
        
        <div class="header-actions">
           <el-input
            v-model="searchQuery"
            placeholder="Type to search..."
            class="search-input"
          >
             <template #prefix>
               <el-icon><Search /></el-icon>
             </template>
           </el-input>
        </div>
      </div>

      <StarBorder
        as="div"
        customClass="content-border"
        contentClass="!p-0 !w-full !h-full"
        speed="8s" thickness="4"
      >
        <div class="content-area">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </StarBorder>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowRight, Search, Expand, Fold
} from '@element-plus/icons-vue'
import Sidebar from './components/Sidebar/index.vue'
import StarBorder from './components/common/StarBorder.vue'

defineOptions({
  name: 'CtbIndex'
})

const route = useRoute()

// State
const isCollapsed = ref(false)
const isMobileOpen = ref(false)
const searchQuery = ref('')

// Actions
const toggleSidebar = () => {
  // Simple check for mobile screen width
  if (window.innerWidth < 768) {
    isMobileOpen.value = !isMobileOpen.value
    isCollapsed.value = false // Ensure it's expanded when open on mobile
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}

const handleProjectClick = (item) => {
  // Navigation is handled by SidebarItem component via router.push
  console.log('Project clicked:', item.title)
}
</script>

<style lang="scss" scoped>
// Variables to mimic shadcn theme
$bg-color: #09090b; // Zinc 950
$sidebar-bg: #09090b;
$card-bg: #09090b;
$border-color: #27272a; // Zinc 800
$text-primary: #fafafa; // Zinc 50
$text-secondary: #a1a1aa; // Zinc 400
$hover-bg: #27272a;
$accent-color: #3b82f6; // Blue 500 (used in logo)

.ctb-wrapper {
  display: flex;
  height: 100vh;
  background-color: $bg-color;
  color: $text-primary;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 40;
}

// Main Content Styles
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .header {
    height: 60px;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .sidebar-trigger {
        background: transparent;
        border: none;
        color: $text-secondary;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background: $hover-bg;
          color: $text-primary;
        }
        
        .el-icon {
          font-size: 20px;
        }
      }
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: $text-secondary;

      .el-icon {
        margin: 0 8px;
        font-size: 12px;
      }

      .crumb-item {
        &.active {
          color: $text-primary;
        }
      }
    }

    .header-actions {
      .search-input {
        width: 240px;
        
        :deep(.el-input__wrapper) {
          background-color: $bg-color;
          box-shadow: 0 0 0 1px $border-color;
          
          &.is-focus {
             box-shadow: 0 0 0 1px $text-secondary;
          }
        }
      }
    }
  }

  .content-border {
    flex: 1;
    min-height: 0;
    margin: 16px;
    width: auto; /* 确保不强制 100% 导致 margin 溢出 */
  }

  .content-area {
    height: 100%;
    width: 100%;
    padding: 24px;
    overflow-y: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
