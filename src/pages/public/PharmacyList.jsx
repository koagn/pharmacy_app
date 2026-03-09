import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePharmacy } from '../../context/PharmacyContext'; // Import the hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import doctor2 from '../../image_logo/doctor2.png';
import doctor3 from '../../image_logo/doctor3.png';

const backgroundImage = doctor2;
const doctorImage = doctor3;

const PharmacyList = () => {
  const navigate = useNavigate();
  const { pharmacies } = usePharmacy(); // Get pharmacies from context
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    }
  };

  const totalPharmacies = pharmacies.length;
  const onDutyCount = pharmacies.filter(p => p.isOnDuty).length;

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

        <div style={styles.grid}>
          {filteredPharmacies.length > 0 ? (
            filteredPharmacies.map(pharmacy => (
              <div
                key={pharmacy.id}
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
                  {pharmacy.isOnDuty && <span style={styles.badge}>24/7</span>}
                </div>
                
                <div style={styles.area}>
                  <FontAwesomeIcon icon="map-marker-alt" /> {pharmacy.area}
                </div>
                
                <div style={styles.info}>
                  <div style={styles.infoItem}>
                    <FontAwesomeIcon icon="phone" /> {pharmacy.phone}
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
            ))
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