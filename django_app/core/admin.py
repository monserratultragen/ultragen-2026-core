from django.contrib import admin
from .models import Seguridad

@admin.register(Seguridad)
class SeguridadAdmin(admin.ModelAdmin):
    list_display = ('id', 'santo', 'sena', 'created_at')
    search_fields = ('santo', 'sena')
