<!--
 @author Lcs
 @date 2025-07-12 18:17:47
 @description 全景看房
-->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, nextTick } from 'vue';
import PanoramaViewer from '@/utils/panoramaViewer';
import { rooms } from '@/config/data.ts'
import type { Vector3 } from 'three'
import { ElMessage } from 'element-plus'

interface InteractivePoint {
  key: string;
  value: string;
  description: string;
  cover: string;
  position: Vector3;
}

interface InteractivePointWithRoom extends InteractivePoint {
  room: string;
}

let viewer: InstanceType<typeof PanoramaViewer> | null = null;

const curRoom = ref('living-room');

const interactivePoints = computed(() => {
  const res: InteractivePointWithRoom[] = []
  rooms.forEach(room => {
    if (room.interactivePoints && room.interactivePoints.length > 0) {
      room.interactivePoints.forEach(point => {
        res.push({
          ...point,
          room: room.key,
        });
      })
    }
  })
  return res;
});


onMounted(async () => {
  const container = document.getElementById('panorama-container')!;
  viewer = new PanoramaViewer(container);

  // 加载初始全景图
  rooms.map(item => {
    viewer?.loadPanorama(item.name, item.position, item.url);
  })

  // 设置交互点
  viewer.setInteractivePoints(interactivePoints.value);

  // 等待 DOM 渲染完成后再绑定元素
  await nextTick();
  const elements = document.querySelectorAll('.point');
  elements.forEach((el, index) => {
    if (viewer && viewer['interactivePoints'][index]) {
      viewer['interactivePoints'][index].element = el as HTMLElement;
    }
  });
  viewer.render();
});

function handleSwitchRoom(roomKey: string) {
  const targetRoom = rooms.find(room => room.key === roomKey);
  if (targetRoom && viewer) {
    curRoom.value = roomKey;
    viewer.switchToRoom(targetRoom.name); // 切换到目标房间
  }
}

const handleReactivePointClick = (point) => {
  ElMessage(`您点击了${point.value}`)
};

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
  <!-- 交互点 -->
  <div
    class="point"
    v-for="(point, index) in interactivePoints"
    :key="index"
    :class="[`point-${index}`, `point-${point.key}`]"
    @click="handleReactivePointClick(point)"
    v-show="point.room === curRoom"
  >
    <div class="label" :class="[`label-${index}`, `label-${point.key}`]">
      <label class="label-tips">
        <div class="cover">
          <i
            class="icon"
            :style="{
                background: `url(${point.cover}) no-repeat center`,
                'background-size': 'contain',
              }"
          ></i>
        </div>
        <div class="info">
          <p class="p1">{{ point.value }}</p>
          <p class="p2">{{ point.description }}</p>
        </div>
      </label>
    </div>
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
.point {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 10;

  .label {
    position: absolute;
    top: -16px;
    left: -16px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 32px;
    font-weight: 100;
    font-size: 14px;
    cursor: help;
    transform: scale(0, 0);
    transition: all 0.3s ease-in-out;
    backdrop-filter: blur(4px);

    &::before,
    &::after {
      content: '';
      display: inline-block;
      background: rgba(255, 255, 255, 1);
      height: 100%;
      width: 100%;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -10px;
      margin-top: -10px;
    }

    &::before {
      animation: bounce-wave 1.5s infinite;
    }

    &::after {
      animation: bounce-wave 1.5s -0.4s infinite;
    }

    .label-tips {
      height: 88px;
      width: 200px;
      overflow: hidden;
      position: absolute;
      top: -32px;
      right: -220px;
      font-size: 32px;
      background: rgba(255, 255, 255, 0.6);
      border: 1px groove rgba(255, 255, 255, 0.5);
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
      border-radius: 16px;
      display: flex;
      cursor: move;
      justify-content: space-between;
      align-content: center;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);

      .cover {
        width: 80px;
        height: 100%;

        .icon {
          display: inline-block;
          height: 100%;
          width: 100%;
          filter: drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.1));
        }
      }

      .info {
        width: calc(100% - 80px);
        height: 100%;
        overflow: hidden;
        padding-left: 12px;

        p {
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

          &.p1 {
            font-size: 24px;
            color: #1d1f24;
            font-weight: 800;
            margin: 12px 0 2px;
          }

          &.p2 {
            font-size: 18px;
            color: #00aa47;
            font-weight: 500;
          }
        }
      }
    }

    &.label-sofa {
      .label-tips {
        left: -220px;
        flex-direction: row-reverse;

        .info {
          padding: 0 12px 0 0;

          p {
            text-align: right;
          }
        }
      }
    }
  }

  .text {
    position: absolute;
    top: 30px;
    left: -120px;
    width: 200px;
    padding: 20px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid #ffffff;
    color: #ffffff;
    line-height: 1.3em;
    font-weight: 100;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    text-align: justify;
    text-align-last: left;
  }

  &:hover .text {
    opacity: 1;
  }

  &.visible .label {
    transform: scale(1, 1);
  }
}

@keyframes bounce-wave {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3.6);
    opacity: 0;
  }
}

</style>
