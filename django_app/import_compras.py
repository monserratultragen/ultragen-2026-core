import os
import django
import decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

from core.models import MercadoUmbralCompra

compras = [
  {
    "id": 102054,
    "nombre": 'Chloe Lancaster',
    "codigo": 'US-22Q',
    "precio": '₿1.25',
    "imagen": 'hist1.jpeg'
  },
  {
    "id": 102106,
    "nombre": 'Avery Sinclair',
    "codigo": 'US-17X',
    "precio": '₿0.95',
    "imagen": 'hist2.jpeg'
  },
]

print("Iniciando importación de Compras...")

for item in compras:
    # Clean price string
    price_str = item['precio'].replace('₿', '').strip()
    price = decimal.Decimal(price_str)
    
    # Map JSON id to itemid
    item_id = str(item['id'])
    
    obj, created = MercadoUmbralCompra.objects.update_or_create(
        codigo=item['codigo'],
        defaults={
            'nombre': item['nombre'],
            'itemid': item_id,
            'precio': price,
            # 'imagen': item['imagen'] # Skipping image as we don't have the files
        }
    )
    
    action = "Creada" if created else "Actualizada"
    print(f"[{action}] {obj.nombre} ({obj.codigo})")

print("Importación completada.")
