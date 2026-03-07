import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePharmacy } from '../context/PharmacyContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import pharmacyLogo from '../image_logo/pharmacy_logo.png';
import DrugTable from '../components/pharmacy/DrugTable';

const PharmacyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPharmacy } = usePharmacy();
  const pharmacy = location.state?.pharmacy || selectedPharmacy;

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Sample reservations
  const pendingReservations = [
    { id: 1, drug: 'Metformin 850mg', quantity: 2, customer: 'Paul N.', phone: '677889900', time: '02:00 PM' },
    { id: 2, drug: 'Amoxicillin 250mg', quantity: 1, customer: 'Jane A.', phone: '699887766', time: '03:30 PM' }
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
    totalCustomers: 89,
    pendingReservations: pendingReservations.length
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

  const handleAddDrug = () => {
    alert('Add new drug feature - would open a form');
  };

  const handleConfirmReservation = (reservation) => {
    alert(`Reservation confirmed for ${reservation.customer}`);
  };

  const handleProcessSale = () => {
    alert('Opening point of sale...');
  };

  // Format currency
  const formatCurrency = (amount) => amount.toLocaleString() + ' FCFA';

  // ===== STYLES DEFINED HERE - BEFORE ANY CONDITIONAL RETURN =====
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f0fe 100%)',
      padding: '30px',
      fontFamily: 'Inter, Arial, sans-serif'
    },
    backButton: {
      background: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      color: '#2c3e50',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    pharmacyHeader: {
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      padding: '30px',
      borderRadius: '15px',
      marginBottom: '30px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '30px',
      boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3)'
    },
    logo: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid white',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    },
    pharmacyName: {
      fontSize: '2.5rem',
      margin: '0 0 10px 0'
    },
    pharmacyAddress: {
      fontSize: '1.1rem',
      margin: '0 0 15px 0',
      opacity: 0.95
    },
    pharmacyMeta: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    metaItem: {
      fontSize: '1rem',
      background: 'rgba(255,255,255,0.2)',
      padding: '5px 15px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    onDutyBadge: {
      background: '#e74c3c',
      color: 'white',
      padding: '5px 15px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 'bold'
    },
    errorContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa, #e8f0fe)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      background: 'white',
      padding: '20px 30px',
      borderRadius: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    headerTitle: {
      fontSize: '2rem',
      margin: '0 0 5px 0',
      color: '#2c3e50',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    headerSubtitle: {
      fontSize: '1rem',
      color: '#7f8c8d',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    headerRight: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center'
    },
    dateBadge: {
      background: '#f8f9fa',
      padding: '10px 15px',
      borderRadius: '8px',
      color: '#34495e',
      fontSize: '0.95rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'linear-gradient(145deg, #2ecc71, #27ae60)',
      padding: '25px',
      borderRadius: '15px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      boxShadow: '0 4px 15px rgba(46, 204, 113, 0.2)',
      cursor: 'pointer'
    },
    statIcon: {
      fontSize: '2rem',
      background: 'rgba(255,255,255,0.2)',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statValue: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      lineHeight: '1.2'
    },
    statLabel: {
      fontSize: '0.9rem',
      opacity: '0.9',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    searchContainer: {
      marginBottom: '20px'
    },
    searchInput: {
      width: '100%',
      padding: '15px 20px',
      fontSize: '1rem',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    tabsContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      background: 'white',
      padding: '10px',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    tab: {
      padding: '12px 20px',
      border: 'none',
      background: 'transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      color: '#7f8c8d',
      transition: 'all 0.3s ease',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    activeTab: {
      background: 'linear-gradient(145deg, #2ecc71, #27ae60)',
      color: 'white'
    },
    contentArea: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    sectionCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: '#2c3e50',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    viewAllBtn: {
      background: 'transparent',
      border: 'none',
      color: '#2ecc71',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      textAlign: 'left',
      padding: '12px',
      backgroundColor: '#f8f9fa',
      color: '#2c3e50',
      fontWeight: '600',
      fontSize: '0.9rem',
      borderBottom: '2px solid #2ecc71'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '0.95rem'
    },
    reorderBtn: {
      backgroundColor: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      marginRight: '5px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px'
    },
    updateBtn: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px'
    },
    confirmBtn: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px'
    },
    primaryBtn: {
      background: 'linear-gradient(145deg, #2ecc71, #27ae60)',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    twoColumnGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px'
    },
    expiryItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderBottom: '1px solid #e0e0e0'
    },
    expiryItemLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    expiryDrugName: {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#2c3e50',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    expiryQuantity: {
      fontSize: '0.85rem',
      color: '#7f8c8d',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    expiryItemRight: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px'
    },
    expiryBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      color: 'white',
      fontSize: '0.8rem',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    },
    expiryDate: {
      fontSize: '0.8rem',
      color: '#95a5a6',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    saleItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderBottom: '1px solid #e0e0e0'
    },
    saleItemLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    saleDrugName: {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#2c3e50',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    saleCustomer: {
      fontSize: '0.85rem',
      color: '#7f8c8d',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    saleItemRight: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px'
    },
    saleAmount: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#27ae60',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    saleTime: {
      fontSize: '0.8rem',
      color: '#95a5a6',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    quickActions: {
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      marginTop: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    quickActionsTitle: {
      fontSize: '1.2rem',
      color: '#2c3e50',
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '15px'
    },
    actionBtn: {
      background: 'linear-gradient(145deg, #2ecc71, #27ae60)',
      color: 'white',
      border: 'none',
      padding: '15px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'transform 0.3s ease',
      boxShadow: '0 4px 10px rgba(46, 204, 113, 0.2)'
    },
    actionIcon: {
      fontSize: '1.2rem'
    }
  };

  // If no pharmacy data, show error
  if (!pharmacy) {
    return (
      <div style={styles.errorContainer}>
        <h2>No pharmacy selected</h2>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          <FontAwesomeIcon icon="arrow-left" /> Back to Pharmacies
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button onClick={() => navigate('/')} style={styles.backButton}>
        <FontAwesomeIcon icon="arrow-left" /> Back to All Pharmacies
      </button>

      {/* Pharmacy Header with Logo */}
      <div style={styles.pharmacyHeader}>
        <img 
          src={pharmacyLogo} 
          alt="Pharmacy Logo" 
          style={styles.logo}
        />
        <div>
          <h1 style={styles.pharmacyName}>{pharmacy.name}</h1>
          <p style={styles.pharmacyAddress}>{pharmacy.address}</p>
          <div style={styles.pharmacyMeta}>
            <span style={styles.metaItem}>
              <FontAwesomeIcon icon="phone-alt" /> {pharmacy.phone}
            </span>
            <span style={styles.metaItem}>
              <FontAwesomeIcon icon="clock" /> {pharmacy.hours}
            </span>
            <span style={styles.metaItem}>
              <FontAwesomeIcon icon="user-md" /> {pharmacy.manager}
            </span>
            {pharmacy.isOnDuty && (
              <span style={styles.onDutyBadge}>On Duty 24/7</span>
            )}
          </div>
        </div>
      </div>

      {/* Header with Welcome and Date */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            <FontAwesomeIcon icon="chart-pie" /> {pharmacy.name} Dashboard
          </h1>
          <p style={styles.headerSubtitle}>
            <FontAwesomeIcon icon="user-check" /> Welcome back, {pharmacy.manager}
          </p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.dateBadge}>
            <FontAwesomeIcon icon="calendar-alt" /> {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats Row - WITH FONT AWESOME ICONS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FontAwesomeIcon icon="pills" />
          </div>
          <div>
            <div style={styles.statValue}>{stats.totalDrugs}</div>
            <div style={styles.statLabel}>Total Drugs</div>
          </div>
        </div>

        <div style={{...styles.statCard, background: 'linear-gradient(145deg, #f39c12, #e67e22)'}}>
          <div style={styles.statIcon}>
            <FontAwesomeIcon icon="exclamation-triangle" />
          </div>
          <div>
            <div style={styles.statValue}>{stats.lowStock}</div>
            <div style={styles.statLabel}>Low Stock</div>
          </div>
        </div>

        <div style={{...styles.statCard, background: 'linear-gradient(145deg, #e74c3c, #c0392b)'}}>
          <div style={styles.statIcon}>
            <FontAwesomeIcon icon="hourglass-half" />
          </div>
          <div>
            <div style={styles.statValue}>{stats.expiringSoon}</div>
            <div style={styles.statLabel}>Expiring Soon</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FontAwesomeIcon icon="money-bill-wave" />
          </div>
          <div>
            <div style={styles.statValue}>{formatCurrency(stats.todaySales)}</div>
            <div style={styles.statLabel}>Today's Sales</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - WITH FONT AWESOME ICONS */}
      <div style={styles.tabsContainer}>
        <button 
          style={{...styles.tab, ...(activeTab === 'overview' && styles.activeTab)}}
          onClick={() => setActiveTab('overview')}
        >
          <FontAwesomeIcon icon="chart-bar" /> Overview
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'inventory' && styles.activeTab)}}
          onClick={() => setActiveTab('inventory')}
        >
          <FontAwesomeIcon icon="boxes" /> Inventory
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'reservations' && styles.activeTab)}}
          onClick={() => setActiveTab('reservations')}
        >
          <FontAwesomeIcon icon="calendar-check" /> Reservations
        </button>
      </div>

      {/* Content based on active tab */}
      <div style={styles.contentArea}>
        {activeTab === 'overview' && (
          <>
            {/* Search Bar */}
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search drugs in inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Low Stock Alerts Section */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  <FontAwesomeIcon icon="exclamation-circle" style={{color: '#f39c12'}} /> Low Stock Alerts
                </h2>
                <button style={styles.viewAllBtn}>View All</button>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Drug Name</th>
                    <th style={styles.tableHeader}>Current Stock</th>
                    <th style={styles.tableHeader}>Threshold</th>
                    <th style={styles.tableHeader}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.slice(0, 3).map(item => (
                    <tr key={item.id}>
                      <td style={styles.tableCell}>{item.name}</td>
                      <td style={{...styles.tableCell, color: '#e74c3c', fontWeight: 'bold'}}>{item.quantity}</td>
                      <td style={styles.tableCell}>{item.threshold}</td>
                      <td style={styles.tableCell}>
                        <button 
                          style={styles.reorderBtn}
                          onClick={() => handleReorder(item)}
                        >
                          <FontAwesomeIcon icon="sync-alt" /> Reorder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expiring Soon & Recent Sales Grid */}
            <div style={styles.twoColumnGrid}>
              {/* Expiring Soon */}
              <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <FontAwesomeIcon icon="hourglass-half" style={{color: '#e74c3c'}} /> Expiring Soon
                  </h2>
                  <button style={styles.viewAllBtn}>View All</button>
                </div>
                {expiringItems.map(item => (
                  <div key={item.id} style={styles.expiryItem}>
                    <div style={styles.expiryItemLeft}>
                      <span style={styles.expiryDrugName}>
                        <FontAwesomeIcon icon="capsules" style={{color: '#7f8c8d'}} /> {item.name}
                      </span>
                      <span style={styles.expiryQuantity}>
                        <FontAwesomeIcon icon="box" /> {item.quantity} units
                      </span>
                    </div>
                    <div style={styles.expiryItemRight}>
                      <span style={{
                        ...styles.expiryBadge,
                        backgroundColor: item.daysLeft < 10 ? '#e74c3c' : '#f39c12'
                      }}>
                        <FontAwesomeIcon icon="clock" /> {item.daysLeft} days left
                      </span>
                      <span style={styles.expiryDate}>
                        <FontAwesomeIcon icon="calendar-times" /> {item.expiryDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Sales */}
              <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <FontAwesomeIcon icon="chart-line" style={{color: '#27ae60'}} /> Recent Sales
                  </h2>
                  <button style={styles.viewAllBtn}>View All</button>
                </div>
                {recentSales.map(sale => (
                  <div key={sale.id} style={styles.saleItem}>
                    <div style={styles.saleItemLeft}>
                      <span style={styles.saleDrugName}>
                        <FontAwesomeIcon icon="pills" /> {sale.drug}
                      </span>
                      <span style={styles.saleCustomer}>
                        <FontAwesomeIcon icon="user" /> {sale.customer}
                      </span>
                    </div>
                    <div style={styles.saleItemRight}>
                      <span style={styles.saleAmount}>
                        <FontAwesomeIcon icon="coins" /> {formatCurrency(sale.amount)}
                      </span>
                      <span style={styles.saleTime}>
                        <FontAwesomeIcon icon="clock" /> {sale.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'inventory' && (
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <FontAwesomeIcon icon="warehouse" /> Inventory Management
              </h2>
              <button style={styles.primaryBtn} onClick={handleAddDrug}>
                <FontAwesomeIcon icon="plus-circle" /> Add New Drug
              </button>
            </div>
            
            {/* Search Bar inside Inventory */}
            <div style={{marginBottom: '20px'}}>
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Using Drug Table Component */}
            <DrugTable 
              drugs={filteredInventory}
              onEdit={handleEditDrug}
              onDelete={handleDeleteDrug}
              onReorder={handleReorderDrug}
            />
          </div>
        )}

        {activeTab === 'reservations' && (
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
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
                      <FontAwesomeIcon icon="pills" style={{marginRight: '5px', color: '#2ecc71'}} /> {res.drug}
                    </td>
                    <td style={styles.tableCell}>{res.quantity}</td>
                    <td style={styles.tableCell}>
                      <FontAwesomeIcon icon="user" style={{marginRight: '5px', color: '#3498db'}} /> {res.customer}
                    </td>
                    <td style={styles.tableCell}>
                      <FontAwesomeIcon icon="phone" style={{marginRight: '5px', color: '#2ecc71'}} /> {res.phone}
                    </td>
                    <td style={styles.tableCell}>
                      <FontAwesomeIcon icon="clock" style={{marginRight: '5px', color: '#f39c12'}} /> {res.time}
                    </td>
                    <td style={styles.tableCell}>
                      <button 
                        style={styles.confirmBtn}
                        onClick={() => handleConfirmReservation(res)}
                      >
                        <FontAwesomeIcon icon="check-circle" /> Confirm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div style={styles.quickActions}>
          <h3 style={styles.quickActionsTitle}>
            <FontAwesomeIcon icon="bolt" /> Quick Actions
          </h3>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn} onClick={handleAddDrug}>
              <FontAwesomeIcon icon="plus-circle" /> Add New Drug
            </button>
            <button style={styles.actionBtn} onClick={handleProcessSale}>
              <FontAwesomeIcon icon="cash-register" /> Process Sale
            </button>
            <button style={styles.actionBtn} onClick={() => window.print()}>
              <FontAwesomeIcon icon="print" /> Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;