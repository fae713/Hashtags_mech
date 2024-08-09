from django.contrib import admin
from .models import Collection, Subcategory, Category, Product


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
