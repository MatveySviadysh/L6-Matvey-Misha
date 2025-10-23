async function renderTodos() {
    const container = document.createElement('div');
    container.className = 'todos-container';
    
    container.innerHTML = '<div class="card"><p>Загрузка задач...</p></div>';
    
    try {
        const todos = await apiService.getAllTodos();
        const searchTerm = window.currentSearchTerm || '';
        
        const filteredTodos = todos.filter(todo => 
            todo.title.toLowerCase().includes(searchTerm)
        );
        
        container.innerHTML = `
            <h1 class="page-title">Задачи (${filteredTodos.length})</h1>
            ${renderTodoForm()}
            <div class="todos-list">
                ${filteredTodos.map(todo => renderTodoCard(todo)).join('')}
            </div>
        `;
        
    } catch (error) {
        container.innerHTML = '<div class="card"><p>Ошибка при загрузке задач</p></div>';
        console.error('Error rendering todos:', error);
    }
    
    return container;
}

function renderTodoCard(todo) {
    const statusClass = todo.completed ? 'todo-completed' : 'todo-pending';
    const statusText = todo.completed ? 'Выполнено' : 'В процессе';
    
    return `
        <div class="card todo-card">
            <div class="d-flex justify-between align-center">
                <div>
                    <h3>${todo.title}</h3>
                    <p class="${statusClass}">Статус: ${statusText}</p>
                    <p class="text-muted text-small">ID пользователя: ${todo.userId}</p>
                </div>
            </div>
        </div>
    `;
}

function renderTodoForm() {
    return `
        <div class="form-container">
            <h3>Добавить новую задачу</h3>
            <form id="addTodoForm">
                <div class="form-group">
                    <label for="todoTitle">Название задачи:</label>
                    <input type="text" id="todoTitle" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="todoUserId">ID пользователя:</label>
                    <input type="number" id="todoUserId" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="todoCompleted">
                        Выполнено
                    </label>
                </div>
                <button type="submit" class="btn btn-success">Добавить задачу</button>
            </form>
        </div>
    `;
}

document.addEventListener('click', function(event) {
    if (event.target && event.target.closest('#addTodoForm')) {
        const form = event.target.closest('#addTodoForm');
        if (form) {
            form.addEventListener('submit', handleAddTodoSubmit);
        }
    }
});

function handleAddTodoSubmit(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('todoTitle').value,
        userId: parseInt(document.getElementById('todoUserId').value),
        completed: document.getElementById('todoCompleted').checked
    };
    
    apiService.saveTodoToLS(formData);
    
    event.target.reset();
    
    renderTodos().then(todosComponent => {
        const app = document.getElementById('app');
        const contentContainer = app.querySelector('.content-container');
        contentContainer.innerHTML = '';
        contentContainer.appendChild(todosComponent);
    });
    
    alert('Задача успешно добавлена!');
}