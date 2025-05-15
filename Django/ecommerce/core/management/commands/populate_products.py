from django.core.management.base import BaseCommand
from core.models import Product
import random

class Command(BaseCommand):
    help = 'Populate random products'

    def handle(self, *args, **kwargs):
        for i in range(10):
            Product.objects.create(
                name=f"Product {i}",
                description=f"Description for product {i}",
                price=round(random.uniform(10, 100), 2)
            )
        self.stdout.write(self.style.SUCCESS("Successfully added products"))
