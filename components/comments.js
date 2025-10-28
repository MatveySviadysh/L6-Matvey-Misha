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
            ${renderCommentForm()}
            <div class="comments-list">
                ${commentCards.join('')}
            </div>
        `;
        const commentForm = container.querySelector('#addCommentForm');
        if (commentForm && !commentForm.hasAttribute('data-listener-added')) {
            commentForm.addEventListener('submit', handleAddCommentSubmit);
            commentForm.setAttribute('data-listener-added', 'true');
        }
        container.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteComment);
        });
        
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
            <div class="mt-2 d-flex justify-end">
                <button class="btn btn-danger delete-comment-btn" data-comment-id="${comment.id}">Удалить</button>
            </div>
        </div>
    `;
}

function renderCommentForm() {
    const selectedPostId = localStorage.getItem('selectedPostId') || '';
    return `
        <div class="form-container">
            <h3>Добавить комментарий</h3>
            <form id="addCommentForm">
                <div class="form-group">
                    <label for="commentName">Заголовок:</label>
                    <input type="text" id="commentName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="commentEmail">Email:</label>
                    <input type="email" id="commentEmail" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="commentBody">Текст:</label>
                    <textarea id="commentBody" class="form-control" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label for="commentPostId">ID поста:</label>
                    <input type="number" id="commentPostId" class="form-control" value="${selectedPostId}" required>
                </div>
                <button type="submit" class="btn btn-success">Добавить комментарий</button>
            </form>
        </div>
    `;
}

function handleAddCommentSubmit(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('commentName').value,
        email: document.getElementById('commentEmail').value,
        body: document.getElementById('commentBody').value,
        postId: parseInt(document.getElementById('commentPostId').value)
    };
    apiService.saveCommentToLS(formData);
    event.target.reset();
    router.handleRouteChange();
    alert('Комментарий добавлен!');
}

function handleDeleteComment(event) {
    const id = parseInt(event.target.dataset.commentId);
    if (confirm('Удалить комментарий?')) {
        apiService.deleteComment(id);
        router.handleRouteChange();
    }
}