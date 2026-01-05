# OrderKhata - Setup & Installation Guide

## 🎯 Overview

OrderKhata is a complete web-based ordering system for local grocery shops and wholesalers. It helps retailers never forget items again with smart recommendations and provides wholesalers with clean, structured orders.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Quick Start Guide

### Step 1: Install MongoDB

1. Download and install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows (run as Administrator)
   net start MongoDB
   
   # Or start manually
   mongod
   ```

### Step 2: Install Backend Dependencies

Open terminal in the OrderKhata folder and run:

```bash
npm install
```

This will install all backend dependencies:
- express (Web framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (JWT authentication)
- bcryptjs (Password hashing)
- cors (Cross-origin resource sharing)
- dotenv (Environment variables)

### Step 3: Install Frontend Dependencies

Navigate to the client folder and install React dependencies:

```bash
cd client
npm install
cd ..
```

### Step 4: Configure Environment

The `.env` file is already created with default settings:
- MongoDB URI: `mongodb://localhost:27017/orderkhata`
- Backend Port: `5000`
- JWT Secret: Change this in production!

### Step 5: Start the Application

#### Option A: Start Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```
Backend will run on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
Frontend will run on: http://localhost:3000

#### Option B: Start Both Simultaneously

```bash
npm run dev:full
```

## 🎨 Application Features

### For Retailers (Shopkeepers)

1. **Browse Wholesalers**
   - View all registered wholesalers
   - Filter by category and location
   - Search by name

2. **Order Products**
   - Browse wholesaler's product catalog
   - Add items to cart with quantity selector
   - Smart recommendations suggest frequently ordered items
   - Review order before sending

3. **Order History**
   - View all past orders
   - Reorder with one click
   - Track order status

### For Wholesalers (Distributors)

1. **Manage Products**
   - Add new products
   - Edit existing products
   - Toggle product availability
   - Set prices and descriptions

2. **Receive Orders**
   - View incoming orders in real-time
   - See complete order details
   - Update order status (Seen → Processing → Completed)

3. **Order Management**
   - View all orders received
   - Filter by status
   - Contact retailer information

## 📱 User Flow

### First Time Setup

1. **Landing Page**: Choose Login or Sign Up
2. **Sign Up**: Select role (Retailer or Wholesaler)
3. **Complete Profile**: Enter shop details and location

### Retailer Journey

1. Dashboard shows all available wholesalers
2. Click on wholesaler to view products
3. Add products to cart
4. Get smart recommendations
5. Review and send order
6. Track in order history

### Wholesaler Journey

1. Dashboard shows incoming orders
2. Add products to catalog
3. Mark orders as seen/processing/completed
4. Manage product availability

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- OTP verification ready (placeholder for SMS gateway integration)

## 📊 Database Structure

### Collections

1. **users** - Retailers and Wholesalers
   - Role-based fields
   - Location information
   - Categories

2. **products** - Product catalog
   - Linked to wholesaler
   - Category classification
   - Price and availability

3. **orders** - Order records
   - Order items with quantities
   - Status tracking
   - Auto-generated order numbers

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/wholesalers` - Get all wholesalers
- `GET /api/users/profile` - Get user profile

### Products
- `POST /api/products` - Add product (Wholesaler)
- `GET /api/products/wholesaler/:id` - Get wholesaler products
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order (Retailer)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Wholesaler)
- `POST /api/orders/:id/reorder` - Reorder (Retailer)

### Recommendations
- `POST /api/recommendations/suggest` - Get smart recommendations
- `GET /api/recommendations/popular/:wholesalerId` - Get popular products

## 🎨 UI/UX Design Principles

✅ Mobile-first responsive design
✅ WhatsApp-like familiar interface
✅ Minimal English, icon-based navigation
✅ Fast loading times
✅ Simple, clean layouts
✅ Color-coded status indicators

## 🧪 Testing the Application

### Test Data Creation

1. **Create a Wholesaler Account**
   - Sign up as Wholesaler
   - Add 10-15 products in different categories

2. **Create a Retailer Account**
   - Sign up as Retailer
   - Browse the wholesaler's products
   - Create test orders

3. **Test Features**
   - Add products to cart
   - Check recommendations popup
   - Place order
   - Reorder from history
   - Update order status (as wholesaler)

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or check if service is running
net start MongoDB
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### Cannot Find Module Error
```bash
# Reinstall dependencies
npm install
cd client
npm install
```

### React Build Errors
```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
```

## 📈 Future Enhancements

- [ ] SMS OTP integration (Twilio/MSG91)
- [ ] Push notifications
- [ ] PDF invoice generation
- [ ] Payment gateway integration
- [ ] Analytics dashboard
- [ ] Bulk product import
- [ ] Multi-language support
- [ ] PWA (Progressive Web App)

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review the API documentation
- Ensure all dependencies are installed
- Verify MongoDB is running

## 📄 License

This project is open source and available for commercial use.

---

**Built with ❤️ for local grocery businesses**
