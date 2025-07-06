<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useThree } from '@/hooks/useThree'

// 六张图路径
const cubeUrls = [
  new URL('@/assets/images/living/4_l.jpg', import.meta.url).href,
  new URL('@/assets/images/living/4_r.jpg', import.meta.url).href,
  new URL('@/assets/images/living/4_u.jpg', import.meta.url).href,
  new URL('@/assets/images/living/4_d.jpg', import.meta.url).href,
  new URL('@/assets/images/living/4_b.jpg', import.meta.url).href,
  new URL('@/assets/images/living/4_f.jpg', import.meta.url).href
]

const modelData = {
  id: 'room1',
  modelUrl: '',
  title: '全景房间',
  bg: '', // 不用球形全景图
  cameraPosition: { x: 0, y: 0, z: 2 },
  modePosition: { x: 0, y: 0, z: 0 },
  modeScale: { x: 1, y: 1, z: 1 },
  cameraNear: 0.1,
  cameraFar: 20
}

const { init, updateCubePanorama, destroy, loading } = useThree({
  containerId: 'house360-container'
})

onMounted(() => {
  init(modelData)
  updateCubePanorama(cubeUrls)
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<template>
  <div
    class="container"
    id="house360-container"
    v-loading="loading"
    element-loading-text="数据加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  ></div>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: #f0f0f0;
}
</style>
