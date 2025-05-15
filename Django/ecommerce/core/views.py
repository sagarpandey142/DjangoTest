from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer
import random

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

@api_view(['POST'])
def recommend_products(request):
    product_ids = request.data.get('product_ids', [])
    if not product_ids:
        return Response({"error": "Provide product_ids list."}, status=400)

    all_products = Product.objects.exclude(id__in=product_ids)
    recommended = random.sample(list(all_products), min(5, all_products.count()))
    serializer = ProductSerializer(recommended, many=True)
    return Response(serializer.data)
