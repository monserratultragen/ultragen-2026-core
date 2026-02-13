
import os
import sys
import django
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
django.setup()

def check():
    print("--- DIAGNOSTICO DE PRODUCCION ---")
    print(f"DEBUG: {settings.DEBUG}")
    print(f"DEFAULT_FILE_STORAGE (Setting): {getattr(settings, 'DEFAULT_FILE_STORAGE', 'No definido')}")
    
    try:
        print(f"STORAGES (Setting): {settings.STORAGES}")
    except AttributeError:
        print("STORAGES: No definido (Django < 4.2 o no configurado)")

    print(f"Storage Activo (Clase): {default_storage.__class__.__name__}")
    
    # Test file upload
    try:
        filename = 'cloud_test_verify.txt'
        if default_storage.exists(filename):
            default_storage.delete(filename)
            
        path = default_storage.save(filename, ContentFile(b'verificacion de nube'))
        url = default_storage.url(path)
        print(f"Prueba de subida exitosa. URL generada: {url}")
        
        if 'cloudinary' in url:
            print(">>> RESULTADO: CLOUDINARY ESTA ACTIVO Y FUNCIONANDO.")
        else:
            print(">>> RESULTADO: ALERTA - SE ESTA USANDO ALMACENAMIENTO LOCAL.")
            
    except Exception as e:
        print(f"Error al intentar subir archivo: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    check()
