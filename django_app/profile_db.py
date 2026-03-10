import os
import time
import requests
import statistics

# Simulate production environment variables
os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_9leZkG7LAVYi@ep-solitary-bird-aie9osz7-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# We'll use a script to call the local Django dev server pointing to production DB
# But first, let's just measure how long the database queries take directly

import django
from django.conf import settings
import dj_database_url
import sys

# Add django project to path
sys.path.append(r'c:\ultragen2026\ultragen_manager\django_app')

if not settings.configured:
    settings.configure(
        DATABASES={
            'default': dj_database_url.config(
                default=os.environ['DATABASE_URL'],
                conn_max_age=600
            )
        },
        INSTALLED_APPS=['core', 'django.contrib.contenttypes', 'django.contrib.auth'],
        SECRET_KEY='test',
    )
    django.setup()

from core.models import Diario, Tomo, Capitulo
from django.db import connection

def profile_query(name, queryset):
    start = time.time()
    count = queryset.count()
    # Force evaluation
    data = list(queryset[:100]) 
    duration = time.time() - start
    print(f"{name}: {duration:.4f}s (Count: {count})")

print("Profiling Direct DB Queries (Neon)...")
profile_query("Diarios All", Diario.objects.all())
profile_query("Tomos All", Tomo.objects.all())
profile_query("Capitulos All", Capitulo.objects.all())
profile_query("Capitulos With Related", Capitulo.objects.select_related('tomo', 'tomo__diario').all())

# Check connection overhead
start = time.time()
connection.ensure_connection()
print(f"Connection Latency: {time.time() - start:.4f}s")
