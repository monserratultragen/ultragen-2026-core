import json

data_dump_path = 'c:/ultragen2026/ultragen_manager/django_app/data_dump.json'

with open(data_dump_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

chapters = [item for item in data if item['model'] == 'core.capitulo']
print(f"Total capítulos en data_dump.json: {len(chapters)}")

# Mostrar los últimos 5 por PK (asumiendo que los nuevos tienen PKs más altas)
chapters_sorted = sorted(chapters, key=lambda x: x['pk'], reverse=True)
print("\nÚltimos 5 capítulos en el dump:")
for c in chapters_sorted[:5]:
    fields = c['fields']
    print(f"PK: {c['pk']}, Nombre: {fields['nombre']}, Activo: {fields['is_active']}")
