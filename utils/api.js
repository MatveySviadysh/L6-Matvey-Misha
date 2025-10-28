class ApiService {
    constructor() {
        this.baseUrl = 'https://jsonplaceholder.typicode.com';
    }

    debounce(func, timeout = 500) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    async getUsers() {
        try {
            const response = await fetch(`${this.baseUrl}/users`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    async getTodos() {
        try {
            const response = await fetch(`${this.baseUrl}/todos`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching todos:', error);
            return [];
        }
    }

    async getPosts() {
        try {
            const response = await fetch(`${this.baseUrl}/posts`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    async getComments() {
        try {
            const response = await fetch(`${this.baseUrl}/comments`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }

    // ---------- helpers for deletions/overrides ----------
    getDeletedIds(key) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    }

    markDeleted(key, id) {
        const ids = this.getDeletedIds(key);
        if (!ids.includes(id)) {
            ids.push(id);
            localStorage.setItem(key, JSON.stringify(ids));
        }
        return ids;
    }

    getOverrides(key) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    }

    saveOverrides(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    getUsersFromLS() {
        const users = localStorage.getItem('customUsers');
        return users ? JSON.parse(users) : [];
    }

    saveUserToLS(user) {
        const users = this.getUsersFromLS();
        const newUser = {
            ...user,
            id: Date.now(),
            isCustom: true
        };
        users.push(newUser);
        localStorage.setItem('customUsers', JSON.stringify(users));
        return newUser;
    }

    deleteUserFromLS(userId) {
        const users = this.getUsersFromLS();
        const filteredUsers = users.filter(user => user.id !== userId);
        localStorage.setItem('customUsers', JSON.stringify(filteredUsers));
        return filteredUsers;
    }

    deleteUser(userId) {
        const users = this.getUsersFromLS();
        const existsCustom = users.some(u => u.id === userId);
        if (existsCustom) {
            this.deleteUserFromLS(userId);
        } else {
            this.markDeleted('deletedUsers', userId);
        }
    }

    getTodosFromLS() {
        const todos = localStorage.getItem('customTodos');
        return todos ? JSON.parse(todos) : [];
    }

    saveTodoToLS(todo) {
        const todos = this.getTodosFromLS();
        const newTodo = {
            ...todo,
            id: Date.now(),
            isCustom: true
        };
        todos.push(newTodo);
        localStorage.setItem('customTodos', JSON.stringify(todos));
        return newTodo;
    }

    deleteTodoFromLS(todoId) {
        const todos = this.getTodosFromLS();
        const filtered = todos.filter(t => t.id !== todoId);
        localStorage.setItem('customTodos', JSON.stringify(filtered));
        return filtered;
    }

    deleteTodo(todoId) {
        const existsCustom = this.getTodosFromLS().some(t => t.id === todoId);
        if (existsCustom) {
            this.deleteTodoFromLS(todoId);
        } else {
            this.markDeleted('deletedTodos', todoId);
        }
    }

    toggleTodoStatus(todoId, currentCompleted) {
        // First try custom todos
        const todos = this.getTodosFromLS();
        const idx = todos.findIndex(t => t.id === todoId);
        if (idx !== -1) {
            const next = typeof currentCompleted === 'boolean' ? !currentCompleted : !todos[idx].completed;
            todos[idx] = { ...todos[idx], completed: next };
            localStorage.setItem('customTodos', JSON.stringify(todos));
            return todos[idx];
        }
        // Save override for API todo
        const overrides = this.getOverrides('todoOverrides');
        const oIdx = overrides.findIndex(o => o.id === todoId);
        if (oIdx !== -1) {
            const next = typeof currentCompleted === 'boolean' ? !currentCompleted : !overrides[oIdx].completed;
            overrides[oIdx] = { ...overrides[oIdx], completed: next };
        } else {
            const next = typeof currentCompleted === 'boolean' ? !currentCompleted : true;
            overrides.push({ id: todoId, completed: next });
        }
        this.saveOverrides('todoOverrides', overrides);
        return overrides.find(o => o.id === todoId);
    }

    async getAllUsers() {
        const [apiUsers, lsUsers] = await Promise.all([
            this.getUsers(),
            Promise.resolve(this.getUsersFromLS())
        ]);
        const deleted = this.getDeletedIds('deletedUsers');
        const filteredApi = apiUsers.filter(u => !deleted.includes(u.id));
        return [...filteredApi, ...lsUsers];
    }

    async getAllTodos() {
        const [apiTodos, lsTodos] = await Promise.all([
            this.getTodos(),
            Promise.resolve(this.getTodosFromLS())
        ]);
        const deleted = this.getDeletedIds('deletedTodos');
        const overrides = this.getOverrides('todoOverrides');
        const filteredApi = apiTodos
            .filter(t => !deleted.includes(t.id))
            .map(t => {
                const o = overrides.find(o => o.id === t.id);
                return o ? { ...t, completed: o.completed } : t;
            });
        return [...filteredApi, ...lsTodos];
    }

    getPostsFromLS() {
        const posts = localStorage.getItem('customPosts');
        return posts ? JSON.parse(posts) : [];
    }

    savePostToLS(post) {
        const posts = this.getPostsFromLS();
        const newPost = { ...post, id: Date.now(), isCustom: true };
        posts.push(newPost);
        localStorage.setItem('customPosts', JSON.stringify(posts));
        return newPost;
    }

    deletePostFromLS(postId) {
        const posts = this.getPostsFromLS();
        const filtered = posts.filter(p => p.id !== postId);
        localStorage.setItem('customPosts', JSON.stringify(filtered));
        return filtered;
    }

    deletePost(postId) {
        const existsCustom = this.getPostsFromLS().some(p => p.id === postId);
        if (existsCustom) {
            this.deletePostFromLS(postId);
        } else {
            this.markDeleted('deletedPosts', postId);
        }
    }

    async getAllPosts() {
        const [apiPosts, lsPosts] = await Promise.all([
            this.getPosts(),
            Promise.resolve(this.getPostsFromLS())
        ]);
        const deleted = this.getDeletedIds('deletedPosts');
        const filteredApi = apiPosts.filter(p => !deleted.includes(p.id));
        return [...filteredApi, ...lsPosts];
    }

    getCommentsFromLS() {
        const comments = localStorage.getItem('customComments');
        return comments ? JSON.parse(comments) : [];
    }

    saveCommentToLS(comment) {
        const comments = this.getCommentsFromLS();
        const newComment = { ...comment, id: Date.now(), isCustom: true };
        comments.push(newComment);
        localStorage.setItem('customComments', JSON.stringify(comments));
        return newComment;
    }

    deleteCommentFromLS(commentId) {
        const comments = this.getCommentsFromLS();
        const filtered = comments.filter(c => c.id !== commentId);
        localStorage.setItem('customComments', JSON.stringify(filtered));
        return filtered;
    }

    deleteComment(commentId) {
        const existsCustom = this.getCommentsFromLS().some(c => c.id === commentId);
        if (existsCustom) {
            this.deleteCommentFromLS(commentId);
        } else {
            this.markDeleted('deletedComments', commentId);
        }
    }

    async getAllComments() {
        const [apiComments, lsComments] = await Promise.all([
            this.getComments(),
            Promise.resolve(this.getCommentsFromLS())
        ]);
        const deleted = this.getDeletedIds('deletedComments');
        const filteredApi = apiComments.filter(c => !deleted.includes(c.id));
        return [...filteredApi, ...lsComments];
    }
}

const apiService = new ApiService();