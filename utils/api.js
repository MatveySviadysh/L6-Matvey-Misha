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

    async getAllUsers() {
        const [apiUsers, lsUsers] = await Promise.all([
            this.getUsers(),
            Promise.resolve(this.getUsersFromLS())
        ]);
        return [...apiUsers, ...lsUsers];
    }

    async getAllTodos() {
        const [apiTodos, lsTodos] = await Promise.all([
            this.getTodos(),
            Promise.resolve(this.getTodosFromLS())
        ]);
        return [...apiTodos, ...lsTodos];
    }

    async getAllPosts() {
        return await this.getPosts();
    }

    async getAllComments() {
        return await this.getComments();
    }
}

const apiService = new ApiService();