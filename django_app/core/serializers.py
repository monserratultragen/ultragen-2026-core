from rest_framework import serializers
from .models import (
    Diario, Tomo, Capitulo, CapituloImagen, CapituloSlap, CapituloPista,
    Personaje, Conversacion, Mensaje, Expediente, ExpedienteImagen, SaludoEditora,
    Presentacion, Slide, Tablero, RecuerdoLeticia, InstagramPerfil, InstagramPost,
    MercadoUmbralNoticia, MercadoUmbralCompra, MercadoUmbralCyborg, MercadoUmbralHumano,
    MercadoUmbralHumanoImagen, Bienvenida, LibroVisitas, Seguridad, Desktop, Susurro
)





class SeguridadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seguridad
        fields = '__all__'

class DesktopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desktop
        fields = '__all__'

class SusurroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Susurro
        fields = '__all__'



class CapituloImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapituloImagen
        fields = '__all__'

class CapituloSlapSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapituloSlap
        fields = '__all__'

class CapituloPistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapituloPista
        fields = '__all__'

class CapituloSerializer(serializers.ModelSerializer):
    imagenes = CapituloImagenSerializer(many=True, read_only=True)
    slaps = CapituloSlapSerializer(many=True, read_only=True)
    pistas = CapituloPistaSerializer(many=True, read_only=True)

    tomo_nombre = serializers.CharField(source='tomo.nombre', read_only=True)
    tomo_orden = serializers.IntegerField(source='tomo.orden', read_only=True)
    diario_nombre = serializers.CharField(source='tomo.diario.nombre', read_only=True)
    diario_orden = serializers.IntegerField(source='tomo.diario.orden', read_only=True)
    diario_id = serializers.IntegerField(source='tomo.diario.id', read_only=True)
    ruta_img = serializers.SerializerMethodField()

    class Meta:
        model = Capitulo
        fields = '__all__'

    def get_ruta_img(self, obj):
        if obj.ruta_img:
            return str(obj.ruta_img)
        return None

class TomoSerializer(serializers.ModelSerializer):
    capitulos = CapituloSerializer(many=True, read_only=True)

    class Meta:
        model = Tomo
        fields = '__all__'

class DiarioSerializer(serializers.ModelSerializer):
    tomos = TomoSerializer(many=True, read_only=True)

    class Meta:
        model = Diario
        fields = '__all__'

class PersonajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personaje
        fields = '__all__'

class MensajeSerializer(serializers.ModelSerializer):
    personaje_nombre = serializers.CharField(source='personaje.nombre', read_only=True)
    personaje_img = serializers.ImageField(source='personaje.ruta_img', read_only=True)

    class Meta:
        model = Mensaje
        fields = '__all__'

class ConversacionSerializer(serializers.ModelSerializer):
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

class ExpedienteImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpedienteImagen
        fields = '__all__'

class ExpedienteSerializer(serializers.ModelSerializer):
    imagenes = ExpedienteImagenSerializer(many=True, read_only=True)

    class Meta:
        model = Expediente
        fields = '__all__'

class SaludoEditoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaludoEditora
        fields = '__all__'

class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = '__all__'

class PresentacionSerializer(serializers.ModelSerializer):
    slides = SlideSerializer(many=True, read_only=True)

    class Meta:
        model = Presentacion
        fields = '__all__'

class TableroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tablero
        fields = '__all__'

class RecuerdoLeticiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecuerdoLeticia
        fields = '__all__'

class InstagramPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramPost
        fields = '__all__'

class InstagramPerfilSerializer(serializers.ModelSerializer):
    posts = InstagramPostSerializer(many=True, read_only=True)

    class Meta:
        model = InstagramPerfil
        fields = '__all__'

class MercadoUmbralNoticiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MercadoUmbralNoticia
        fields = '__all__'

class MercadoUmbralCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = MercadoUmbralCompra
        fields = '__all__'

class MercadoUmbralCyborgSerializer(serializers.ModelSerializer):
    class Meta:
        model = MercadoUmbralCyborg
        fields = '__all__'

class MercadoUmbralHumanoImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = MercadoUmbralHumanoImagen
        fields = '__all__'

class MercadoUmbralHumanoSerializer(serializers.ModelSerializer):
    imagenes = MercadoUmbralHumanoImagenSerializer(many=True, read_only=True)

    class Meta:
        model = MercadoUmbralHumano
        fields = '__all__'

class BienvenidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bienvenida
        fields = '__all__'

class LibroVisitasSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibroVisitas
        fields = '__all__'
