import React from 'react';
import spinnerImage from '../../image_logo/loading-icon.png'; // Use your renamed image

const LoadingSpinner = (size = 60 ) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f0fe 100%)',
      fontFamily: 'Arial, sans-serif',
    },
    spinner: {
      width: '80px',
      height: '80px',
      marginBottom: '20px',
    },
    message: {
      fontSize: '1.2rem',
      color: '#2c3e50',
      fontWeight: '500',
    }
  };

  return (
    <div style={styles.container}>
      <img src={spinnerImage} alt="Loading..." style={styles.spinner} />
      <p style={styles.message}>Loading.........</p>
    </div>
    
  );
};

export default LoadingSpinner;