class Router {
    constructor() {
        this.routes = {};
        this.currentHash = '';
        this.appContainer = document.getElementById('app');
        
        this.init();
    }

    init() {
        // Обработчик изменения хэша
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // Обработчик загрузки страницы
        window.addEventListener('load', () => {
            this.handleRouteChange();
        });
    }

    // Добавление маршрута
    addRoute(hash, callback) {
        this.routes[hash] = callback;
    }

    // Обработчик изменения маршрута
    async handleRouteChange() {
        this.currentHash = window.location.hash || '#users';
        
        try {
            // Рендерим хедер
            if (typeof renderHeader === 'function') {
                this.appContainer.innerHTML = '';
                this.appContainer.appendChild(renderHeader());
            }

            // Рендерим хлебные крошки
            if (typeof renderBreadcrumbs === 'function') {
                const breadcrumbsContainer = document.createElement('div');
                breadcrumbsContainer.className = 'breadcrumbs-container';
                breadcrumbsContainer.innerHTML = renderBreadcrumbs(this.currentHash);
                this.appContainer.appendChild(breadcrumbsContainer);
            }

            // Рендерим контент в зависимости от маршрута
            const contentContainer = document.createElement('div');
            contentContainer.className = 'content-container';
            
            switch (this.currentHash) {
                case '#users':
                    if (typeof renderUsers === 'function') {
                        contentContainer.appendChild(await renderUsers());
                    }
                    break;
                
                case '#users#todos':
                    if (typeof renderTodos === 'function') {
                        contentContainer.appendChild(await renderTodos());
                    }
                    break;
                
                case '#users#posts':
                    if (typeof renderPosts === 'function') {
                        contentContainer.appendChild(await renderPosts());
                    }
                    break;
                
                case '#users#posts#comments':
                    if (typeof renderComments === 'function') {
                        contentContainer.appendChild(await renderComments());
                    }
                    break;
                
                default:
                    contentContainer.innerHTML = '<h2>Страница не найдена</h2>';
            }

            this.appContainer.appendChild(contentContainer);

        } catch (error) {
            console.error('Error during route change:', error);
            this.appContainer.innerHTML = '<h2>Произошла ошибка при загрузке страницы</h2>';
        }
    }

    // Навигация
    navigate(hash) {
        window.location.hash = hash;
    }

    // Получение текущего маршрута
    getCurrentRoute() {
        return this.currentHash;
    }
}

// Создаем экземпляр роутера
const router = new Router();