function renderBreadcrumbs(currentHash) {
    const routes = currentHash.split('#').filter(segment => segment !== '');
    
    const breadcrumbs = routes.map((segment, index) => {
        const path = '#' + routes.slice(0, index + 1).join('#');
        const name = getBreadcrumbName(segment);
        
        return {
            path: path,
            name: name,
            isLast: index === routes.length - 1
        };
    });

    if (routes[0] !== 'users') {
        breadcrumbs.unshift({
            path: '#users',
            name: 'Главная',
            isLast: false
        });
    }

    let breadcrumbsHTML = '<nav class="breadcrumbs"><ul>';
    
    breadcrumbs.forEach((crumb, index) => {
        if (crumb.isLast) {
            breadcrumbsHTML += `<li><span>${crumb.name}</span></li>`;
        } else {
            breadcrumbsHTML += `<li><a href="${crumb.path}">${crumb.name}</a></li>`;
        }
        
        if (index < breadcrumbs.length - 1) {
            breadcrumbsHTML += '<li class="separator">/</li>';
        }
    });
    
    breadcrumbsHTML += '</ul></nav>';
    
    return breadcrumbsHTML;
}

function getBreadcrumbName(segment) {
    const names = {
        'users': 'Пользователи',
        'todos': 'Задачи',
        'posts': 'Посты',
        'comments': 'Комментарии'
    };
    
    return names[segment] || segment;
}