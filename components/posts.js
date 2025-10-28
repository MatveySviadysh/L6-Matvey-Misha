async function renderPosts() {
    const container = document.createElement('div');
    container.className = 'posts-container';
    
    container.innerHTML = '<div class="card"><p>Загрузка постов...</p></div>';
    
    try {
        const posts = await apiService.getAllPosts();
        const searchTerm = window.currentSearchTerm || '';
        const selectedUserId = localStorage.getItem('selectedUserId');
        
        let filteredPosts = posts;
        
        if (selectedUserId) {
            filteredPosts = posts.filter(post => post.userId == selectedUserId);
        }
        
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.body.toLowerCase().includes(searchTerm)
        );
        
        const backButton = selectedUserId ? '<a href="#users" class="btn btn-primary mb-2">← Назад к пользователям</a>' : '';
        
        const users = await apiService.getAllUsers();
        
        const postCards = filteredPosts.map(post => renderPostCard(post, users));
        
        container.innerHTML = `
            ${backButton}
            <h1 class="page-title">Посты (${filteredPosts.length})</h1>
            ${renderPostForm()}
            <div class="posts-list">
                ${postCards.join('')}
            </div>
        `;
        const postForm = container.querySelector('#addPostForm');
        if (postForm && !postForm.hasAttribute('data-listener-added')) {
            postForm.addEventListener('submit', handleAddPostSubmit);
            postForm.setAttribute('data-listener-added', 'true');
        }
        container.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', handleDeletePost);
        });
    } catch (error) {
        container.innerHTML = '<div class="card"><p>Ошибка при загрузке постов</p></div>';
        console.error('Error rendering posts:', error);
    }
    
    return container;
}

function renderPostCard(post, users = []) {
    let userName = `ID пользователя: ${post.userId}`;
    const user = users.find(u => u.id == post.userId);
    if (user) {
        userName = `Автор: ${user.name}`;
    }
    
    return `
        <div class="card post-card">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <div class="d-flex justify-between align-center mt-2">
                <span class="text-muted text-small">${userName}</span>
                <a href="#comments" class="btn btn-primary" 
                   onclick="localStorage.setItem('selectedPostId', ${post.id})">
                    Комментарии
                </a>
            </div>
            <div class="mt-2 d-flex justify-end">
                <button class="btn btn-danger delete-post-btn" data-post-id="${post.id}">Удалить</button>
            </div>
        </div>
    `;
}

function renderPostForm() {
    const selectedUserId = localStorage.getItem('selectedUserId') || '';
    return `
        <div class="form-container">
            <h3>Добавить новый пост</h3>
            <form id="addPostForm">
                <div class="form-group">
                    <label for="postTitle">Заголовок:</label>
                    <input type="text" id="postTitle" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="postBody">Текст:</label>
                    <textarea id="postBody" class="form-control" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label for="postUserId">ID пользователя:</label>
                    <input type="number" id="postUserId" class="form-control" value="${selectedUserId}" required>
                </div>
                <button type="submit" class="btn btn-success">Добавить пост</button>
            </form>
        </div>
    `;
}

function handleAddPostSubmit(event) {
    event.preventDefault();
    const formData = {
        title: document.getElementById('postTitle').value,
        body: document.getElementById('postBody').value,
        userId: parseInt(document.getElementById('postUserId').value)
    };
    apiService.savePostToLS(formData);
    event.target.reset();
    router.handleRouteChange();
    alert('Пост успешно добавлен!');
}

function handleDeletePost(event) {
    const id = parseInt(event.target.dataset.postId);
    if (confirm('Удалить пост?')) {
        apiService.deletePost(id);
        router.handleRouteChange();
    }
}
