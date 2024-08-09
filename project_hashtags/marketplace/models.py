"""
Hashtags Mech Models.

These models represent the structure of the database tables.

Each model corresponds to a single database table,
and the attributes of the model represent the fields of the table.
"""

from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User


class Collection(models.Model):
    """
    This class defines the collection table structure.
    """
    collection_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    def to_dict(self, request=None):
        return {
            'collection_id': self.collection_id,
            'name': self.name,
        }


class Subcategory(models.Model):
    """
    This class defines the subcategory table structure.
    """
    subcategory_id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=255,
        choices=[
            ('Tops', 'Tops'),
            ('Pants', 'Pants')
        ]
    )
    collection = models.ForeignKey(
        Collection,
        related_name='subcategories',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f'{self.collection.name} - {self.name}'

    def to_dict(self, request=None):
        return {
            'subcategory_id': self.subcategory_id,
            'name': self.name,
            'collection': self.collection.to_dict() if self.collection else None,
        }


class Category(models.Model):
    """
    This class defines the category table structure.
    """
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=255,
        choices=[
            ('Hoodies', 'Hoodies'),
            ('Shirts', 'Shirts'),
            ('Jackets', 'Jackets')
        ]
    )
    subcategory = models.ForeignKey(
        Subcategory,
        related_name='categories',
        on_delete=models.CASCADE,
        null=True,  # Allow the field to be nullable
        blank=True  # Allow the field to be left blank in forms
    )

    def __str__(self):
        return f'{self.subcategory.name} - {self.name}'

    def to_dict(self, request=None):
        return {
            'category_id': self.category_id,
            'name': self.name,
            'subcategory': self.subcategory.to_dict() if self.subcategory else None,
        }


class Product(models.Model):
    """
    This class defines the products table structure.
    """
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_in_stock = models.IntegerField(
        validators=[MinValueValidator(0)]
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='images', blank=True)

    def __str__(self):
        return f'{self.name} - {self.price}'

    def to_dict(self, request=None):
        image_url = self.image.url if self.image else None

        if request and image_url:
            image_url = request.build_absolute_uri(image_url)

        return {
            'product_id': self.product_id,
            'name': self.name,
            'description': self.description,
            'price': str(self.price),
            'quantity_in_stock': self.quantity_in_stock,
            'category': self.category.to_dict() if self.category else None,
            'image': image_url
        }


class ShoppingCart(models.Model):
    """
    This class defines the shopping cart table structure.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]

    cart_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f'Cart ID: {self.cart_id} - User: {self.user}'

    def to_dict(self, request=None):
        cart_dict = {
            'cart_id': self.cart_id,
            'user': self.user.username,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'updated_at': self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
            'status': self.status,
        }

        cart_items = self.cartitem_set.all()
        cart_dict['items'] = [item.to_dict(exclude_cart=True) for item in cart_items]

        return cart_dict


class CartItem(models.Model):
    """
    This class defines the cart item table structure.
    """
    item_id = models.AutoField(primary_key=True)
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'Item ID: {self.item_id} - Product: {self.product.name} - Quantity: {self.quantity}'

    def to_dict(self, exclude_cart=False):
        cart_item_data = {
            'item_id': self.item_id,
            'product': self.product.to_dict() if self.product else None,
            'subtotal': self.product.price * self.quantity if self.product else None,
            'quantity': self.quantity,
        }
        if not exclude_cart:
            cart_item_data['cart'] = self.cart.to_dict() if self.cart else None
        return cart_item_data


class Order(models.Model):
    """
    This class defines the order table structure.
    """
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE)
    items = models.ManyToManyField(CartItem, through='OrderItem')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.CharField(max_length=255, choices=ORDER_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Order ID: {self.order_id} - User: {self.user.username} - Status: {self.order_status}'

    def to_dict(self, request=None):
        return {
            'order_id': self.order_id,
            'user': self.user.id,
            'total_amount': str(self.total_amount),
            'order_status': self.order_status,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }


class OrderItem(models.Model):
    """
    This class defines the orderitem table structure.
    """
    item_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    cart_item = models.ForeignKey(CartItem, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'Order Item ID: {self.item_id} - Product: {self.product.name} - Quantity: {self.quantity}'

    def to_dict(self):
        return {
            'order_item_id': self.item_id,
            'order': self.order.order_id,
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'unit_price': str(self.unit_price),
        }


class Address(models.Model):
    """
    This class defines the address table structure.
    """
    address_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    street_address = models.CharField(max_length=255, null=True, blank=True, verbose_name="Street Address")
    town = models.CharField(max_length=255, null=True, blank=True, verbose_name="Town")
    zipcode = models.CharField(max_length=10, null=True, blank=True, verbose_name="Zip Code")
    county = models.CharField(max_length=255, null=True)
    phone_number_1 = models.CharField(max_length=20, null=True, blank=True, verbose_name="Phone Number 1")
    phone_number_2 = models.CharField(max_length=20, null=True, blank=True, verbose_name="Phone Number 2")
    additional_details = models.TextField(null=True, blank=True, verbose_name="Additional Details")

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"
        ordering = ['user', 'street_address']

    def __str__(self):
        return f'{self.user.username} - {self.street_address}, {self.town}, {self.county}, {self.zipcode}'

    def to_dict(self, request=None):
        return {
            'address_id': self.address_id,
            'user': self.user.id,
            'street_address': self.street_address,
            'town': self.town,
            'zipcode': self.zipcode,
            'county': self.county,
            'phone_number_1': self.phone_number_1,
            'phone_number_2': self.phone_number_2,
            'additional_details': self.additional_details,
        }
