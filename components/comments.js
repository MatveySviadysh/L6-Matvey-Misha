async function renderComments() {
    const container = document.createElement('div');
    container.className = 'comments-container';
    
    container.innerHTML = '<div class="card"><p>Загрузка комментариев...</p></div>';
    
    try {
        const comments = await apiService.getAllComments();
        const searchTerm = window.currentSearchTerm || '';
        
        const filteredComments = comments.filter(comment => 
            comment.name.toLowerCase().includes(searchTerm) ||
            comment.body.toLowerCase().includes(searchTerm) ||
            comment.email.toLowerCase().includes(searchTerm)
        );
        
        container.innerHTML = `
            <h1 class="page-title">Комментарии (${filteredComments.length})</h1>
            <div class="comments-list">
                ${filteredComments.map(comment => renderCommentCard(comment)).join('')}
            </div>
        `;
        
    } catch (error) {
        container.innerHTML = '<div class="card"><p>Ошибка при загрузке комментариев</p></div>';
        console.error('Error rendering comments:', error);
    }
    
    return container;
}

function renderCommentCard(comment) {
    return `
        <div class="card comment-card">
            <h3>${comment.name}</h3>
            <p><strong>Email:</strong> ${comment.email}</p>
            <p>${comment.body}</p>
            <div class="text-muted text-small">
                ID поста: ${comment.postId}
            </div>
        </div>
    `;
}