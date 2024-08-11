"""
These urls goverent the hashtag mech website.
"""

from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views


#app_name = "marketplace"
urlpatterns = [
    path('', views.index, name='index'),  # Home page
    path('accounts/', include('django.contrib.auth.urls')),
    path('login/', auth_views.LoginView.as_view(template_name='marketplace/registration/login.html'), name='login'),
    path('password_change/', auth_views.PasswordChangeView.as_view(template_name='marketplace/registration/password_change_form.html'), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(template_name='marketplace/registration/password_change_done.html'), name='password_change_done'),
    path('password_reset/', auth_views.PasswordResetView.as_view(template_name='marketplace/registration/password_reset_form.html'), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(template_name='marketplace/registration/password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='marketplace/registration/password_reset_confirm.html'), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='marketplace/registration/password_reset_complete.html'), name='password_reset_complete'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/', views.register_form, name='register_form'),  # To display the form
    path('register/submit/', views.register, name='register'),
    path('profile/', views.profile_view, name='profile'),
]

