import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePharmacy } from '../context/PharmacyContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import pharmacyLogo from '../image_logo/pharmacy_logo.png';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PharmacyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPharmacy, pharmacies } = usePharmacy();
  const { user } = useAuth();
  
  // State for pharmacy data
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Inventory data from backend
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sample sales data (will connect later)
  const [recentSales] = useState([
    { id: 1, drug: 'Paracetamol 500mg', quantity: 2, amount: 1000, time: '10:30 AM', customer: 'John D.' },
    { id: 2, drug: 'Amoxicillin 250mg', quantity: 1, amount: 1200, time: '11:15 AM', customer: 'Mary W.' },
    { id: 3, drug: 'Ibuprofen 400mg', quantity: 3, amount: 2400, time: '12:00 PM', customer: 'Peter K.' },
    { id: 4, drug: 'Vitamin C 1000mg', quantity: 1, amount: 1500, time: '01:30 PM', customer: 'Sarah M.' }
  ]);

  // Sample reservations (will connect later)
  const [pendingReservations] = useState([
    { id: 1, drug: 'Metformin 850mg', quantity: 2, customer: 'Paul N.', phone: '677889900', time: '02:00 PM' },
    { id: 2, drug: 'Amoxicillin 250mg', quantity: 1, customer: 'Jane A.', phone: '699887766', time: '03:30 PM' }
  ]);

  // ========== FETCH PHARMACY AND INVENTORY FROM BACKEND ==========
  useEffect(() => {
    const fetchPharmacyData = async () => {
      setLoading(true);
      
      // First try: from location state (when coming from pharmacy list)
      if (location.state?.pharmacy) {
        setPharmacy(location.state.pharmacy);
        await fetchInventory(location.state.pharmacy.id);
        setLoading(false);
        return;
      }
      
      // Second try: from auth context (if user is pharmacist)
      if (user?.pharmacyId) {
        try {
          const response = await api.getPharmacyById(user.pharmacyId);
          if (response.success && response.pharmacy) {
            setPharmacy(response.pharmacy);
            await fetchInventory(response.pharmacy.id);
          } else {
            setError('Pharmacy not found');
          }
        } catch (err) {
          setError('Failed to load pharmacy data');
        }
        setLoading(false);
        return;
      }
      
      // Third try: from selectedPharmacy in context
      if (selectedPharmacy) {
        setPharmacy(selectedPharmacy);
        await fetchInventory(selectedPharmacy.id);
        setLoading(false);
        return;
      }
      
      setError('No pharmacy selected');
      setLoading(false);
    };
    
    const fetchInventory = async (pharmacyId) => {
      setInventoryLoading(true);
      try {
        const response = await api.getPharmacyInventory(pharmacyId);
        if (response.success) {
          setInventory(response.inventory);
        } else {
          setInventory([]);
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setInventory([]);
      } finally {
        setInventoryLoading(false);
      }
    };
    
    fetchPharmacyData();
  }, [location.state, user, selectedPharmacy]);

  // Calculate stats from real inventory data
  const stats = {
    totalDrugs: inventory.length,
    lowStock: inventory.filter(item => item.quantity < item.threshold).length,
    expiringSoon: inventory.filter(item => {
      const daysLeft = Math.floor((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft < 30 && daysLeft > 0;
    }).length,
    todaySales: recentSales.reduce((sum, sale) => sum + sale.amount, 0),
    totalCustomers: 89,
    pendingReservations: pendingReservations.length
  };

  // Low stock items
  const lowStockItems = inventory.filter(item => item.quantity < item.threshold);

  // Expiring items
  const expiringItems = inventory.filter(item => {
    const daysLeft = Math.floor((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft < 30 && daysLeft > 0;
  }).map(item => ({
    ...item,
    daysLeft: Math.floor((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))
  }));

  // Quick action handlers
  const handleReorder = (drug) => {
    alert(`Reorder initiated for ${drug.name} at ${pharmacy?.name || 'pharmacy'}`);
  };

  const handleConfirmReservation = (reservation) => {
    alert(`Reservation confirmed for ${reservation.customer}`);
  };

  const [drugSearch, setDrugSearch] = useState('');
  const [availabilityResults, setAvailabilityResults] = useState([]);

  const handleDrugAvailabilitySearch = () => {
    const search = drugSearch.trim().toLowerCase();
    if (!search) {
      setAvailabilityResults([]);
      return;
    }

    const yaoundePharmacies = pharmacies.filter(ph =>
      ph.area?.toLowerCase().includes('yaounde') ||
      ph.area?.toLowerCase().includes('centre') ||
      ph.area?.toLowerCase().includes('centre ville') ||
      ph.area?.toLowerCase().includes('melen') ||
      ph.area?.toLowerCase().includes('bastos') ||
      ph.area?.toLowerCase().includes('meka')
    );

    const inventoryByPharmacy = yaoundePharmacies.map(ph => ({
      ...ph,
      availableDrugs: inventory
        .filter(item => item.name?.toLowerCase().includes(search))
        .map(item => ({
          ...item,
          pharmacyId: ph.id
        }))
    })).filter(ph => ph.availableDrugs.length > 0);

    setAvailabilityResults(inventoryByPharmacy);
  };

  // Format currency
  const formatCurrency = (amount) => amount.toLocaleString() + ' FCFA';

  // ===== STYLES =====
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    sidebar: {
      width: sidebarCollapsed ? '80px' : '280px',
      background: 'linear-gradient(180deg, #2ecc71 0%, #27ae60 100%)',
      color: 'white',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      transition: 'width 0.3s ease',
      position: 'relative',
      zIndex: 1000,
      flexShrink: 0
    },
    sidebarHeader: {
      padding: '0 20px 30px',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      marginBottom: '20px'
    },
    sidebarLogo: {
      width: sidebarCollapsed ? '40px' : '60px',
      height: sidebarCollapsed ? '40px' : '60px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid white',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease'
    },
    sidebarTitle: {
      fontSize: sidebarCollapsed ? '0px' : '1.2rem',
      fontWeight: 'bold',
      marginTop: '10px',
      opacity: sidebarCollapsed ? 0 : 1,
      transition: 'opacity 0.3s ease',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },
    sidebarNav: {
      flex: 1,
      padding: '0 15px'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px 20px',
      marginBottom: '8px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      textAlign: 'left',
      fontSize: '1rem',
      gap: sidebarCollapsed ? '0' : '15px',
      width: '100%'
    },
    activeNavItem: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    navIcon: {
      fontSize: '1.2rem',
      minWidth: '20px',
      textAlign: 'center'
    },
    navText: {
      opacity: sidebarCollapsed ? 0 : 1,
      transition: 'opacity 0.3s ease',
      whiteSpace: 'nowrap'
    },
    toggleBtn: {
      position: 'absolute',
      top: '20px',
      right: '-15px',
      background: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001
    },
    mainContent: {
      flex: 1,
      padding: '30px',
      overflow: 'auto',
      transition: 'margin-left 0.3s ease'
    },
    header: {
      background: 'white',
      padding: '25px 30px',
      borderRadius: '16px',
      marginBottom: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    headerLeft: {
      flex: 1
    },
    headerTitle: {
      fontSize: '2.2rem',
      margin: '0 0 8px 0',
      color: '#2c3e50',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    headerSubtitle: {
      fontSize: '1.1rem',
      color: '#7f8c8d',
      margin: '0 0 15px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    headerMeta: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    metaBadge: {
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '25px',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 2px 8px rgba(46, 204, 113, 0.3)'
    },
    onDutyBadge: {
      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '25px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    dateCard: {
      background: 'linear-gradient(135deg, #3498db, #2980b9)',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
    },
    backBtn: {
      background: 'rgba(255,255,255,0.9)',
      border: '1px solid rgba(0,0,0,0.1)',
      padding: '12px 20px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      color: '#2c3e50',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '25px',
      marginBottom: '40px'
    },
    statCard: {
      background: 'white',
      padding: '30px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '25px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
      border: '1px solid rgba(46, 204, 113, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    },
    statIcon: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.8rem',
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
      flexShrink: 0
    },
    statContent: {
      flex: 1
    },
    statValue: {
      fontSize: '2.2rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      margin: '0 0 5px 0',
      lineHeight: '1.2'
    },
    statLabel: {
      fontSize: '1rem',
      color: '#7f8c8d',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '30px',
      marginBottom: '40px'
    },
    mainSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
      border: '1px solid rgba(46, 204, 113, 0.1)'
    },
    sidebarSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      paddingBottom: '15px',
      borderBottom: '2px solid #f1f3f4'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#2c3e50',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '600'
    },
    viewAllBtn: {
      background: 'transparent',
      border: 'none',
      color: '#2ecc71',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '500',
      textDecoration: 'underline'
    },
    searchContainer: {
      marginBottom: '25px'
    },
    searchInput: {
      width: '100%',
      padding: '15px 20px',
      fontSize: '1rem',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      outline: 'none',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      background: 'white',
      boxSizing: 'border-box'
    },
    alertCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px',
      borderLeft: '4px solid #f39c12',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    alertIcon: {
      fontSize: '1.5rem',
      color: '#f39c12'
    },
    alertContent: {
      flex: 1
    },
    alertTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#2c3e50',
      margin: '0 0 5px 0'
    },
    alertText: {
      fontSize: '0.95rem',
      color: '#7f8c8d',
      margin: 0
    },
    actionBtn: {
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'transform 0.2s ease'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    tableHeader: {
      textAlign: 'left',
      padding: '15px 12px',
      backgroundColor: '#f8f9fa',
      color: '#2c3e50',
      fontWeight: '600',
      fontSize: '0.95rem',
      borderBottom: '2px solid #2ecc71'
    },
    tableCell: {
      padding: '15px 12px',
      borderBottom: '1px solid #e9ecef',
      fontSize: '0.95rem'
    },
    tableCellBold: {
      padding: '15px 12px',
      borderBottom: '1px solid #e9ecef',
      fontSize: '0.95rem',
      fontWeight: 'bold',
      color: '#27ae60'
    },
    quickActions: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
      border: '1px solid rgba(46, 204, 113, 0.1)'
    },
    quickActionsTitle: {
      fontSize: '1.3rem',
      color: '#2c3e50',
      margin: '0 0 25px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '600'
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    },
    actionButton: {
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      border: 'none',
      padding: '18px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)'
    },
    inventorySection: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
      border: '1px solid rgba(46, 204, 113, 0.1)'
    },
    inventoryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      paddingBottom: '15px',
      borderBottom: '2px solid #f1f3f4'
    },
    inventoryTitle: {
      fontSize: '1.5rem',
      color: '#2c3e50',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '600'
    },
    addBtn: {
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
      transition: 'transform 0.3s ease'
    },
    summaryCard: {
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
      padding: '20px',
      borderRadius: '12px',
      marginTop: '25px',
      border: '1px solid #dee2e6'
    },
    summaryText: {
      fontSize: '1rem',
      color: '#2c3e50',
      margin: 0,
      fontWeight: '500'
    },
    errorContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    },
    errorCard: {
      background: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
      textAlign: 'center',
      maxWidth: '400px'
    },
    errorTitle: {
      fontSize: '1.5rem',
      color: '#2c3e50',
      margin: '0 0 15px 0'
    },
    errorText: {
      color: '#7f8c8d',
      margin: '0 0 25px 0'
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error if no pharmacy found
  if (error || !pharmacy) {
    const isPharmacist = user?.role === 'pharmacist';
    
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorTitle}>
            <FontAwesomeIcon icon="info-circle" /> No Pharmacy Found
          </h2>
          <p style={styles.errorText}>{error || 'No pharmacy information available.'}</p>
          
          {isPharmacist ? (
            <>
              <p style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '0.95rem' }}>
                👋 Welcome! Let's set up your pharmacy to get started.
              </p>
              <button 
                onClick={() => navigate('/create-pharmacy')} 
                style={{...styles.backBtn, background: '#2ecc71', color: 'white', border: 'none', marginBottom: '10px'}}
              >
                <FontAwesomeIcon icon="plus-circle" /> Create My Pharmacy
              </button>
              <button onClick={() => navigate('/pharmacies')} style={styles.backBtn}>
                <FontAwesomeIcon icon="arrow-left" /> Browse Other Pharmacies
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/pharmacies')} style={styles.backBtn}>
              <FontAwesomeIcon icon="arrow-left" /> Browse Pharmacies
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show loading spinner for inventory
  if (inventoryLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <div style={styles.sidebar}>
        <button
          style={styles.toggleBtn}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <FontAwesomeIcon icon={sidebarCollapsed ? "chevron-right" : "chevron-left"} />
        </button>

        <div style={styles.sidebarHeader}>
          <img src={pharmacyLogo} alt="Pharmacy Logo" style={styles.sidebarLogo} />
          <h3 style={styles.sidebarTitle}>{pharmacy.name}</h3>
        </div>

        <nav style={styles.sidebarNav}>
          {[
            { key: 'overview', icon: 'chart-bar', label: 'Overview' },
            { key: 'reservations', icon: 'calendar-check', label: 'Reservations' }
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              style={{
                ...styles.navItem,
                ...(activeSection === key && styles.activeNavItem)
              }}
              onClick={() => setActiveSection(key)}
            >
              <FontAwesomeIcon icon={icon} style={styles.navIcon} />
              <span style={styles.navText}>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>
              <FontAwesomeIcon icon="store" /> Pharmacy Dashboard
            </h1>
            <p style={styles.headerSubtitle}>
              <FontAwesomeIcon icon="user-check" /> Welcome back, {user?.name || 'Pharmacist'}
            </p>
            <div style={styles.headerMeta}>
              {pharmacy.location && (
                <span style={styles.metaBadge}>
                  <FontAwesomeIcon icon="map-marker-alt" /> {pharmacy.location}
                </span>
              )}
              {pharmacy.phone && (
                <span style={styles.metaBadge}>
                  <FontAwesomeIcon icon="phone" /> {pharmacy.phone}
                </span>
              )}
              {pharmacy.is_on_duty && (
                <span style={styles.onDutyBadge}>
                  <FontAwesomeIcon icon="sun" /> Open 24/7
                </span>
              )}
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.dateCard}>
              <FontAwesomeIcon icon="calendar-alt" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <button onClick={() => navigate('/pharmacies')} style={styles.backBtn}>
              <FontAwesomeIcon icon="arrow-left" /> Back to Pharmacies
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <FontAwesomeIcon icon="pills" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.totalDrugs}</div>
              <div style={styles.statLabel}>
                <FontAwesomeIcon icon="boxes" /> Total Drugs
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}>
              <FontAwesomeIcon icon="exclamation-triangle" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.lowStock}</div>
              <div style={styles.statLabel}>
                <FontAwesomeIcon icon="exclamation-circle" /> Low Stock
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
              <FontAwesomeIcon icon="hourglass-half" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.expiringSoon}</div>
              <div style={styles.statLabel}>
                <FontAwesomeIcon icon="calendar-times" /> Expiring Soon
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <FontAwesomeIcon icon="money-bill-wave" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{formatCurrency(stats.todaySales)}</div>
              <div style={styles.statLabel}>
                <FontAwesomeIcon icon="chart-line" /> Today's Sales
              </div>
            </div>
          </div>
        </div>

        {/* ===== OVERVIEW SECTION ===== */}
        {activeSection === 'overview' && (
          <div style={styles.contentGrid}>
            {/* Main Panel */}
            <div style={styles.mainSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  <FontAwesomeIcon icon="chart-bar" /> Dashboard Overview
                </h2>
              </div>

              {/* Yaounde Drug Availability Search */}
              <div style={{ ...styles.sectionHeader, marginBottom: '20px', paddingBottom: '12px' }}>
                <h3 style={{ ...styles.sectionTitle, fontSize: '1.2rem' }}>
                  <FontAwesomeIcon icon="hospital" /> Search Drugs in Yaounde Pharmacies
                </h3>
              </div>
              <div style={{ ...styles.searchContainer, display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter drug name..."
                  value={drugSearch}
                  onChange={(e) => setDrugSearch(e.target.value)}
                  style={{ ...styles.searchInput, flex: 1 }}
                />
                <button style={styles.actionBtn} onClick={handleDrugAvailabilitySearch}>
                  <FontAwesomeIcon icon="search" /> Find
                </button>
              </div>
              {drugSearch.trim().length > 0 && (
                <div style={{ marginBottom: '20px', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  {availabilityResults.length > 0 ? (
                    availabilityResults.map(ph => (
                      <div key={ph.id} style={{ marginBottom: '12px' }}>
                        <strong>{ph.name}</strong> ({ph.location || ph.area})
                        <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
                          {ph.availableDrugs.map(d => (
                            <li key={d.id}>{d.name} - {d.quantity} units</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p style={{ margin: 0, color: '#7f8c8d' }}>No matching drug availability found in Yaounde pharmacies.</p>
                  )}
                </div>
              )}

              {/* Search */}
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              {/* Low Stock Alerts */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ ...styles.sectionTitle, fontSize: '1.2rem', marginBottom: '15px' }}>
                  <FontAwesomeIcon icon="exclamation-circle" style={{ color: '#f39c12' }} /> Low Stock Alerts
                </h3>
                {lowStockItems.slice(0, 3).map(item => (
                  <div key={item.id} style={styles.alertCard}>
                    <FontAwesomeIcon icon="exclamation-triangle" style={styles.alertIcon} />
                    <div style={styles.alertContent}>
                      <div style={styles.alertTitle}>{item.name}</div>
                      <div style={styles.alertText}>
                        Current stock: {item.quantity} | Threshold: {item.threshold}
                      </div>
                    </div>
                    <button style={styles.actionBtn} onClick={() => handleReorder(item)}>
                      <FontAwesomeIcon icon="sync-alt" /> Reorder
                    </button>
                  </div>
                ))}
              </div>

              {/* Recent Sales Table */}
              <div>
                <div style={styles.sectionHeader}>
                  <h3 style={{ ...styles.sectionTitle, fontSize: '1.2rem' }}>
                    <FontAwesomeIcon icon="chart-line" style={{ color: '#27ae60' }} /> Recent Sales
                  </h3>
                  <button style={styles.viewAllBtn}>View All</button>
                </div>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Drug</th>
                      <th style={styles.tableHeader}>Quantity</th>
                      <th style={styles.tableHeader}>Customer</th>
                      <th style={styles.tableHeader}>Amount</th>
                      <th style={styles.tableHeader}>Time</th>
                     </tr>
                  </thead>
                  <tbody>
                    {recentSales.map(sale => (
                      <tr key={sale.id}>
                        <td style={styles.tableCell}>
                          <FontAwesomeIcon icon="pills" style={{ marginRight: '8px', color: '#2ecc71' }} />
                          {sale.drug}
                        </td>
                        <td style={styles.tableCell}>{sale.quantity}</td>
                        <td style={styles.tableCell}>
                          <FontAwesomeIcon icon="user" style={{ marginRight: '8px', color: '#3498db' }} />
                          {sale.customer}
                        </td>
                        <td style={styles.tableCellBold}>
                          {formatCurrency(sale.amount)}
                        </td>
                        <td style={styles.tableCell}>
                          <FontAwesomeIcon icon="clock" style={{ marginRight: '8px', color: '#95a5a6' }} />
                          {sale.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel */}
            <div style={styles.sidebarSection}>
              {/* Expiring Soon */}
              <div style={styles.mainSection}>
                <div style={styles.sectionHeader}>
                  <h3 style={{ ...styles.sectionTitle, fontSize: '1.2rem' }}>
                    <FontAwesomeIcon icon="hourglass-half" style={{ color: '#e74c3c' }} /> Expiring Soon
                  </h3>
                  <button style={styles.viewAllBtn}>View All</button>
                </div>
                {expiringItems.slice(0, 4).map(item => (
                  <div key={item.id} style={{ ...styles.alertCard, borderLeftColor: '#e74c3c' }}>
                    <FontAwesomeIcon icon="calendar-times" style={{ ...styles.alertIcon, color: '#e74c3c' }} />
                    <div style={styles.alertContent}>
                      <div style={styles.alertTitle}>{item.name}</div>
                      <div style={styles.alertText}>
                        {item.daysLeft} days left | Expires: {item.expiry_date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== RESERVATIONS SECTION ===== */}
        {activeSection === 'reservations' && (
          <div style={styles.inventorySection}>
            <div style={styles.inventoryHeader}>
              <h2 style={styles.inventoryTitle}>
                <FontAwesomeIcon icon="clipboard-list" /> Pending Reservations
              </h2>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Drug</th>
                  <th style={styles.tableHeader}>Quantity</th>
                  <th style={styles.tableHeader}>Customer</th>
                  <th style={styles.tableHeader}>Phone</th>
                  <th style={styles.tableHeader}>Pickup Time</th>
                  <th style={styles.tableHeader}>Action</th>
                 </tr>
              </thead>
              <tbody>
                {pendingReservations.map(res => (
                  <tr key={res.id}>
                    <td style={styles.tableCell}>
                      <FontAwesomeIcon icon="pills" style={{ marginRight: '8px', color: '#2ecc71' }} />
                      {res.drug}
                    </td>
                    <td style={styles.tableCell}>{res.quantity}</td>
                    <td style={styles.tableCell}>
                      <FontAwesomeIcon icon="user" style={{ marginRight: '8px', color: '#3498db' }} />
                      {res.customer}
                    </td>
                    <td style={styles.tableCell}>
                      <FontAwesomeIcon icon="phone" style={{ marginRight: '8px', color: '#2ecc71' }} />
                      {res.phone}
                    </td>
                    <td style={styles.tableCell}>
                      <FontAwesomeIcon icon="clock" style={{ marginRight: '8px', color: '#f39c12' }} />
                      {res.time}
                    </td>
                    <td style={styles.tableCell}>
                      <button style={styles.actionBtn} onClick={() => handleConfirmReservation(res)}>
                        <FontAwesomeIcon icon="check-circle" /> Confirm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyDashboard;