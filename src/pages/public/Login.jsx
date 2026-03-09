import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const pharmacyBackground = 'https://www.shutterstock.com/image-photo/smiling-african-woman-pharmacist-lab-260nw-2534519639.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('patient');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        console.log('Attempting login with:', { email, role });
        
        try {
            // Call the actual backend API
            const response = await api.login(email, password);
            
            console.log('Login API response:', response);
            
            if (response.success) {
                // Check if role matches (optional - you can remove this if backend doesn't check role)
                if (response.user.role !== role) {
                    setError(`This account is registered as ${response.user.role}, not ${role}`);
                    setLoading(false);
                    return;
                }
                
                // Update auth context with user data and token (no localStorage)
                login(response.user, response.token);
                
                // Show success message
                setError('');
                
                // Navigate based on role
                setTimeout(() => {
                    if (response.user.role === 'admin') {
                        navigate('/admin');
                    } else if (response.user.role === 'pharmacist') {
                        navigate('/pharmacy-dashboard');
                    } else {
                        navigate('/pharmacies');
                    }
                }, 500);
            } else {
                setError(response.message || 'Invalid email or password');
                setLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please make sure the backend server is running.');
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            fontFamily: 'Inter, Arial, sans-serif',
        },
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
            maxWidth: '360px',
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

    // Show only spinner when loading
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div style={styles.container}>
            {/* Left Panel with African Pharmacist Image */}
            <div style={styles.leftPanel}>
                <div style={styles.brightOverlay}></div>
                <div style={styles.leftContent}>
                    <h1 style={styles.leftTitle}>PharmaLocator</h1>
                    <p style={styles.leftText}>
                        Your trusted platform for finding medicines and managing pharmacy inventory. 
                        Secure, fast, and reliable healthcare access.
                    </p>
                </div>
            </div>

            {/* Right Panel with Login Form */}
            <div style={styles.rightPanel}>
                <div style={styles.formContainer}>
                    <h2 style={styles.formTitle}>Welcome Back</h2>
                    <p style={styles.formSubtitle}>Sign in to continue</p>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
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
                            <label style={styles.label}>Password</label>
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
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={styles.select}
                        >
                            <option value="patient">Patient</option>
                            <option value="pharmacist">Pharmacist</option>
                            <option value="admin">Administrator</option>
                        </select>

                        <button
                            type="submit"
                            style={styles.button}
                            disabled={loading}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(46, 204, 113, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Sign In
                        </button>
                    </form>

                    <p style={styles.link} onClick={() => navigate('/register')}>
                        New here? <strong>Create account</strong>
                    </p>
                    <p style={styles.footer}>© 2024 PharmaLocator</p>
                </div>
            </div>
        </div>
    );
};

export default Login;