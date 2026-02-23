from django.db import models
from django.utils.translation import gettext_lazy as _

class AuditModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, help_text="Fecha de creación del registro")
    updated_at = models.DateTimeField(auto_now=True, help_text="Última fecha de actualización")
    is_active = models.BooleanField(default=True, help_text="Indica si el registro está activo (borrado lógico)")

    class Meta:
        abstract = True

class Diario(AuditModel):
    nombre = models.CharField(max_length=255)
    sinopsis = models.TextField(blank=True, null=True)
    ruta_img = models.ImageField(upload_to='diarios/', blank=True, null=True)
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.nombre

class Tomo(AuditModel):
    diario = models.ForeignKey(Diario, on_delete=models.CASCADE, related_name='tomos')
    nombre = models.CharField(max_length=255)
    sinopsis = models.TextField(blank=True, null=True)
    ruta_img = models.ImageField(upload_to='tomos/', blank=True, null=True)
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f"{self.diario.nombre} - {self.nombre}"

class Capitulo(AuditModel):
    tomo = models.ForeignKey(Tomo, on_delete=models.CASCADE, related_name='capitulos')
    nombre = models.CharField(max_length=255)
    sinopsis = models.TextField(blank=True, null=True)
    orden = models.IntegerField(default=0)
    contenido = models.TextField(blank=True, null=True)
    
    # Metadata
    pais = models.CharField(max_length=100, blank=True, null=True)
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    anio = models.CharField(max_length=50, blank=True, null=True) # CharField to allow "2023 AC" etc
    ruta_img = models.ImageField(upload_to='capitulos/', blank=True, null=True)

    # Tags
    romance = models.BooleanField(default=False)
    risas = models.BooleanField(default=False)
    lagrimas = models.BooleanField(default=False)
    violencia = models.BooleanField(default=False)
    peligro = models.BooleanField(default=False)
    armas = models.BooleanField(default=False)
    sexo = models.BooleanField(default=False)
    eventos = models.BooleanField(default=False)
    es_demo = models.BooleanField(default=True)
    is_vip = models.BooleanField(default=False)
    palabras = models.IntegerField(default=0, help_text="Contador de palabras del capítulo")

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f"{self.tomo.nombre} - {self.nombre}"

class CapituloImagen(AuditModel):
    capitulo = models.ForeignKey(Capitulo, on_delete=models.CASCADE, related_name='imagenes')
    ruta = models.ImageField(upload_to='capitulos/extras/')
    tag = models.CharField(max_length=100)
    es_demo = models.BooleanField(default=True)

    def __str__(self):
        return f"Img {self.tag} - {self.capitulo.nombre}"

class CapituloSlap(AuditModel):
    capitulo = models.ForeignKey(Capitulo, on_delete=models.CASCADE, related_name='slaps')
    ruta = models.ImageField(upload_to='capitulos/slaps/')
    nivel = models.IntegerField(default=0)

    def __str__(self):
        return f"Slap {self.nivel} - {self.capitulo.nombre}"

class CapituloPista(AuditModel):
    capitulo = models.ForeignKey(Capitulo, on_delete=models.CASCADE, related_name='pistas')
    titulo = models.CharField(max_length=255, blank=True, null=True)
    contenido = models.TextField()
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.titulo or "Pista sin título"

class Personaje(AuditModel):
    diario = models.ForeignKey(Diario, on_delete=models.CASCADE, related_name='personajes')
    tomo = models.ForeignKey(Tomo, on_delete=models.SET_NULL, null=True, blank=True, related_name='personajes')
    capitulo = models.ForeignKey(Capitulo, on_delete=models.SET_NULL, null=True, blank=True, related_name='personajes')
    
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    ruta_img = models.ImageField(upload_to='personajes/', blank=True, null=True)
    prioridad = models.IntegerField(default=0)

    def __str__(self):
        return self.nombre

class Conversacion(AuditModel):
    personajes = models.ManyToManyField(Personaje, related_name='conversaciones')

    def __str__(self):
        return f"Conversación {self.id}"

class Mensaje(AuditModel):
    conversacion = models.ForeignKey(Conversacion, on_delete=models.CASCADE, related_name='mensajes')
    personaje = models.ForeignKey(Personaje, on_delete=models.CASCADE, related_name='mensajes_enviados')
    mensaje = models.TextField(blank=True, null=True)
    ruta_img = models.ImageField(upload_to='mensajes/', blank=True, null=True)
    
    fecha = models.DateTimeField(blank=True, null=True) # Real timestamp override
    fecha_simulada = models.DateField(blank=True, null=True)
    hora_simulada = models.TimeField(blank=True, null=True)
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f"Msg {self.orden} - {self.personaje.nombre}"

class Expediente(AuditModel):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    contenido = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    orden = models.IntegerField(default=0)
    imagen = models.ImageField(upload_to='expedientes/', blank=True, null=True)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.titulo

class ExpedienteImagen(AuditModel):
    expediente = models.ForeignKey(Expediente, on_delete=models.CASCADE, related_name='imagenes')
    ruta = models.ImageField(upload_to='expedientes/extras/')
    tag = models.CharField(max_length=100)

    def __str__(self):
        return f"Img {self.tag} - {self.expediente.titulo}"

class SaludoEditora(AuditModel):
    contenido = models.TextField()
    url_librovisitas = models.URLField(blank=True, null=True)
    imagen = models.ImageField(upload_to='saludos/')

    def __str__(self):
        return f"Saludo {self.id}"

class Presentacion(AuditModel):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.titulo

class Slide(AuditModel):
    presentacion = models.ForeignKey(Presentacion, on_delete=models.CASCADE, related_name='slides')
    contenido = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='slides/')
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f"Slide {self.orden} - {self.presentacion.titulo}"

class Tablero(AuditModel):
    orden = models.IntegerField(default=0)
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    notas = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='tableros/')

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.titulo

class RecuerdoLeticia(AuditModel):
    orden = models.IntegerField(default=0)
    titulo = models.CharField(max_length=255)
    contenido = models.TextField()
    fecha = models.DateTimeField(blank=True, null=True)
    firma = models.CharField(max_length=255, blank=True, null=True)
    imagen = models.ImageField(upload_to='recuerdos_leticia/')

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.titulo

class InstagramPerfil(AuditModel):
    nombre_usuario = models.CharField(max_length=255)
    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0)
    ocupacion = models.CharField(max_length=255, blank=True, null=True)
    descripcion1 = models.TextField(blank=True, null=True)
    descripcion2 = models.TextField(blank=True, null=True)
    imagen_perfil = models.ImageField(upload_to='instagram/perfil/')

    def __str__(self):
        return self.nombre_usuario

class InstagramPost(AuditModel):
    perfil = models.ForeignKey(InstagramPerfil, on_delete=models.CASCADE, related_name='posts')
    imagen = models.ImageField(upload_to='instagram/posts/')
    me_gusta = models.IntegerField(default=0)
    fecha = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"Post {self.id} - {self.perfil.nombre_usuario}"

class MercadoUmbralNoticia(AuditModel):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.titulo

class MercadoUmbralCompra(AuditModel):
    nombre = models.CharField(max_length=255)
    codigo = models.CharField(max_length=100)
    itemid = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField(blank=True, null=True)
    imagen = models.ImageField(upload_to='mercadoumbral/compras/')

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"

class MercadoUmbralCyborg(AuditModel):
    codigo = models.CharField(max_length=100)
    humano = models.BooleanField(default=False)
    disponible = models.BooleanField(default=True)
    nacionalidad = models.CharField(max_length=100)
    stock = models.IntegerField(default=0)
    material_construccion = models.CharField(max_length=255)
    densidad_cabello = models.CharField(max_length=100)
    nombre = models.CharField(max_length=255)
    nombre = models.CharField(max_length=255)
    edad = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    piel_sintetica = models.CharField(max_length=100, blank=True, null=True)
    chip_version = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='mercadoumbral/cyborgs/')

    def __str__(self):
        return f"{self.nombre} (Cyborg)"

class MercadoUmbralHumano(AuditModel):
    codigo = models.CharField(max_length=100)
    humano = models.BooleanField(default=True)
    nacionalidad = models.CharField(max_length=100)
    buscada = models.BooleanField(default=False)
    nombre = models.CharField(max_length=255)
    edad = models.IntegerField()
    estado = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='mercadoumbral/humanos/')

    def __str__(self):
        return f"{self.nombre} (Humano)"

class MercadoUmbralHumanoImagen(AuditModel):
    humano = models.ForeignKey(MercadoUmbralHumano, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='mercadoumbral/humanos/extras/')
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f"Img {self.orden} - {self.humano.nombre}"

class Bienvenida(AuditModel):
    contenido = models.TextField()
    imagen = models.ImageField(upload_to='bienvenidas/')
    fecha = models.DateTimeField(auto_now_add=True)
    tipo_usuario = models.CharField(max_length=50, default='Invitado')

    def __str__(self):
        return f"Bienvenida {self.id} ({self.tipo_usuario})"

class LibroVisitas(AuditModel):
    nombre = models.CharField(max_length=255)
    mensaje = models.TextField()
    correo = models.EmailField()
    fecha = models.CharField(max_length=100)

    def __str__(self):
        return f"Visita de {self.nombre}"

class Seguridad(AuditModel):
    santo = models.TextField()
    sena = models.TextField()

    def __str__(self):
        return f"Seguridad {self.id}"

class Desktop(AuditModel):
    nombre = models.CharField(max_length=255)
    tooltip = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='desktop/')

    def __str__(self):
        return self.nombre

class Susurro(AuditModel):
    SECCION_CHOICES = [
        ('desktop', 'Desktop'),
        ('laptop', 'Laptop'),
        ('movil', 'Móvil'),
        ('diarios', 'Diarios'),
        ('tablet', 'Tablet'),
        ('mural', 'Mural'),
        ('presentacion', 'Presentación'),
        # Legacy/Other
        ('paginabase', 'Página Base'),
        ('autenticacion', 'Autenticación'),
        ('bienvenida', 'Bienvenida'),
        ('expedientes', 'Expedientes'),
        ('pistas', 'Pistas'),
        ('tomos', 'Tomos'),
        ('whatsapp', 'WhatsApp'),
        ('instagram', 'Instagram'),
        ('darkweb', 'Dark Web'),
        ('cyborgs', 'Cyborgs'),
        ('ordenes', 'Órdenes'),
        ('humanas', 'Humanas'),
        ('linea_temporal', 'Línea Temporal'),
    ]
    seccion = models.CharField(max_length=50, choices=SECCION_CHOICES)
    duracion = models.IntegerField(default=0)
    susurro = models.TextField()
    activado = models.BooleanField(default=True)

    def __str__(self):
        return f"Susurro ({self.seccion})"

class ClaveAcceso(AuditModel):
    TIPO_CHOICES = [
        ('maestra', 'Llave Maestra (Admin)'),
        ('vip', 'Acceso VIP Temporal'),
        ('laptop', 'Acceso Laptop Temporal'),
    ]

    nombre = models.CharField(max_length=100, help_text="Ej: Acceso VIP Marzo o Master Key")
    clave = models.CharField(max_length=255, unique=True)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='vip')
    
    # Control de tiempo
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Clave de Acceso"
        verbose_name_plural = "Claves de Acceso"

    def __str__(self):
        return f"{self.nombre} ({self.get_tipo_display()})"

    def esta_valida(self):
        """Lógica para verificar si la clave sirve en este momento"""
        from django.utils import timezone
        ahora = timezone.now()
        
        if not self.is_active:
            return False
            
        if self.tipo == 'maestra':
            return True
            
        if self.fecha_inicio and ahora < self.fecha_inicio:
            return False
        if self.fecha_fin and ahora > self.fecha_fin:
            return False
            
        return True
