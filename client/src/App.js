import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RetailerDashboard from './pages/RetailerDashboard';
import WholesalerDashboard from './pages/WholesalerDashboard';
import WholesalerProducts from './pages/WholesalerProducts';
import OrderReview from './pages/OrderReview';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import ManageProducts from './pages/ManageProducts';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Route based on user role
const DashboardRoute = () => {
  const { user } = useAuth();
  
  if (user?.role === 'retailer') {
    return <RetailerDashboard />;
  } else if (user?.role === 'wholesaler') {
    return <WholesalerDashboard />;
  }
  
  return <Navigate to="/login" />;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <DashboardRoute /> : <Landing />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
        
        {/* Retailer Routes */}
        <Route 
          path="/wholesaler/:id/products" 
          element={
            <ProtectedRoute allowedRole="retailer">
              <WholesalerProducts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order/review" 
          element={
            <ProtectedRoute allowedRole="retailer">
              <OrderReview />
            </ProtectedRoute>
          } 
        />
        
        {/* Common Routes */}
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order/:id" 
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } 
        />
        
        {/* Wholesaler Routes */}
        <Route 
          path="/manage-products" 
          element={
            <ProtectedRoute allowedRole="wholesaler">
              <ManageProducts />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
