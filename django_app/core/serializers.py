from rest_framework import serializers
from django.db import models
from .models import (
    Diario, Tomo, Capitulo, CapituloImagen, CapituloSlap, CapituloPista,
    Personaje, Conversacion, Mensaje, Expediente, ExpedienteImagen, SaludoEditora,
    Presentacion, Slide, Tablero, RecuerdoLeticia, InstagramPerfil, InstagramPost,
    MercadoUmbralNoticia, MercadoUmbralCompra, MercadoUmbralCyborg, MercadoUmbralHumano,
    MercadoUmbralHumanoImagen, Bienvenida, LibroVisitas, Seguridad, Desktop, Susurro, ClaveAcceso
)

class CloudinaryImageField(serializers.ImageField):
    """
    Custom field to ensure we always return the Cloudinary name (public_id)
    instead of the absolute URL. Also strips /media/ prefixes and absolute hosts.
    """
    def to_representation(self, value):
        if not value:
            return None
        
        # Get the name/path (e.g. 'ultragen_media/capitulos/t1_xiqzet')
        # We handle both FieldFile objects and strings
        name = getattr(value, 'name', str(value))
        
        # Robust check: if it contains /media/, strip it
        if '/media/' in name:
            name = name.split('/media/')[-1]
        
        # Extreme check: if it's still an absolute URL, take only the last parts
        # If the name looks like http://.../ultragen_media/...
        if '://' in name and 'ultragen_media/' in name:
            name = name.split('ultragen_media/')[-1]
            name = 'ultragen_media/' + name
            
        return name

class BaseCloudinarySerializer(serializers.ModelSerializer):
    """
    Base serializer that automatically uses CloudinaryImageField 
    for all ImageField models in the project.
    """
    serializer_field_mapping = serializers.ModelSerializer.serializer_field_mapping.copy()
    serializer_field_mapping[models.ImageField] = CloudinaryImageField

class SeguridadSerializer(BaseCloudinarySerializer):
    class Meta:
        model = Seguridad
        fields = '__all__'

class DesktopSerializer(BaseCloudinarySerializer):
    class Meta:
        model = Desktop
        fields = '__all__'

class SusurroSerializer(BaseCloudinarySerializer):
    class Meta:
        model = Susurro
        fields = '__all__'

class CapituloImagenSerializer(BaseCloudinarySerializer):
    class Meta:
        model = CapituloImagen
        fields = '__all__'

class CapituloSlapSerializer(BaseCloudinarySerializer):
    class Meta:
        model = CapituloSlap
        fields = '__all__'

class CapituloPistaSerializer(BaseCloudinarySerializer):
    class Meta:
        model = CapituloPista
        fields = '__all__'

class CapituloSerializer(BaseCloudinarySerializer):
    # EXPLICITLY define fields to ensure mapping doesn't skip them
    ruta_img = CloudinaryImageField(required=False, allow_null=True)
    
    imagenes = CapituloImagenSerializer(many=True, read_only=True)
    slaps = CapituloSlapSerializer(many=True, read_only=True)
    pistas = CapituloPistaSerializer(many=True, read_only=True)

    tomo_nombre = serializers.CharField(source='tomo.nombre', read_only=True)
    tomo_orden = serializers.IntegerField(source='tomo.orden', read_only=True)
    diario_nombre = serializers.CharField(source='tomo.diario.nombre', read_only=True)
    diario_orden = serializers.IntegerField(source='tomo.diario.orden', read_only=True)
    diario_id = serializers.IntegerField(source='tomo.diario.id', read_only=True)

    class Meta:
        model = Capitulo
        fields = '__all__'

class TomoSerializer(BaseCloudinarySerializer):
    capitulos = CapituloSerializer(many=True, read_only=True)

    class Meta:
        model = Tomo
        fields = '__all__'

class DiarioSerializer(BaseCloudinarySerializer):
    tomos = TomoSerializer(many=True, read_only=True)

    class Meta:
        model = Diario
        fields = '__all__'

class PersonajeSerializer(BaseCloudinarySerializer):
    class Meta:
        model = Personaje
        fields = '__all__'

class MensajeSerializer(BaseCloudinarySerializer):
    personaje_nombre = serializers.CharField(source='personaje.nombre', read_only=True)
    # Ensure source field also uses the same logic
    personaje_img = serializers.SerializerMethodField()

    class Meta:
        model = Mensaje
        fields = '__all__'
    
    def get_personaje_img(self, obj):
        if obj.personaje and obj.personaje.ruta_img:
            return obj.personaje.ruta_img.name
        return None

class ConversacionSerializer(BaseCloudinarySerializer):
    personajes = PersonajeSerializer(many=True, read_only=True)
    mensajes = MensajeSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversacion
        fields = '__all__'

    def get_last_message(self, obj):
        last_msg = obj.mensajes.order_by('-fecha_simulada', '-hora_simulada', '-orden').first()
        if last_msg:
            return MensajeSerializer(last_msg).data
        return None

class ExpedienteImagenSerializer(BaseCloudinarySerializer):
    class Meta:
        model = ExpedienteImagen
        fields = '__all__'

class ExpedienteSerializer(BaseCloudinarySerializer):
    imagenes = ExpedienteImagenSerializer(many=True, read_only=True)

    class Meta:
        model = Expediente
        fields = '__all__'

class SaludoEditoraSerializer(BaseCloudinarySerializer):
    class Meta:
        model = SaludoEditora
        fields = '__all__'

class SlideSerializer(BaseCloudinarySerializer):
    class Meta:
        model = Slide
        fields = '__all__'

class PresentacionSerializer(BaseCloudinarySerializer):
    slides = SlideSerializer(many=True, read_only=True)

    class Meta:
        model = Presentacion
        fields = '__all__'

class TableroSerializer(BaseCloudinarySerializer):
    class Meta:
        model = Tablero
        fields = '__all__'

class RecuerdoLeticiaSerializer(BaseCloudinarySerializer):
    class Meta:
        model = RecuerdoLeticia
        fields = '__all__'

class InstagramPostSerializer(BaseCloudinarySerializer):
    class Meta:
        model = InstagramPost
        fields = '__all__'

class InstagramPerfilSerializer(BaseCloudinarySerializer):
    posts = InstagramPostSerializer(many=True, read_only=True)

    class Meta:
        model = InstagramPerfil
        fields = '__all__'

class MercadoUmbralNoticiaSerializer(BaseCloudinarySerializer):
    class Meta:
        model = MercadoUmbralNoticia
        fields = '__all__'

class MercadoUmbralCompraSerializer(BaseCloudinarySerializer):
    class Meta:
        model = MercadoUmbralCompra
        fields = '__all__'

class MercadoUmbralCyborgSerializer(BaseCloudinarySerializer):
    class Meta:
        model = MercadoUmbralCyborg
        fields = '__all__'

class MercadoUmbralHumanoImagenSerializer(BaseCloudinarySerializer):
    class Meta:
        model = MercadoUmbralHumanoImagen
        fields = '__all__'

class MercadoUmbralHumanoSerializer(BaseCloudinarySerializer):
    imagenes = MercadoUmbralHumanoImagenSerializer(many=True, read_only=True)

    class Meta:
        model = MercadoUmbralHumano
        fields = '__all__'

class BienvenidaSerializer(BaseCloudinarySerializer):
    class Meta:
        model = Bienvenida
        fields = '__all__'

class LibroVisitasSerializer(BaseCloudinarySerializer):
    class Meta:
        model = LibroVisitas
        fields = '__all__'

class ClaveAccesoSerializer(BaseCloudinarySerializer):
    class Meta:
        model = ClaveAcceso
        fields = '__all__'
