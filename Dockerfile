# Usar una imagen base oficial de Python
FROM python:3.10-slim

# Establecer variables de entorno
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar el archivo de requerimientos
COPY requirements.txt /app/

# Instalar dependencias de Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiar el proyecto
COPY django_app /app/django_app

# Cambiar al directorio del proyecto Django
WORKDIR /app/django_app

# Recolectar archivos estáticos (opcional, pero recomendado)
# RUN python manage.py collectstatic --noinput

# Exponer el puerto
EXPOSE 8000

# Comando por defecto (Gunicorn)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "ultragen_backend.wsgi:application"]
