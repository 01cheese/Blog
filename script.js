let currentPage = 1;
const postsPerPage = 5;

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

// Рендеринг пагинации
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

// Функция для инициализации кнопок "Поделиться"



// Загрузка постов
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
                        <button class="share-btn" data-id="${posts[i].id}">Copy link</button>
                    </div>
                `;
                postContainer.appendChild(post);
            }

            // Обновляем пагинацию
            currentPage = page;
            const totalPages = Math.ceil(posts.length / postsPerPage);
            renderPagination(totalPages);

            // Инициализация кнопок для "Поделиться"
            initShareButtons();

            // Прокрутка наверх после загрузки постов
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => console.error('Ошибка при загрузке постов:', error));
}



function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', function () {
            const postId = this.getAttribute('data-id');
            const shareUrl = `https://01cheese.github.io/EasyBlogInGitHubPages/share.html?id=${postId}`;

            // Копируем ссылку в буфер обмена
            navigator.clipboard.writeText(shareUrl).then(() => {
                // Создание временного сообщения
                const tempMessage = document.createElement('div');
                tempMessage.textContent = 'Ссылка скопирована!';
                tempMessage.style.position = 'fixed';
                tempMessage.style.bottom = '10px';
                tempMessage.style.right = '10px';
                tempMessage.style.backgroundColor = '#1e90ff';
                tempMessage.style.color = 'white';
                tempMessage.style.padding = '10px';
                tempMessage.style.borderRadius = '5px';
                tempMessage.style.opacity = '1';
                tempMessage.style.transition = 'opacity 2s'; // Плавное исчезновение
                document.body.appendChild(tempMessage);

                // Через 2 секунды начинаем плавное исчезновение
                setTimeout(() => {
                    tempMessage.style.opacity = '0';
                }, 1000);

                // Через 4 секунды удаляем элемент из DOM
                setTimeout(() => {
                    document.body.removeChild(tempMessage);
                }, 4000);
            }).catch(err => {
                console.error('Ошибка копирования ссылки:', err);
            });
        });
    });
}
