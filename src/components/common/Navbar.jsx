import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import pharmacyLogo from '../../image_logo/pharmacy_logo.png'; // Import your logo

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const styles = {
    navbar: {
      background: 'white',
      padding: '10px 30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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
      width: '40px',
      height: '40px',
      objectFit: 'contain'
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2ecc71'
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
      fontSize: '1rem',
      transition: 'color 0.3s ease'
    },
    button: {
      background: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'background 0.3s ease'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: '#f0f0f0',
      padding: '5px 15px',
      borderRadius: '20px'
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo with Image */}
      <div style={styles.logoContainer} onClick={() => navigate('/')}>
        <img 
          src={pharmacyLogo} 
          alt="Pharmacy Locator Logo" 
          style={styles.logo}
        />
        <span style={styles.logoText}>PharmaLocator</span>
      </div>

      <div style={styles.navLinks}>
        <span 
          style={styles.link} 
          onClick={() => navigate('/')}
          onMouseEnter={(e) => e.target.style.color = '#2ecc71'}
          onMouseLeave={(e) => e.target.style.color = '#2c3e50'}
        >
          Home
        </span>
        <span 
          style={styles.link} 
          onClick={() => navigate('/pharmacies')}
          onMouseEnter={(e) => e.target.style.color = '#2ecc71'}
          onMouseLeave={(e) => e.target.style.color = '#2c3e50'}
        >
          Pharmacies
        </span>
        
        {user ? (
          <div style={styles.userInfo}>
            <span>👤 {user.name}</span>
            <button 
              style={styles.button} 
              onClick={logout}
              onMouseEnter={(e) => e.target.style.background = '#27ae60'}
              onMouseLeave={(e) => e.target.style.background = '#2ecc71'}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <span 
              style={styles.link} 
              onClick={() => navigate('/login')}
              onMouseEnter={(e) => e.target.style.color = '#2ecc71'}
              onMouseLeave={(e) => e.target.style.color = '#2c3e50'}
            >
              Login
            </span>
            <button 
              style={styles.button} 
              onClick={() => navigate('/register')}
              onMouseEnter={(e) => e.target.style.background = '#27ae60'}
              onMouseLeave={(e) => e.target.style.background = '#2ecc71'}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;