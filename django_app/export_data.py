import os
import django
import json
from django.core import serializers
from django.apps import apps

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

# Modelos listados en MANAGER_LOAD_STABLE.py
model_names = [
    'core.diario', 'core.tomo', 'core.capitulo', 'core.personaje',
    'core.expediente', 'core.tablero', 'core.recuerdoleticia',
    'core.promptai', 'core.capituloimagen', 'core.capituloslap',
    'core.capitulopista', 'core.capituloprompt'
]

all_objects = []

for m_name in model_names:
    try:
        model = apps.get_model(m_name)
        objs = model.objects.all()
        all_objects.extend(list(objs))
        print(f"Exportando {m_name}: {objs.count()} objetos")
    except LookupError:
        print(f"Advertencia: Modelo {m_name} no encontrado")

# Serializar a JSON
data = serializers.serialize("json", all_objects, indent=2)

# Guardar con UTF-8 explícito
with open("data_dump_fix.json", "w", encoding="utf-8") as f:
    f.write(data)

print(f"\nExportación completada exitosamente en data_dump_fix.json")
print(f"Total objetos exportados: {len(all_objects)}")
