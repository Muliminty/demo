<!-- src/App.svelte -->
<script>
    import TodoList from './TodoList.svelte';
</script>

<main>
    <h1>Svelte To-Do List</h1>
    <TodoList />
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
    }
    h1 {
        text-align: center;
    }
</style>