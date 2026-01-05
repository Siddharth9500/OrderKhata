# OrderKhata API Testing Guide

Use these example requests to test the API using tools like Postman or Thunder Client.

## Base URL
```
http://localhost:5000/api
```

## 1. Authentication

### Signup (Wholesaler)
```json
POST /auth/signup

{
  "name": "Rajesh Kumar",
  "mobile": "9876543210",
  "password": "password123",
  "role": "wholesaler",
  "shopName": "Kumar Trading Co",
  "businessName": "Kumar Wholesale",
  "location": {
    "area": "Chandni Chowk",
    "city": "Delhi"
  },
  "categoriesSupplied": ["Rice & Grains", "Pulses", "Oil", "Spices"]
}
```

### Signup (Retailer)
```json
POST /auth/signup

{
  "name": "Amit Sharma",
  "mobile": "9123456789",
  "password": "password123",
  "role": "retailer",
  "shopName": "Sharma General Store",
  "location": {
    "area": "Karol Bagh",
    "city": "Delhi"
  },
  "shopSize": "medium",
  "preferredCategories": ["Rice & Grains", "FMCG", "Snacks"]
}
```

### Login
```json
POST /auth/login

{
  "mobile": "9876543210",
  "password": "password123"
}
```

Response will include a `token`. Use this token in all subsequent requests:
```
Authorization: Bearer <token>
```

## 2. Products

### Add Product (Wholesaler Only)
```json
POST /products
Authorization: Bearer <wholesaler-token>

{
  "name": "Basmati Rice",
  "brand": "India Gate",
  "category": "Rice & Grains",
  "unit": "kg",
  "unitSize": 5,
  "price": 450,
  "description": "Premium quality basmati rice"
}
```

### Get Wholesaler's Products
```
GET /products/wholesaler/:wholesalerId
Authorization: Bearer <token>
```

### Update Product
```json
PUT /products/:productId
Authorization: Bearer <wholesaler-token>

{
  "price": 475,
  "isAvailable": true
}
```

### Delete Product
```
DELETE /products/:productId
Authorization: Bearer <wholesaler-token>
```

## 3. Orders

### Create Order (Retailer Only)
```json
POST /orders
Authorization: Bearer <retailer-token>

{
  "wholesalerId": "65abc123def456789",
  "items": [
    {
      "productId": "65xyz789abc123456",
      "quantity": 5
    },
    {
      "productId": "65pqr456mno789012",
      "quantity": 2
    }
  ],
  "notes": "Please deliver by evening"
}
```

### Get My Orders
```
GET /orders/my-orders
Authorization: Bearer <token>

Query params (optional):
- status: pending/seen/processing/completed
- page: 1
- limit: 20
```

### Get Order Details
```
GET /orders/:orderId
Authorization: Bearer <token>
```

### Update Order Status (Wholesaler Only)
```json
PUT /orders/:orderId/status
Authorization: Bearer <wholesaler-token>

{
  "status": "seen"
}
```

Valid statuses: `seen`, `processing`, `completed`, `cancelled`

### Reorder (Retailer Only)
```json
POST /orders/:orderId/reorder
Authorization: Bearer <retailer-token>

{
  "notes": "Reordering same items"
}
```

## 4. Recommendations

### Get Smart Recommendations
```json
POST /recommendations/suggest
Authorization: Bearer <retailer-token>

{
  "wholesalerId": "65abc123def456789",
  "currentItems": [
    "65xyz789abc123456",
    "65pqr456mno789012"
  ]
}
```

### Get Frequently Ordered Together
```
GET /recommendations/frequently-ordered-together/:productId
Authorization: Bearer <token>
```

### Get Popular Products
```
GET /recommendations/popular/:wholesalerId
Authorization: Bearer <token>
```

### Get My Frequent Items
```
GET /recommendations/my-frequent-items?wholesalerId=65abc123def456789
Authorization: Bearer <retailer-token>
```

## 5. Users

### Get Profile
```
GET /users/profile
Authorization: Bearer <token>
```

### Get All Wholesalers
```
GET /users/wholesalers
Authorization: Bearer <token>

Query params (optional):
- city: Delhi
- category: Rice & Grains
```

### Get Wholesaler Details
```
GET /users/wholesaler/:wholesalerId
Authorization: Bearer <token>
```

### Update Profile
```json
PUT /users/profile
Authorization: Bearer <token>

{
  "name": "Updated Name",
  "shopName": "New Shop Name",
  "location": {
    "area": "New Area",
    "city": "New City"
  }
}
```

## Sample Test Flow

1. **Create Wholesaler Account**
   - Signup as wholesaler
   - Copy the token from response

2. **Add Products**
   - Use wholesaler token
   - Add 5-10 products in different categories

3. **Create Retailer Account**
   - Signup as retailer
   - Copy the token from response

4. **Browse Wholesalers**
   - Use retailer token
   - Get list of wholesalers
   - Get products of a specific wholesaler

5. **Place Order**
   - Create order with multiple products
   - Check order details

6. **Wholesaler Actions**
   - Use wholesaler token
   - View received orders
   - Update order status

7. **Test Recommendations**
   - Add products to cart
   - Get recommendations
   - Test frequently ordered together

8. **Reorder**
   - Use retailer token
   - Reorder a previous order

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
