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
from django.utils.decorators import method_decorator


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
from .models import Product, Category, Collection, Subcategory, Order, ShoppingCart, CartItem, Address, OrderItem
from django.utils.datastructures import MultiValueDictKeyError
from django.core.exceptions import ValidationError, MultipleObjectsReturned, PermissionDenied, ObjectDoesNotExist
from django.http import QueryDict
from django.core import serializers
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.contrib import messages
from django.views import View
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.middleware.csrf import get_token
from django.views.generic.edit import FormView
from django.contrib.auth.forms import AuthenticationForm
import logging, json



"""
Decorator to render the homepage (LANDING PAGE)
"""
@require_http_methods(["GET"])
def index(request):
    if settings.DEBUG:
        # Redirect to React's development server
        return HttpResponseRedirect('http://localhost:3000/home')
    else:
        # In production, serve the built React app
        return render(request, 'marketplace/index.html')


""""
USER MANAGEMENT
"""
@require_http_methods(["POST"])
def register(request):
    try:
        data = json.loads(request.body)  # Parse the JSON data

        # Create a form instance with the JSON data
        form = UserRegistrationForm(data)
        
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

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)


logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class AjaxLoginView(View):
    def post(self, request, *args, **kwargs):
        logger.info(f"Received POST request to ajax_login: {request.body}")
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username', '')
            password = data.get('password', '')
            
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid login credentials'}, status=400)
        except Exception as e:
            logger.error(f"Error processing ajax login: {e}")
            return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred.'}, status=400)


"""@require_http_methods(["GET"])
def register_form(request):
    form = UserRegistrationForm()
    return render(request, 'marketplace/registration/register.html', {'form': form})
    """


@api_view(['GET'])
def get_csrf_token(request):
    return Response({'csrfToken': get_token(request)})


@login_required
@require_http_methods(["GET"])
def get_user_profile(request):
    user_id = request.user.id
    specific_user = User.objects.get(id=user_id)
    user_details = {
        'id': specific_user.id,
        'username': specific_user.username,
        'email': specific_user.email,
        'first_name': specific_user.first_name,
        'last_name': specific_user.last_name,
    }
    if request.headers.get('Accept') == 'application/json':
        return JsonResponse({'user': user_details})
    return render(request, 'marketplace/registration/profile.html', {'user': user_details})

@login_required
@require_http_methods(["PUT"])
def update_user_profile(request):
    if request.content_type != 'application/json':
        return JsonResponse({"error": "Invalid content type. Please use JSON."}, status=400)

    try:
        user_to_update = User.objects.get(id=request.user.id)
        data = QueryDict(request.body).dict()

        # Only allow specific fields to be updated
        allowed_fields = ['username', 'email', 'first_name', 'last_name']
        for field, value in data.items():
            if field == "password":
                try:
                    user_to_update.set_password(value)
                except (ValueError, ValidationError) as e:
                    return JsonResponse({"error": str(e)}, status=400)
            elif field in allowed_fields:
                setattr(user_to_update, field, value)
            else:
                return JsonResponse({"error": f"There is no field named {field} in the user model."}, status=400)

        user_to_update.save()
        return JsonResponse({"success": True}, status=200)

    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)

@login_required
@require_http_methods(["GET"])
def list_orders_placed_by_user(request):
    try:
        orders_placed_by_user = Order.objects.filter(user=request.user)
        orders_data = [order.to_dict() for order in orders_placed_by_user]
        return JsonResponse({'orders': orders_data}, safe=False, status=200)
    except Order.DoesNotExist:
        return JsonResponse({"error": "No orders found for the user."}, status=404)



"""@login_required
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


class UserStatusView(View):
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'isAuthenticated': False}, status=200)
        
        user = request.user
        user_status = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_active': user.is_active,
            'date_joined': user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
            'last_login': user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else None,
            'isAuthenticated': True
        }
        return JsonResponse(user_status, safe=False)


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



"""
SEARCH AND FILTERS MANAGEMENT
"""

@require_http_methods(["POST", "GET"])
def search_products_categories_and_collections(request):
    search_term = request.GET.get('search', '') if request.method == 'GET' else request.POST.get('search', '')
    search_term = search_term.strip().lower()

    # Search for collections
    collection_results = Collection.objects.filter(
        name__icontains=search_term
    ).order_by('name')

    # If collections found, get all related categories and subcategories
    if collection_results.exists():
        collections = collection_results
        # Get all related subcategories
        subcategories = Subcategory.objects.filter(collection__in=collections)
        # Get all related categories
        categories = Category.objects.filter(subcategory__in=subcategories)
        # Get all related products
        product_results = Product.objects.filter(category__in=categories).select_related('category').order_by('name')
    else:
        # If no collections are found, proceed with the search
        product_results = Product.objects.filter(
            Q(name__icontains=search_term) | Q(description__icontains=search_term)
        ).select_related('category').order_by('name')

    # Search for categories
    category_results = Category.objects.filter(
        name__icontains=search_term
    ).order_by('name')

    # Search for collections again to include non-empty results
    collections_results = Collection.objects.filter(
        name__icontains=search_term
    ).order_by('name')

    # Pagination parameters
    page_number = request.GET.get('page', 1)
    items_per_page = 10

    paginator_products = Paginator(product_results, items_per_page)
    paginator_categories = Paginator(category_results, items_per_page)
    paginator_collections = Paginator(collections_results, items_per_page)

    try:
        products_page = paginator_products.get_page(page_number)
        categories_page = paginator_categories.get_page(page_number)
        collections_page = paginator_collections.get_page(page_number)
    except EmptyPage:
        return JsonResponse({"error": "Page not found"}, status=404)

    json_data = {
        'products': [product.to_dict(request) for product in products_page],
        'categories': [category.to_dict(request) for category in categories_page],
        'collections': [collection.to_dict(request) for collection in collections_page],
        'current_page': products_page.number,
        'total_pages': {
            'products': paginator_products.num_pages,
            'categories': paginator_categories.num_pages,
            'collections': paginator_collections.num_pages
        }
    }

    return JsonResponse(json_data, safe=False)



@csrf_exempt
@require_http_methods(["GET", "POST"])
def apply_filters_to_search_results(request):
    search_results = request.session.get('search_results', [])

    if search_results:
        filtered_results = []

        # Deserialize the search results from the session
        for result in search_results:
            model = result.get('model')
            pk = result.get('pk')

            if model == 'product':
                try:
                    product = Product.objects.get(product_id=pk)
                    filtered_results.append(product)
                except Product.DoesNotExist:
                    continue
            elif model == 'category':
                try:
                    category = Category.objects.get(category_id=pk)
                    filtered_results.append(category)
                except Category.DoesNotExist:
                    continue
            elif model == 'collection':
                try:
                    collection = Collection.objects.get(collection_id=pk)
                    filtered_results.append(collection)
                except Collection.DoesNotExist:
                    continue

        min_price = int(request.POST.get('min_price', 0))
        max_price = int(request.POST.get('max_price', 1_000_000_000))
        category_filter = request.POST.get('category', None)

        if isinstance(filtered_results[0], Product):
            filtered_results = [product for product in filtered_results if min_price <= product.price <= max_price]
            if category_filter:
                filtered_results = [product for product in filtered_results if product.category.name == category_filter]

        elif isinstance(filtered_results[0], Category):
            if category_filter:
                filtered_results = [category for category in filtered_results if category.name == category_filter]

        elif isinstance(filtered_results[0], Collection):
            if category_filter:
                filtered_results = [collection for collection in filtered_results if collection.name == category_filter]

        filtered_results_json = [result.to_dict(request) for result in filtered_results]

        return JsonResponse(filtered_results_json, safe=False)
    else:
        return JsonResponse({"error": "No search results found in session."}, status=404)


"""
SHOPPING CART MANAGEMENT
"""
@login_required
@require_http_methods(["GET"])
def get_user_shopping_cart_contents(request):
    try:
        user_id = request.user.id
        cart = ShoppingCart.objects.get(user=user_id)
        print(f"Cart ID: {cart.cart_id}")

        cart_items = CartItem.objects.filter(cart=cart)
        print(f"Cart Items: {cart_items}")

        cart_items_data = []
        total_amount = 0

        for item in cart_items:
            total_price = item.product.price * item.quantity
            total_amount += total_price
            cart_items_data.append({
                'product': {
                    'product_id': item.product.product_id,
                    'name': item.product.name,
                    'price': item.product.price,
                },
                'quantity': item.quantity,
                'total_price': total_price,
            })

        return JsonResponse({
            'cart_items': cart_items_data,
            'total_amount': total_amount,
            'cart_item_count': cart_items.count()
        })
    except ShoppingCart.DoesNotExist:
        return JsonResponse({
            'cart_items': [],
            'total_amount': 0,
            'cart_item_count': 0
        })
    except Exception as e:
        print(f"Error fetching cart contents: {str(e)}")
        return JsonResponse({
            'cart_items': [],
            'total_amount': 0,
            'cart_item_count': 0
        })



@login_required
@require_http_methods(["POST"])
def add_product_to_cart(request, productId):
    try:
        user_id = request.user.id
        quantity = int(request.POST.get('quantity', 1))  # Default to 1 if quantity is not provided

        # Fetch the product or return a 404 if it doesn't exist
        product = Product.objects.get(product_id=productId)

        # Check if the requested quantity exceeds the available stock
        if quantity > product.quantity_in_stock:
            return JsonResponse(
                {'success': False, 'error': f"Please reduce the quantity to {product.quantity_in_stock} or less, as the current stock is {product.quantity_in_stock} items."}, status=400)

        # Get or create a shopping cart for the user
        cart, created = ShoppingCart.objects.get_or_create(user=request.user)

        # Get or create the cart item
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        
        # Always set the quantity before saving
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        
        if cart_item.quantity is None:
            cart_item.quantity = quantity

        cart_item.save()

        return JsonResponse({'success': True, 'cart_item_id': cart_item.item_id})

    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'error': f"Product with ID: {productId} not found."}, status=404)
    except ValueError:
        return JsonResponse({'success': False, 'error': "Invalid quantity. Please enter a valid number."}, status=400)
    except Exception as e:
        # Log the detailed error message for debugging purposes
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'error': f"An unexpected error occurred: {str(e)}"}, status=500)

@login_required
@require_http_methods(["DELETE"])
def remove_product_from_user_cart(request, productId):
    try:
        user_id = request.user.id
        cart = ShoppingCart.objects.get(user=user_id, status='active')
        cart_item_to_delete = CartItem.objects.get(cart=cart, product_id=productId)
        
        cart_item_to_delete.delete()
        
        return JsonResponse({'message': 'Item removed from cart.'}, status=200)
    
    except ShoppingCart.DoesNotExist:
        return JsonResponse({'error': f'User with ID: {user_id} does not have an active cart.'}, status=404)
    
    except CartItem.DoesNotExist:
        return JsonResponse({'error': 'CartItem does not exist.'}, status=404)
    
    except Product.DoesNotExist:
        return JsonResponse({'error': f'Product with ID: {productId} not found in cart.'}, status=404)


@login_required
@require_http_methods(["DELETE", "POST"])
def clear_entire_shopping_cart(request):
    try:
        user_id = request.user.id
        cart = ShoppingCart.objects.get(user=user_id)

        cart_items = CartItem.objects.filter(cart=cart)
        cart_items.delete()

        return JsonResponse({'message': 'Cart cleared successfully.'}, status=200)
    
    except ShoppingCart.DoesNotExist:
        return JsonResponse({'error': f'User with ID: {user_id} does not have a cart.'}, status=404)
