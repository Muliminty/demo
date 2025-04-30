// 导入Vue Router的核心函数
// createRouter: 用于创建路由实例
// createWebHistory: 用于创建HTML5历史模式的路由（使用history.pushState API实现URL变化而无需刷新页面）
import { createRouter, createWebHistory } from 'vue-router'

// 导入首页视图组件，这是一个非懒加载的组件，会在应用启动时立即加载
import HomeView from '../views/HomeView.vue'

// 创建路由实例
const router = createRouter({
  // 设置路由历史模式为HTML5 History模式
  // import.meta.env.BASE_URL 是Vite提供的环境变量，表示应用的基础URL路径
  // 如果应用部署在子路径下（如example.com/my-app/），这个配置可以确保路由正常工作
  history: createWebHistory(import.meta.env.BASE_URL),
  
  // 定义路由表，每个路由对象包含路径、名称和组件等信息
  routes: [
    {
      path: '/', // 路由路径，根路径
      name: 'home', // 路由名称，可用于编程式导航，如router.push({name: 'home'})
      component: HomeView, // 路由对应的组件，这里使用的是直接导入的组件
    },
    {
      path: '/about', // 路由路径，/about
      name: 'about', // 路由名称
      // 路由级代码分割（懒加载）
      // 这会为该路由生成一个单独的代码块（About.[hash].js）
      // 只有当路由被访问时才会加载该组件
      // 这种方式可以提高首屏加载速度，特别是在大型应用中
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// 导出路由实例，供main.js使用
export default router
