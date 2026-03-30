import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePharmacy } from '../../context/PharmacyContext'; // Import the hook
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import doctor2 from '../../image_logo/doctor2.png';
import doctor3 from '../../image_logo/doctor3.png';
import api from '../../services/api'; // ADD THIS IMPORT
import LoadingSpinner from '../../components/common/LoadingSpinner'; // ADD THIS IMPORT

const backgroundImage = doctor2;
const doctorImage = doctor3;

const PharmacyList = () => {
  const navigate = useNavigate();
  const { pharmacies, pharmacyInventories, setPharmacies } = usePharmacy(); // ADD set functions
  const { user, isPharmacist } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [drugSearchTerm, setDrugSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true); // ADD loading state
  const [error, setError] = useState(null); // ADD error state

  // ========== FETCH PHARMACIES FROM BACKEND ==========
  useEffect(() => {
    const fetchPharmacies = async () => {
      setLoading(true);
      try {
        const response = await api.getAllPharmacies();
        if (response.success) {
          // Update context with real pharmacy data
          setPharmacies(response.pharmacies);
        } else {
          setError('Failed to load pharmacies');
        }
      } catch (err) {
        console.error('Fetch pharmacies error:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, [setPharmacies]); // Only depend on setPharmacies

  // Filter pharmacies by name/location
  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter pharmacies by drug name (using mock inventory for now)
  const filteredByDrug = drugSearchTerm.trim().length > 0
    ? pharmacies.filter(pharmacy => {
        const inventory = (pharmacyInventories[pharmacy.id] || []).map(d => d.toLowerCase());
        return inventory.some(drug => drug.includes(drugSearchTerm.trim().toLowerCase()));
      })
    : [];

  const slideCount = filteredPharmacies.length;

  // Reset slider when results change
  useEffect(() => {
    setCurrentSlide(0);
  }, [slideCount, searchTerm]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (slideCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideCount]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const goNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(46, 204, 113, 0.1)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '40px',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '40px',
      marginBottom: '40px',
      padding: '30px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    leftImageSection: {
      flex: '0 0 200px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    doctorImage: {
      width: '180px',
      height: '180px',
      borderRadius: '20px',
      objectFit: 'cover',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
      border: '4px solid white',
    },
    rightContentSection: {
      flex: '1',
    },
    title: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '10px',
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#7f8c8d',
      marginBottom: '20px',
    },
    statsBar: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    statBadge: {
      background: '#f0f7f0',
      padding: '8px 16px',
      borderRadius: '30px',
      fontSize: '0.9rem',
      color: '#2c3e50',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(46, 204, 113, 0.2)',
    },
    searchContainer: {
      width: '100%',
    },
    searchInput: {
      width: '100%',
      padding: '14px 25px',
      fontSize: '1rem',
      border: '2px solid #e0e0e0',
      borderRadius: '50px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    sliderContainer: {
      position: 'relative',
      marginTop: '20px',
      overflow: 'hidden',
    },
    slideWrapper: {
      display: 'flex',
      transition: 'transform 0.6s ease',
      width: '100%',
    },
    slide: {
      flex: '0 0 100%',
      padding: '0 10px',
      boxSizing: 'border-box',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px',
      marginTop: '20px',
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '25px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, boxShadow 0.3s ease',
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(0,0,0,0.35)',
      border: 'none',
      color: 'white',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      padding: '0',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
      transition: 'background 0.2s ease',
    },
    prevButton: {
      left: '10px',
    },
    nextButton: {
      right: '10px',
    },
    dots: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '20px',
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(0,0,0,0.2)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, background 0.2s ease',
    },
    activeDot: {
      background: '#2ecc71',
      transform: 'scale(1.2)',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },
    pharmacyName: {
      fontSize: '1.3rem',
      color: '#2c3e50',
      margin: 0,
      fontWeight: '600',
    },
    area: {
      color: '#7f8c8d',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '0.95rem',
    },
    badge: {
      background: '#2ecc71',
      color: 'white',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    pharmacyImageContainer: {
      marginBottom: '15px',
      textAlign: 'center',
    },
    pharmacyImage: {
      width: '100%',
      maxWidth: '200px',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '12px',
      border: '2px solid #e9ecef',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    info: {
      marginTop: '15px',
      padding: '15px',
      background: '#f8f9fa',
      borderRadius: '12px',
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '8px',
      color: '#34495e',
      fontSize: '0.95rem',
    },
    viewButton: {
      width: '100%',
      padding: '12px',
      marginTop: '15px',
      background: '#2ecc71',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
    noResults: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '60px',
      background: 'white',
      borderRadius: '20px',
      color: '#7f8c8d',
      fontSize: '1.2rem',
    },
    footer: {
      textAlign: 'center',
      marginTop: '40px',
      color: 'white',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    },
    errorContainer: {
      textAlign: 'center',
      padding: '40px',
      background: 'white',
      borderRadius: '20px',
      marginTop: '20px',
    },
    errorText: {
      color: '#e74c3c',
      marginBottom: '20px',
    },
    retryButton: {
      padding: '10px 20px',
      background: '#2ecc71',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    }
  };

  // Calculate stats from real data
  const totalPharmacies = pharmacies.length;
  const onDutyCount = pharmacies.filter(p => p.is_on_duty).length;

  // Show loading spinner while fetching
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error with retry option
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={styles.retryButton}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.leftImageSection}>
            <img src={doctorImage} alt="Pharmacist" style={styles.doctorImage} />
          </div>

          <div style={styles.rightContentSection}>
            <h1 style={styles.title}>Pharmacies in Yaoundé</h1>
            <p style={styles.subtitle}>Find the nearest pharmacy to you</p>
            
            <div style={styles.statsBar}>
              <span style={styles.statBadge}><FontAwesomeIcon icon="hospital" /> {totalPharmacies} Pharmacies</span>
              <span style={styles.statBadge}><FontAwesomeIcon icon="clock" /> {onDutyCount} Open 24/7</span>
            </div>

            {(isPharmacist && !user?.pharmacy_id) && (
              <div style={{ margin: '18px 0', padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', color: '#fff', textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 600 }}>No pharmacy registered for your account yet.</p>
                <button
                  onClick={() => navigate('/create-pharmacy')}
                  style={{
                    marginTop: '10px',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: '#16a085'
                  }}
                >
                  <FontAwesomeIcon icon="store" style={{ marginRight: '8px' }} /> Register Your Pharmacy
                </button>
              </div>
            )}

            <div style={{ ...styles.searchContainer, marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search by drug name to see available pharmacies"
                value={drugSearchTerm}
                onChange={(e) => setDrugSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {drugSearchTerm.trim() && (
              <div style={{ marginBottom: '25px', background: 'white', borderRadius: '12px', padding: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#2c3e50' }}>
                  Pharmacies with "{drugSearchTerm.trim()}"
                </h4>
                {filteredByDrug.length > 0 ? (
                  filteredByDrug.map((ph) => (
                    <div key={ph.id} style={{ marginBottom: '8px', color: '#34495e' }}>
                      <strong>{ph.name}</strong> ({ph.location || ph.area}) - Available:
                      {(pharmacyInventories[ph.id] || [])
                        .filter(drug => drug.toLowerCase().includes(drugSearchTerm.trim().toLowerCase()))
                        .join(', ')}
                    </div>
                  ))
                ) : (
                  <p style={{ margin: 0, color: '#c0392b' }}>No drug avaible.</p>
                )}
              </div>
            )}

            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
        </div>

        <div style={styles.sliderContainer}>
          {filteredPharmacies.length > 0 ? (
            <>
              <div
                style={{
                  ...styles.slideWrapper,
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {filteredPharmacies.map((pharmacy) => (
                  <div key={pharmacy.id} style={styles.slide}>
                    <div
                      style={styles.card}
                      onClick={() => navigate(`/pharmacy/${pharmacy.id}`, { state: { pharmacy } })}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.pharmacyName}>{pharmacy.name}</h3>
                        {pharmacy.is_on_duty && <span style={styles.badge}>24/7</span>}
                      </div>
                      
                      {/* Pharmacy Image */}
                      {pharmacy.image_url && (
                        <div style={styles.pharmacyImageContainer}>
                          <img 
                            src={`http://localhost:5000${pharmacy.image_url}`} 
                            alt={pharmacy.name}
                            style={styles.pharmacyImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div style={styles.area}>
                        <FontAwesomeIcon icon="map-marker-alt" /> {pharmacy.location || pharmacy.area}
                      </div>
                      
                      <div style={styles.info}>
                        <div style={styles.infoItem}>
                          <FontAwesomeIcon icon="phone" /> {pharmacy.phone || 'N/A'}
                        </div>
                        <div style={styles.infoItem}>
                          <FontAwesomeIcon icon="clock" /> {pharmacy.hours || 'Hours not specified'}
                        </div>
                        <div style={styles.infoItem}>
                          <FontAwesomeIcon icon="user-md" /> {pharmacy.manager || 'Pharmacist'}
                        </div>
                      </div>
                      
                      <button 
                        style={styles.viewButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/pharmacy/${pharmacy.id}`, { state: { pharmacy } });
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#27ae60'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#2ecc71'}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {slideCount > 1 && (
                <>
                  <button
                    style={{ ...styles.navButton, ...styles.prevButton }}
                    onClick={goPrev}
                    aria-label="Previous pharmacy"
                  >
                    ‹
                  </button>
                  <button
                    style={{ ...styles.navButton, ...styles.nextButton }}
                    onClick={goNext}
                    aria-label="Next pharmacy"
                  >
                    ›
                  </button>
                  <div style={styles.dots}>
                    {filteredPharmacies.map((_, idx) => (
                      <button
                        key={idx}
                        style={{
                          ...styles.dot,
                          ...(idx === currentSlide ? styles.activeDot : {}),
                        }}
                        onClick={() => goToSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={styles.noResults}>
              <p>No pharmacies found matching "{searchTerm}"</p>
              <p style={{ marginTop: '10px', fontSize: '1rem' }}>Try a different search term</p>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <p>Click on any pharmacy to view details</p>
        </div>
      </div>
    </div>
  );
};

export default PharmacyList;