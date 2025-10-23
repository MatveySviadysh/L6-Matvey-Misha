function renderHeader() {
    const header = document.createElement('header');
    header.className = 'header';
    
    header.innerHTML = `
        <div class="header-content">
            <div class="logo">SPA App</div>
            <div class="search-container">
                <input 
                    type="text" 
                    class="search-input" 
                    id="searchInput" 
                    placeholder="Поиск..."
                >
            </div>
            <nav class="main-nav">
                <a href="#users" class="nav-link">Пользователи</a>
            </nav>
        </div>
    `;
    
    const searchInput = header.querySelector('#searchInput');
    const debouncedSearch = apiService.debounce(handleSearch, 300);
    searchInput.addEventListener('input', debouncedSearch);
    
    return header;
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const currentHash = window.location.hash;
    
    window.currentSearchTerm = searchTerm;
    
    router.handleRouteChange();
}