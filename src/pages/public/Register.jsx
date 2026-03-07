import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Using the same African pharmacist image as login page
const pharmacyBackground = 'https://www.shutterstock.com/image-photo/smiling-african-woman-pharmacist-lab-260nw-2534519639.jpg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    const result = await register(name, email, password, role);
    
    if (result.success) {
      setSuccess('Registration successful! Please login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Inter, Arial, sans-serif',
    },
    // Left panel with African pharmacist image (matching login)
    leftPanel: {
      flex: '1.2',
      background: `linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(46, 204, 113, 0.1)), url(${pharmacyBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      padding: '40px',
      textAlign: 'center',
      position: 'relative',
    },
    // Bright overlay to make image lighter
    brightOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.1)',
      pointerEvents: 'none',
    },
    leftContent: {
      maxWidth: '500px',
      position: 'relative',
      zIndex: 2,
    },
    leftTitle: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
      color: '#ffffff',
    },
    leftText: {
      fontSize: '1.2rem',
      lineHeight: '1.6',
      opacity: 0.95,
      color: '#ffffff',
      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    },
    // Right panel with form
    rightPanel: {
      flex: '0.8',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '20px',
    },
    formContainer: {
      width: '100%',
      maxWidth: '380px', // Slightly wider for registration form
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(46, 204, 113, 0.15)',
    },
    formTitle: {
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '5px',
    },
    formSubtitle: {
      color: '#7f8c8d',
      marginBottom: '20px',
      fontSize: '0.9rem',
    },
    inputGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#34495e',
      fontWeight: '500',
      fontSize: '0.85rem',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      border: '1.5px solid #e8f0fe',
      borderRadius: '10px',
      fontSize: '0.95rem',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    // Password input container
    passwordContainer: {
      position: 'relative',
      width: '100%',
    },
    passwordInput: {
      width: '100%',
      padding: '12px 45px 12px 14px',
      border: '1.5px solid #e8f0fe',
      borderRadius: '10px',
      fontSize: '0.95rem',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    // Toggle button inside password field
    toggleButton: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.1rem',
      color: '#7f8c8d',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    select: {
      width: '100%',
      padding: '12px 14px',
      border: '1.5px solid #e8f0fe',
      borderRadius: '10px',
      fontSize: '0.95rem',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
      marginBottom: '20px',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(145deg, #2ecc71, #27ae60)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginBottom: '20px',
    },
    error: {
      color: '#e74c3c',
      marginBottom: '15px',
      textAlign: 'center',
      padding: '10px',
      background: '#fdeded',
      borderRadius: '8px',
      fontSize: '0.85rem',
      border: '1px solid #fadbd8',
    },
    success: {
      color: '#27ae60',
      marginBottom: '15px',
      textAlign: 'center',
      padding: '10px',
      background: '#e8f8f0',
      borderRadius: '8px',
      fontSize: '0.85rem',
      border: '1px solid #c8e6c9',
    },
    link: {
      textAlign: 'center',
      color: '#2ecc71',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    footer: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#bdc3c7',
      fontSize: '0.8rem',
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel with African Pharmacist Image */}
      <div style={styles.leftPanel}>
        <div style={styles.brightOverlay}></div>
        <div style={styles.leftContent}>
          <h1 style={styles.leftTitle}>PharmaLocator</h1>
          <p style={styles.leftText}>
            Join our trusted platform for finding medicines and managing pharmacy inventory. 
            Secure, fast, and reliable healthcare access.
          </p>
        </div>
      </div>

      {/* Right Panel with Registration Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Create Account</h2>
          <p style={styles.formSubtitle}>Join PharmaLocator today</p>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password (min. 6 characters)</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.passwordInput}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={styles.toggleButton}
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.passwordInput}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  style={styles.toggleButton}
                >
                  {showConfirmPassword ? "hide" : "show"}
                </button>
              </div>
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="patient">Patient - Find Medicines</option>
              <option value="pharmacist">Pharmacist - Manage Pharmacy</option>
            </select>

            <button
              type="submit"
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(46, 204, 113, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Register
            </button>
          </form>

          <p style={styles.link} onClick={() => navigate('/login')}>
            Already have an account? <strong>Sign in</strong>
          </p>
          <p style={styles.footer}>© 2024 PharmaLocator</p>
        </div>
      </div>
    </div>
  );
};

export default Register;