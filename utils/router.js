class Router {
    constructor() {
        this.routes = {};
        this.currentHash = '';
        this.appContainer = document.getElementById('app');
        
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        window.addEventListener('load', () => {
            this.handleRouteChange();
        });
    }

    addRoute(hash, callback) {
        this.routes[hash] = callback;
    }

    async handleRouteChange() {
        this.currentHash = window.location.hash || '#users';
        
        try {
            if (typeof renderHeader === 'function') {
                this.appContainer.innerHTML = '';
                this.appContainer.appendChild(renderHeader());
            }

            if (typeof renderBreadcrumbs === 'function') {
                const breadcrumbsContainer = document.createElement('div');
                breadcrumbsContainer.className = 'breadcrumbs-container';
                breadcrumbsContainer.innerHTML = renderBreadcrumbs(this.currentHash);
                this.appContainer.appendChild(breadcrumbsContainer);
            }

            const contentContainer = document.createElement('div');
            contentContainer.className = 'content-container';
            
            switch (this.currentHash) {
                case '#users':
                    if (typeof renderUsers === 'function') {
                        contentContainer.appendChild(await renderUsers());
                    }
                    break;
                
                case '#todos':
                    if (typeof renderTodos === 'function') {
                        contentContainer.appendChild(await renderTodos());
                    }
                    break;
                
                case '#posts':
                    if (typeof renderPosts === 'function') {
                        contentContainer.appendChild(await renderPosts());
                    }
                    break;
                
                case '#comments':
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

    navigate(hash) {
        window.location.hash = hash;
    }

    getCurrentRoute() {
        return this.currentHash;
    }
}

const router = new Router();