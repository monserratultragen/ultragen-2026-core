import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

from core.models import MercadoUmbralNoticia

noticias = [
  { "id": 1, "titulo": 'Chip Neural NX-1982A', "fecha": '1982-05-20', "descripcion": 'Se lanza chip Neural NX-1982A, capacidad de procesamiento 2.4 GFLOPS, compatible con unidades androides de 1ª generación.' },
  { "id": 2, "titulo": 'Piel Sintética PS-84X', "fecha": '1984-09-15', "descripcion": 'Nueva piel sintética PS-84X, textura ultra-realista, resistencia a abrasión 1200 ciclos, compatible con chips NX-1982A y posteriores.' },
  { "id": 3, "titulo": 'Unidad Biológica', "fecha": '1988-03-10', "descripcion": 'Primera unidad biológica: Monserrat. Integración con chip Neural MB-88, piel biocompatible PB-88.' },
  { "id": 4, "titulo": 'Chip Neural NX-91B', "fecha": '1991-06-12', "descripcion": 'Actualización chip NX-91B, 4.8 GFLOPS, soporte multitarea avanzada, compatibilidad con piel PS-84X y PS-91A.' },
  { "id": 5, "titulo": 'Piel Sintética PS-94C', "fecha": '1994-11-05', "descripcion": 'Piel sintética PS-94C con sensación térmica y humedad simulada, mejoras en elasticidad y durabilidad.' },
  { "id": 6, "titulo": 'Chip Neural NX-97D', "fecha": '1997-08-23', "descripcion": 'Nuevo chip NX-97D, integración de red neural adaptativa y cifrado de datos interno para unidades androides.' },
  { "id": 7, "titulo": 'Piel Sintética PS-00A', "fecha": '2000-02-14', "descripcion": 'PS-00A: piel adaptable a temperatura y humedad ambiente, compatible con chips NX-97D y NX-00C.' },
  { "id": 8, "titulo": 'Chip Neural NX-03F', "fecha": '2003-10-19', "descripcion": 'Actualización NX-03F, aprendizaje autónomo, 12 GFLOPS, optimizado para simulación de comportamiento humano.' },
  { "id": 9, "titulo": 'Unidad Android Mejorada', "fecha": '2006-05-01', "descripcion": 'Nueva serie de androides con integración de chip NX-06H y piel sintética PS-06B, mejoras en reflejos y respuesta sensorial.' },
  { "id": 10, "titulo": 'Piel Sintética PS-09D', "fecha": '2009-07-07', "descripcion": 'PS-09D con tacto avanzado, resistencia a impactos menores y compatibilidad con chips NX-06H y NX-09C.' },
]

print("Iniciando importación de Noticias...")

for item in noticias:
    obj, created = MercadoUmbralNoticia.objects.update_or_create(
        titulo=item['titulo'],
        defaults={
            'descripcion': item['descripcion'],
            'fecha': item['fecha'],
        }
    )
    
    action = "Creada" if created else "Actualizada"
    print(f"[{action}] {obj.titulo}")

print("Importación completada.")
