// File: src/components/common/LoadingSpinner.jsx
import React from 'react';
import loadingIcon from '../../image_logo/loading-icon.png';

const LoadingSpinner = () => {
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f0fe 100%)',
    },
    spinner: {
      // responsive image sizing
      width: '10vw',
      height: '10vw',
      maxWidth: '120px',
      maxHeight: '120px',
      animation: 'spin 1s linear infinite',
    }
  };

  const spinnerAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{spinnerAnimation}</style>
      <div style={styles.container}>
        <img
          src={loadingIcon}
          alt="Loading..."
          style={styles.spinner}
        />
      </div>
    </>
  );
};

export default LoadingSpinner;