# OrderKhata - Visual Workflow & Architecture

## 🎯 Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     ORDERKHATA LANDING PAGE                      │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │               📱 OrderKhata                              │  │
│  │         Smart ordering for local shops                   │  │
│  │                                                           │  │
│  │  Features:                                                │  │
│  │  📝 Never forget items                                   │  │
│  │  🤖 Smart recommendations                                │  │
│  │  ⚡ Quick & easy ordering                                │  │
│  │                                                           │  │
│  │         ┌─────────┐    ┌─────────┐                      │  │
│  │         │  Login  │    │ Sign Up │                      │  │
│  │         └─────────┘    └─────────┘                      │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────▼─────┐      ┌─────▼─────┐
              │   LOGIN   │      │  SIGN UP   │
              └─────┬─────┘      └─────┬─────┘
                    │                   │
                    │            ┌──────▼──────┐
                    │            │ Role Select │
                    │            │ 🏪 Retailer │
                    │            │ 📦 Wholesaler│
                    │            └──────┬──────┘
                    │                   │
                    │            ┌──────▼──────┐
                    │            │   Details   │
                    │            │    Form     │
                    │            └──────┬──────┘
                    │                   │
                    └──────────┬────────┘
                               │
                    ┌──────────▼──────────┐
                    │   AUTHENTICATION    │
                    │   (JWT + Role)      │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            ┌───────▼────────┐    ┌──────▼────────┐
            │   RETAILER      │    │  WHOLESALER   │
            │   DASHBOARD     │    │  DASHBOARD    │
            └───────┬────────┘    └──────┬────────┘
                    │                     │
        ┌───────────┴───────────┐        │
        │                       │        │
┌───────▼────────┐    ┌────────▼───────┐│
│ Browse         │    │ Order          ││
│ Wholesalers    │    │ History        ││
└───────┬────────┘    └────────────────┘│
        │                                │
┌───────▼────────┐                       │
│ View Products  │              ┌────────▼────────┐
│ (Wholesaler)   │              │ Manage Products │
└───────┬────────┘              └────────┬────────┘
        │                                │
┌───────▼────────┐              ┌────────▼────────┐
│ Add to Cart    │              │ Add/Edit/Delete │
└───────┬────────┘              │    Products     │
        │                       └─────────────────┘
┌───────▼────────┐                       │
│ Smart          │              ┌────────▼────────┐
│ Recommendations│◄─────────────┤ Receive Orders  │
│ 🤖 AI Powered  │              └────────┬────────┘
└───────┬────────┘                       │
        │                       ┌────────▼────────┐
┌───────▼────────┐              │ View Order      │
│ Review Order   │              │ Details         │
└───────┬────────┘              └────────┬────────┘
        │                                │
┌───────▼────────┐              ┌────────▼────────┐
│ Send Order  ✓  │─────────────►│ Update Status   │
└───────┬────────┘              │ Seen/Processing │
        │                       │ /Completed      │
┌───────▼────────┐              └─────────────────┘
│ Track Status   │
│ Reorder Option │
└────────────────┘
```

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (React)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Landing    │  │    Login     │  │   Signup     │         │
│  │    Page      │  │    Page      │  │    Page      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Retailer    │  │  Wholesaler  │  │  Products    │         │
│  │  Dashboard   │  │  Dashboard   │  │  Browse      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Order     │  │    Order     │  │   Manage     │         │
│  │   Review     │  │   History    │  │  Products    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │            AuthContext (JWT State)                   │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP Requests (Axios)
                          │ Authorization: Bearer <JWT>
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                         API LAYER (Express)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              Authentication Middleware              │       │
│  │              JWT Verify + Role Check                │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
│  API Routes:                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   /auth      │  │   /users     │  │  /products   │         │
│  │  Signup      │  │  Profile     │  │  CRUD        │         │
│  │  Login       │  │  Wholesalers │  │  Search      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────────────────────┐           │
│  │   /orders    │  │   /recommendations           │           │
│  │  Create      │  │  🤖 Smart Suggestions       │           │
│  │  List        │  │  Frequently Ordered          │           │
│  │  Update      │  │  Popular Items               │           │
│  │  Reorder     │  └──────────────────────────────┘           │
│  └──────────────┘                                               │
│                                                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ Mongoose ODM
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      DATABASE (MongoDB)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │                  Users Collection                    │       │
│  │  {role, name, mobile, shopName, location, ...}      │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │                Products Collection                   │       │
│  │  {wholesaler, name, category, unit, price, ...}     │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │                  Orders Collection                   │       │
│  │  {retailer, wholesaler, items[], status, ...}       │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Examples

### Example 1: Retailer Places Order

```
┌─────────────┐      1. Browse Products      ┌─────────────┐
│             │─────────────────────────────►│             │
│  Retailer   │                               │   Backend   │
│  (React)    │◄─────────────────────────────│   (Express) │
│             │   2. Return Product List      │             │
└──────┬──────┘                               └──────┬──────┘
       │                                             │
       │ 3. Add to Cart (Local State)               │
       │                                             │
       │  4. Request Recommendations                │
       ├────────────────────────────────────────────►
       │◄────────────────────────────────────────────┤
       │  5. Return Smart Suggestions                │
       │                                             │
       │  6. Review & Send Order                    │
       ├────────────────────────────────────────────►
       │                                       ┌─────▼─────┐
       │  7. Order Saved                       │           │
       │◄──────────────────────────────────────┤  MongoDB  │
       │                                       │           │
       │                                       └───────────┘
```

### Example 2: Smart Recommendation Flow

```
                  Retailer adds Rice to cart
                           │
                           ▼
                  Backend analyzes cart
                           │
           ┌───────────────┴───────────────┐
           │                               │
    ┌──────▼───────┐              ┌───────▼──────┐
    │ Rule-Based   │              │ History-Based│
    │ Logic        │              │ Analysis     │
    │              │              │              │
    │ Rice →       │              │ Check past   │
    │ Pulses, Oil  │              │ orders for   │
    │ Spices       │              │ patterns     │
    └──────┬───────┘              └───────┬──────┘
           │                               │
           └───────────────┬───────────────┘
                           │
                  Merge & Sort by Frequency
                           │
                           ▼
                  Show Recommendations Modal
                           │
                  "You may have missed these items"
```

### Example 3: Order Status Update Flow

```
┌─────────────┐                               ┌─────────────┐
│ Wholesaler  │  1. Click "Mark as Seen"      │  Backend    │
│ Dashboard   ├──────────────────────────────►│             │
│             │                               │  Validates  │
│             │◄──────────────────────────────┤  + Updates  │
│             │  2. Status Updated            │             │
└─────────────┘                               └──────┬──────┘
                                                     │
                                              ┌──────▼──────┐
                                              │   MongoDB   │
                                              │             │
                                              │ order.status│
                                              │ = "seen"    │
                                              │ order.seenAt│
                                              │ = Date.now()│
                                              └─────────────┘
       ┌─────────────┐
       │  Retailer   │  3. Views order status
       │  (refresh)  ├──────┐
       │             │      │
       │  Shows:     │      │
       │  Status: Seen      │
       │  🔵 Blue Badge     │
       └─────────────┘      │
```

---

## 🗂️ Database Relationships

```
┌───────────────┐
│     User      │
│  (Wholesaler) │
└───────┬───────┘
        │
        │ 1:N (owns many products)
        │
        ▼
┌───────────────┐         ┌───────────────┐
│   Product     │         │     Order     │
│               │         │               │
│ - wholesaler  │         │ - retailer    │
│ - name        │         │ - wholesaler  │
│ - category    │         │ - items[]     │
│ - price       │    N:M  │ - status      │
└───────┬───────┘◄────────┤ - orderNumber │
        │                 └───────┬───────┘
        │                         │
        │                         │ N:1 (many orders from)
        │                         │
        │                         ▼
        │                 ┌───────────────┐
        │                 │     User      │
        └─────────────────┤  (Retailer)   │
          Referenced by   └───────────────┘
          order.items[]
```

---

## 📊 State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                   React Component Tree                   │
└─────────────────────────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
         ┌──────▼──────┐       ┌─────▼─────┐
         │  App.js     │       │ Context   │
         │  (Router)   │       │ Providers │
         └──────┬──────┘       └─────┬─────┘
                │                    │
                │              ┌─────▼──────┐
         ┌──────┴──────┐      │ AuthContext│
         │             │      │ - user     │
         │   Routes    │      │ - login()  │
         │             │      │ - logout() │
         └──────┬──────┘      │ - isAuth   │
                │             └────────────┘
    ┌───────────┼───────────┐
    │           │           │
┌───▼───┐  ┌───▼───┐  ┌───▼───┐
│Landing│  │Login  │  │Signup │
└───────┘  └───┬───┘  └───┬───┘
               │          │
           Save Token   Save Token
               │          │
         ┌─────▼──────────▼─────┐
         │   localStorage       │
         │   - token            │
         │   - user             │
         └──────────────────────┘
```

---

## 🔐 Authentication Flow

```
1. User Login
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT Token
   ↓
4. Send token to client
   ↓
5. Client stores in localStorage
   ↓
6. All API requests include token
   ↓
7. Backend middleware verifies token
   ↓
8. Grant/Deny access based on role
```

---

## 🎨 UI Component Hierarchy

```
App
├── Landing
├── Login
├── Signup
│   ├── RoleSelection
│   └── DetailsForm
├── RetailerDashboard
│   ├── Header (Search, Profile)
│   ├── CategoryFilter
│   └── WholesalerList
│       └── WholesalerCard[]
├── WholesalerProducts
│   ├── Header
│   ├── SearchBar
│   ├── CategoryTabs
│   ├── ProductGrid
│   │   └── ProductCard[]
│   ├── RecommendationsModal 🤖
│   └── CartFooter
├── OrderReview
│   ├── Header
│   ├── OrderItems
│   ├── Summary
│   ├── NotesInput
│   └── SubmitButton
├── OrderHistory
│   ├── Header
│   ├── FilterTabs
│   └── OrderList
│       └── OrderCard[]
├── OrderDetails
│   ├── Header
│   ├── OrderInfo
│   ├── ItemsList
│   ├── Summary
│   └── StatusActions
├── WholesalerDashboard
│   ├── Header
│   ├── Stats
│   ├── Tabs
│   └── OrdersList
│       └── OrderCard[]
└── ManageProducts
    ├── Header
    ├── ProductsList
    │   └── ProductCard[]
    └── AddEditModal
```

---

**This visual documentation helps understand the complete architecture and flow of OrderKhata!** 📊
