<template>
  <ClickSpark spark-color="#ff6b6b" :spark-size="12" :spark-radius="25" :spark-count="12" :duration="600"
    easing="ease-out" :extra-scale="1.2" class="sidebar" :class="{ 'collapsed': collapsed, 'mobile-open': mobileOpen }">
    
    <div class="sidebar-header">
      <el-dropdown trigger="click" class="user-dropdown">
        <div class="user-profile">
          <div class="user-info" v-show="!collapsed">
            <span class="user-name">BCY测试</span>
            <span class="user-email">www.xrkj.com</span>
          </div>
          <el-avatar :size="32" src="https://github.com/shadcn.png" />
          <el-icon class="sort-icon" v-show="!collapsed">
            <Sort />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div class="flex items-center gap-2">
                <el-avatar :size="24" src="https://github.com/shadcn.png" />
                <div class="flex flex-col">
                  <span class="text-xs font-medium">shadcn</span>
                  <span class="text-xs text-gray-500">m@example.com</span>
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-icon>
                <User />
              </el-icon>
              Account
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon>
                <CreditCard />
              </el-icon>
              Billing
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon>
                <Bell />
              </el-icon>
              Notifications
            </el-dropdown-item>
            <el-dropdown-item divided>Log out</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="sidebar-content">
      <!-- Platform Group -->
      <div class="nav-group">
        <StarBorder as="div" color="white" speed="8s" thickness="2" class="group-title-wrapper">
          <div class="group-title" v-show="!collapsed">XRKJ-Playground</div>
        </StarBorder>
        <!-- Simple Items -->
        <SidebarItem v-for="item in platformMainItems" :key="item.title" :item="item" :collapsed="collapsed"
          @click="handleMainItemClick" />

        <!-- Collapsible Items -->
        <SidebarGroup v-for="item in platformSubItems" :key="item.title" :item="item" :collapsed="collapsed"
          @toggle="handleSubMenuToggle" />
      </div>

      <!-- Projects Group -->
      <div class="nav-group">
        <StarBorder as="div" color="white" speed="8s" thickness="2" class="group-title-wrapper">
          <div class="group-title" v-show="!collapsed">XRKJ-Projects</div>
        </StarBorder>
        <SidebarItem v-for="item in projectItems" :key="item.title" :item="item" :collapsed="collapsed"
          @click="handleProjectItemClick">
          <template #extra>
            <el-dropdown trigger="click" class="more-actions" @click.stop>
              <span class="el-dropdown-link">
                <el-icon>
                  <MoreFilled />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>View Project</el-dropdown-item>
                  <el-dropdown-item>Settings</el-dropdown-item>
                  <el-dropdown-item divided>Delete Project</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </SidebarItem>

        <div class="nav-item">
          <el-icon>
            <MoreFilled />
          </el-icon>
          <span v-show="!collapsed">More</span>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="nav-item">
        <el-icon>
          <HelpFilled />
        </el-icon>
        <span v-show="!collapsed">Support</span>
      </div>
      <div class="nav-item">
        <el-icon>
          <ChatDotSquare />
        </el-icon>
        <span v-show="!collapsed">Feedback</span>
      </div>
    </div>
  </ClickSpark>
</template>

<script setup>
import { ref } from 'vue'
import ClickSpark from '@/views/ctb/components/common/ClickSpark.vue'
import StarBorder from '@/views/ctb/components/common/StarBorder.vue'
import {
  Sort, MoreFilled, HelpFilled, ChatDotSquare,
  User, CreditCard, Bell
} from '@element-plus/icons-vue'
import SidebarItem from './SidebarItem.vue'
import SidebarGroup from './SidebarGroup.vue'
import {
  platformMainItems as initialPlatformMainItems,
  platformSubItems as initialPlatformSubItems,
  projectItems as initialProjectItems
} from './sidebar.config'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  mobileOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:collapsed', 'project-click'])

// State
const platformMainItems = ref(initialPlatformMainItems)
const platformSubItems = ref(initialPlatformSubItems)
const projectItems = ref(initialProjectItems)

// Methods
const handleMainItemClick = (item) => {
  // Navigation is handled by SidebarItem via router
  // We can add other logic here if needed (e.g. close mobile sidebar)
}

const handleSubMenuToggle = (item) => {
  if (props.collapsed) {
    emit('update:collapsed', false)
    setTimeout(() => { item.isOpen = true }, 200)
  } else {
    item.isOpen = !item.isOpen
  }
}

const handleProjectItemClick = (item) => {
  emit('project-click', item)
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

.sidebar {
  width: 260px;
  background-color: $sidebar-bg;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  transition: width 0.3s ease, transform 0.3s ease;
  flex-shrink: 0;
  z-index: 50;
  height: 100%; // Ensure it takes full height of parent
  // position: relative; // 新增：关键！让canvas绝对定位基于侧边栏
  overflow: visible; // 新增：防止火花超出侧边栏时被裁剪

  &.collapsed {
    width: 70px;
    padding: 16px 8px;

    .org-trigger {
      justify-content: center;
      padding: 8px 0;
    }

    .user-profile {
      justify-content: center;

      .el-avatar {
        margin-right: 0;
      }
    }

    // Hide text in collapsed mode for generic items not handled by components
    .nav-item>span {
      display: none;
    }
  }

  // Mobile styles
  @media (max-width: 768px) {
    position: fixed;
    height: 100%;
    transform: translateX(-100%);
    width: 260px; // Always full width on mobile when open
    top: 0;
    left: 0;

    &.mobile-open {
      transform: translateX(0);
    }
  }

  .sidebar-header {
    margin-bottom: 24px;

    .user-dropdown {
      width: 100%;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: $hover-bg;
        color: $text-primary;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;

        .user-name {
          font-weight: 600;
          font-size: 20px;
          color: $text-primary;
        }

        .user-email {
          font-size: 18px;
          color: $text-secondary;
        }
      }

      .sort-icon {
        color: $text-secondary;
      }
    }
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    /* Hide scrollbar */
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .nav-group {
      margin-bottom: 24px;

      .group-title {
        font-size: 22px;
        color: $text-secondary;
        font-weight: 600;
        margin-bottom: 8px;
        text-align: left; // 修复笔误：补全为完整的左对齐属性
        padding: 0; // 清除标题自身内边距，避免左侧空白
        margin: 0 0 8px 0; // 仅保留底部8px间距，左右/顶部无间距
        line-height: 1; // 避免垂直多余空白，让标题更紧凑

      }

      // Generic nav item styles for items not using SidebarItem component (like "More")
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
        }

        .el-icon {
          font-size: 20px;
          margin-right: 12px;
        }

        span {
          font-size: 14px;
        }
      }
    }
  }

  .sidebar-footer {
    border-top: 1px solid $border-color;
    padding-top: 16px;

    .nav-item {
      display: flex;
      align-items: center;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      color: $text-secondary;
      transition: all 0.2s;

      &:hover {
        background-color: $hover-bg;
        color: $text-primary;
      }

      .el-icon {
        font-size: 18px;
        margin-right: 12px;
      }

      span {
        font-size: 14px;
      }
    }


  }
}

.group-title-wrapper {
  display: block;
  width: 100%;
  line-height: inherit;
  padding: 0;

  :deep(.relative.z-10) {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}
</style>
