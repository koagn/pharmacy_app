import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePharmacy } from '../context/PharmacyContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import pharmacyLogo from '../image_logo/pharmacy_logo.png';
import DrugTable from '../components/pharmacy/DrugTable';

const PharmacyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPharmacy, pharmacies } = usePharmacy();
  const { user } = useAuth();
  const pharmacy = location.state?.pharmacy || selectedPharmacy ||
                    pharmacies.find(p => p.id === user?.pharmacyId) || null;

  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sample inventory data for the pharmacy
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Paracetamol 500mg', genericName: 'Paracetamol', quantity: 15, threshold: 20, category: 'Pain Relief', price: 500, expiryDate: '2024-12-31' },
    { id: 2, name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', quantity: 8, threshold: 15, category: 'Antibiotics', price: 1200, expiryDate: '2024-10-15' },
    { id: 3, name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', quantity: 12, threshold: 25, category: 'Pain Relief', price: 800, expiryDate: '2024-11-30' },
    { id: 4, name: 'Metformin 850mg', genericName: 'Metformin', quantity: 5, threshold: 10, category: 'Diabetes', price: 600, expiryDate: '2024-09-20' },
    { id: 5, name: 'Omeprazole 20mg', genericName: 'Omeprazole', quantity: 9, threshold: 20, category: 'Gastric', price: 750, expiryDate: '2024-08-15' },
    { id: 6, name: 'Aspirin 100mg', genericName: 'Aspirin', quantity: 45, threshold: 30, category: 'Pain Relief', price: 300, expiryDate: '2024-05-15' },
    { id: 7, name: 'Vitamin C 1000mg', genericName: 'Ascorbic Acid', quantity: 30, threshold: 25, category: 'Vitamins', price: 1500, expiryDate: '2024-05-30' },
    { id: 8, name: 'Cetirizine 10mg', genericName: 'Cetirizine', quantity: 25, threshold: 20, category: 'Allergy', price: 450, expiryDate: '2024-04-20' }
  ]);

  // Sample sales data
  const recentSales = [
    { id: 1, drug: 'Paracetamol 500mg', quantity: 2, amount: 1000, time: '10:30 AM', customer: 'John D.' },
    { id: 2, drug: 'Amoxicillin 250mg', quantity: 1, amount: 1200, time: '11:15 AM', customer: 'Mary W.' },
    { id: 3, drug: 'Ibuprofen 400mg', quantity: 3, amount: 2400, time: '12:00 PM', customer: 'Peter K.' },
    { id: 4, drug: 'Vitamin C 1000mg', quantity: 1, amount: 1500, time: '01:30 PM', customer: 'Sarah M.' }
  ];

  // Handler functions for Drug Table
  const handleEditDrug = (drug) => {
    const newQuantity = prompt(`Enter new quantity for ${drug.name}:`, drug.quantity);
    if (newQuantity) {
      setInventory(inventory.map(item =>
        item.id === drug.id ? {...item, quantity: parseInt(newQuantity)} : item
      ));
    }
  };

  const handleDeleteDrug = (id) => {
    if (window.confirm('Are you sure you want to delete this drug?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const handleReorderDrug = (drug) => {
    alert(`Reorder initiated for ${drug.name}`);
  };

  // Calculate stats
  const stats = {
    totalDrugs: inventory.length,
    lowStock: inventory.filter(item => item.quantity < item.threshold).length,
    expiringSoon: inventory.filter(item => {
      const daysLeft = Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft < 30 && daysLeft > 0;
    }).length,
    todaySales: recentSales.reduce((sum, sale) => sum + sale.amount, 0),
    totalCustomers: 89
  };

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Low stock items
  const lowStockItems = inventory.filter(item => item.quantity < item.threshold);

  // Expiring items
  const expiringItems = inventory.filter(item => {
    const daysLeft = Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft < 30 && daysLeft > 0;
  }).map(item => ({
    ...item,
    daysLeft: Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  }));

  // Quick action handlers
  const handleReorder = (drug) => {
    alert(`Reorder initiated for ${drug.name} at ${pharmacy?.name || 'pharmacy'}`);
  };

  const handleUpdateStock = (drug) => {
    const newQuantity = prompt(`Enter new quantity for ${drug.name}:`, drug.quantity);
    if (newQuantity) {
      setInventory(inventory.map(item =>
        item.id === drug.id ? {...item, quantity: parseInt(newQuantity)} : item
      ));
    }
  };

  const handleProcessSale = () => {
    alert('Opening point of sale...');
  };

  // Format currency
  const formatCurrency = (amount) => amount.toLocaleString() + ' FCFA';

  // ===== MODERN STYLES WITH SIDEBAR NAVIGATION =====
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
      zIndex: 1000
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
      transition: 'opacity 0.3s ease'
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
      gap: sidebarCollapsed ? '0' : '15px'
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
    headerTitleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '8px',
    },
    headerPharmacyImage: {
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      objectFit: 'cover',
      border: '3px solid white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
      boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)'
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
      textDecoration: 'underline',
      transition: 'color 0.3s ease'
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
      background: 'white'
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
    },

    // Mobile responsiveness
    '@media (max-width: 768px)': {
      sidebar: {
        width: sidebarCollapsed ? '0' : '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 1000
      },
      mainContent: {
        padding: '20px',
        marginLeft: 0
      },
      header: {
        flexDirection: 'column',
        textAlign: 'center'
      },
      headerTitle: {
        fontSize: '1.8rem'
      },
      statsGrid: {
        gridTemplateColumns: '1fr'
      },
      contentGrid: {
        gridTemplateColumns: '1fr'
      },
      actionButtons: {
        gridTemplateColumns: '1fr'
      }
    }
  };

  // ===== UPDATED INVENTORY MANAGEMENT FUNCTIONS =====
  const handleAddNewDrug = () => {
    const drugName = prompt("Enter drug name:");
    if (!drugName) return;

    const category = prompt("Enter category (Pain Relief, Antibiotics, etc.):") || "General";
    const quantity = parseInt(prompt("Enter quantity:") || "0");
    const price = parseInt(prompt("Enter price (FCFA):") || "0");
    const expiryDate = prompt("Enter expiry date (YYYY-MM-DD):") ||
                      new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0];

    const newDrug = {
      id: inventory.length + 1,
      name: drugName,
      genericName: drugName,
      quantity: quantity,
      threshold: 10,
      category: category,
      price: price,
      expiryDate: expiryDate
    };

    setInventory([...inventory, newDrug]);
    alert(`${drugName} added to your inventory!`);
  };

  // If no pharmacy data, show error
  if (!pharmacy) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorTitle}>No pharmacy selected</h2>
          <p style={styles.errorText}>Please select a pharmacy to view the dashboard.</p>
          <button onClick={() => navigate('/')} style={styles.backBtn}>
            <FontAwesomeIcon icon="arrow-left" /> Back to Pharmacies
          </button>
        </div>
      </div>
    );
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
          {pharmacy.image_url ? (
            <img src={`http://localhost:5000${pharmacy.image_url}`} alt={pharmacy.name} style={styles.sidebarLogo} />
          ) : (
            <img src={pharmacyLogo} alt="Pharmacy Logo" style={styles.sidebarLogo} />
          )}
          <h3 style={styles.sidebarTitle}>{pharmacy.name}</h3>
        </div>

        <nav style={styles.sidebarNav}>
          <button
            style={{
              ...styles.navItem,
              ...(activeSection === 'overview' && styles.activeNavItem)
            }}
            onClick={() => setActiveSection('overview')}
          >
            <FontAwesomeIcon icon="chart-bar" style={styles.navIcon} />
            <span style={styles.navText}>Overview</span>
          </button>

          <button
            style={{
              ...styles.navItem,
              ...(activeSection === 'inventory' && styles.activeNavItem)
            }}
            onClick={() => setActiveSection('inventory')}
          >
            <FontAwesomeIcon icon="boxes" style={styles.navIcon} />
            <span style={styles.navText}>Inventory</span>
          </button>

          <button
            style={{
              ...styles.navItem,
              ...(activeSection === 'sales' && styles.activeNavItem)
            }}
            onClick={() => setActiveSection('sales')}
          >
            <FontAwesomeIcon icon="cash-register" style={styles.navIcon} />
            <span style={styles.navText}>Sales</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerTitleRow}>
              {pharmacy.image_url && (
                <img 
                  src={`http://localhost:5000${pharmacy.image_url}`} 
                  alt={pharmacy.name}
                  style={styles.headerPharmacyImage}
                />
              )}
              <h1 style={styles.headerTitle}>
                <FontAwesomeIcon icon="store" /> Pharmacy Dashboard
              </h1>
            </div>
            <p style={styles.headerSubtitle}>
              <FontAwesomeIcon icon="user-check" /> Welcome back, {user?.name || 'Pharmacist'}
            </p>
            <div style={styles.headerMeta}>
              {pharmacy.area && (
                <span style={styles.metaBadge}>
                  <FontAwesomeIcon icon="map-marker-alt" /> {pharmacy.area}
                </span>
              )}
              {pharmacy.phone && (
                <span style={styles.metaBadge}>
                  <FontAwesomeIcon icon="phone" /> {pharmacy.phone}
                </span>
              )}
              {pharmacy.isOnDuty && (
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
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f39c12, #e67e22)'}}>
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
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #e74c3c, #c0392b)'}}>
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

        {/* Content based on active section */}
        {activeSection === 'overview' && (
          <>
            {/* Main Content Grid */}
            <div style={styles.contentGrid}>
              {/* Main Section */}
              <div style={styles.mainSection}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <FontAwesomeIcon icon="chart-bar" /> Dashboard Overview
                  </h2>
                </div>

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
                <div style={{marginBottom: '30px'}}>
                  <h3 style={{...styles.sectionTitle, fontSize: '1.2rem', marginBottom: '15px'}}>
                    <FontAwesomeIcon icon="exclamation-circle" style={{color: '#f39c12'}} /> Low Stock Alerts
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
                    <h3 style={{...styles.sectionTitle, fontSize: '1.2rem'}}>
                      <FontAwesomeIcon icon="chart-line" style={{color: '#27ae60'}} /> Recent Sales
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
                            <FontAwesomeIcon icon="pills" style={{marginRight: '8px', color: '#2ecc71'}} />
                            {sale.drug}
                          </td>
                          <td style={styles.tableCell}>{sale.quantity}</td>
                          <td style={styles.tableCell}>
                            <FontAwesomeIcon icon="user" style={{marginRight: '8px', color: '#3498db'}} />
                            {sale.customer}
                          </td>
                          <td style={styles.tableCell} style={{fontWeight: 'bold', color: '#27ae60'}}>
                            {formatCurrency(sale.amount)}
                          </td>
                          <td style={styles.tableCell}>
                            <FontAwesomeIcon icon="clock" style={{marginRight: '8px', color: '#95a5a6'}} />
                            {sale.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar Sections */}
              <div style={styles.sidebarSection}>
                {/* Expiring Soon */}
                <div style={styles.mainSection}>
                  <div style={styles.sectionHeader}>
                    <h3 style={{...styles.sectionTitle, fontSize: '1.2rem'}}>
                      <FontAwesomeIcon icon="hourglass-half" style={{color: '#e74c3c'}} /> Expiring Soon
                    </h3>
                    <button style={styles.viewAllBtn}>View All</button>
                  </div>
                  {expiringItems.slice(0, 4).map(item => (
                    <div key={item.id} style={{...styles.alertCard, borderLeftColor: '#e74c3c'}}>
                      <FontAwesomeIcon icon="calendar-times" style={{...styles.alertIcon, color: '#e74c3c'}} />
                      <div style={styles.alertContent}>
                        <div style={styles.alertTitle}>{item.name}</div>
                        <div style={styles.alertText}>
                          {item.daysLeft} days left | Expires: {item.expiryDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div style={styles.quickActions}>
                  <h3 style={styles.quickActionsTitle}>
                    <FontAwesomeIcon icon="bolt" /> Quick Actions
                  </h3>
                  <div style={styles.actionButtons}>
                    <button style={styles.actionButton} onClick={handleAddNewDrug}>
                      <FontAwesomeIcon icon="plus-circle" /> Add Drug
                    </button>
                    <button style={styles.actionButton} onClick={handleProcessSale}>
                      <FontAwesomeIcon icon="cash-register" /> Process Sale
                    </button>
                    <button style={styles.actionButton} onClick={() => window.print()}>
                      <FontAwesomeIcon icon="print" /> Print Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Inventory Section */}
        {activeSection === 'inventory' && (
          <div style={styles.inventorySection}>
            <div style={styles.inventoryHeader}>
              <h2 style={styles.inventoryTitle}>
                <FontAwesomeIcon icon="warehouse" /> Inventory Management
              </h2>
              <button style={styles.addBtn} onClick={handleAddNewDrug}>
                <FontAwesomeIcon icon="plus-circle" /> Add New Drug
              </button>
            </div>

            {/* Search */}
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search your inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Drug Table */}
            <DrugTable
              drugs={filteredInventory}
              onEdit={handleEditDrug}
              onDelete={handleDeleteDrug}
              onReorder={handleReorderDrug}
            />

            {/* Summary */}
            <div style={styles.summaryCard}>
              <p style={styles.summaryText}>
                <strong><FontAwesomeIcon icon="chart-bar" /> Inventory Summary:</strong> {inventory.length} total items |
                {stats.lowStock} low stock | {stats.expiringSoon} expiring soon
              </p>
            </div>
          </div>
        )}

        {/* Sales Section */}
        {activeSection === 'sales' && (
          <div style={styles.inventorySection}>
            <div style={styles.inventoryHeader}>
              <h2 style={styles.inventoryTitle}>
                <FontAwesomeIcon icon="cash-register" /> Sales Management
              </h2>
              <button style={styles.addBtn} onClick={handleProcessSale}>
                <FontAwesomeIcon icon="plus-circle" /> New Sale
              </button>
            </div>

            <div style={styles.contentGrid}>
              <div>
                <h3 style={{...styles.sectionTitle, fontSize: '1.2rem', marginBottom: '20px'}}>
                  Today's Sales Summary
                </h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
                  <div style={{...styles.statCard, padding: '20px'}}>
                    <div style={{...styles.statIcon, width: '50px', height: '50px', fontSize: '1.5rem'}}>
                      <FontAwesomeIcon icon="money-bill-wave" />
                    </div>
                    <div style={styles.statContent}>
                      <div style={{...styles.statValue, fontSize: '1.8rem'}}>{formatCurrency(stats.todaySales)}</div>
                      <div style={styles.statLabel}>Total Sales</div>
                    </div>
                  </div>
                  <div style={{...styles.statCard, padding: '20px'}}>
                    <div style={{...styles.statIcon, width: '50px', height: '50px', fontSize: '1.5rem'}}>
                      <FontAwesomeIcon icon="users" />
                    </div>
                    <div style={styles.statContent}>
                      <div style={{...styles.statValue, fontSize: '1.8rem'}}>{stats.totalCustomers}</div>
                      <div style={styles.statLabel}>Customers Served</div>
                    </div>
                  </div>
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
                          <FontAwesomeIcon icon="pills" style={{marginRight: '8px', color: '#2ecc71'}} />
                          {sale.drug}
                        </td>
                        <td style={styles.tableCell}>{sale.quantity}</td>
                        <td style={styles.tableCell}>
                          <FontAwesomeIcon icon="user" style={{marginRight: '8px', color: '#3498db'}} />
                          {sale.customer}
                        </td>
                        <td style={styles.tableCell} style={{fontWeight: 'bold', color: '#27ae60'}}>
                          {formatCurrency(sale.amount)}
                        </td>
                        <td style={styles.tableCell}>
                          <FontAwesomeIcon icon="clock" style={{marginRight: '8px', color: '#95a5a6'}} />
                          {sale.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={styles.sidebarSection}>
                <div style={styles.quickActions}>
                  <h3 style={styles.quickActionsTitle}>
                    <FontAwesomeIcon icon="bolt" /> Sales Actions
                  </h3>
                  <div style={styles.actionButtons}>
                    <button style={styles.actionButton} onClick={handleProcessSale}>
                      <FontAwesomeIcon icon="cash-register" /> Process Sale
                    </button>
                    <button style={styles.actionButton} onClick={() => window.print()}>
                      <FontAwesomeIcon icon="file-invoice" /> Generate Invoice
                    </button>
                    <button style={styles.actionButton} onClick={() => alert('Opening sales report...')}>
                      <FontAwesomeIcon icon="chart-bar" /> Sales Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyDashboard;



