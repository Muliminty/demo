// 从 Vue 核心库导入响应式 API
import { ref, computed } from 'vue'
// 从 Pinia 导入 defineStore 函数，用于创建状态存储
import { defineStore } from 'pinia'

// 定义并导出一个名为 'counter' 的状态存储
// 使用组合式 API 风格（Composition API）创建 store
export const useCounterStore = defineStore('counter', () => {
  // 创建一个响应式状态变量 count，初始值为 0
  // ref() 使变量具有响应式，当它变化时会自动更新相关视图
  const count = ref(0)
  
  // 创建一个计算属性 doubleCount，返回 count 的两倍值
  // computed() 会缓存计算结果，只有依赖项变化时才会重新计算
  const doubleCount = computed(() => count.value * 2)
  
  // 定义一个方法用于增加计数器的值
  // 这是一个 action，用于修改状态
  function increment() {
    count.value++
  }

  // 返回需要暴露给组件使用的状态和方法
  // 这些将可以在组件中通过 store 实例访问
  return { count, doubleCount, increment }
})
