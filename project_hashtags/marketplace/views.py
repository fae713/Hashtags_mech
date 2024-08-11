from django.views.decorators.http import require_http_methods
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.contrib.auth.models import User
from .models import ShoppingCart
from .forms import UserRegistrationForm



"""Decorator to render the homepage (LANDING PAGE)"""
@require_http_methods(["GET"])
def index(request):
    return render(request, 'marketplace/index.html')

@require_http_methods(["POST"])
def register(request):
    form = UserRegistrationForm(request.POST)
    
    if form.is_valid():
        try:
            # Save the new user
            new_user = form.save(commit=False)
            new_user.set_password(form.cleaned_data['password'])
            new_user.save()

            # Create a shopping cart for the new user
            user_cart = ShoppingCart(user=new_user)
            user_cart.save()

            return JsonResponse({"message": "User created successfully"}, status=201)

        except IntegrityError:
            return JsonResponse({"error": "Username or email already exists"}, status=409)

    else:
        errors = form.errors.as_json()
        return JsonResponse({"error": errors}, status=400)


@require_http_methods(["GET"])
def register_form(request):
    form = UserRegistrationForm()
    return render(request, 'marketplace/registration/register.html', {'form': form})
