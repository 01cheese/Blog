let currentPage = 1;


// Инициализация темы при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Восстановление сохраненной темы
    const savedTheme = localStorage.getItem('selectedTheme');
    const themeOptions = document.querySelectorAll('.theme-option');

    if (savedTheme) {
        // Применяем сохраненную тему
        document.body.className = `${savedTheme}-theme`;

        // Активируем кнопку выбранной темы
        themeOptions.forEach(option => {
            const theme = option.getAttribute('data-theme');
            if (theme === savedTheme) {
                option.classList.add('active'); // Добавляем класс "active" к сохраненной теме
            } else {
                option.classList.remove('active');
            }
        });
    } else {
        // Если тема не сохранена, применяем тему по умолчанию
        const defaultTheme = 'grey'; // Укажите тему по умолчанию
        document.body.className = `${defaultTheme}-theme`;
        const defaultOption = document.querySelector(`.theme-option[data-theme="${defaultTheme}"]`);
        if (defaultOption) {
            defaultOption.classList.add('active');
        }
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

            // Обновляем активное состояние кнопок
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}


// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id')
    };
}

// Function to load post by ID
function loadPostById(postId) {
    fetch('posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error loading posts');
            }
            return response.json();
        })
        .then(data => {
            const posts = data.posts;
            const postContainer = document.getElementById('post-content');

            // Find the post with the matching id
            const post = posts.find(p => p.id === parseInt(postId, 10));

            if (post) {
                postContainer.innerHTML = `
                    <div class="post">
                        <div class="container">
                            <div class="post-content">${post.content}</div>
                        </div>
                    </div>
                `;
            } else {
                postContainer.innerHTML = 'Post not found.';
            }
        })
        .catch(error => {
            console.error('Error loading post:', error);
            document.getElementById('post-content').innerHTML = 'Error loading post.';
        });
}

// When the document is ready, load the post by id from the URL
document.addEventListener('DOMContentLoaded', () => {
    const params = getUrlParams();
    if (params.id) {
        loadPostById(params.id);
    } else {
        document.getElementById('post-content').innerHTML = 'No post ID found in URL.';
    }
});
