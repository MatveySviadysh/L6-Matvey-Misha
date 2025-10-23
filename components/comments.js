async function renderComments() {
    const container = document.createElement('div');
    container.className = 'comments-container';
    
    container.innerHTML = '<div class="card"><p>Загрузка комментариев...</p></div>';
    
    try {
        const comments = await apiService.getAllComments();
        const searchTerm = window.currentSearchTerm || '';
        const selectedPostId = localStorage.getItem('selectedPostId');
        
        let filteredComments = comments;
        
        if (selectedPostId) {
            filteredComments = comments.filter(comment => comment.postId == selectedPostId);
        }
        
        filteredComments = filteredComments.filter(comment => 
            comment.name.toLowerCase().includes(searchTerm) ||
            comment.body.toLowerCase().includes(searchTerm) ||
            comment.email.toLowerCase().includes(searchTerm)
        );
        
        const backButton = selectedPostId ? '<a href="#posts" class="btn btn-primary mb-2">← Назад к постам</a>' : '';
        
        const posts = await apiService.getAllPosts();
        
        const commentCards = filteredComments.map(comment => renderCommentCard(comment, posts));
        
        container.innerHTML = `
            ${backButton}
            <h1 class="page-title">Комментарии (${filteredComments.length})</h1>
            <div class="comments-list">
                ${commentCards.join('')}
            </div>
        `;
        
    } catch (error) {
        container.innerHTML = '<div class="card"><p>Ошибка при загрузке комментариев</p></div>';
        console.error('Error rendering comments:', error);
    }
    
    return container;
}

function renderCommentCard(comment, posts = []) {
    let postInfo = `ID поста: ${comment.postId}`;
    const post = posts.find(p => p.id == comment.postId);
    if (post) {
        postInfo = `Пост: ${post.title.substring(0, 50)}${post.title.length > 50 ? '...' : ''}`;
    }
    
    return `
        <div class="card comment-card">
            <h3>${comment.name}</h3>
            <p><strong>Email:</strong> ${comment.email}</p>
            <p>${comment.body}</p>
            <div class="text-muted text-small">
                ${postInfo}
            </div>
        </div>
    `;
}