# E-Commerce Store

A full-stack e-commerce application built with React (frontend) and Node.js/Express (backend) with MongoDB database.

## 🚀 Features

### Frontend (React)
- **Product Catalog**: Browse products with search and filtering
- **Product Details**: Detailed product pages with images and descriptions
- **Shopping Cart**: Add/remove items, update quantities
- **User Authentication**: Login/Register with JWT
- **Order Management**: View order history and track orders
- **Admin Panel**: Manage products, orders, and users
- **Responsive Design**: Works on desktop and mobile devices

### Backend (Node.js/Express)
- **RESTful API**: Complete CRUD operations for products, orders, users
- **Authentication**: JWT-based authentication and authorization
- **File Upload**: Product image upload with Multer
- **Payment Integration**: Stripe payment processing
- **Database**: MongoDB with Mongoose ODM
- **Security**: CORS, Helmet, Rate limiting

## 🛠️ Tech Stack

### Frontend
- React 18
- Redux Toolkit (State Management)
- React Router (Navigation)
- Axios (HTTP Client)
- Tailwind CSS (Styling)
- React Hook Form (Form Handling)
- Stripe React (Payment)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- Multer (File Upload)
- Stripe (Payments)
- Winston (Logging)
- Helmet (Security)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd E-commerce
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Environment Setup

#### Backend (.env in server directory)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

#### Frontend (.env in client directory)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Start the Application

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
E-commerce/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── store/         # Redux store
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                # Node.js Backend
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   ├── utils/           # Utility functions
│   ├── uploads/         # Uploaded files
│   └── index.js         # Server entry point
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## 👤 Admin Features

- Product management (CRUD operations)
- Order management and status updates
- User management
- Sales analytics

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- XSS protection

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` folder
3. Configure MongoDB connection

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support, email support@example.com or create an issue in the repository. 