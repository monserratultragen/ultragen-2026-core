from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DiarioViewSet, TomoViewSet, CapituloViewSet,
    CapituloImagenViewSet, CapituloSlapViewSet, CapituloPistaViewSet,
    PersonajeViewSet, ConversacionViewSet, MensajeViewSet,
    ExpedienteViewSet, ExpedienteImagenViewSet, SaludoEditoraViewSet,
    PresentacionViewSet, SlideViewSet, TableroViewSet, RecuerdoLeticiaViewSet,
    InstagramPerfilViewSet, InstagramPostViewSet,
    MercadoUmbralNoticiaViewSet, MercadoUmbralCompraViewSet,
    MercadoUmbralCyborgViewSet, MercadoUmbralHumanoViewSet,
    MercadoUmbralHumanoImagenViewSet, BienvenidaViewSet, UniversalLoaderViewSet, LibroVisitasViewSet, SeguridadViewSet, DashboardStatsViewSet, DesktopViewSet, SusurroViewSet,
    debug_storage_view
)

router = DefaultRouter()
router.register(r'diarios', DiarioViewSet)
router.register(r'tomos', TomoViewSet)
router.register(r'capitulos', CapituloViewSet)
router.register(r'capitulo-imagenes', CapituloImagenViewSet)
router.register(r'capitulo-slaps', CapituloSlapViewSet)
router.register(r'capitulo-pistas', CapituloPistaViewSet)
router.register(r'personajes', PersonajeViewSet)
router.register(r'conversaciones', ConversacionViewSet)
router.register(r'mensajes', MensajeViewSet)
router.register(r'expedientes', ExpedienteViewSet)
router.register(r'expediente-imagenes', ExpedienteImagenViewSet)
router.register(r'saludos-editora', SaludoEditoraViewSet)
router.register(r'presentaciones', PresentacionViewSet)
router.register(r'slides', SlideViewSet)
router.register(r'tableros', TableroViewSet)
router.register(r'recuerdos-leticia', RecuerdoLeticiaViewSet)
router.register(r'instagram-perfil', InstagramPerfilViewSet)
router.register(r'instagram-posts', InstagramPostViewSet)
router.register(r'mercadoumbral-noticias', MercadoUmbralNoticiaViewSet)
router.register(r'mercadoumbral-compras', MercadoUmbralCompraViewSet)
router.register(r'mercadoumbral-cyborgs', MercadoUmbralCyborgViewSet)
router.register(r'mercadoumbral-humanos', MercadoUmbralHumanoViewSet)
router.register(r'mercadoumbral-humanos-imagenes', MercadoUmbralHumanoImagenViewSet)
router.register(r'bienvenidas', BienvenidaViewSet)
router.register(r'libro-visitas', LibroVisitasViewSet)
router.register(r'seguridad', SeguridadViewSet)
router.register(r'desktop', DesktopViewSet)
router.register(r'susurros', SusurroViewSet)
router.register(r'dashboard-stats', DashboardStatsViewSet, basename='dashboard-stats')
router.register(r'universal-loader', UniversalLoaderViewSet, basename='universal-loader')

urlpatterns = [
    path('', include(router.urls)),
]
