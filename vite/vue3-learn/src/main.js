import './assets/main.css'

// 从 Vue 核心库导入 createApp 函数
// createApp 用于创建 Vue 应用实例
import { createApp } from 'vue'

// 导入 Pinia 状态管理库的 createPinia 函数
// Pinia 是 Vue 官方推荐的状态管理库，用于替代 Vuex
import { createPinia } from 'pinia'

// 导入根组件 App
import App from './App.vue'

// 导入路由配置
// router 包含了应用的路由规则和配置
import router from './router'

// 创建 Vue 应用实例
// 传入 App 作为根组件
const app = createApp(App)

// 使用 Pinia 进行状态管理
// app.use() 方法用于安装 Vue 插件
app.use(createPinia())

// 使用路由系统
// 这将启用路由功能，允许应用根据 URL 变化渲染不同组件
app.use(router)

// 将应用挂载到 DOM 元素上
// '#app' 是一个 CSS 选择器，指向 index.html 中的 <div id="app"></div> 元素
// 这是应用的根 DOM 节点
app.mount('#app')