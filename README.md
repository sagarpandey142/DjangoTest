# 🛒 Django E-commerce API — Products & Orders Management

## 📌 Problem Statement

Build a Django REST API system using SQLite that supports **Products** and **Orders** management. The system should:

1. Store Products and Orders using proper database models.
2. Provide complete **CRUD APIs** (Create, Read, Update, Delete) for both entities.
3. Include a custom script to populate random product and order data.
4. Include an API to accept a list of product IDs and return recommended products.

---

##  Solution Approach

The project is built using **Django** and **Django REST Framework** for robust and scalable API development.

### 🔧 Structure:

- **Models**: Defined `Product` and `Order` models with necessary fields.
- **Serializers**: Handle conversion between model instances and JSON.
- **Views**: Used `ModelViewSet` to auto-generate all CRUD APIs.
- **URLs**: RESTful routes configured using DRF's router.
- **Custom Scripts**: `populate_products` and `populate_orders` commands to generate random test data.
- **Recommendation API**: Accepts a list of product IDs and returns recommended products excluding the given ones.

---

## 🧑‍💻 Instructions to Run the Code

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ecommerce-django.git
cd ecommerce-django
