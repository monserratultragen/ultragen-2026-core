import os
import django
import decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

from core.models import MercadoUmbralCyborg

productos_darkweb = [
  {
    "id": 23,
    "codigo": "DX-23A",
    "nombre": "Anna", 
    "descripcion": "Androide imitando a una joven suiza, con piel suave y delicado aroma a flores alpinas. Su voz melódica y risueña cautiva al oído, proyectando armonía y serenidad.",
    "humano": False,
    "edad": 0,
    "nacionalidad": "Suiza",
    "estado": "Disponible",
    "stock": 2,
    "precio": "₿12.0",
    "materialConstruccion": "Aleación de titanio reforzado",
    "pielSintetica": "Silicona 3ª generación hiperrealista",
    "densidadCabello": "2500 cabellos/cm²",
    "chipVersion": "V4.2 Neural Sync",
    "bandera": "ch.png",
    "imagenes": ["androide_d_1.jpeg"],
  },
  {
    "id": 24,
    "codigo": "DX-24B",
    "nombre": "Elena", 
    "descripcion": "Androide imitando a una mujer rusa, de tez clara y aroma fresco como la nieve del norte. Sus gestos suaves y pronunciación elegante encantan al oído y transmiten confianza.",
    "humano": False,
    "edad": 0,
    "nacionalidad": "Rusa",
    "estado": "Agotada",
    "stock": 0, 
    "precio": "₿11.8",
    "materialConstruccion": "Acero inoxidable premium",
    "pielSintetica": "Silicona estándar 2ª generación",
    "densidadCabello": "2000 cabellos/cm²",
    "chipVersion": "V3.5 Core",
    "bandera": "ru.png",
    "imagenes": ["androide_a_1.jpeg"],
  },
  {
    "id": 25,
    "codigo": "DX-25C",
    "nombre": "Maya", 
    "descripcion": "Androide simulando a una joven india, con piel cálida y aroma sutil a jazmín. Su voz suave y cadenciosa crea una sensación de calma y cercanía.",
    "humano": False,
    "edad": 0,
    "nacionalidad": "India",
    "estado": "Disponible",
    "stock": 3,
    "precio": "₿9.5",
    "materialConstruccion": "Polímero orgánico reforzado",
    "pielSintetica": "Composición híbrida mate",
    "densidadCabello": "1800 cabellos/cm²",
    "chipVersion": "V3.2 Basic AI",
    "bandera": "in.png",
    "imagenes": ["androide_c_1.jpeg"],
  },
  {
    "id": 26,
    "codigo": "DX-26D",
    "nombre": "Lea", 
    "descripcion": "Androide imitando a una mujer francesa, con perfume tenue a lavanda y voz melodiosa que acaricia el oído. Sus gestos delicados evocan elegancia natural.",
    "humano": False,
    "edad": 0,
    "nacionalidad": "Francesa",
    "estado": "Disponible",
    "stock": 1,
    "precio": "₿12.5",
    "materialConstruccion": "Carbono ligero de alta resistencia",
    "pielSintetica": "Silicona 3ª generación premium",
    "densidadCabello": "2400 cabellos/cm²",
    "chipVersion": "V4.3 Neural Emotion",
    "bandera": "fr.png",
    "imagenes": ["androide_f_1.jpeg"],
  },
  {
    "id": 27,
    "codigo": "DX-27G",
    "nombre": "Aiko", 
    "descripcion": "Androide de origen japonés con estética refinada y minimalista. Su piel clara presenta textura seda sintética con detalles de precisión milimétrica. Optimizada para respuestas rápidas en interacción social avanzada.",
    "humano": False,
    "edad": 0,
    "nacionalidad": "Japonesa",
    "estado": "Disponible",
    "stock": 2,
    "precio": "₿13.2",
    "materialConstruccion": "Nano-cerámica reforzada con carbono",
    "pielSintetica": "Dermis sintética Shinkai v2.1",
    "densidadCabello": "2700 cabellos/cm²",
    "chipVersion": "V5.0 Quantum Sync",
    "bandera": "jp.png",
    "imagenes": ["androide_g_1.jpeg"],
  },
  {
    "id": 28,
    "codigo": "DX-28H",
    "nombre": "Emily Carter", 
    "descripcion": "Androide imitando a una joven estadounidense de carácter extrovertido. Incluye modulador de acento configurable (Nueva York, California, Texas). Su diseño busca proyectar vitalidad y cercanía.",
    "humano": False,
    "edad": 0,
    "nacionalidad": "Estadounidense",
    "estado": "Disponible",
    "stock": 4,
    "precio": "₿14.0",
    "materialConstruccion": "Aleación aeroespacial grado militar",
    "pielSintetica": "Silicona HDX con nanoporos dinámicos",
    "densidadCabello": "2600 cabellos/cm²",
    "chipVersion": "V4.9 Adaptive Neural",
    "bandera": "us.png",
    "imagenes": ["androide_h_1.jpeg"],
  },
  {
    "id": 29,
    "codigo": "DX-29B",
    "nombre": "Ngozi", 
    "descripcion": "Androide inspirado en una mujer nigeriana. Su tono de piel es oscuro con pigmentación precisa y resistente al desgaste. El chip integra un sistema de aprendizaje de patrones sociales multiculturales.",
    "humano": False,
    "edad": 0,
    "nacionalidad": "Nigeriana",
    "estado": "Disponible",
    "stock": 3,
    "precio": "₿10.8",
    "materialConstruccion": "Compuesto polímero reforzado con kevlar",
    "pielSintetica": "Epidermis híbrida resistente a climas extremos",
    "densidadCabello": "1900 cabellos/cm²",
    "chipVersion": "V3.8 Ethno AI Core",
    "bandera": "ng.png",
    "imagenes": ["androide_b_1.jpeg"],
  },
  {
    "id": 30,
    "codigo": "DX-30E",
    "nombre": "Siobhan", 
    "descripcion": "Androide diseñado con estética irlandesa. Piel clara con detalles de pecas artificiales y voz dulce calibrada con acento celta. Ideal para entornos de interacción cultural.",
    "humano": False,
    "edad": 0,
    "nacionalidad": "Irlandesa",
    "estado": "Disponible",
    "stock": 1,
    "precio": "₿12.9",
    "materialConstruccion": "Fibra de carbono ultraligera",
    "pielSintetica": "Silicona 4ª generación translúcida",
    "densidadCabello": "2300 cabellos/cm²",
    "chipVersion": "V4.4 Cognitive Harmony",
    "bandera": "ie.png",
    "imagenes": ["androide_e_1.jpeg"],
  },
]

print("Iniciando importación de Cyborgs...")

for item in productos_darkweb:
    # Clean price string
    price_str = item['precio'].replace('₿', '').strip()
    price = decimal.Decimal(price_str)
    
    # Determine availability
    disponible = item['stock'] > 0
    
    obj, created = MercadoUmbralCyborg.objects.update_or_create(
        codigo=item['codigo'],
        defaults={
            'nombre': item['nombre'],
            'descripcion': item['descripcion'],
            'humano': item['humano'],
            'edad': item['edad'],
            'nacionalidad': item['nacionalidad'],
            'disponible': disponible,
            'stock': item['stock'],
            'precio': price,
            'material_construccion': item['materialConstruccion'],
            'piel_sintetica': item['pielSintetica'],
            'densidad_cabello': item['densidadCabello'],
            'chip_version': item['chipVersion'],
        }
    )
    
    action = "Creado" if created else "Actualizado"
    print(f"[{action}] {obj.nombre} ({obj.codigo})")

print("Importación completada.")
