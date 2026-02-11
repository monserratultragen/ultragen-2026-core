import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

from core.models import Presentacion, Slide

# Data
typing_effect_data = [
    {
    "screen": 1,
    "paragraph": 1,
    "text": 'Oficialmente, UltraGen no existe. La compañía opera clandestinamente y la ubicación de sus laboratorios es un secreto celosamente guardado. '
    },
    {
    "screen": 1,
    "paragraph": 2,
    "text": 'Cada miembro de UltraGen es un delincuente, un experto en alguna forma de arte oscuro o ciencia retorcida, todos atraídos por el negocio millonario de la clonación humana.'
    },
    {
    "screen": 1,
    "paragraph": 3,
    "text": 'Los productos de UltraGen son exclusivamente mujeres, diseñadas con un propósito único y siniestro: la venta en subastas clandestinas. Allí, hombres depravados con oscuros deseos las adquieren para la prostitución, explotación sexual, esclavitud y otros destinos inimaginables. Estas creaciones, aunque antificiales, están destinadas a satisfacer los caprichos más oscuros de sus dueños.'
    },
    {
    "screen": 1,
    "paragraph": 4,
    "text": 'Durante años, UltraGen produjo cyborgs mecánicos que imitaban con precisión a los seres humanos reales. Sin embargo, la compañía llevó su tecnología a un nuevo nivel hace solo un año. Lanzaron un prototipo completamente biológico, sin implantes cibernéticos, pero potenciado con avanzadas modificaciones genéticas. Esta unidad, creada a partir de los genes de actrices atractivas, bailarinas gráciles y deportistas de élite, fue codificada como M1 y recibió el nombre de Monserrat.'
    },
    {
    "screen": 1,
    "paragraph": 5,
    "text": 'Monserrat tiene un cuerpo bio-modificado diseñado para la perfección femenina. Sus tecnologías biológicas avanzadas incluyen la capacidad de inducir multiorgasmos mediante microfibras nerviosas sensibles que amplifican el estímulo. También puede experimentar placer a través de la tortura, y controlar su propia lubricación vaginal.'
    },
    {
    "screen": 1,
    "paragraph": 6,
    "text": 'Las paredes del recto anal tienen una compleja concentración de nervios sensores para el placer. Monserrat puede controlar con precisión la presión y succión en sus cavidades vaginales y anales, ajustando la sensibilidad y el placer a las preferencias de su cliente. Además, posee una capacidad de regeneración física asombrosa, permitiéndole recuperarse rápidamente de heridas, cortes o mutilaciones.'
    },
    {
    "screen": 1,
    "paragraph": 7,
    "text": 'Se rumorea que todos los productos de UltraGen están equipados con un chip inhibidor de voluntad, entregado a su comprador para asegurar la obediencia total. Este chip obliga a las unidades a seguir órdenes inviolables, transformandolos en meros instrumentos de placer y servidumbre, atrapados en una existencia de degradación perpetua.'
    },
    {
    "screen": 1,
    "paragraph": 8,
    "text": 'En la Deep Web, los agentes de las principales mafias vigilan con ansiedad, esperando el codiciado aviso de venta que anunciará la llegada de Monserrat al mercado.'
    }
]

print("Iniciando importación de Slides...")

try:
    presentacion = Presentacion.objects.get(titulo="ultragen")
except Presentacion.DoesNotExist:
    print("Error: No se encontró la presentación 'ultragen'. Créala primero.")
    exit(1)

# Optional: Clear existing slides for this presentation to avoid duplicates if running multiple times?
# User didn't ask to clear, but "agregaremos" implies adding. 
# I will just add them.

for item in typing_effect_data:
    slide = Slide.objects.create(
        presentacion=presentacion,
        orden=item['screen'], # Mapping screen -> orden as requested
        contenido=item['text'] # Mapping text -> contenido
    )
    print(f"[Creado] Slide {slide.id} (Orden {slide.orden})")

print("Importación completada.")
