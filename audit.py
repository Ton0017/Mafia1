import re

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_block(content, block_name):
    m = re.search(r'const ' + block_name + r' = \{(.+?)\n\};', content, re.DOTALL)
    if not m: return ""
    return m.group(1)

print("════════ АУДИТ НАВИГАЦИИ (v2) ════════\n")
s = read_file('js/ui/screens.js')

screens_body = extract_block(s, 'Screens')
actions_body = extract_block(s, 'Actions')

# 1. Экраны
screens = re.findall(r'^  (\w+)\([^)]*\) \{', screens_body, re.MULTILINE)
print("--- Экраны и кнопки выхода ---")
broken = []
for name in screens:
    idx = screens_body.find(f'  {name}(')
    end_idx = screens_body.find('  },', idx)
    body = screens_body[idx:end_idx]
    
    has_exit = ('go("city")' in body or 'go("menu")' in body or 
                'go("bar")' in body or 'go("quests")' in body or 
                'combatFinish' in body or 'pokerLeave' in body or 
                'resolveEvent' in body or 'copAction' in body)
    if not has_exit and name not in ('menu', 'create', 'combat'):
        broken.append(name)
        print(f"❌ {name}")
    else:
        print(f"✅ {name}")

if not broken:
    print("\n✅ ВСЕ ЭКРАНЫ ИМЕЮТ ВЫХОД.")

# 2. Мёртвые Actions
print("\n--- Мёртвые кнопки (Actions) ---")
actions_def = set(re.findall(r'^  (\w+)\([^)]*\) \{', actions_body, re.MULTILINE))
actions_call = set(re.findall(r'Actions\.(\w+)\s*\(', s))
missing = actions_call - actions_def
if missing:
    print(f"❌ НЕТ В КОДЕ: {', '.join(missing)}")
else:
    print("✅ Все Actions существуют.")
