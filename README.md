# OrderKhata 🏪

> **Smart ordering system for local grocery shops and wholesalers**

OrderKhata eliminates the problem of incomplete orders and forgotten items by providing a structured digital ordering platform with AI-powered smart recommendations.

---

## 🎯 Problem Solved

Local grocery shopkeepers often:
- ❌ Forget to order small but critical items
- ❌ Place incomplete orders
- ❌ Depend on calls, WhatsApp messages, or handwritten lists
- ❌ Face delays because wholesalers deliver exactly what was ordered, not what was forgotten

**OrderKhata solves this by:**
- ✅ Providing a structured digital ordering list
- ✅ Showing smart recommendations of commonly ordered items
- ✅ Sending clear, complete order lists directly to wholesalers
- ✅ Maintaining complete order history with one-click reorder

---

## ⚡ Key Features

### For Retailers (Shopkeepers)
- 🔍 **Browse Wholesalers** - View all registered wholesalers, filter by category
- 📦 **Smart Product Ordering** - Add items to cart with quantity selector
- 🤖 **AI Recommendations** - Never forget items again! (Rice → suggests Pulses, Oil, Spices)
- 📋 **Order History** - View all past orders with complete details
- 🔄 **One-Click Reorder** - Reorder previous orders instantly
- 📊 **Order Tracking** - Real-time status updates (Pending → Seen → Processing → Completed)

### For Wholesalers (Distributors)
- 📦 **Product Management** - Add, edit, delete products with availability toggle
- 📨 **Receive Orders** - Get structured, complete orders from retailers
- 👥 **Retailer Details** - View contact info and location
- ✅ **Order Status Updates** - Mark orders as seen, processing, or completed
- 📊 **Dashboard Analytics** - View total, pending, and completed orders

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - RESTful API server
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP requests
- **CSS3** - Mobile-first styling

### Architecture
- **Role-based access control** (Retailer/Wholesaler)
- **JWT-based authentication**
- **RESTful API design**
- **MongoDB document database**
- **Mobile-first responsive design**

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

1. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   # OR
   mongod
   ```

2. **Install Dependencies**
   ```bash
   # Run setup script (Windows)
   setup.bat
   
   # OR manually:
   npm install
   cd client && npm install && cd ..
   ```

3. **Start Application**
   ```bash
   # Start both backend and frontend
   npm run dev:full
   
   # OR separately:
   # Terminal 1: npm run dev
   # Terminal 2: cd client && npm start
   ```

4. **Open Browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 📚 Documentation

- **[📘 SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed installation and setup
- **[📗 FEATURES.md](FEATURES.md)** - Complete feature list
- **[📙 API_TESTING.md](API_TESTING.md)** - API endpoints and testing
- **[📕 QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands and tips
- **[📊 ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and flow diagrams
- **[📄 PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview

---

## 🎨 UI Preview

### Landing Page
```
┌────────────────────────┐
│     OrderKhata         │
│ Smart ordering for     │
│   local shops          │
│                        │
│  📝 Never forget items │
│  🤖 Smart suggestions  │
│  ⚡ Quick ordering     │
│                        │
│    [Login] [Sign Up]   │
└────────────────────────┘
```

### Retailer Dashboard
```
┌────────────────────────┐
│ 🏪 Sharma Store  📋 🚪 │
│ Search wholesalers...  │
│ [All][Rice][Pulses]    │
├────────────────────────┤
│ Kumar Trading Co       │
│ 📍 Chandni Chowk       │
│ Rice·Pulses·Oil        │
│    [View Products →]   │
├────────────────────────┤
│ Gupta Wholesale        │
│ 📍 Karol Bagh          │
│ FMCG·Snacks·Beverages  │
│    [View Products →]   │
└────────────────────────┘
```

### Smart Recommendations 🤖
```
┌────────────────────────┐
│ You may have missed    │
│    these items ✕       │
├────────────────────────┤
│ • Toor Dal             │
│   1 kg                [Add]
├────────────────────────┤
│ • Sunflower Oil        │
│   1 liter             [Add]
├────────────────────────┤
│ • Red Chilli Powder    │
│   100g                [Add]
├────────────────────────┤
│      [Continue]        │
└────────────────────────┘
```

---

## 🔐 Default Test Credentials

Create test accounts with these patterns:

**Wholesaler:**
- Mobile: 9876543210
- Password: test123

**Retailer:**
- Mobile: 9123456789
- Password: test123

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/wholesalers` - List all wholesalers
- `GET /api/users/profile` - Get user profile

### Products
- `POST /api/products` - Add product (Wholesaler)
- `GET /api/products/wholesaler/:id` - Get products
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order (Retailer)
- `GET /api/orders/my-orders` - Get user orders
- `PUT /api/orders/:id/status` - Update status (Wholesaler)
- `POST /api/orders/:id/reorder` - Reorder (Retailer)

### Recommendations 🤖
- `POST /api/recommendations/suggest` - Get smart suggestions
- `GET /api/recommendations/popular/:id` - Popular products

See [API_TESTING.md](API_TESTING.md) for detailed documentation.

---

## 🎯 Core Value Proposition

> **OrderKhata helps retailers never forget items again and helps wholesalers receive clean, complete, mistake-free orders.**

### Benefits for Retailers
- ✅ Never miss important items
- ✅ Save time vs phone calls
- ✅ Complete order history
- ✅ Quick reordering

### Benefits for Wholesalers
- ✅ Structured digital orders
- ✅ No confusion about items/quantities
- ✅ Easy product management
- ✅ Better customer communication

---

## 📈 Smart Recommendation System

The recommendation engine uses two approaches:

### 1. Rule-Based Logic
```
Rice & Grains → Pulses, Oil, Spices
Snacks → Beverages, FMCG
Oil → Rice, Spices
Dairy → Beverages
```

### 2. History-Based Learning
- Analyzes past orders
- Finds frequently ordered together items
- Calculates co-occurrence patterns
- Provides personalized suggestions

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS protection

---

## 📱 Mobile-First Design

- ✅ Optimized for smartphones
- ✅ Touch-friendly interface
- ✅ WhatsApp-like familiarity
- ✅ Icon-based navigation
- ✅ Fast loading
- ✅ Responsive layouts

---

## 🚧 Roadmap (Future Enhancements)

- [ ] SMS OTP integration (Twilio/MSG91)
- [ ] Push notifications
- [ ] PDF invoice generation
- [ ] Payment gateway integration
- [ ] Analytics dashboard
- [ ] Bulk product import (CSV)
- [ ] Multi-language support (Hindi, etc.)
- [ ] Progressive Web App (PWA)

---

## 📞 Support & Documentation

Need help? Check these resources:

1. **Installation Issues** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. **Feature Questions** → [FEATURES.md](FEATURES.md)
3. **API Testing** → [API_TESTING.md](API_TESTING.md)
4. **Quick Commands** → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
5. **Architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 📄 License

This project is open source and available for commercial use.

---

## 🙏 Acknowledgments

Built for local grocery businesses to modernize their ordering process while keeping it simple and accessible.

---

**Ready to get started?**

```bash
setup.bat
npm run dev:full
```

Then open http://localhost:3000 and create your first account! 🚀
