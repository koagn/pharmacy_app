import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const styles = {
    navbar: {
      background: 'white',
      padding: '15px 30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2ecc71',
      cursor: 'pointer'
    },
    navLinks: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    },
    link: {
      cursor: 'pointer',
      color: '#2c3e50',
      textDecoration: 'none',
      fontSize: '1rem'
    },
    button: {
      background: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        💊 PharmaLocator
      </div>

      <div style={styles.navLinks}>
        <span style={styles.link} onClick={() => navigate('/')}>Home</span>
        <span style={styles.link} onClick={() => navigate('/pharmacies')}>Pharmacies</span>
        
        {isAuthenticated ? (
          <div style={styles.userInfo}>
            <span>👤 {user?.name}</span>
            {user?.role === 'admin' && (
              <span style={styles.link} onClick={() => navigate('/admin')}>Admin</span>
            )}
            {user?.role === 'pharmacist' && (
              <span style={styles.link} onClick={() => navigate('/pharmacy-dashboard')}>Dashboard</span>
            )}
            <button style={styles.button} onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <span style={styles.link} onClick={() => navigate('/login')}>Login</span>
            <button style={styles.button} onClick={() => navigate('/register')}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;