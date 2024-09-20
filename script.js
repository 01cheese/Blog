let currentPage = 1;
const postsPerPage = 5;

// Инициализация темы при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Восстановление сохраненной темы
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.body.className = `${savedTheme}-theme`;
    }

    // Загрузка постов на текущей странице
    loadPosts(currentPage);

    // Инициализация переключателя тем
    initThemeSwitcher();
});

// Логика переключения тем
function initThemeSwitcher() {
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeOptions = document.querySelectorAll('.theme-option');

    themeOptions.forEach(option => {
        option.addEventListener('click', function () {
            const selectedTheme = this.getAttribute('data-theme');
            document.body.className = `${selectedTheme}-theme`;

            // Сохранение выбранной темы в localStorage
            localStorage.setItem('selectedTheme', selectedTheme);

            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('button');
        pageLink.textContent = i;
        pageLink.classList.add('page-link');
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.onclick = function () {
            loadPosts(i);
        };
        paginationContainer.appendChild(pageLink);
    }
}

function loadPosts(page) {
    fetch('posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки постов');
            }
            return response.json();
        })
        .then(data => {
            const posts = data.posts;
            const postContainer = document.getElementById('post-content');
            postContainer.innerHTML = ''; // Очищаем содержимое перед загрузкой новых постов

            const start = (page - 1) * postsPerPage;
            const end = Math.min(start + postsPerPage, posts.length);

            for (let i = start; i < end; i++) {
                const post = document.createElement('div');
                post.classList.add('post');
                post.innerHTML = `
                    <div class="container">
                        <div class="post-content">${posts[i].content}</div>
                    </div>
                `;
                postContainer.appendChild(post);
            }

            // Пересчёт пагинации и активной страницы
            currentPage = page;
            const totalPages = Math.ceil(posts.length / postsPerPage);
            renderPagination(totalPages);

            // Прокрутка наверх после загрузки постов
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => console.error('Ошибка при загрузке постов:', error));
}
