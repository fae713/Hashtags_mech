"""
These urls goverent the hashtag mech website.
"""

from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views


#app_name = "marketplace"
urlpatterns = [
    path('', views.index, name='index'),  # Home page


    #USER URLS MANAGEMENT
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


    #PRODUCTS MANAGEMENT
    path('products/', views.list_all_products, name='list-all-products'),
    path('products/<int:id>/', views.fetch_product_by_id, name='get-product-details'),
    path('products/create/', views.create_new_product, name='create-new-product'),
    path('products/<int:id>/update/', views.update_product_id_details, name='update-product-details'),
    path('products/<int:id>/delete/', views.delete_product_by_id, name='delete-product'),


    #COLLECTION AND CATEGORY MANAGEMENT
    path('collections/', views.list_all_collections, name='list-all-collections'),
    path('categories/', views.get_list_of_all_product_categories, name='list-all-categories'),
    path('categories/<int:id>/', views.get_list_of_all_products_in_category, name='list-all-products-in-category'),
    path('categories/create/', views.create_new_product_category, name='create-new-category'),
    path('categories/<int:id>/update/', views.update_details_of_category_with_category_id, name='update-category-details'),
    path('categories/<int:id>/delete/', views.remove_product_category_with_category_id, name='delete-category'),
    path('categories/<str:category_name>/', views.get_category_by_name, name='get_category_by_name'),
]

