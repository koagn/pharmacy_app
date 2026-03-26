import React, { useState, useEffect } from 'react';
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
import LoadingSpinner from './components/common/LoadingSpinner';
// Pharmacy Pages
import InventoryManagement from './pages/admin/InventoryManagement';
import CreatePharmacy from './pharmacy/createPharmacy';


// Admin Pages
// (removed - admin role no longer supported)

// Create a wrapper component to check current route
const AppContent = () => {
  const location = useLocation();
  const [navLoading, setNavLoading] = useState(false);

  // show spinner whenever location changes
  useEffect(() => {
    setNavLoading(true);
    const timer = setTimeout(() => setNavLoading(false), 200); // reduced from 500
    return () => clearTimeout(timer);
  }, [location]);
  
  // Don't show footer on login or register pages
  const hideFooterPages = ['/login', '/register'];
  const showFooter = !hideFooterPages.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* spinner overlay on navigation */}
      {navLoading && <LoadingSpinner />}
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
          {/* Inventory management (pharmacist-only) */}
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={["pharmacist"]}>
              <InventoryManagement />
            </ProtectedRoute>
          } />
          {/* creatae pharmacy route */}
          <Route path="/create-pharmacy" element={
    <ProtectedRoute allowedRoles={['pharmacist']}>
        <CreatePharmacy />
    </ProtectedRoute>
} />

          {/* Admin pages removed – role no longer available */}
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