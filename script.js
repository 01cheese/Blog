let currentPage = 1;
const postsPerPage = 10;

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('button');
        pageLink.textContent = i;
        pageLink.classList.add('page-link');
        pageLink.onclick = function () {
            loadPosts(i);
        };
        paginationContainer.appendChild(pageLink);
    }
}

function loadPosts(page) {
    fetch('posts.json')
        .then(response => response.json())
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

            // Пересчёт пагинации на случай изменения количества постов
            const totalPages = Math.ceil(posts.length / postsPerPage);
            renderPagination(totalPages);
        })
        .catch(error => console.error('Ошибка при загрузке постов:', error));
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadPosts(currentPage);
});
