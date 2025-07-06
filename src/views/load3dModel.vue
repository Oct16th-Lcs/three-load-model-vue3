/**
* @author Lcs
* @date 2025/05/05 18:05
* @Description: 3D模型
*/
<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { useThree } from '@/hooks/useThree'
import { useThreeStore } from '@/stores/threeStore'
import pImg21 from '@/assets/images/panorama/pImg21.png'
import pImg20 from '@/assets/images/panorama/pImg20.png'
import pImg8 from '@/assets/images/panorama/pImg8.png'

const threeStore = useThreeStore()
const modelList = [
  {
    id: '01',
    modelUrl: "model/武士刀.glb",
    title: "武士刀",
    bg: pImg21,
    cameraPosition: { // 相机位置
      x: -10,
      y: 5,
      z: 10
    },
    modePosition: { // 模型位置
      x: 2,
      y: 0,
      z: -5
    },
    modeScale: { // 模型缩放
      x: 20,
      y: 20,
      z: 20
    }
  },
  {
    id: '02',
    modelUrl: "model/左轮手枪.glb",
    title: "左轮手枪",
    bg: pImg20,
    cameraPosition: { // 相机位置
      x: 0,
      y: 50,
      z: 100
    },
    modePosition: { // 模型位置
      x: 0,
      y: 0,
      z: 0
    },
    modeScale: { // 模型缩放
      x: 0.1,
      y: 0.1,
      z: 0.1
    }
  },
  {
    id: '03',
    modelUrl: "model/dji-mini-2.glb",
    title: "大疆 Mini 2",
    bg: pImg8,
    cameraPosition: { // 相机位置
      x: -10,
      y: 30,
      z: 10
    },
    modePosition: { // 模型位置
      x: 5,
      y: -280,
      z: -10
    },
    modeScale: { // 模型缩放
      x: 150,
      y: 150,
      z: 150
    }
  },
  // {
  //   id: '04',
  //   title: '全景看房'
  // }
]
const curActive = ref(0)

const { init, updateModel, updatePanorama, updateCamera, destroy, loading } = useThree({
  containerId: 'container',
  // onModelLoaded: () => {
  //   threeStore.setLoading(false)
  // },
  // onError: () => {
  //   threeStore.setLoading(false)
  // }
})

// watchEffect(() => {
//   threeStore.setLoading(loading.value)
// })

function toggleModel(item: typeof modelList[0], index: number) {
  curActive.value = index
  updatePanorama(item.bg)
  updateCamera(item)
  updateModel(item)
}

onMounted(() => {
  init(modelList[0])
  updatePanorama(modelList[0].bg)
  updateCamera(modelList[0])
  updateModel(modelList[0])
})

onBeforeUnmount(() => {
  destroy()
})

</script>

<template>
<div class="model-wrapper">
  <div class="three-wrapper"
       v-loading="loading"
       element-loading-text="数据加载中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <div id="container"></div>
  </div>
  <!--切换盒子-->
  <div class="toggle-wrapper">
    <el-button
      type="primary"
      class="toggle-btn"
      :class="{active: curActive === index }"
      v-for="(item, index) in modelList"
      :key="index"
      @click="toggleModel(item, index)"
    >{{ item.title }}</el-button>
  </div>
</div>
</template>

<style scoped lang="scss">
.model-wrapper {
  width: 100%;
  height: 100%;
  .three-wrapper {
    height: 100%;
    width: 100%;
    #container {
      width: 100%;
      height: 100%;
    }
  }
  .toggle-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    background-color: rgba(255, 255, 255, 0.8);

    .toggle-btn {
      border-radius: 0;
      width: 100%;
      margin-left: 0;
      margin-top: 10px;
      &:first-of-type {
        margin-top: 0;
      }
      &.active {
        background-color: #ff8282;
        border: #ff8282;
        color: white;
      }
    }
  }
}
</style>
