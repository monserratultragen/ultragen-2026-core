import os
import django
import decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

from core.models import MercadoUmbralHumano

productos_darkweb_humanas = [
  {
    "id": 230523,
    "codigo": "H-23A",
    "nombre": "Lena Bauer",
    "descripcion": "Originaria de Hamburgo. Capturada en la noche de un 12 de marzo.",
    "humano": True,
    "edad": 24,
    "nacionalidad": "Irlandesa",
    "bandera": "ie.png",
    "estado": "Disponible",
    "buscada": True,
    "precio": "₿3.8",
    "imagenes": ["irlandesa1.jpeg","irlandesa2.jpeg","irlandesa3.jpeg","irlandesa4.jpeg","irlandesa5.jpeg","irlandesa6.jpeg","irlandesa7.jpeg","irlandesa8.jpeg","irlandesa9.jpeg"],
  },
  {
    "id": 230529, 
    "codigo": "H-23B",
    "nombre": "Hana Takahashi",
    "descripcion": "Proveniente de Kioto, desaparecida durante un festival de otoño. Tez clara.",
    "humano": True,
    "edad": 18,
    "nacionalidad": "Japonesa",
    "bandera": "jp.png",
    "estado": "Disponible",
    "buscada": False,
    "precio": "₿1.5",
    "imagenes": ["japonesa1.jpeg","japonesa2.jpeg","japonesa3.jpeg","japonesa4.jpeg","japonesa5.jpeg","japonesa6.jpeg"],
  },
  {
    "id": 230534, 
    "codigo": "H-23C",
    "nombre": "Javiera Rojas",
    "descripcion": "Desde Valparaíso, desaparecida en un callejón del puerto a medianoche. Cabello castaño.",
    "humano": True,
    "edad": 22,
    "nacionalidad": "Chilena",
    "bandera": "cl.png",
    "estado": "Disponible",
    "buscada": True,
    "precio": "₿0.9",
    "imagenes": ["chilena1.jpeg","chilena2.jpeg","chilena3.jpeg","chilena4.jpeg","chilena5.jpeg","chilena6.jpeg"],
  },
  {
    "id": 230541, 
    "codigo": "H-23D",
    "nombre": "Isabela Santos",
    "descripcion": "Natural de Río de Janeiro, capturada durante un carnaval nocturno. Piel cálida y cabellos oscuros.",
    "humano": True,
    "edad": 18,
    "nacionalidad": "Brasileña",
    "bandera": "br.png",
    "estado": "Disponible",
    "buscada": False,
    "precio": "₿1.2",
    "imagenes": ["brasilera1.jpeg","brasilera2.jpeg","brasilera3.jpeg","brasilera4.jpeg","brasilera5.jpeg"],
  },
  {
    "id": 230548, 
    "codigo": "H-23E",
    "nombre": "Susane Nilsson",
    "descripcion": "Procedente de Estocolmo, desaparecida en la oscuridad de un bosque nevado. Cabellos rubios.",
    "humano": True,
    "edad": 27,
    "nacionalidad": "Sueca",
    "bandera": "se.png",
    "estado": "Disponible",
    "buscada": True,
    "precio": "₿4.2",
    "imagenes": ["sueca1.jpeg","sueca2.jpeg","sueca3.jpeg","sueca4.jpeg","sueca5.jpeg","sueca6.jpeg"],
  },
  {
    "id": 230555, 
    "codigo": "H-23F",
    "nombre": "Linda Castañeda",
    "descripcion": "Originaria de Ciudad de México, capturada al caer la noche en un mercado antiguo. Cabellos oscuros.",
    "humano": True,
    "edad": 18,
    "nacionalidad": "Mexicana",
    "bandera": "mx.png",
    "estado": "Disponible",
    "buscada": False,
    "precio": "₿0.8",
    "imagenes": ["mexicana1.jpeg","mexicana2.jpeg","mexicana3.jpeg"],
  },
  {
    "id": 230562, 
    "codigo": "H-23G",
    "nombre": "Giulia Romano",
    "descripcion": "De Roma, desaparecida en los callejones del Trastevere. Piel clara, cabellos castaños.",
    "humano": True,
    "edad": 23,
    "nacionalidad": "Italiana",
    "bandera": "it.png",
    "estado": "Disponible",
    "buscada": True,
    "precio": "₿3.5",
    "imagenes": ["italiana1.jpeg","italiana2.jpeg","italiana3.jpeg","italiana4.jpeg","italiana5.jpeg","italiana6.jpeg"],
  },
  {
    "id": 230570, 
    "codigo": "H-23H",
    "nombre": "Camille Dubois",
    "descripcion": "Proveniente de París, capturada cerca del Sena a medianoche. Cabello rubio, tez clara.",
    "humano": True,
    "edad": 24,
    "nacionalidad": "Francesa",
    "bandera": "fr.png",
    "estado": "Disponible",
    "buscada": True,
    "precio": "₿4.0",
    "imagenes": ["francesa1.jpeg","francesa2.jpeg","francesa3.jpeg","francesa4.jpeg","francesa5.jpeg","francesa6.jpeg"],
  },
  {
    "id": 230578, 
    "codigo": "H-23I",
    "nombre": "Sabrina Álvarez",
    "descripcion": "Nacida en Rosario, Argentina. Desaparecida durante una tormenta en la ruta costera del Paraná.",
    "humano": True,
    "edad": 19,
    "nacionalidad": "Argentina",
    "bandera: ": "ar.png",
    "estado": "Disponible",
    "buscada": False,
    "precio": "₿1.0",
    "imagenes": ["argentina1.jpeg","argentina2.jpeg","argentina3.jpeg","argentina4.jpeg","argentina5.jpeg","argentina6.jpeg","argentina7.jpeg","argentina8.jpeg","argentina9.jpeg"],
  }
]

print("Iniciando importación de Humanos...")

for item in productos_darkweb_humanas:
    # Clean price string
    price_str = item['precio'].replace('₿', '').strip()
    price = decimal.Decimal(price_str)
    
    obj, created = MercadoUmbralHumano.objects.update_or_create(
        codigo=item['codigo'],
        defaults={
            'nombre': item['nombre'],
            'descripcion': item['descripcion'],
            'humano': item['humano'],
            'edad': item['edad'],
            'nacionalidad': item['nacionalidad'],
            'estado': item['estado'],
            'buscada': item['buscada'],
            'precio': price,
        }
    )
    
    action = "Creado" if created else "Actualizado"
    print(f"[{action}] {obj.nombre} ({obj.codigo})")

print("Importación completada.")
