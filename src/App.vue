<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import router from '@/router'
const route = useRoute()

const navRoutes = router.options.routes.filter(route => {
  // 只保留有 name 且不为 redirect 的路由
  return route.name && route.path !== '/'
})
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <span v-for="(item, index) in navRoutes">
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

  <RouterView />
  <div class="user-wrap">
    <img class="user-logo" src="@/assets/user-logo.jpg">
<!--    <div class="user-name">by 南鸢.°</div>-->
    <div class="user-name">by Oct16th_Lcs</div>
  </div>
</template>

<style scoped>
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
</style>
