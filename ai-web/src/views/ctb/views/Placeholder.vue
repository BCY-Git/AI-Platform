<template>
  <div class="placeholder-container">
    <h1>{{ route.meta.title || 'Page Title' }}</h1>
    <p>Content Placeholder 1</p>
    <p>Content Placeholder 2</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>
.placeholder-container {
  padding: 20px;
  color: #fff;
}
</style>
