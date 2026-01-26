<!-- src/TodoList.svelte -->
<script>
    let todos = [];
    let newTodo = '';

    // 添加任务
    function addTodo() {
        if (newTodo.trim() !== '') {
            todos = [...todos, { text: newTodo, completed: false }];
            newTodo = '';
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
    .container {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
    }

    .input-group {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }

    input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }

    button {
        padding: 10px 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    button:hover {
        background: #0056b3;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 10px;
        transition: background 0.3s ease;
    }

    li:hover {
        background: #f1f1f1;
    }

    .completed {
        text-decoration: line-through;
        opacity: 0.6;
    }

    .task-text {
        flex: 1;
        margin: 0 10px;
    }

    .task-actions {
        display: flex;
        gap: 10px;
    }

    .clear-all {
        margin-top: 20px;
        background: #dc3545;
    }

    .clear-all:hover {
        background: #c82333;
    }

    .stats {
        margin-top: 20px;
        font-size: 14px;
        color: #666;
    }

    .empty-state {
        text-align: center;
        color: #999;
        margin-top: 20px;
    }
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