async function renderPosts() {
    const container = document.createElement('div');
    container.className = 'posts-container';
    
    container.innerHTML = '<div class="card"><p>Загрузка постов...</p></div>';
    
    try {
        const posts = await apiService.getAllPosts();
        const searchTerm = window.currentSearchTerm || '';
        
        const filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.body.toLowerCase().includes(searchTerm)
        );
        
        container.innerHTML = `
            <h1 class="page-title">Посты (${filteredPosts.length})</h1>
            <div class="posts-list">
                ${filteredPosts.map(post => renderPostCard(post)).join('')}
            </div>
        `;
        
    } catch (error) {
        container.innerHTML = '<div class="card"><p>Ошибка при загрузке постов</p></div>';
        console.error('Error rendering posts:', error);
    }
    
    return container;
}

function renderPostCard(post) {
    return `
        <div class="card post-card">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <div class="d-flex justify-between align-center mt-2">
                <span class="text-muted text-small">ID пользователя: ${post.userId}</span>
                <a href="#users#posts#comments" class="btn btn-primary" 
                   onclick="localStorage.setItem('selectedPostId', ${post.id})">
                    Комментарии
                </a>
            </div>
        </div>
    `;
}


