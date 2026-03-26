import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import pharmacyLogo from '../../image_logo/pharmacy_logo.png';

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
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#2ecc71',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        <img src={pharmacyLogo} alt="Pharmacy Logo" style={{ height: '50px', width: 'auto', marginRight: '10px' }} />
        PharmaLocator
      </div>

      <div style={styles.navLinks}>
        <span style={styles.link} onClick={() => navigate('/')}>Home</span>
        <span style={styles.link} onClick={() => navigate('/pharmacies')}>Pharmacies</span>
        
        {isAuthenticated ? (
          <div style={styles.userInfo}>
            {user?.role === 'pharmacist' && (
              <>
                <span style={styles.link} onClick={() => navigate('/inventory')}>Inventory</span>
              </>
            )}
            <button style={styles.button} onClick={handleLogout}>Logout</button>
            <div style={styles.avatar}>
              {user?.name ? user.name.split(' ').map(word => word[0]).join('').toUpperCase() : 'U'}
            </div>
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