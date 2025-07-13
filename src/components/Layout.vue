<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {RouterLink, RouterView, useRoute} from 'vue-router'
import router from "@/router";
import Loader from '@/utils/loader';
import { resourceList } from '@/config'

const route = useRoute()
const navRoutes = router.options.routes.filter(route => {
  // 只保留有 name 且不为 redirect 的路由
  return route.name && route.path !== '/'
})
let animationInterval: number | null = null;
const data = ref({
  loadingComplete: false,
  percent: 0,
})

onMounted(() => {
  const resourceLoader = new Loader();
  resourceLoader.setData(resourceList);
  resourceLoader.on('start', () => {
    data.value.percent = 0;
    data.value.loadingComplete = false;
    animationInterval = window.setInterval(() => {
      if (data.value.percent < 95) {
        data.value.percent += 1;
      }
    }, 20);
  });
  resourceLoader.on('loading', function(event) {
    const progress = Math.floor((event.nowProgress / event.allProgress) * 100);
    data.value.percent = progress;
  });
  resourceLoader.on('complete', function() {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }

    data.value.percent = 100;
    data.value.loadingComplete = true;
  });
  resourceLoader.start();
})
</script>

<template>
  <div class="layout-wrapper">
    <div class="loading" v-if="!data.loadingComplete">
      <span class="progress">{{ data.percent }}%</span>
    </div>
    <div class="layout-content">
      <header>
        <div class="wrapper">
          <nav>
              <span v-for="(item, index) in navRoutes" :key="item.name">
                <RouterLink
                  :key="item.path"
                  :to="item.path"
                  :class="['nav-link', { active: route.path === item.path }]"
                >
                  {{ item.name }}
                </RouterLink>
                <span v-if="index < navRoutes.length - 1" class="divider"> | </span>
              </span>
          </nav>
        </div>
      </header>
      <router-view />
      <div class="user-wrap">
        <img class="user-logo" src="@/assets/user-logo.jpg">
        <!--    <div class="user-name">by 南鸢.°</div>-->
        <div class="user-name">by Oct16th_Lcs</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-wrapper {
  wwidth: 100%;
  height: 100%;
  box-sizing: border-box;
  .loading {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 111;
    background: radial-gradient(at 73.0% 34.0%, hsl(212, 99%, 60%) 0px, transparent 50%),
    radial-gradient(at 42.0% 4.0%, #f2f20a 0px, transparent 50%),
    radial-gradient(at 70.0% 98.0%, hsl(134, 61%, 45%) 0px, transparent 50%),
    radial-gradient(at 30.0% 9.0%, hsl(79, 32%, 37%) 0px, transparent 50%),
    radial-gradient(at 3.0% 39.0%, #2ce61c 0px, transparent 50%),
    #03f692;
    text-align: center;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .progress {
      display: inline-block;
      font-size: 64px;
      color: #FFFFFF;
      text-shadow:
        0 1px 0 hsl(174, 5%, 80%),
        0 2px 0 hsl(174, 5%, 75%),
        0 3px 0 hsl(174, 5%, 70%),
        0 4px 0 hsl(174, 5%, 66%),
        0 5px 0 hsl(174, 5%, 64%),
        0 6px 0 hsl(174, 5%, 62%),
        0 7px 0 hsl(174, 5%, 61%),
        0 8px 0 hsl(174, 5%, 60%),
        0 0 5px rgba(0, 0, 0, 0.05),
        0 1px 3px rgba(0, 0, 0, 0.2),
        0 3px 5px rgba(0, 0, 0, 0.2),
        0 5px 10px rgba(0, 0, 0, 0.2),
        0 10px 10px rgba(0, 0, 0, 0.2),
        0 20px 20px rgba(0, 0, 0, 0.3);
    }
  }
  .layout-content {
    width: 100%;
    height: 100%;
    .wrapper {
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.8);
      padding: 10px;
      nav {
        .nav-link {
          text-decoration: none;
          padding: 8px 15px;
          color: #333;
          transition: color 0.3s ease;

          &:hover,
          &.active {
            color: #ff8282;
          }
        }

        .divider {
          color: #999;
        }
      }
    }
    .user-wrap {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      color: white;
    }

    .user-logo {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}

</style>
