![Build Status](https://img.shields.io/github/actions/workflow/status/theaaryaas/E-commerce/node.js.yml?branch=main)
![GitHub last commit](https://img.shields.io/github/last-commit/theaaryaas/E-commerce)
![GitHub license](https://img.shields.io/github/license/theaaryaas/E-commerce)
![GitHub repo size](https://img.shields.io/github/repo-size/theaaryaas/E-commerce)
![E-commerce](https://img.shields.io/badge/E--commerce-live-brightgreen)

# E-Commerce Website

## 📝 About

This project is a full-featured, modern e-commerce platform designed for both customers and administrators. Built with a React frontend and a Node.js/Express backend, it leverages MongoDB for data storage and Stripe for secure payment processing. The platform supports user authentication, product browsing, shopping cart management, order processing, and an admin dashboard for managing products, users, and orders. The codebase is modular and scalable, making it suitable for learning, personal projects, or as a foundation for a production e-commerce site.

Key highlights:
- Modern tech stack: React, Redux Toolkit, Node.js, Express, MongoDB, Stripe
- Secure authentication and authorization with JWT
- Responsive, mobile-friendly UI with Tailwind CSS
- Real-world features: product reviews, order tracking, admin controls
- Easy local setup and extensible architecture

---

## 🚀 Features

### User Features
- **User Authentication**: Registration, login, logout with JWT tokens
- **Product Catalog**: Browse products with search, filtering, and pagination
- **Shopping Cart**: Add, remove, and update items with real-time updates
- **Secure Checkout**: Stripe payment processing with multiple payment methods
- **Order Management**: View order history and track order status
- **User Profile**: Update personal information and manage addresses
- **Product Reviews**: Rate and review products

### Admin Features
- **Dashboard**: Overview of sales, orders, and user statistics
- **Product Management**: Create, edit, and delete products
- **Order Management**: Process orders and update status
- **User Management**: View and manage user accounts
- **Inventory Management**: Track stock levels and update quantities

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live cart updates and notifications
- **Search & Filtering**: Advanced product search with multiple filters
- **Image Gallery**: Product image carousel and zoom functionality
- **Security**: JWT authentication, input validation, and rate limiting
- **Performance**: Optimized queries, pagination, and caching

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **multer** - File uploads
- **nodemailer** - Email functionality

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Tailwind CSS** - Styling
- **Stripe Elements** - Payment UI
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-website
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```

### Database Setup

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Create database and collections**
   The application will automatically create the necessary collections when it starts.

## 🚀 Quick Start

1. **Install all dependencies**
   ```bash
   npm run install-all
   ```

2. **Start both servers**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
ecommerce-website/
├── server/                 # Backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── index.js           # Server entry point
│   └── package.json
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main app component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin)
- `PUT /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/status/:orderId` - Get payment status

## 🔐 Environment Variables

### Backend (.env)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `EMAIL_HOST` - SMTP host
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Deploy to Heroku, Vercel, or your preferred platform
3. Set environment variables in your deployment platform
4. Update CORS settings for your domain

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform
3. Set environment variables for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🙏 Acknowledgments

- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend framework 