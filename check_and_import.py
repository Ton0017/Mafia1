import os
import shutil
from PIL import Image

src_dir = os.path.expanduser('~/storage/downloads/noir city new')
dest_sprites = 'assets/sprites'
dest_bg = 'assets/backgrounds'

print("=== РАЗМЕРЫ СТАРЫХ СПРАЙТОВ ===")
for f in sorted(os.listdir(dest_sprites)):
    if f.startswith('man') or f.startswith('women'):
        try:
            img = Image.open(os.path.join(dest_sprites, f))
            print(f"{f}: {img.size[0]}x{img.size[1]}")
        except Exception as e:
            print(f"{f}: ошибка чтения")

print("\n=== РАЗМЕРЫ НОВЫХ СПРАЙТОВ (из Загрузок) ===")
if not os.path.exists(src_dir):
    print(f"ОШИБКА: Папка {src_dir} не найдена. Проверь путь и termux-setup-storage.")
else:
    rename_map = {
        'police.jpg': 'role_police.jpg',
        'police chief.jpg': 'role_police_chief.jpg',
        'detective.jpg': 'role_detective.jpg',
        'mafia bandit.jpg': 'role_bandit.jpg',
        'bartender.jpg': 'role_bartender.jpg',
        'woman citizen.jpg': 'role_woman_citizen.jpg',
        'sex scene.jpg': 'sex_scene.jpg'
    }

    os.makedirs(dest_bg, exist_ok=True)

    for filename in os.listdir(src_dir):
        src_path = os.path.join(src_dir, filename)
        if not os.path.isfile(src_path): continue

        # Проверяем размеры всех JPG
        if filename.endswith('.jpg'):
            try:
                img = Image.open(src_path)
                print(f"{filename}: {img.size[0]}x{img.size[1]}")
            except:
                pass

        # Копируем фоны
        if filename.startswith('background'):
            shutil.copy2(src_path, os.path.join(dest_bg, filename))
            print(f"-> Скопирован фон: {filename}")
        
        # Копируем роли (не трогая старые man.png/women.png)
        elif filename in rename_map:
            new_name = rename_map[filename]
            dest_path = os.path.join(dest_sprites, new_name)
            shutil.copy2(src_path, dest_path)
            print(f"-> Скопирован спрайт: {filename} -> {new_name}")

    print("\nГОТОВО. Старые спрайты не тронуты, новые добавлены.")
