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
                <button class="btn btn-primary" id="searchButton" style="margin-left: 0.5rem;">Поиск</button>
                <button class="btn btn-danger" id="clearSearchButton" style="margin-left: 0.5rem;">Очистить</button>
            </div>
            <nav class="main-nav">
                <a href="#users" class="nav-link">Пользователи</a>
            </nav>
        </div>
    `;
    
    const searchInput = header.querySelector('#searchInput');
    const searchButton = header.querySelector('#searchButton');
    const clearSearchButton = header.querySelector('#clearSearchButton');
    
    searchInput.addEventListener('keypress', handleSearchKeypress);
    searchButton.addEventListener('click', handleSearchClick);
    clearSearchButton.addEventListener('click', handleClearSearch);
    
    return header;
}

function handleSearchKeypress(event) {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.toLowerCase().trim();
        
        window.currentSearchTerm = searchTerm;
        
        router.handleRouteChange();
    }
}

function handleSearchClick(event) {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    window.currentSearchTerm = searchTerm;
    
    router.handleRouteChange();
}

function handleClearSearch(event) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    
    window.currentSearchTerm = '';
    
    router.handleRouteChange();
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const currentHash = window.location.hash;
    
    window.currentSearchTerm = searchTerm;
    
    router.handleRouteChange();
}