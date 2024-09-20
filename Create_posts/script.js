document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const dropzone = document.getElementById('post-content');
    let draggedElement = null;

    draggables.forEach(draggable => {
        // Начало перетаскивания
        draggable.addEventListener('dragstart', (e) => {
            draggedElement = e.target;
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-type'));
        });
    });

    // Разрешаем перетаскивание в dropzone
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    // Обработка отпускания элемента
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');

        if (type && draggedElement) {
            let newElement = document.createElement('div');

            switch (type) {
                case 'p':
                    newElement.innerHTML = `<p contenteditable="true">Новый абзац</p>`;
                    break;
                case 'h1':
                    newElement.innerHTML = `<h1 contenteditable="true">Заголовок 1</h1>`;
                    break;
                case 'h2':
                    newElement.innerHTML = `<h2 contenteditable="true">Заголовок 2</h2>`;
                    break;
                case 'h3':
                    newElement.innerHTML = `<h3 contenteditable="true">Заголовок 3</h3>`;
                    break;
                case 'h4':
                    newElement.innerHTML = `<h4 contenteditable="true">Заголовок 4</h4>`;
                    break;
                case 'h5':
                    newElement.innerHTML = `<h5 contenteditable="true">Заголовок 5</h5>`;
                    break;
                case 'h6':
                    newElement.innerHTML = `<h6 contenteditable="true">Заголовок 6</h6>`;
                    break;
                case 'img':
                    newElement.innerHTML = `<img src="image.png" alt="Изображение" class="my-4" /><input type="text" class="image-url-input" placeholder="Введите URL изображения" />`;
                    newElement.querySelector('.image-url-input').addEventListener('input', function(e) {
                        const img = newElement.querySelector('img');
                        img.src = e.target.value || 'image.png';
                    });
                    break;
                case 'ul':
                    newElement.innerHTML = `<ul contenteditable="true"><li>Элемент списка</li></ul>`;
                    break;
                case 'ol':
                    newElement.innerHTML = `<ol contenteditable="true"><li>Упорядоченный элемент списка</li></ol>`;
                    break;
                case 'blockquote':
                    newElement.innerHTML = `<blockquote contenteditable="true">Цитата текста</blockquote>`;
                    break;
                case 'pre':
                    newElement.innerHTML = `<pre contenteditable="true"><code>Кодовый блок</code></pre>`;
                    break;
                case 'table':
                    newElement.innerHTML = createEditableTable();
                    addTableEditFunctionality(newElement);
                    break;
                default:
                    break;
            }

            // Добавляем кнопку для удаления элемента
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.classList.add('delete', 'bg-red-500', 'text-white', 'px-2', 'py-1', 'ml-2', 'rounded');
            deleteButton.addEventListener('click', () => {
                newElement.remove();
            });

            newElement.appendChild(deleteButton);
            dropzone.appendChild(newElement);
        }

        draggedElement = null;
    });

    // Создаем редактируемую таблицу с кнопками
    function createEditableTable() {
        return `
            <table contenteditable="true">
                <thead>
                    <tr>
                        <td>Заголовок 1</td>
                        <td>Заголовок 2</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ячейка 1</td>
                        <td>Ячейка 2</td>
                    </tr>
                </tbody>
            </table>
            <button class="add-row">Добавить строку</button>
            <button class="add-column">Добавить колонку</button>
        `;
    }

    // Добавление функционала редактирования для таблицы
    function addTableEditFunctionality(tableContainer) {
        const addRowBtn = tableContainer.querySelector('.add-row');
        const addColumnBtn = tableContainer.querySelector('.add-column');
        const table = tableContainer.querySelector('table');

        addRowBtn.addEventListener('click', () => {
            const newRow = table.insertRow();
            const columnsCount = table.rows[0].cells.length;

            for (let i = 0; i < columnsCount; i++) {
                const newCell = newRow.insertCell();
                newCell.contentEditable = "true";
                newCell.textContent = `Новая ячейка`;
            }
        });

        addColumnBtn.addEventListener('click', () => {
            for (let i = 0; i < table.rows.length; i++) {
                const newCell = table.rows[i].insertCell();
                newCell.contentEditable = "true";
                newCell.textContent = i === 0 ? `Новый заголовок` : `Новая ячейка`;
            }
        });
    }

    // Функция для удаления всех технических кнопок и атрибутов перед сохранением
    function prepareForSave() {
        const buttonsToRemove = dropzone.querySelectorAll('.delete, .add-row, .add-column, .image-url-input');
        buttonsToRemove.forEach(button => button.remove());

        const editableElements = dropzone.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(element => element.removeAttribute('contenteditable'));

        // Удаляем все классы и стили
        const elementsWithClasses = dropzone.querySelectorAll('[class]');
        elementsWithClasses.forEach(element => element.removeAttribute('class'));

        const elementsWithStyles = dropzone.querySelectorAll('[style]');
        elementsWithStyles.forEach(element => element.removeAttribute('style'));
    }

    // Функция для сохранения поста как чистого HTML без классов и стилей
    document.getElementById('savePost').addEventListener('click', () => {
        prepareForSave();

        // Сохраняем только чистый HTML-контент
        const postHTML = dropzone.innerHTML;
        const blob = new Blob([postHTML], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'post.html';
        link.click();
    });
});
