from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Инициализация драйвера (используем Chrome)
driver = webdriver.Chrome()  # Замените на путь к вашему chromedriver
lst = []
for i in range(7):
    print(i+1)
    # Открываем сайт
    driver.get(f"https://tproger.ru/blogs/page{i+1}")

    # Устанавливаем паузу для подгрузки контента
    SCROLL_PAUSE_TIME = 2

    # Получаем начальную высоту страницы
    last_height = driver.execute_script("return document.body.scrollHeight")

    while True:
        # Скроллим страницу вниз
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Ждем, пока подгрузится новый контент
        time.sleep(SCROLL_PAUSE_TIME)

        # Вычисляем новую высоту страницы и сравниваем с предыдущей
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            # Если высота не изменилась, значит, мы достигли конца страницы
            break
        last_height = new_height


    # После завершения скроллинга ищем все ссылки
    links = driver.find_elements(By.TAG_NAME, "a")

    # Выводим ссылки, начинающиеся с 'https://'
    for link in links:
        href = link.get_attribute('href')
        if href and href.startswith(''):
            if '/blogs/' in href:
                lst.append(href)


    print(len(lst))
    print(lst)
# Закрываем браузер
driver.quit()
