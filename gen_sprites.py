import os
from PIL import Image, ImageDraw

def create_base():
    # Создаем черно-белое изображение 32x32
    return Image.new('1', (32, 32), 0)

def draw_don():
    img = create_base()
    d = ImageDraw.Draw(img)
    # Плечи (пальто)
    d.polygon([(0, 32), (10, 24), (22, 24), (32, 32)], fill=1)
    # Лицо
    d.rectangle([10, 12, 22, 25], fill=1)
    # Тень от шляпы (глаза скрыты)
    d.rectangle([10, 14, 22, 18], fill=0)
    # Глаза (белые точки)
    d.point((13, 16), fill=1)
    d.point((19, 16), fill=1)
    # Шляпа
    d.polygon([(6, 12), (26, 12), (22, 2), (10, 2)], fill=1) # Тулейка
    d.rectangle([2, 12, 30, 14], fill=1) # Поля
    # Вырез рубашки
    d.polygon([(14, 25), (18, 25), (16, 30)], fill=0)
    return img

def draw_femme():
    img = create_base()
    d = ImageDraw.Draw(img)
    # Плечи (платье)
    d.polygon([(0, 32), (12, 26), (20, 26), (32, 32)], fill=1)
    # Шея
    d.rectangle([14, 20, 18, 26], fill=1)
    # Лицо
    d.ellipse([10, 8, 22, 22], fill=1)
    # Шляпа (широкие поля)
    d.ellipse([2, 4, 30, 10], fill=1)
    d.ellipse([8, 0, 24, 8], fill=1)
    # Вуаль (сетка)
    d.line([(10, 12), (22, 12)], fill=0)
    d.line([(10, 14), (22, 14)], fill=0)
    d.line([(10, 16), (22, 16)], fill=0)
    d.line([(12, 10), (12, 18)], fill=0)
    d.line([(16, 10), (16, 18)], fill=0)
    d.line([(20, 10), (20, 18)], fill=0)
    # Губы
    d.rectangle([14, 19, 18, 20], fill=0)
    # Сигарета с мундштуком
    d.line([(18, 20), (26, 18)], fill=1)
    return img

def draw_cop():
    img = create_base()
    d = ImageDraw.Draw(img)
    # Форма
    d.polygon([(0, 32), (8, 26), (24, 26), (32, 32)], fill=1)
    # Галстук
    d.polygon([(15, 26), (17, 26), (16, 32)], fill=0)
    # Лицо
    d.rectangle([10, 10, 22, 26], fill=1)
    # Фуражка
    d.ellipse([8, 4, 24, 12], fill=1)
    d.rectangle([6, 10, 26, 12], fill=1) # Козырёк
    # Тень от козырька
    d.rectangle([10, 12, 22, 14], fill=0)
    # Глаза
    d.point((13, 15), fill=1)
    d.point((19, 15), fill=1)
    # Усы
    d.rectangle([13, 19, 19, 20], fill=0)
    # Звезда на груди
    d.point((8, 29), fill=1)
    return img

def draw_thug():
    img = create_base()
    d = ImageDraw.Draw(img)
    # Куртка
    d.polygon([(0, 32), (8, 24), (24, 24), (32, 32)], fill=1)
    # Лицо
    d.rectangle([9, 10, 23, 24], fill=1)
    # Кепка
    d.polygon([(8, 10), (24, 10), (22, 4), (10, 4)], fill=1)
    d.rectangle([8, 10, 24, 11], fill=1)
    # Шрам
    d.line([(20, 12), (22, 18)], fill=0)
    # Глаза
    d.point((12, 15), fill=0)
    d.point((19, 15), fill=0)
    # Щетина (точки)
    for i in range(11, 22, 2):
        d.point((i, 22), fill=0)
        d.point((i+1, 23), fill=0)
    return img

sprites = {
    'don': draw_don(),
    'femme': draw_femme(),
    'cop': draw_cop(),
    'thug': draw_thug()
}

os.makedirs('assets/sprites', exist_ok=True)
for name, img in sprites.items():
    # Увеличиваем в 8 раз (получается 256x256, пиксели остаются четкими)
    img = img.resize((256, 256), Image.NEAREST)
    img.save(f'assets/sprites/{name}.png')
    print(f'Создан assets/sprites/{name}.png')
