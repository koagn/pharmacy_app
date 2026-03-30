import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePharmacy } from '../context/PharmacyContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../../src/services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import pharmacyLogo from '../image_logo/pharmacy_logo.png';
// import pharmacyLogo from '../../image_logo/pharmacy_logo.png';

const CreatePharmacy = () => {
    const { user, refreshPharmacy } = useAuth();
    const { setPharmacies, setPharmacyInventories } = usePharmacy();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        address: '',
        phone: '',
        hours: '8h - 20h',
        manager: user?.name || '',
        is_on_duty: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showImageUpload, setShowImageUpload] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const handleImageToggle = (checked) => {
        setShowImageUpload(checked);
        if (!checked) {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name.trim()) {
            setError('Pharmacy name is required');
            setLoading(false);
            return;
        }
        if (!formData.location.trim()) {
            setError('Location is required');
            setLoading(false);
            return;
        }

        try {
            const dataToSend = new FormData();
            dataToSend.append('name', formData.name.trim());
            dataToSend.append('location', formData.location.trim());
            dataToSend.append('address', formData.address.trim());
            dataToSend.append('phone', formData.phone.trim());
            dataToSend.append('hours', formData.hours);
            dataToSend.append('manager', formData.manager);
            dataToSend.append('is_on_duty', formData.is_on_duty ? 'true' : 'false');

            if (imageFile) {
                dataToSend.append('image', imageFile);
            }

            const response = await api.createPharmacy(dataToSend);
            
            if (response.success) {
                const newPharmacy = response.pharmacy;
                if (newPharmacy) {
                    setPharmacies(prev => [...prev, newPharmacy]);
                    setPharmacyInventories(prev => ({
                        ...prev,
                        [newPharmacy.id]: []
                    }));
                }
                setSuccess('🎉 Pharmacy registered successfully! Redirecting to dashboard...');
                await refreshPharmacy();
                
                setTimeout(() => {
                    navigate('/pharmacy-dashboard');
                }, 2500);
            } else {
                setError(response.message || 'Failed to create pharmacy');
            }
        } catch (err) {
            console.error('Create pharmacy error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f0fe 100%)',
            padding: '40px',
            fontFamily: 'Inter, Arial, sans-serif',
        },
        header: {
            maxWidth: '800px',
            margin: '0 auto 30px',
            textAlign: 'center',
        },
        logo: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '20px',
        },
        title: {
            fontSize: '2rem',
            color: '#2c3e50',
            marginBottom: '10px',
            fontWeight: 'bold',
        },
        subtitle: {
            fontSize: '1rem',
            color: '#7f8c8d',
            marginBottom: '0',
        },
        formContainer: {
            maxWidth: '700px',
            margin: '0 auto',
            background: 'white',
            padding: '40px',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        },
        formGroup: {
            marginBottom: '24px',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: '#34495e',
            fontWeight: '600',
            fontSize: '0.9rem',
        },
        requiredStar: {
            color: '#e74c3c',
            marginLeft: '4px',
        },
        input: {
            width: '100%',
            padding: '14px 18px',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
        },
        checkboxGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '8px',
        },
        checkbox: {
            width: '20px',
            height: '20px',
            cursor: 'pointer',
        },
        checkboxLabel: {
            color: '#34495e',
            cursor: 'pointer',
            margin: 0,
            fontWeight: 'normal',
        },
        row: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
        },
        button: {
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            marginTop: '16px',
        },
        backButton: {
            width: '100%',
            padding: '14px',
            background: 'transparent',
            color: '#2ecc71',
            border: '2px solid #2ecc71',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '12px',
        },
        error: {
            color: '#e74c3c',
            marginBottom: '20px',
            padding: '14px',
            background: '#fdeded',
            borderRadius: '12px',
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid #fadbd8',
        },
        success: {
            color: '#27ae60',
            marginBottom: '20px',
            padding: '14px',
            background: '#e8f8f0',
            borderRadius: '12px',
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid #c8e6c9',
        },
        infoBox: {
            background: '#f8f9fa',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid #e9ecef',
        },
        infoText: {
            fontSize: '0.85rem',
            color: '#6c757d',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        divider: {
            textAlign: 'center',
            margin: '24px 0',
            position: 'relative',
            borderTop: '1px solid #e9ecef',
        },
        dividerText: {
            background: 'white',
            padding: '0 16px',
            position: 'relative',
            top: '-12px',
            color: '#adb5bd',
            fontSize: '0.85rem',
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <img src={pharmacyLogo} alt="Pharmacy Logo" style={styles.logo} />
                <h1 style={styles.title}>Register Your Pharmacy</h1>
                <p style={styles.subtitle}>Join our network of pharmacies in Cameroon</p>
            </div>

            <div style={styles.formContainer}>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <div style={styles.infoBox}>
                    <p style={styles.infoText}>
                        <FontAwesomeIcon icon="info-circle" />
                        Your pharmacy will be registered and immediately available in our pharmacy network.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Pharmacy Name */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Pharmacy Name <span style={styles.requiredStar}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Pharmacie du Centre"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Location & Phone - Two columns */}
                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Location <span style={styles.requiredStar}>*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Melen, Yaoundé"
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g., 677889900"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="e.g., Rue Principale, Carrefour Melen"
                            style={styles.input}
                        />
                    </div>

                    {/* Image Upload Toggle */}
                    <div style={styles.formGroup}>
                        <div style={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                checked={showImageUpload}
                                onChange={(e) => handleImageToggle(e.target.checked)}
                                style={styles.checkbox}
                                id="showImageUpload"
                            />
                            <label htmlFor="showImageUpload" style={styles.checkboxLabel}>
                                Add pharmacy photo (optional)
                            </label>
                        </div>
                    </div>

                    {/* Image Upload - Only show if toggled */}
                    {showImageUpload && (
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Pharmacy Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={styles.input}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Pharmacy preview"
                                    style={{
                                        marginTop: '12px',
                                        width: '100%',
                                        maxHeight: '240px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0'
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* Hours & Manager - Two columns */}
                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Operating Hours</label>
                            <input
                                type="text"
                                name="hours"
                                value={formData.hours}
                                onChange={handleChange}
                                placeholder="e.g., 8h - 20h"
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Manager Name</label>
                            <input
                                type="text"
                                name="manager"
                                value={formData.manager}
                                onChange={handleChange}
                                placeholder="e.g., Dr. Marie Ngono"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* 24/7 Checkbox */}
                    <div style={styles.formGroup}>
                        <div style={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                name="is_on_duty"
                                checked={formData.is_on_duty}
                                onChange={handleChange}
                                style={styles.checkbox}
                                id="is_on_duty"
                            />
                            <label htmlFor="is_on_duty" style={styles.checkboxLabel}>
                                Open 24/7 (On Duty Pharmacy)
                            </label>
                        </div>
                    </div>

                    <button type="submit" style={styles.button}>
                        <FontAwesomeIcon icon="store" style={{ marginRight: '10px' }} />
                        Register Pharmacy
                    </button>

                    <div style={styles.divider}>
                        <div style={styles.dividerText}>or</div>
                    </div>

                    <button
                        type="button"
                        style={styles.backButton}
                        onClick={() => navigate('/pharmacy-dashboard')}
                    >
                        <FontAwesomeIcon icon="arrow-left" style={{ marginRight: '10px' }} />
                        Back to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePharmacy;