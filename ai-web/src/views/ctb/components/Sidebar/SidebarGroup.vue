<template>
  <div class="nav-item-group">
    <div class="nav-item" @click="toggle">
      <el-icon><component :is="item.icon" /></el-icon>
      <span v-show="!collapsed">{{ item.title }}</span>
      <el-icon 
        class="arrow-right" 
        v-show="!collapsed"
        :class="{ 'rotated': item.isOpen }"
      >
        <ArrowRight />
      </el-icon>
    </div>
    
    <el-collapse-transition>
      <div class="submenu" v-show="item.isOpen && !collapsed">
        <div 
          v-for="sub in item.children" 
          :key="sub.title" 
          class="submenu-item"
          :class="{ active: route.path === sub.path }"
          @click="handleSubClick(sub)"
          :data-path="sub.path"
        >
          {{ sub.title }}
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ElCollapseTransition } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

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

const emit = defineEmits(['toggle'])

const toggle = () => {
  emit('toggle', props.item)
}

const handleSubClick = (subItem) => {
  if (subItem.path) {
    router.push(subItem.path)
  }
}
</script>

<style lang="scss" scoped>
$text-secondary: #a1a1aa;
$text-primary: #fafafa;
$hover-bg: #27272a;
$border-color: #27272a;
$active-text: #fafafa;

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

  .arrow-right {
    font-size: 18px;
    margin-right: 0;
    margin-left: auto;
    transition: transform 0.2s;

    &.rotated {
      transform: rotate(90deg);
    }
  }
}

.submenu {
  padding-left: 36px;
  border-left: 1px solid $border-color;
  margin-left: 16px;
  overflow: hidden; /* Important for animation */

  .submenu-item {
    padding: 6px 0;
    font-size: 16px;
    color: $text-secondary;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: $text-primary;
    }
  }
}
</style>
