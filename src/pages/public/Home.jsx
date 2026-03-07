import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    },
    title: {
      fontSize: '3rem',
      color: 'white',
      marginBottom: '20px',
      textAlign: 'center'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: 'white',
      marginBottom: '40px',
      textAlign: 'center',
      opacity: 0.9
    },
    buttonContainer: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    button: {
      padding: '15px 30px',
      fontSize: '1.1rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'transform 0.3s ease'
    },
    primaryButton: {
      background: 'white',
      color: '#2ecc71'
    },
    secondaryButton: {
      background: 'transparent',
      color: 'white',
      border: '2px solid white'
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Smart Pharmacy Locator</h1>
      <p style={styles.subtitle}>Find medicines, locate pharmacies, manage inventory</p>
      
      <div style={styles.buttonContainer}>
        <button 
          style={{...styles.button, ...styles.primaryButton}}
          onClick={() => handleNavigation('/pharmacies')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Find Pharmacies
        </button>
        <button 
          style={{...styles.button, ...styles.secondaryButton}}
          onClick={() => handleNavigation('/login')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Login
        </button>
        <button 
          style={{...styles.button, ...styles.secondaryButton}}
          onClick={() => handleNavigation('/register')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;