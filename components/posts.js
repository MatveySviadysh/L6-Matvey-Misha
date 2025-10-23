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
            <div class="posts-list">
                ${postCards.join('')}
            </div>
        `;
        
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
        </div>
    `;
}


