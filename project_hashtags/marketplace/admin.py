from django.contrib import admin
from .models import Collection, Subcategory, Category, Product, ShoppingCart, CartItem, Order, OrderItem, Address


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ('collection_id', 'name')
    search_fields = ('name',)

@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('subcategory_id', 'name', 'collection')
    search_fields = ('name',)
    list_filter = ('collection',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'name', 'subcategory')
    search_fields = ('name',)
    list_filter = ('subcategory',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'name', 'price', 'category', 'quantity_in_stock', 'description')
    search_fields = ('name',)
    list_filter = ('category',)

@admin.register(ShoppingCart)
class ShoppingCartAdmin(admin.ModelAdmin):
    list_display = ('cart_id', 'user', 'status', 'created_at', 'updated_at')
    search_fields = ('user__username', 'status')
    list_filter = ('status', 'created_at', 'updated_at')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('item_id', 'cart', 'product', 'quantity')
    search_fields = ('product__name',)
    list_filter = ('cart__status',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'user', 'cart', 'total_amount', 'order_status', 'created_at')
    search_fields = ('user__username', 'cart__cart_id')
    list_filter = ('order_status',)
    readonly_fields = ('created_at',)


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('item_id', 'order', 'cart_item', 'product', 'quantity', 'unit_price')
    search_fields = ('product__name', 'order__user__username')
    list_filter = ('order__order_status',)
    readonly_fields = ('unit_price',)


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('address_id', 'user', 'street_address', 'town', 'zipcode', 'county')
    search_fields = ('user__username', 'street_address', 'town', 'zipcode')
    list_filter = ('user',)
    readonly_fields = ('address_id',)