import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import pharmacyLogo from '../../images/pharmacy_logo.png';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const styles = {
    navbar: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '10px 30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer'
    },
    logo: {
      width: '35px',
      height: '35px',
      filter: 'brightness(0) invert(1)' // Makes logo white
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white'
    },
    navLinks: {
      display: 'flex',
      gap: '25px',
      alignItems: 'center'
    },
    link: {
      cursor: 'pointer',
      color: 'white',
      textDecoration: 'none',
      fontSize: '1rem',
      padding: '8px 12px',
      borderRadius: '5px',
      transition: 'background 0.3s ease'
    },
    activeLink: {
      background: 'rgba(255,255,255,0.2)'
    },
    badge: {
      background: '#e74c3c',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '0.7rem',
      marginLeft: '5px'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      background: 'rgba(255,255,255,0.1)',
      padding: '5px 15px',
      borderRadius: '20px'
    },
    logoutBtn: {
      background: 'white',
      color: '#667eea',
      border: 'none',
      padding: '5px 12px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <div style={styles.logoContainer} onClick={() => navigate('/admin')}>
        <img src={pharmacyLogo} alt="Admin Logo" style={styles.logo} />
        <span style={styles.logoText}>Admin Panel</span>
      </div>

      {/* Navigation Links */}
      <div style={styles.navLinks}>
        <span 
          style={styles.link} 
          onClick={() => navigate('/admin')}
        >
          📊 Dashboard
        </span>
        
        <span 
          style={styles.link} 
          onClick={() => navigate('/admin/pharmacies')}
        >
          🏥 Pharmacies
        </span>
        
        <span 
          style={styles.link} 
          onClick={() => navigate('/admin/inventory')}
        >
          📦 Inventory
        </span>
        
        <span 
          style={styles.link} 
          onClick={() => navigate('/admin/users')}
        >
          👥 Users
        </span>
        
        <span 
          style={styles.link} 
          onClick={() => navigate('/admin/reports')}
        >
          📊 Reports
        </span>

        {/* User Info */}
        <div style={styles.userInfo}>
          <span>👤 Admin: {user?.name || 'Admin'}</span>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;