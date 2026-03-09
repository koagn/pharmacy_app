// File: src/components/common/LoadingSpinner.jsx
import React from 'react';

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
      width: '60px',
      height: '60px',
      border: '6px solid #f3f3f3',
      borderTop: '6px solid #2ecc71',
      borderRadius: '50%',
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
        <div style={styles.spinner}></div>
      </div>
    </>
  );
};

export default LoadingSpinner;