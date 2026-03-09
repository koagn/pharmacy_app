import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PharmacyProvider } from './context/PharmacyContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import PharmacyList from './pages/public/PharmacyList';
import PharmacyDashboard from './pharmacy/PharmacyDashboard';

// Pharmacy Pages


// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePharmacies from './pages/admin/ManagePharmacies';
import ManageUsers from './pages/admin/ManageUsers';
import SystemReports from './pages/admin/SystemReports';
import InventoryManagement from './pages/admin/InventoryManagement';

// Create a wrapper component to check current route
const AppContent = () => {
  const location = useLocation();
  
  // Don't show footer on login or register pages
  const hideFooterPages = ['/login', '/register'];
  const showFooter = !hideFooterPages.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes - Anyone can access */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pharmacies" element={<PharmacyList />} />
          <Route path="/pharmacy/:id" element={<PharmacyDashboard />} />

          {/* Pharmacy Routes - Only pharmacists */}
          <Route path="/pharmacy-dashboard" element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacyDashboard />
            </ProtectedRoute>
          } />

          {/* ADMIN ONLY ROUTES - Only admin can access these */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/pharmacies" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManagePharmacies />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SystemReports />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/inventory" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <InventoryManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      {/* Footer shows on all pages EXCEPT login and register */}
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <PharmacyProvider>
        <Router>
          <AppContent />
        </Router>
      </PharmacyProvider>
    </AuthProvider>
  );
}

export default App;