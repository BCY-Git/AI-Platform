<template>
  <component :is="as"
    :class="['relative inline-block overflow-hidden !bg-transparent !border-none !rounded-[20px]', customClass]"
    v-bind="restAttrs" :style="componentStyle">
    <div
      class="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
      :style="{
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animationDuration: speed
      }"></div>

    <div
      class="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
      :style="{
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animationDuration: speed
      }"></div>

    <div
      class="relative z-10 border border-[#333] bg-[#0b0b0b] text-white text-[16px] text-left"
      :class="[defaultContentClass, contentClass]">
      <slot></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

interface StarBorderProps {
  as?: string;
  customClass?: string;
  contentClass?: string; // New prop for inner content styling
  color?: string;
  speed?: string;
  thickness?: number;
  left?: string;
  right?: string;
}

const props = withDefaults(defineProps<StarBorderProps>(), {
  as: 'button',
  customClass: '',
  contentClass: '',
  color: 'white',
  speed: '6s',
  thickness: 2,
});

const defaultContentClass = 'px-[64px] py-[6px]'; // Default padding moved here


const restAttrs = useAttrs();

const componentStyle = computed(() => {
  const base = {
    padding: `${props.thickness}px 0`,
    left: props.left,
    right: props.right,
    position: 'relative'
  };
  const userStyle = (restAttrs.style as Record<string, string>) || {};
  return { ...base, ...userStyle };
});
</script>

<style scoped>
@keyframes star-movement-bottom {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  100% {
    /* 从右向左移动：结合right偏移量，精准到指定像素 */
    transform: translate(calc(-100% + var(--star-right)), 0);
    opacity: 0;
  }
}

@keyframes star-movement-top {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  100% {
    /* 从左向右移动：结合left偏移量，精准到指定像素 */
    transform: translate(calc(100% - var(--star-left)), 0);
    opacity: 0;
  }
}

.animate-star-movement-bottom {
  animation: star-movement-bottom linear infinite;
  --star-right: 0px; /* CSS变量：接收右侧偏移量 */
}

.animate-star-movement-top {
  animation: star-movement-top linear infinite;
  --star-left: 0px; /* CSS变量：接收左侧偏移量 */
}
</style>
