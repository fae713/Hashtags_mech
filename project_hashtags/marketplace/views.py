from django.views.decorators.http import require_http_methods
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.contrib.auth.models import User
from .models import ShoppingCart
from .forms import UserRegistrationForm
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserChangeForm
from django.urls import reverse_lazy
from django.views.generic.edit import UpdateView
from django.contrib.auth import update_session_auth_hash


from django.contrib.auth import authenticate, login, logout
from django.db.models import F, ExpressionWrapper, fields, Sum, Q, FloatField
from django.db import IntegrityError, transaction
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.core.paginator import Paginator, EmptyPage
from django.conf import settings
from django.urls import reverse
from urllib.parse import quote_plus, urlencode
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.http import HttpResponseNotFound, HttpResponseServerError, Http404
from .models import Product, Category, Collection, Order, ShoppingCart, CartItem, Address, OrderItem
from django.utils.datastructures import MultiValueDictKeyError
from django.core.exceptions import ValidationError, MultipleObjectsReturned, PermissionDenied, ObjectDoesNotExist
from django.http import QueryDict
from django.core import serializers
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.contrib import messages



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


@login_required
def profile_view(request):
    if request.method == 'POST':
        form = UserChangeForm(request.POST, instance=request.user)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Keeps the user logged in after password change
            return redirect('marketplace:profile')
    else:
        form = UserChangeForm(instance=request.user)
    return render(request, 'marketplace/registration/profile.html', {'form': form})


"""
PAIGINATION
"""
def paginate_results(request, query_results, view_url, items_per_page=12):
    page_number = request.GET.get('page', 1)
    paginator = Paginator(query_results, items_per_page)

    try:
        page_obj = paginator.get_page(page_number)
    except EmptyPage:
        return JsonResponse({"error": "Page not found"}, status=404)

    items_on_current_page = page_obj.object_list

    json_data = {
        'current_page': page_obj.number,
        'total_pages': paginator.num_pages,
        'query_results': [item.to_dict(request) for item in items_on_current_page],
    }

    if page_obj.has_previous():
        json_data['previous_page'] = f"{view_url}&page={page_obj.previous_page_number()}" if "page=" in view_url else f"{view_url}?page={page_obj.previous_page_number()}"

    if page_obj.has_next():
        json_data['next_page'] = f"{view_url}&page={page_obj.next_page_number()}" if "page=" in view_url else f"{view_url}?page={page_obj.next_page_number()}"

    return json_data

@require_http_methods(["GET"])
def list_all_products(request):
    all_products = Product.objects.all()
    view_url = request.build_absolute_uri()

    if all_products.exists():
        paginated_results = paginate_results(request, all_products, view_url)
        return JsonResponse(paginated_results, safe=False)
    else:
        return JsonResponse({"error": "No products found, add a product and try again."}, status=404)

@require_http_methods(["GET"])
def fetch_product_by_id(request, id):
    try:
        unique_product = Product.objects.get(product_id=id)
        product_dict = unique_product.to_dict(request)
        return JsonResponse(product_dict, safe=False)
    except Product.DoesNotExist:
        return JsonResponse({"error": f"Product with ID: {id} was not found."}, status=404)

@csrf_exempt
@require_http_methods(["POST"])
def create_new_product(request):
    try:
        name = request.POST['name']
        description = request.POST['description']
        price = request.POST['price']
        quantity_in_stock = request.POST['quantity_in_stock']
        category = request.POST['category']
        image = request.FILES['image']
    except MultiValueDictKeyError as e:
        return JsonResponse({"error": f"The form value for attribute {str(e)} is missing"}, status=400)

    try:
        with transaction.atomic():
            category_obj = Category.objects.get(name=category)
            new_product = Product(
                name=name,
                description=description,
                price=float(price),
                quantity_in_stock=quantity_in_stock,
                category=category_obj,
                image=image
            )
            new_product.save()
    except (ValueError, ValidationError) as e:
        return JsonResponse({"error": f"{str(e)}"}, status=400)
    except Category.DoesNotExist:
        return JsonResponse({"error": f"Category '{category}' does not exist."}, status=400)

    return JsonResponse({"success": True}, safe=False)

@csrf_exempt
@require_http_methods(["PUT", "POST"])
def update_product_id_details(request, id):
    try:
        product_to_update = Product.objects.get(product_id=id)

        if request.method == 'PUT':
            for field, value in QueryDict(request.body).items():
                if hasattr(product_to_update, field):
                    if field == "category":
                        try:
                            setattr(product_to_update, field, Category.objects.get(name=value))
                        except (ValueError, ValidationError, Category.DoesNotExist) as e:
                            return JsonResponse({"error": f"{str(e)}"}, status=400)
                    elif field == "image":
                        return JsonResponse({"error": 'Use POST request to update image'}, status=405)
                    else:
                        setattr(product_to_update, field, value)
                else:
                    return JsonResponse({"error": f"There is no field named {field} in products table."}, status=400)
        elif request.method == 'POST':
            data = request.POST
            image = request.FILES.get('image', None)
            
            for field, value in data.items():
                if hasattr(product_to_update, field):
                    if field == "category":
                        try:
                            setattr(product_to_update, field, Category.objects.get(name=value))
                        except (ValueError, ValidationError, Category.DoesNotExist) as e:
                            return JsonResponse({"error": f"{str(e)}"}, status=400)
                    elif field == "image" and image:
                        product_to_update.image = image
                    else:
                        setattr(product_to_update, field, value)
                else:
                    return JsonResponse({"error": f"There is no field named {field} in products table."}, status=400)

        with transaction.atomic():
            product_to_update.save()
    
    except Product.DoesNotExist:
        return JsonResponse({"error": f"Product with ID: {id} was not found."}, status=404)

    return JsonResponse({"success": True}, safe=False)


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_product_by_id(request, id):
    try:
        product_to_delete = Product.objects.get(product_id=id)
        product_to_delete.delete()
    except Product.DoesNotExist:
        return JsonResponse({"error": f"Product with ID: {id} was not found."}, status=404)
    
    return JsonResponse({"success": True}, safe=False)


"""
CATEGORY AND COLLECTION VIEWS MANAGEMENT
"""

@require_http_methods(["GET"])
def list_all_collections(request):
    all_collections = Collection.objects.prefetch_related('subcategories__categories').all()

    if all_collections.exists():
        collections_list = []

        for collection in all_collections:
            collection_dict = collection.to_dict()
            collection_dict['subcategories'] = []

            for subcategory in collection.subcategories.all():
                subcategory_dict = subcategory.to_dict()
                subcategory_dict['categories'] = [category.to_dict() for category in subcategory.categories.all()]
                collection_dict['subcategories'].append(subcategory_dict)

            collections_list.append(collection_dict)

        return JsonResponse(collections_list, safe=False)
    else:
        return JsonResponse({"error": "No collections found, add a collection and try again."}, status=404)
    

@require_http_methods(["GET"])
def get_list_of_all_product_categories(request):
    list_of_all_categories = Category.objects.all()

    if list_of_all_categories.exists():
        # Paginate the results
        paginated_data = paginate_results(request, list_of_all_categories, request.build_absolute_uri())
        return JsonResponse(paginated_data, safe=False)
    else:
        return JsonResponse({"error": "No categories found."}, status=404)


@require_http_methods(["GET"])
def get_list_of_all_products_in_category(request, id):
    try:
        category = Category.objects.get(pk=id)
        products_in_category = Product.objects.filter(category=category)

        if products_in_category.exists():
            # Paginate the results
            paginated_data = paginate_results(request, products_in_category, request.build_absolute_uri())
            return JsonResponse(paginated_data, safe=False)
        else:
            return JsonResponse({"error": f"No products found in category with ID: {id}."}, status=404)
        
    except Category.DoesNotExist:
        return JsonResponse({"error": f"Category with ID: {id} was not found."}, status=404)
    

@require_http_methods(["POST"])
def create_new_product_category(request):
    try:
        name = request.POST["name"]

        new_category = Category(name=name)
        new_category.save()
        return JsonResponse({"success": True, "category": new_category.to_dict()}, safe=False)

    except MultiValueDictKeyError as e:
        return JsonResponse({"error": f"The form value for attribute {str(e)} is missing."}, status=400)
    

@require_http_methods(["PUT"])
def update_details_of_category_with_category_id(request, id):
    try:
        category_to_update = Category.objects.get(pk=id)

        name = QueryDict(request.body).get('name')

        if name:
            category_to_update.name = name
            category_to_update.save()
            return JsonResponse({"success": True, "updated_category": category_to_update.to_dict()}, safe=False)
        else:
            return JsonResponse({"error": "The 'name' field is required."}, status=400)

    except Category.DoesNotExist:
        return JsonResponse({"error": f"Category with ID: {id} does not exist."}, status=404)


@require_http_methods(["DELETE"])
def remove_product_category_with_category_id(request, id):
    try:
        category_to_delete = Category.objects.get(pk=id)

        category_to_delete_details = category_to_delete.to_dict()
        category_to_delete.delete()
        return JsonResponse({"success": True, "deleted_category": category_to_delete_details}, safe=False)

    except Category.DoesNotExist:
        return JsonResponse({"error": f"Category with ID: {id} does not exist."}, status=404)
    

@require_http_methods(["GET"])
def get_category_by_name(request, category_name):
    try:
        category = Category.objects.get(name=category_name)

        category_data = category.to_dict()
        return JsonResponse(category_data, safe=False)

    except Category.DoesNotExist:
        return JsonResponse({"error": f"Category with name: {category_name} does not exist."}, status=404)

