<!--
 @author Lcs
 @date 2025-07-12 18:17:47
 @description 全景看房
-->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import PanoramaViewer from '@/utils/panoramaViewer';
import { rooms } from '@/config/data.ts'

let viewer: InstanceType<typeof PanoramaViewer> | null = null;

const curRoom = ref('living-room');


onMounted(() => {
  const container = document.getElementById('panorama-container')!;
  viewer = new PanoramaViewer(container);

  // 加载初始全景图
  rooms.map(item => {
    viewer?.loadPanorama(item.name, item.position, item.url);
  })
  viewer.render();
});

function handleSwitchRoom(roomKey: string) {
  const targetRoom = rooms.find(room => room.key === roomKey);
  if (targetRoom && viewer) {
    curRoom.value = roomKey;
    viewer.switchToRoom(targetRoom.name); // 切换到目标房间
  }
}
//
// function updateCamera() {
//   viewer.updateCameraPosition(0, 0, 0);
// }

onBeforeUnmount(() => {
  viewer?.destroy();
  viewer = null!;
});
</script>

<template>
  <div id="panorama-container"></div>
  <!-- 场景切换点 -->
  <div class="switch">
    <span class="button" v-for="(room, index) in rooms" :key="index" @click="handleSwitchRoom(room.key)" v-show="room.key !== curRoom">
      <b class="text">{{ room.name }}</b>
      <i class="icon"></i>
    </span>
  </div>
</template>

<style scoped lang="scss">
@import url('@/assets/styles/keyframes.scss');
#panorama-container {
  width: 100%;
  height: 100%;
}
.switch {
  position: fixed;
  right: 24px;
  top: 40%;
  z-index: 11;
  -webkit-animation: slideInRight 1s .3s;
  animation: slideInRight 1s .3s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  .button {
    background: rgba(27,25,24,.5);
    border-radius: 12px;
    display: flex;
    align-items: center;
    padding: 12px 8px 12px 24px;
    -webkit-backdrop-filter: blur(4px);
    -moz-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    cursor: pointer;
    transition: all .25s ease-in-out;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    &:hover {
      background: rgba(27, 25, 24, .2);
      box-shadow: 1px 1px 2px rgba(0, 0, 0, .2);
    }
    .text {
      color: rgba(255, 255, 255, 1);
      font-size: 24px;
      font-weight: 600;
    }
    .icon {
      display: inline-block;
      width: 30px;
      height: 30px;
      background: url("@/assets/images/panorama/device/icon_arrow.png") no-repeat center;
      background-size: 100% 100%;
      transform: rotate(180deg);
      margin-left: 8px;
    }
  }
}
</style>
