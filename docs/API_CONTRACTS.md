# MarketHub API Contracts

This document defines the core API contracts for the MarketHub backend.

## Response Formats

All API responses follow a standard wrapper format.

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_SNAKE_CASE",
    "message": "Human readable message",
    "requestId": "uuid"
  }
}
```

## Auth

### Register
`POST /api/auth/register`
- **Body:** `{ "email": "user@example.com", "password": "securepassword", "role": "CUSTOMER" }` // role optional
- **Response:** `{ "success": true, "data": { "user": { "id": "...", "email": "...", "role": "..." } } }`

### Login
`POST /api/auth/login`
- **Body:** `{ "email": "user@example.com", "password": "securepassword" }`
- **Response:** `{ "success": true, "data": { "user": { "id": "...", "email": "...", "role": "..." } } }`

### Logout
`POST /api/auth/logout`
- **Body:** None
- **Response:** `{ "success": true, "data": { "message": "Logged out successfully" } }`

### Me
`GET /api/auth/me`
- **Body:** None
- **Response:** `{ "success": true, "data": { "user": { "id": "...", "email": "...", "role": "..." } } }`

## Products

### List Products
`GET /api/products`
- **Query Params:** `categoryId`, `vendorId`, `page`, `limit`
- **Response:** `{ "success": true, "data": { "products": [...], "total": 100, "page": 1, "limit": 10 } }`

### Create Product
`POST /api/products`
- **Body:** `{ "name": "Product", "description": "...", "price": 1000, "categoryId": "..." }`
- **Response:** `{ "success": true, "data": { "product": { ... } } }`

### Update Product
`PUT /api/products/:id`
- **Body:** `{ "name": "New Name", "price": 1200 }`
- **Response:** `{ "success": true, "data": { "product": { ... } } }`

### Delete Product
`DELETE /api/products/:id`
- **Body:** None
- **Response:** `{ "success": true, "data": { "message": "Product deleted successfully" } }`

## Cart

### Get Cart
`GET /api/cart`
- **Response:** `{ "success": true, "data": { "cart": { "items": [...], "total": 2000 } } }`

### Add to Cart
`POST /api/cart`
- **Body:** `{ "productId": "...", "quantity": 1 }`
- **Response:** `{ "success": true, "data": { "cart": { ... } } }`

### Update Cart Item
`PUT /api/cart/:id`
- **Body:** `{ "quantity": 2 }`
- **Response:** `{ "success": true, "data": { "cart": { ... } } }`

### Remove from Cart
`DELETE /api/cart/:id`
- **Response:** `{ "success": true, "data": { "cart": { ... } } }`

## Orders

### Checkout
`POST /api/orders/checkout`
- **Body:** `{ "shippingAddress": "...", "paymentMethodId": "..." }`
- **Response:** `{ "success": true, "data": { "order": { "id": "...", "total": 2000, "status": "PENDING" } } }`

### List Customer Orders
`GET /api/orders/customer`
- **Response:** `{ "success": true, "data": { "orders": [...] } }`

### List Vendor Orders
`GET /api/orders/vendor`
- **Response:** `{ "success": true, "data": { "orders": [...] } }`
