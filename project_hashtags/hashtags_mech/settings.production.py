# settings/production.py
from .settings import *  # Import all base settings
import os
import dj_database_url
from decouple import config

DEBUG = False
ALLOWED_HOSTS = ['hashtags-mech.onrender.com']

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Configure database (Render provides the DATABASE_URL)
DATABASES = {
    'default': dj_database_url.config(default=config('DATABASE_URL'))
}

