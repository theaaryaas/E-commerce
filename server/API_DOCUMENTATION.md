# E-commerce API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user profile (requires authentication).

#### PUT /auth/profile
Update user profile (requires authentication).

### Products

#### GET /products
Get all products with pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term
- `category` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sort` (string): Sort field (price, createdAt, etc.)
- `order` (string): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### GET /products/:id
Get single product by ID.

#### POST /products (Admin only)
Create new product.

#### PUT /products/:id (Admin only)
Update product.

#### DELETE /products/:id (Admin only)
Delete product.

### Cart

#### GET /cart
Get user's cart (requires authentication).

#### POST /cart
Add item to cart (requires authentication).

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

#### PUT /cart/:productId
Update cart item quantity (requires authentication).

#### DELETE /cart/:productId
Remove item from cart (requires authentication).

#### DELETE /cart
Clear entire cart (requires authentication).

### Orders

#### GET /orders
Get user's orders (requires authentication).

#### GET /orders/:id
Get single order (requires authentication).

#### POST /orders
Create new order (requires authentication).

**Request Body:**
```json
{
  "orderItems": [
    {
      "product": "product_id",
      "name": "Product Name",
      "image": "image_url",
      "price": 29.99,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  },
  "paymentMethod": "stripe",
  "totalPrice": 59.98
}
```

#### PUT /orders/:id/status (Admin only)
Update order status.

### Payments

#### POST /payments/create-payment-intent
Create payment intent for order (requires authentication).

**Request Body:**
```json
{
  "orderId": "order_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

#### POST /payments/confirm
Confirm payment completion (requires authentication).

**Request Body:**
```json
{
  "orderId": "order_id",
  "paymentIntentId": "pi_xxx"
}
```

#### GET /payments/methods
Get user's saved payment methods (requires authentication).

#### POST /payments/webhook
Stripe webhook endpoint (no authentication required).

### Users

#### GET /users (Admin only)
Get all users with pagination.

#### GET /users/:id (Admin only)
Get single user.

#### PUT /users/:id (Admin only)
Update user.

#### DELETE /users/:id (Admin only)
Delete user.

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email",
      "value": "invalid-email"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "User role user is not authorized to access this route"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP

## Webhook Events

The application handles these Stripe webhook events:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.created`
- `customer.updated`

## Environment Variables

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
``` 