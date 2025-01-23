# Svelte 待办事项清单 - 新手学习项目

欢迎来到 Svelte 待办事项清单项目！这是一个非常适合新手学习的练习项目，帮助你从零开始搭建一个简单的待办事项应用。通过这个项目，你将学习 Svelte 的基本概念，如组件、状态管理、事件处理等。

## 项目目标

- 学习如何使用 Svelte 创建一个简单的 Web 应用。
- 理解 Svelte 的组件化开发模式。
- 掌握状态管理和事件处理的基本方法。
- 通过实践提升前端开发技能。

## 项目功能

- **添加任务**：输入任务内容并添加到列表中。
- **完成任务**：通过复选框标记任务为已完成。
- **删除任务**：支持删除单个任务。
- **清空所有任务**：一键清空所有任务。
- **任务统计**：显示剩余任务和已完成任务的数量。
- **回车键支持**：在输入框中按回车键即可添加任务。
- **空状态提示**：当没有任务时，显示友好的提示信息。

---

## 从零开始搭建项目

### 1. 环境准备

在开始之前，请确保你的电脑上已经安装了以下工具：

- [Node.js](https://nodejs.org/)（建议使用最新版本）
- 一个代码编辑器（如 [VS Code](https://code.visualstudio.com/)）

### 2. 创建 Svelte 项目

打开终端，运行以下命令来创建一个新的 Svelte 项目：

```bash
npx degit sveltejs/template svelte-todolist
cd svelte-todolist
npm install
```

- `npx degit sveltejs/template svelte-todolist`：从 Svelte 官方模板创建一个新项目。
- `cd svelte-todolist`：进入项目目录。
- `npm install`：安装项目依赖。

### 3. 运行开发服务器

安装完成后，运行以下命令启动开发服务器：

```bash
npm run dev
```

打开浏览器并访问 `http://localhost:5000`，你会看到一个默认的 Svelte 欢迎页面。

---

## 实现待办事项清单

接下来，我们将一步步实现待办事项清单的核心功能。

### 1. 创建 `TodoList.svelte` 组件

在 `src/` 目录下创建一个新文件 `TodoList.svelte`，并添加以下代码：

```svelte
<!-- src/TodoList.svelte -->
<script>
    let todos = []; // 存储任务列表
    let newTodo = ''; // 存储新任务的输入内容

    // 添加任务
    function addTodo() {
        if (newTodo.trim() !== '') {
            todos = [...todos, { text: newTodo, completed: false }];
            newTodo = ''; // 清空输入框
        }
    }

    // 切换任务完成状态
    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        todos = todos; // 触发更新
    }

    // 删除任务
    function removeTodo(index) {
        todos.splice(index, 1);
        todos = todos; // 触发更新
    }

    // 清空所有任务
    function clearAll() {
        todos = [];
    }

    // 按回车键添加任务
    function handleKeydown(event) {
        if (event.key === 'Enter') {
            addTodo();
        }
    }

    // 计算未完成和已完成的任务数量
    $: remaining = todos.filter(todo => !todo.completed).length;
    $: completed = todos.length - remaining;
</script>

<style>
    /* 样式代码省略，参考完整代码 */
</style>

<div class="container">
    <h1>待办事项清单</h1>

    <!-- 输入框和添加按钮 -->
    <div class="input-group">
        <input
            bind:value={newTodo}
            placeholder="添加一个新任务"
            on:keydown={handleKeydown}
        />
        <button on:click={addTodo}>添加</button>
    </div>

    <!-- 任务列表 -->
    <ul>
        {#each todos as todo, index}
            <li class:completed={todo.completed}>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    on:change={() => toggleTodo(index)}
                />
                <span class="task-text">{todo.text}</span>
                <div class="task-actions">
                    <button on:click={() => removeTodo(index)}>删除</button>
                </div>
            </li>
        {:else}
            <div class="empty-state">暂无任务，请添加一个新任务！</div>
        {/each}
    </ul>

    <!-- 任务统计 -->
    <div class="stats">
        <span>剩余 {remaining} 个任务</span> |
        <span>已完成 {completed} 个任务</span>
    </div>

    <!-- 清空所有任务按钮 -->
    {#if todos.length > 0}
        <button class="clear-all" on:click={clearAll}>清空所有任务</button>
    {/if}
</div>
```

### 2. 在 `App.svelte` 中使用 `TodoList` 组件

打开 `src/App.svelte`，将其内容替换为以下代码：

```svelte
<!-- src/App.svelte -->
<script>
    import TodoList from './TodoList.svelte';
</script>

<main>
    <TodoList />
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
    }
</style>
```

### 3. 运行项目

保存所有文件后，开发服务器会自动重新加载。打开浏览器并访问 `http://localhost:5000`，你将看到一个功能齐全的待办事项清单应用！

---

## 下一步

恭喜你完成了这个项目！接下来，你可以尝试以下扩展功能：

- **持久化存储**：使用 `localStorage` 保存任务列表，即使刷新页面也不会丢失数据。
- **任务分类**：为任务添加标签或分类。
- **任务排序**：按完成状态或创建时间排序任务。

---

## 学习资源

- [Svelte 官方文档](https://svelte.dev/docs)
- [Svelte 教程](https://svelte.dev/tutorial/basics)
- [JavaScript 教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)

---

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

通过这个项目，你已经掌握了 Svelte 的基础知识！继续加油，探索更多前端开发的乐趣吧！ 🚀