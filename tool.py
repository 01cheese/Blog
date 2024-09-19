from datetime import datetime
import html

# Получение текущей даты в нужном формате
current_date = datetime.now()
dateNow = current_date.strftime("%B %d, %Y")

# Ввод заголовка поста
post_title = input("Enter your post title: ")

# Начальный и конечный HTML-код для поста
startCodeForPost = f"""
    <div class="container">
        <div class="post">
            <h1 class="post-title">{post_title}</h1>
            <p class="post-meta">Published on {dateNow} | Author: Vadym Zelenko</p>

            <div class="post-content">

    """
endCodeForPost = """
        </div>

    </div>
</div>
"""

# Базовый класс для элементов
class WebElement:
    def __init__(self, element_type, content):
        self.element_type = element_type
        self.content = content

    def render(self):
        return f"<{self.element_type}>{self.content}</{self.element_type}>\n"


class Header(WebElement):
    def __init__(self, header_level, content):
        super().__init__(f'h{header_level}', content)


class tag_p(WebElement):
    def __init__(self, content):
        super().__init__('p', content)


class tag_blockquote(WebElement):
    def __init__(self, content):
        super().__init__('blockquote', content)


class tag_img(WebElement):
    def __init__(self, src):
        self.src = src
        super().__init__('img', src)

    def render(self):
        return f"<img src='{self.src}' />\n"


class tag_ul(WebElement):
    def __init__(self, content):
        super().__init__('ul', content)

    def render(self):
        return f"<ul>{self.content}</ul>\n"


class tag_ol(WebElement):
    def __init__(self, content):
        super().__init__('ol', content)

    def render(self):
        return f"<ol>{self.content}</ol>\n"


class tag_table(WebElement):
    def __init__(self, head, body):
        self.head = head
        self.body = body
        super().__init__('table', head)

    def render(self):
        return f"<table><thead><tr>{self.head}</tr></thead><tbody>{self.body}</tbody></table>\n"


class tag_pre(WebElement):
    def __init__(self, code):
        self.code = code
        super().__init__('pre', code)

    def render(self):
        escaped_code = html.escape(self.code)
        return f"<pre>{escaped_code}</pre>\n"


# Класс для веб-страницы
class WebPage:
    def __init__(self):
        self.elements = []

    def add_element(self, element):
        self.elements.append(element)

    def render_page(self):
        html_content = startCodeForPost
        for element in self.elements:
            html_content += element.render()
        html_content += endCodeForPost
        return html_content


# Создание страницы и добавление элементов
filling = ""
page = WebPage()
counter = True

while (counter):
    choice = input("Enter tag: ")

    if choice == "p":                                      # tag p
        filling = input("Enter your <p>: ")
        p = tag_p(filling)
        page.add_element(p)

    elif choice.startswith("h"):                            # tag h1...h6
        level = int(choice[1]) if choice[1].isdigit() else 1
        filling = input(f"Enter your <h{level}>: ")
        header = Header(level, filling)
        page.add_element(header)

    elif choice == "img":                                   # tag img
        filling = input("Enter image source (src): ")
        img = tag_img(filling)
        page.add_element(img)

    elif choice == "pre":                                   # tag pre
        print("Enter your code (type 'END' on a new line to finish):")
        lines = []
        while True:
            line = input()
            if line.strip().upper() == "END":
                break
            lines.append(line)
        pre = tag_pre("\n".join(lines))
        page.add_element(pre)

    elif choice in ["bq", "blockquote", "quote"]:           # tag blockquote
        filling = input("Enter your <blockquote>: ")
        blockquote = tag_blockquote(filling)
        page.add_element(blockquote)

    elif choice == "table":                                 # tag table
        # Get table headers (th)
        list_th = []
        num_th = int(input("Enter number of <th>: "))
        for i in range(num_th):
            list_th.append("<th>" + input(f"Enter header {i+1}: ") + "</th>")
        thead = "\n".join(list_th)

        # Get table rows and columns (tr, td)
        list_tr = []
        num_tr = int(input("Enter number of <tr>: "))
        num_td = int(input("Enter number of <td>: "))
        for i in range(num_tr):
            list_td = []
            for j in range(num_td):
                list_td.append("<td>" + input(f"Enter row {i + 1}, column {j + 1}: ") + "</td>")
            tr = "\n".join(list_td)
            list_tr.append("<tr>" + tr + "</tr>")
        tbody = "\n".join(list_tr)

        table = tag_table(thead, tbody)
        page.add_element(table)

    elif choice == "ul":                                    # tag ul
        list_li = []
        num_li = int(input("Enter number of <li>: "))
        for i in range(num_li):
            list_li.append("<li>"+input(f"Enter item {i + 1}: ") + "</li>")
        ul = tag_ul("\n".join(list_li))
        page.add_element(ul)

    elif choice == "ol":                                    # tag ol
        list_li = []
        num_li = int(input("Enter number of <li>: "))
        for i in range(num_li):
            list_li.append("<li>"+input(f"Enter item {i + 1}: ") + "</li>")
        ol = tag_ol("\n".join(list_li))
        page.add_element(ol)

    elif choice in ["help", "HELP", "Help"]:
        print("'p' for <p>\n'h1' for <h1>\n'h2' for <h2>\n'ul' for <ul>\n'ol' for <ol>\n'table' for <table>\n'img' for <img>\n'pre' for <pre>, 0 to stop")
        print("print 'END' in end code for tag <pre>\n")

    elif choice == "0":
        counter = False

# Рендеринг HTML-страницы
data = page.render_page()

# Запись в файл
with open("example.html", "w") as file:
    file.write(data)

print("HTML file generated successfully!")
