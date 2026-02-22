from django.contrib import admin
from .models import Seguridad, Diario, Tomo, Capitulo, Susurro, ClaveAcceso

@admin.register(Seguridad)
class SeguridadAdmin(admin.ModelAdmin):
    list_display = ('id', 'santo', 'sena', 'created_at')
    search_fields = ('santo', 'sena')

@admin.register(Diario)
class DiarioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'orden', 'is_active')
    list_editable = ('orden', 'is_active')

@admin.register(Tomo)
class TomoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'diario', 'orden', 'is_active')
    list_editable = ('orden', 'is_active')
    list_filter = ('diario',)

@admin.register(Capitulo)
class CapituloAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tomo', 'orden', 'is_active', 'is_vip')
    list_editable = ('orden', 'is_active', 'is_vip')
    list_filter = ('tomo__diario', 'tomo', 'is_vip')

@admin.register(Susurro)
class SusurroAdmin(admin.ModelAdmin):
    list_display = ('seccion', 'susurro', 'activado')
    list_editable = ('activado',)
    list_filter = ('seccion', 'activado')

@admin.register(ClaveAcceso)
class ClaveAccesoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'clave', 'tipo', 'fecha_inicio', 'fecha_fin', 'is_active')
    list_editable = ('is_active',)
    list_filter = ('tipo', 'is_active')
    search_fields = ('nombre', 'clave')
