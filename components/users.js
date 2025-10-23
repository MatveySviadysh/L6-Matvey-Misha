async function renderUsers() {
    const container = document.createElement('div');
    container.className = 'users-container';
    
    container.innerHTML = '<div class="card"><p>Загрузка пользователей...</p></div>';
    
    try {
        const users = await apiService.getAllUsers();
        const searchTerm = window.currentSearchTerm || '';
        
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        
        container.innerHTML = `
            <h1 class="page-title">Пользователи (${filteredUsers.length})</h1>
            ${renderUserForm()}
            <div class="users-list">
                ${filteredUsers.map(user => renderUserCard(user)).join('')}
            </div>
        `;
        
        container.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteUser);
        });
        
    } catch (error) {
        container.innerHTML = '<div class="card"><p>Ошибка при загрузке пользователей</p></div>';
        console.error('Error rendering users:', error);
    }
    
    return container;
}

function renderUserCard(user) {
    const isCustomUser = user.isCustom;
    
    return `
        <div class="card user-card">
            <div class="d-flex justify-between align-center">
                <div>
                    <h3>${user.name}</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    ${user.phone ? `<p><strong>Телефон:</strong> ${user.phone}</p>` : ''}
                    ${user.website ? `<p><strong>Website:</strong> ${user.website}</p>` : ''}
                    ${user.company ? `<p><strong>Компания:</strong> ${user.company.name}</p>` : ''}
                </div>
                <div>
                    ${isCustomUser ? 
                        `<button class="btn btn-danger delete-user-btn" data-user-id="${user.id}">
                            Удалить
                        </button>` : 
                        ''
                    }
                </div>
            </div>
            <div class="mt-2">
                <a href="#users#todos" class="btn btn-primary" onclick="localStorage.setItem('selectedUserId', ${user.id})">
                    Задачи
                </a>
                <a href="#users#posts" class="btn btn-primary ml-2" onclick="localStorage.setItem('selectedUserId', ${user.id})">
                    Посты
                </a>
            </div>
        </div>
    `;
}

function renderUserForm() {
    return `
        <div class="form-container">
            <h3>Добавить нового пользователя</h3>
            <form id="addUserForm">
                <div class="form-group">
                    <label for="userName">Имя:</label>
                    <input type="text" id="userName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="userEmail">Email:</label>
                    <input type="email" id="userEmail" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="userPhone">Телефон:</label>
                    <input type="tel" id="userPhone" class="form-control">
                </div>
                <div class="form-group">
                    <label for="userWebsite">Website:</label>
                    <input type="url" id="userWebsite" class="form-control">
                </div>
                <div class="form-group">
                    <label for="userCompany">Компания:</label>
                    <input type="text" id="userCompany" class="form-control">
                </div>
                <button type="submit" class="btn btn-success">Добавить пользователя</button>
            </form>
        </div>
    `;
}

function handleDeleteUser(event) {
    const userId = parseInt(event.target.dataset.userId);
    
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        apiService.deleteUserFromLS(userId);
        renderUsers().then(usersComponent => {
            const app = document.getElementById('app');
            const contentContainer = app.querySelector('.content-container');
            contentContainer.innerHTML = '';
            contentContainer.appendChild(usersComponent);
        });
    }
}

document.addEventListener('click', function(event) {
    if (event.target && event.target.closest('#addUserForm')) {
        const form = event.target.closest('#addUserForm');
        if (form) {
            form.addEventListener('submit', handleAddUserSubmit);
        }
    }
});

function handleAddUserSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value || '',
        website: document.getElementById('userWebsite').value || '',
        company: document.getElementById('userCompany').value ? {
            name: document.getElementById('userCompany').value
        } : null
    };
    
    apiService.saveUserToLS(formData);
    
    event.target.reset();
    
    renderUsers().then(usersComponent => {
        const app = document.getElementById('app');
        const contentContainer = app.querySelector('.content-container');
        contentContainer.innerHTML = '';
        contentContainer.appendChild(usersComponent);
    });
    
    alert('Пользователь успешно добавлен!');
}