from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime
current_date = datetime.now()
dateNow = current_date.strftime("%B %d, %Y")


lst = ['https://tproger.ru/blogs/why-elasticsearch-is-a-good-choice',
       'https://tproger.ru/blogs/dlp-system-search-inform',
       'https://tproger.ru/blogs/mobile-development-important-details', 'https://tproger.ru/blogs/security-system',
       'https://tproger.ru/blogs/what-language-to-learn', 'https://tproger.ru/blogs/no-it-certification',
       'https://tproger.ru/blogs/schoolkid-in-it', 'https://tproger.ru/blogs/big-data-for-business',
       'https://tproger.ru/blogs/enter-it-13-advices', 'https://tproger.ru/blogs/displaying-images-in-android-app',
       'https://tproger.ru/blogs/find-a-company-of-a-dream', 'https://tproger.ru/blogs/jvm-insides',
       'https://tproger.ru/blogs/it-certification', 'https://tproger.ru/blogs/startup-grow-crisis',
       'https://tproger.ru/blogs/runet-isolation', 'https://tproger.ru/blogs/micronaut-introduction',
       'https://tproger.ru/blogs/real-project-advices',
       'https://tproger.ru/blogs/js-obfuscation', 'https://tproger.ru/blogs/10-tips-on-organizing-hackaton',
       'https://tproger.ru/blogs/game-development-from-idea-to-post-release',
       'https://tproger.ru/blogs/do-you-need-blockchain',
       'https://tproger.ru/blogs/what-is-difficult-for-a-programmer-and-what-to-do-with-that',
       'https://tproger.ru/blogs/10-good-things-to-do-for-it-guy',
       'https://tproger.ru/blogs/how-can-student-find-a-job-in-it', 'https://tproger.ru/blogs/ci-cd',
       'https://tproger.ru/blogs/protection-of-data-in-cloud',
       'https://tproger.ru/blogs/why-data-analysts-need-sql', 'https://tproger.ru/blogs/monitoring-systems-comparison',
       'https://tproger.ru/blogs/kubernetes-as-default-tool-for-containers',
       'https://tproger.ru/blogs/why-unusual-hackathons-are-held', 'https://tproger.ru/blogs/ozon-it-delivery-insights',
       'https://tproger.ru/blogs/retrospective-analysis', 'https://tproger.ru/blogs/qa-qc-tester-career',
       'https://tproger.ru/blogs/documentation-as-code', 'https://tproger.ru/blogs/delegation-of-authority',
       'https://tproger.ru/blogs/microservices-and-its-usefulness',
       'https://tproger.ru/blogs/why-investors-are-interested-in-iot', 'https://tproger.ru/blogs/freelance-for-newbies',
       'https://tproger.ru/blogs/public-sector-blockchain', 'https://tproger.ru/blogs/creating-voice-bot',
       'https://tproger.ru/blogs/smart-contracts',
       'https://tproger.ru/blogs/how-to-become-a-qa-engineer', 'https://tproger.ru/blogs/project-team-plus-business',
       'https://tproger.ru/blogs/ecology-hiring-in-it', 'https://tproger.ru/blogs/ico-sto-paradise',
       'https://tproger.ru/blogs/utah-teapot',
       'https://tproger.ru/blogs/effective-code-in-js-with-event-loop',
       'https://tproger.ru/blogs/improve-soft-skills-in-7-days', 'https://tproger.ru/blogs/js-classes',
       'https://tproger.ru/blogs/whats-wrong-with-articles-for-begginers',
       'https://tproger.ru/blogs/nlp-professional-howto', 'https://tproger.ru/blogs/coder-to-artificial-intelligence']


author = f'<p class="post-meta"><em>Published on {dateNow} | Author: Vadym Zelenko</em></p>'

def new_post_in_json(content):
    # Чтение существующего JSON файла
    with open('posts.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Создание нового поста
    new_post = {
        "id": len(data['posts']) + 1,  # Увеличиваем id для нового поста
        "content": f"{content}"
    }

    # Добавление нового поста в список постов
    data['posts'].append(new_post)

    # Сохранение обновленного JSON файла
    with open('posts.json', 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

    print("Новый пост добавлен успешно!")


for url in lst:
    # URL страницы, которую будем парсить
    # url = "https://tproger.ru/blogs/qa-qc-tester-career"

    # Выполняем запрос к странице
    response = requests.get(url)

    # Проверяем, успешен ли запрос
    if response.status_code == 200:
        # Парсим HTML страницы
        soup = BeautifulSoup(response.content, 'html.parser')

        # Ищем все элементы <h3> и <p> в порядке их появления на странице
        content = soup.find_all(['h3', 'p', 'h1', 'img'], class_=['tp-content-subtitle--h3', 'tp-content-paragraph',
                                                                  "tp-post-single-header__title", "tp-image__image"])

        # Собираем HTML контент всех найденных элементов
        content_html = ""
        content_html += content[0].prettify()+"\n"+author
        print(content[0])
        for i in range(len(content)-1):
            content_html += content[i+1].prettify() + "\n"

        # Создаем объект BeautifulSoup для парсинга HTML
        soup = BeautifulSoup(content_html, 'html.parser')


        # Функция для удаления лишних атрибутов
        def clean_attributes(tag):
            if tag.name == 'img':
                # Сохраняем только атрибут src для тега img
                attrs_to_keep = ['src']
            else:
                # Оставляем теги без атрибутов
                attrs_to_keep = []

            # Удаляем все атрибуты, кроме необходимых
            for attr in list(tag.attrs):
                if attr not in attrs_to_keep:
                    del tag[attr]


        # Применяем функцию к каждому тегу в HTML
        for tag in soup.find_all(True):  # True находит все теги
            clean_attributes(tag)

        new_post_in_json(soup.prettify())

