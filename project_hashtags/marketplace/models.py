"""
Hashtags Mech Models.

These models represent the structure of the database tables.

Each model corresponds to a single database table,
and the attributes of the model represent the fields of the table.
"""

from django.db import models
from django.core.validators import MinValueValidator


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
