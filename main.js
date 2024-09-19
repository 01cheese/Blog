// Сначала загружаем файл data.txt
fetch('data.txt')
    .then(response => response.text()) // Преобразуем ответ в текст
    .then(data => {
        // Находим элемент, куда будем вставлять текст
        const contentDiv = document.getElementById('content');
        // Вставляем содержимое файла data.txt
        contentDiv.textContent = data;
    })
    .catch(error => {
        console.error('Error loading the text file:', error);
    });
