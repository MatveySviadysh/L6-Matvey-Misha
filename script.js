document.addEventListener('DOMContentLoaded', function() {
    console.log('SPA Application started!');
    
    if (typeof router !== 'undefined') {
        console.log('Router initialized');
    }
    
    setupFormEventListeners();
});

function setupFormEventListeners() {
    document.removeEventListener('click', handleFormClick);
    document.addEventListener('click', handleFormClick);
}

function handleFormClick(event) {
    if (event.target && event.target.closest('#addUserForm')) {
        const form = event.target.closest('#addUserForm');
        if (form && !form.hasAttribute('data-listener-added')) {
            form.addEventListener('submit', handleAddUserSubmit);
            form.setAttribute('data-listener-added', 'true');
        }
    }
    
    if (event.target && event.target.closest('#addTodoForm')) {
        const form = event.target.closest('#addTodoForm');
        if (form && !form.hasAttribute('data-listener-added')) {
            form.addEventListener('submit', handleAddTodoSubmit);
            form.setAttribute('data-listener-added', 'true');
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupFormEventListeners,
    handleFormClick, 
  };
}