"""
These urls goverent the hashtag mech website.
"""

from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views


app_name = "marketplace"
urlpatterns = [
    path('', views.index, name='index'),  # Home page
    path('accounts/', include('django.contrib.auth.urls')),
    path('login/', auth_views.LoginView.as_view(template_name='marketplace/registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/', views.register_form, name='register_form'),  # To display the form
    path('register/submit/', views.register, name='register'),
]

