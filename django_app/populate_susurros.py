import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

from core.models import Susurro

DATA = [
    # DESKTOP
    ('desktop', 4, 'He pasado demasiados años aquí… solo con su recuerdo.', True),
    ('desktop', 4, 'Este escritorio me ha visto envejecer esperando algo que no vuelve.', True),
    ('desktop', 3, 'Cada noche termino hablándole a su ausencia.', True),
    ('desktop', 4, 'Todo lo que soy ahora nació de esta soledad interminable.', True),
    ('desktop', 4, 'Nada se mueve aquí… excepto mi obsesión por ella.', True),

    # DIARIOS
    ('diarios', 4, 'Aquí escribió su vida… y yo pago el precio de leerla.', True),
    ('diarios', 4, 'Cada nombre que aparece me atraviesa como un error irreparable.', True),
    ('diarios', 3, 'Amó, sufrió, siguió adelante… sin mí.', True),
    ('diarios', 4, 'Todas las pistas están aquí… junto a todo lo que me destruye.', True),
    ('diarios', 4, 'Leerla es entender cuánto nunca fui suficiente.', True),

    # TOMOS
    ('tomos', 4, 'Aún no los abro… sé lo que pueden hacerme.', True),
    ('tomos', 3, 'Cada tomo guarda más verdades que no quiero aceptar.', True),
    ('tomos', 4, 'Cuanto más avanzo, más lejos siento que estuvo de mí.', True),
    ('tomos', 3, 'No sé si busco pistas… o castigo.', True),
    ('tomos', 4, 'Aquí está su historia… y mi derrota.', True),

    # WHATSAPP
    ('whatsapp', 3, 'Mensajes que nunca fueron para mí.', True),
    ('whatsapp', 4, 'Aquí concreta encuentros… y yo los leo uno por uno.', True),
    ('whatsapp', 3, 'Cada chat duele… pero cada chat sirve.', True),
    ('whatsapp', 4, 'Esta es la parte más sucia… y la más útil.', True),
    ('whatsapp', 3, 'Me repugna leer esto… pero necesito saber.', True),

    # INSTAGRAM
    ('instagram', 2, 'Aquí todavía puedo verla… hermosa como siempre.', True),
    ('instagram', 3, 'Cada imagen me recuerda por qué nunca la olvidé.', True),
    ('instagram', 2, 'Ella sonríe… y el mundo no sabe lo que perdí.', True),
    ('instagram', 3, 'Si pudiera entrar en una sola de estas fotos…', True),
    ('instagram', 3, 'Todo mi amor sigue intacto aquí.', True),

    # EXPEDIENTES
    ('expedientes', 3, 'Esto nunca debí tenerlo… pero lo guardé todo.', True),
    ('expedientes', 4, 'Aquí explican cómo fue posible arrebatarme su destino.', True),
    ('expedientes', 3, 'Informes fríos para justificar lo imperdonable.', True),
    ('expedientes', 4, 'Cada documento revela cuánto sabían.', True),
    ('expedientes', 3, 'La verdad estaba escrita… solo había que robarla.', True),

    # TABLET
    ('tablet', 4, 'Este video lo explica todo… o eso temo.', True),
    ('tablet', 3, 'Ultragen… siempre oculto detrás de palabras limpias.', True),
    ('tablet', 4, 'Si reproduzco esto… nada volverá a ser igual.', True),

    # DARKWEB
    ('darkweb', 4, 'Aquí la humanidad se vende sin vergüenza.', True),
    ('darkweb', 4, 'Este lugar existe porque demasiados miran hacia otro lado.', True),
    ('darkweb', 3, 'Todo aquí huele a abuso y silencio.', True),
    ('darkweb', 4, 'Monserrat nunca debió estar cerca de esto.', True),
    ('darkweb', 3, 'Entrar aquí fue perder otra parte de mí.', True),

    # CYBORGS
    ('cyborgs', 3, 'No sienten… no sufren… no son ella.', True),
    ('cyborgs', 3, 'Las diseñaron para obedecer, no para vivir.', True),
    ('cyborgs', 2, 'Nada artificial puede reemplazarla.', True),
    ('cyborgs', 3, 'Aquí la ética murió primero.', True),
    ('cyborgs', 3, 'Esto nunca fue el problema real.', True),

    # ORDENES
    ('ordenes', 4, 'Yo también hice pedidos… y cargo con eso.', True),
    ('ordenes', 4, 'Fue la única forma de entrar.', True),
    ('ordenes', 3, 'Pedí para romper el sistema desde dentro.', True),
    ('ordenes', 4, 'Dos chicas salieron libres… al menos eso.', True),
    ('ordenes', 3, 'No todos mis actos fueron limpios.', True),

    # HUMANAS
    ('humanas', 4, 'Aquí el horror ya no se disimula.', True),
    ('humanas', 4, 'Las venden como si fueran objetos.', True),
    ('humanas', 4, 'Cada rostro aquí grita en silencio.', True),
    ('humanas', 4, 'Esto es lo más podrido que he visto.', True),
    ('humanas', 4, 'Nadie debería existir en esta sección.', True),

    # LINEA TEMPORAL
    ('linea_temporal', 3, 'Aquí todo cobra un sentido cruel.', True),
    ('linea_temporal', 3, 'Cada evento empujó su destino un poco más.', True),
    ('linea_temporal', 4, 'Nada fue casual… nunca.', True),
    ('linea_temporal', 3, 'Puedo ver cuándo la perdí.', True),
    ('linea_temporal', 4, 'El tiempo siempre jugó en mi contra.', True),

    # MURALES
    ('murales', 4, 'Todo está conectado… demasiado.', True),
    ('murales', 4, 'Estas fotos no debieron existir.', True),
    ('murales', 3, 'La mosca vio más de lo que imaginé.', True),
    ('murales', 4, 'Cada hilo lleva de vuelta a ella.', True),
    ('murales', 4, 'He convertido mi vida en un mapa obsesivo.', True),
]

def populate():
    print("Populating Susurros...")
    count = 0
    for seccion, duracion, susurro, activado in DATA:
        Susurro.objects.create(
            seccion=seccion,
            duracion=duracion,
            susurro=susurro,
            activado=activado
        )
        count += 1
    print(f"Successfully created {count} susurros.")

if __name__ == '__main__':
    populate()
