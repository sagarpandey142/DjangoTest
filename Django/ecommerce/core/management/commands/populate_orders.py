from django.core.management.base import BaseCommand
from core.models import Order, Product
import random

class Command(BaseCommand):
    help = 'Place random orders'

    def handle(self, *args, **kwargs):
        products = Product.objects.all()
        if not products:
            self.stdout.write(self.style.ERROR("No products available."))
            return

        for _ in range(10):
            product = random.choice(products)
            Order.objects.create(product=product, quantity=random.randint(1, 5))

        self.stdout.write(self.style.SUCCESS("Successfully added orders"))
