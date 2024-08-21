"""
URL configuration for hashtags_mech project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static
from django.http import Http404



urlpatterns = [
    #path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('', include('marketplace.urls')),
    path("__debug__/", include("debug_toolbar.urls")),
]; 
# add at the last
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


# Serve media files only during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# Catch-all URL pattern
def catch_all(request, *args, **kwargs):
    raise Http404("Page not found")

# Add the catch-all URL pattern at the end
urlpatterns += [
    path('<path:path>', catch_all),
]
