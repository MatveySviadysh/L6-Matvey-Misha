async function renderTodos() {
    const container = document.createElement('div');
    container.className = 'todos-container';
    
    container.innerHTML = '<div class="card"><p>Загрузка задач...</p></div>';
    
    try {
        const todos = await apiService.getAllTodos();
        const searchTerm = window.currentSearchTerm || '';
        const selectedUserId = localStorage.getItem('selectedUserId');
        
        let filteredTodos = todos;
        
        if (selectedUserId) {
            filteredTodos = todos.filter(todo => todo.userId == selectedUserId);
        }
        
        filteredTodos = filteredTodos.filter(todo => 
            todo.title.toLowerCase().includes(searchTerm)
        );
        
        const backButton = selectedUserId ? '<a href="#users" class="btn btn-primary mb-2">← Назад к пользователям</a>' : '';
        
        const users = await apiService.getAllUsers();
        
        const todoCards = filteredTodos.map(todo => renderTodoCard(todo, users));
        
        container.innerHTML = `
            ${backButton}
            <h1 class="page-title">Задачи (${filteredTodos.length})</h1>
            ${renderTodoForm()}
            <div class="todos-list">
                ${todoCards.join('')}
            </div>
        `;
        
        const todoForm = container.querySelector('#addTodoForm');
        if (todoForm && !todoForm.hasAttribute('data-listener-added')) {
            todoForm.addEventListener('submit', handleAddTodoSubmit);
            todoForm.setAttribute('data-listener-added', 'true');
        }
        
    } catch (error) {
        container.innerHTML = '<div class="card"><p>Ошибка при загрузке задач</p></div>';
        console.error('Error rendering todos:', error);
    }
    
    return container;
}

function renderTodoCard(todo, users = []) {
    const statusClass = todo.completed ? 'todo-completed' : 'todo-pending';
    const statusText = todo.completed ? 'Выполнено' : 'В процессе';
    
    let userName = `ID пользователя: ${todo.userId}`;
    const user = users.find(u => u.id == todo.userId);
    if (user) {
        userName = `Пользователь: ${user.name}`;
    }
    
    return `
        <div class="card todo-card">
            <div class="d-flex justify-between align-center">
                <div>
                    <h3>${todo.title}</h3>
                    <p class="${statusClass}">Статус: ${statusText}</p>
                    <p class="text-muted text-small">${userName}</p>
                </div>
            </div>
        </div>
    `;
}

function renderTodoForm() {
    const selectedUserId = localStorage.getItem('selectedUserId') || '';
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
                    <input type="number" id="todoUserId" class="form-control" value="${selectedUserId}" required>
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


function handleAddTodoSubmit(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('todoTitle').value,
        userId: parseInt(document.getElementById('todoUserId').value),
        completed: document.getElementById('todoCompleted').checked
    };
    
    apiService.saveTodoToLS(formData);
    
    event.target.reset();
    
    router.handleRouteChange();
    
    alert('Задача успешно добавлена!');
}