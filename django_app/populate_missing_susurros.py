import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

from core.models import Susurro

DATA = [
    # PAGINABASE
    ('paginabase', 3, 'Este sitio es un laberinto de recuerdos rotos.', True),
    ('paginabase', 4, 'No hay salida, solo vuelvo al mismo dolor.', True),
    ('paginabase', 3, 'El fondo siempre es oscuro aquí.', True),
    ('paginabase', 5, 'Cada clic me aleja más de lo que fui.', True),

    # AUTENTICACION
    ('autenticacion', 4, '¿Quién soy yo después de todo esto?', True),
    ('autenticacion', 3, 'Acceso concedido al infierno.', True),
    ('autenticacion', 4, 'Mi identidad se perdió con ella.', True),
    ('autenticacion', 3, 'No hay contraseña que borre el pasado.', True),

    # BIENVENIDA
    ('bienvenida', 3, 'Bienvenido a mi insomnio.', True),
    ('bienvenida', 4, 'Si entras, no saldrás igual.', True),
    ('bienvenida', 3, 'Aquí solo habita el eco de su voz.', True),
    ('bienvenida', 5, 'Hola... de nuevo a la soledad.', True),

    # MOVIL
    ('movil', 3, 'Llevo su ausencia en el bolsillo.', True),
    ('movil', 4, 'Pantalla pequeña para un dolor tan grande.', True),
    ('movil', 3, 'Siempre conectado a su recuerdo.', True),
    ('movil', 4, 'Vibraciones fantasmas... creo que es ella.', True),

    # PISTAS
    ('pistas', 4, 'Fragmentos que cortan al tocarlos.', True),
    ('pistas', 3, '¿Verdad o trampa? Ya no distingo.', True),
    ('pistas', 4, 'Seguir el rastro me destruye.', True),
    ('pistas', 5, 'Cada pista es una herida abierta.', True),

    # LAPTOP
    ('laptop', 4, 'Teclas frías... como su adiós.', True),
    ('laptop', 3, 'La luz de esta pantalla no calienta.', True),
    ('laptop', 4, 'Archivos corruptos, igual que mi memoria.', True),
    ('laptop', 3, 'Escribo para no olvidar... o para morir.', True),
]

def populate():
    print("Populating Missing Susurros...")
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
