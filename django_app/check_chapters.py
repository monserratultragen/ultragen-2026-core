import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

from core.models import Capitulo

print("Últimos 5 capítulos añadidos:")
for c in Capitulo.objects.all().order_by('-id')[:5]:
    print(f"ID: {c.id}, Nombre: {c.nombre}, Activo: {c.is_active}, Tomo: {c.tomo.nombre if c.tomo else 'None'}")
