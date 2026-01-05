# OrderKhata - Quick Reference Card

## 🚀 Starting the Application

### Method 1: Automatic (Recommended)
```bash
# Run the setup script (Windows)
setup.bat

# Then start both servers
npm run dev:full
```

### Method 2: Manual
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 📝 Common Tasks

### Adding Sample Data

#### Create Wholesaler
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Select "I am a Wholesaler"
4. Fill details:
   - Name: Rajesh Kumar
   - Mobile: 9876543210
   - Password: test123
   - Shop Name: Kumar Trading Co
   - Business Name: Kumar Wholesale
   - Area: Chandni Chowk
   - City: Delhi
   - Categories: Rice & Grains, Pulses, Oil

#### Add Products
1. Login as wholesaler
2. Click 📦 icon (Manage Products)
3. Click "+ Add Product"
4. Sample products:
   - Basmati Rice, India Gate, 5kg, ₹450
   - Toor Dal, Tata Sampann, 1kg, ₹150
   - Sunflower Oil, Fortune, 1 liter, ₹180
   - Red Chilli Powder, MDH, 100g, ₹45
   - Biscuits, Parle-G, 1 packet, ₹20

#### Create Retailer
1. Sign Up again (new browser/incognito)
2. Select "I am a Retailer"
3. Fill details:
   - Name: Amit Sharma
   - Mobile: 9123456789
   - Password: test123
   - Shop Name: Sharma General Store
   - Area: Karol Bagh
   - City: Delhi
   - Shop Size: Medium

#### Place Test Order
1. Login as retailer
2. Click on wholesaler card
3. Add 3-4 products to cart
4. Check recommendations popup
5. Review and send order

## 🔍 Testing Features

### Test Smart Recommendations
1. Add Rice to cart
2. See recommendations for Pulses, Oil, Spices
3. Add Snacks
4. See recommendations for Beverages

### Test Reorder
1. Place an order
2. Go to Order History (📋 icon)
3. Click "Reorder" on any past order
4. Modify if needed and send

### Test Order Status Flow
1. Login as wholesaler
2. See incoming order
3. Click "Mark as Seen"
4. Change to "Processing"
5. Mark as "Completed"
6. Login as retailer to see status change

## 🐛 Troubleshooting

### MongoDB Not Connected
```bash
# Start MongoDB
net start MongoDB

# Or manually
mongod
```

### Port 5000 Already in Use
```bash
# Edit .env file
PORT=5001
```

### React Won't Start
```bash
cd client
rm -rf node_modules
npm install
```

### Clear Database (Start Fresh)
```bash
# In MongoDB shell
mongo
use orderkhata
db.dropDatabase()
```

## 📊 Default Ports

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend React | 3000 | http://localhost:3000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

## 🔑 Test Credentials Template

```
WHOLESALER 1:
Mobile: 9876543210
Password: test123

WHOLESALER 2:
Mobile: 9876543211
Password: test123

RETAILER 1:
Mobile: 9123456789
Password: test123

RETAILER 2:
Mobile: 9123456788
Password: test123
```

## 📱 Screen Flow

```
Landing Page
├── Login → Dashboard (Role-based)
└── Sign Up
    ├── Role Selection
    └── Details Form → Dashboard

Retailer Dashboard
├── Browse Wholesalers
├── Click Wholesaler
│   ├── View Products
│   ├── Add to Cart
│   ├── See Recommendations ⭐
│   └── Review Order → Send
├── Order History
│   ├── View Orders
│   └── Reorder
└── Profile

Wholesaler Dashboard
├── View Orders
│   ├── Order Details
│   └── Update Status
├── Manage Products
│   ├── Add Product
│   ├── Edit Product
│   └── Delete Product
└── Order History
```

## 🎯 Key Features to Demo

1. **Smart Recommendations** - Add Rice, see Pulses suggested
2. **Quick Reorder** - One click to reorder previous order
3. **Order Tracking** - Status colors (Orange→Blue→Purple→Green)
4. **Product Management** - Toggle availability on/off
5. **Search & Filter** - Find products and wholesalers fast
6. **Mobile Design** - Resize browser to see responsive design

## 📁 Project Structure

```
OrderKhata/
├── backend/
│   ├── models/        # Database schemas
│   ├── routes/        # API endpoints
│   ├── middleware/    # Auth, validation
│   └── server.js      # Express app
├── client/
│   ├── src/
│   │   ├── pages/     # React pages
│   │   ├── context/   # Auth context
│   │   └── utils/     # API helper
│   └── public/
├── .env               # Environment variables
├── package.json       # Backend dependencies
└── README.md          # Documentation
```

## 🔄 API Base Routes

```
/api/auth/*            - Authentication
/api/users/*           - User management
/api/products/*        - Product CRUD
/api/orders/*          - Order management
/api/recommendations/* - Smart suggestions
```

## 💡 Pro Tips

1. **Fast Testing**: Use Chrome DevTools → Mobile view
2. **Multiple Users**: Use Incognito windows for different roles
3. **Check Network**: DevTools → Network tab to see API calls
4. **MongoDB GUI**: Use MongoDB Compass to view database
5. **Postman**: Import API_TESTING.md endpoints for API testing

## 📞 Contact & Support

For detailed docs, see:
- `README.md` - Overview
- `SETUP_GUIDE.md` - Installation
- `FEATURES.md` - Complete feature list
- `API_TESTING.md` - API endpoints

---

**Happy Testing! 🎉**
