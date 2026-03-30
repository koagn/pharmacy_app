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
    totalCustomers: 89
  };

  // Low stock items
  const lowStockItems = inventory.filter(item => item.quantity < item.threshold);

  // ========== DRUGS DATABASE FOR PHARMACY ==========
  const DRUGS_DATABASE = [
    { name: 'Paracetamol 500mg', category: 'Pain Relief', generic: 'Acetaminophen' },
    { name: 'Ibuprofen 400mg', category: 'Pain Relief', generic: 'Ibuprofen' },
    { name: 'Aspirin 100mg', category: 'Pain Relief', generic: 'Acetylsalicylic Acid' },
    { name: 'Amoxicillin 250mg', category: 'Antibiotics', generic: 'Amoxicillin' },
    { name: 'Azithromycin 500mg', category: 'Antibiotics', generic: 'Azithromycin' },
    { name: 'Ciprofloxacin 500mg', category: 'Antibiotics', generic: 'Ciprofloxacin' },
    { name: 'Metronidazole 500mg', category: 'Antibiotics', generic: 'Metronidazole' },
    { name: 'Doxycycline 100mg', category: 'Antibiotics', generic: 'Doxycycline' },
    { name: 'Vitamin C 1000mg', category: 'Vitamins', generic: 'Ascorbic Acid' },
    { name: 'Vitamin D3 5000IU', category: 'Vitamins', generic: 'Cholecalciferol' },
    { name: 'Vitamin B12 1000mcg', category: 'Vitamins', generic: 'Cyanocobalamin' },
    { name: 'Multivitamin Complex', category: 'Vitamins', generic: 'Multiple' },
    { name: 'Cetirizine 10mg', category: 'Allergy', generic: 'Cetirizine' },
    { name: 'Loratadine 10mg', category: 'Allergy', generic: 'Loratadine' },
    { name: 'Diphenhydramine 25mg', category: 'Allergy', generic: 'Diphenhydramine' },
    { name: 'Metformin 500mg', category: 'Diabetes', generic: 'Metformin' },
    { name: 'Glibenclamide 5mg', category: 'Diabetes', generic: 'Glibenclamide' },
    { name: 'Amlodipine 5mg', category: 'Blood Pressure', generic: 'Amlodipine' },
    { name: 'Lisinopril 10mg', category: 'Blood Pressure', generic: 'Lisinopril' },
    { name: 'Omeprazole 20mg', category: 'Digestive', generic: 'Omeprazole' },
    { name: 'Ranitidine 150mg', category: 'Digestive', generic: 'Ranitidine' },
    { name: 'Domperidone 10mg', category: 'Digestive', generic: 'Domperidone' },
    { name: 'Salbutamol 4mg', category: 'Respiratory', generic: 'Salbutamol' },
    { name: 'Bromhexine 8mg', category: 'Respiratory', generic: 'Bromhexine' },
    { name: 'Prednisolone 5mg', category: 'Anti-inflammatory', generic: 'Prednisolone' },
    { name: 'Dexamethasone 0.5mg', category: 'Anti-inflammatory', generic: 'Dexamethasone' },
    { name: 'Chloroquine 250mg', category: 'Antimalarial', generic: 'Chloroquine' },
    { name: 'Artemisinin 50mg', category: 'Antimalarial', generic: 'Artemisinin' },
    { name: 'ORS Sachets', category: 'Rehydration', generic: 'Oral Rehydration Salt' },
    { name: 'Ferrous Sulfate 200mg', category: 'Supplements', generic: 'Iron Supplement' },
    { name: 'Folic Acid 5mg', category: 'Supplements', generic: 'Folic Acid' },
    { name: 'Zinc Tablets 20mg', category: 'Supplements', generic: 'Zinc' },
    { name: 'Calcium 500mg', category: 'Supplements', generic: 'Calcium Carbonate' },
    { name: 'Melatonin 3mg', category: 'Sleep Aid', generic: 'Melatonin' },
    { name: 'Omega 3 1000mg', category: 'Heart Health', generic: 'Fish Oil' },
    { name: 'Cough Syrup', category: 'Cough & Cold', generic: 'Dextromethorphan' },
    { name: 'Nasal Drops', category: 'Cough & Cold', generic: 'Saline Solution' },
    { name: 'Antacid Tablets', category: 'Digestive', generic: 'Calcium Carbonate' },
    { name: 'Antifungal Cream', category: 'Skin Care', generic: 'Clotrimazole' },
    { name: 'Hydrocortisone Cream', category: 'Skin Care', generic: 'Hydrocortisone' },
    { name: 'Eye Drops', category: 'Eye Care', generic: 'Artificial Tears' },
    { name: 'Ear Drops', category: 'Ear Care', generic: 'Saline Solution' },
    { name: 'Antiseptic Solution', category: 'First Aid', generic: 'Povidone-Iodine' },
    { name: 'Paracetamol Syrup', category: 'Pain Relief', generic: 'Acetaminophen' },
    { name: 'Amoxicillin Syrup', category: 'Antibiotics', generic: 'Amoxicillin' },
    { name: 'ORS for Children', category: 'Rehydration', generic: 'Pediatric ORS' },
    { name: 'Metformin 850mg', category: 'Diabetes', generic: 'Metformin' },
    { name: 'Atorvastatin 20mg', category: 'Heart Health', generic: 'Atorvastatin' },
    { name: 'Losartan 50mg', category: 'Blood Pressure', generic: 'Losartan' },
    { name: 'Pantoprazole 40mg', category: 'Digestive', generic: 'Pantoprazole' },
    { name: 'Levofloxacin 500mg', category: 'Antibiotics', generic: 'Levofloxacin' },
  ];

  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [selectedDrugCategory, setSelectedDrugCategory] = useState('all');
  const [showAddDrugModal, setShowAddDrugModal] = useState(false);
  const [selectedDrugForAdd, setSelectedDrugForAdd] = useState(null);

  const drugCategories = ['all', ...new Set(DRUGS_DATABASE.map(d => d.category))];

  const filteredDrugs = DRUGS_DATABASE.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                        drug.generic.toLowerCase().includes(drugSearchQuery.toLowerCase());
    const matchesCategory = selectedDrugCategory === 'all' || drug.category === selectedDrugCategory;
    return matchesSearch && matchesCategory;
  });

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
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '24px',
      marginBottom: '40px'
    },
    statCard: {
      background: 'white',
      padding: '28px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid rgba(46, 204, 113, 0.08)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },
    statCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(46, 204, 113, 0.15)'
    },
    statIcon: {
      width: '65px',
      height: '65px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.6rem',
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(46, 204, 113, 0.35)',
      flexShrink: 0
    },
    statContent: {
      flex: 1
    },
    statValue: {
      fontSize: '2.4rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      margin: '0 0 4px 0',
      lineHeight: '1.1'
    },
    statLabel: {
      fontSize: '0.95rem',
      color: '#7f8c8d',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontWeight: '500'
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: '28px',
      marginBottom: '40px'
    },
    mainSection: {
      background: 'white',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid rgba(46, 204, 113, 0.08)'
    },
    sidebarSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
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
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid rgba(46, 204, 113, 0.08)'
    },
    quickActionsTitle: {
      fontSize: '1.2rem',
      color: '#2c3e50',
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '600'
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '12px'
    },
    actionButton: {
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      border: 'none',
      padding: '16px 20px',
      borderRadius: '14px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)'
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
          {pharmacy.image_url ? (
            <img src={`http://localhost:5000${pharmacy.image_url}`} alt={pharmacy.name} style={styles.sidebarLogo} />
          ) : (
            <img src={pharmacyLogo} alt="Pharmacy Logo" style={styles.sidebarLogo} />
          )}
          <h3 style={styles.sidebarTitle}>{pharmacy.name}</h3>
        </div>

        <nav style={styles.sidebarNav}>
          {[
            { key: 'overview', icon: 'chart-bar', label: 'Overview' },
            { key: 'drugs', icon: 'pills', label: 'Drugs Database' }
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
            <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #3498db, #2980b9)' }}>
              <FontAwesomeIcon icon="users" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.totalCustomers}</div>
              <div style={styles.statLabel}>
                <FontAwesomeIcon icon="user-plus" /> Total Customers
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
                  <FontAwesomeIcon icon="hospital" /> Drug Availability
                </h3>
              </div>
              <div style={{ ...styles.searchContainer, display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search drug name..."
                  value={drugSearch}
                  onChange={(e) => setDrugSearch(e.target.value)}
                  style={{ ...styles.searchInput, flex: 1 }}
                />
                <button style={styles.actionBtn} onClick={handleDrugAvailabilitySearch}>
                  <FontAwesomeIcon icon="search" /> Search
                </button>
              </div>
              {drugSearch.trim().length > 0 && (
                <div style={{ marginTop: '20px', background: '#f8f9fa', padding: '16px', borderRadius: '12px' }}>
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
                    <p style={{ margin: 0, color: '#7f8c8d' }}>No matching drugs found.</p>
                  )}
                </div>
              )}

              {/* Low Stock Alerts */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ ...styles.sectionTitle, fontSize: '1.2rem', marginBottom: '15px' }}>
                  <FontAwesomeIcon icon="exclamation-circle" style={{ color: '#f39c12' }} /> Low Stock Alerts
                </h3>
                {lowStockItems.length === 0 ? (
                  <p style={{ color: '#27ae60', textAlign: 'center', padding: '20px', background: '#e8f8f0', borderRadius: '12px' }}>
                    <FontAwesomeIcon icon="check-circle" /> All inventory items are well stocked!
                  </p>
                ) : (
                  lowStockItems.slice(0, 5).map(item => (
                    <div key={item.id} style={styles.alertCard}>
                      <FontAwesomeIcon icon="exclamation-triangle" style={styles.alertIcon} />
                      <div style={styles.alertContent}>
                        <div style={styles.alertTitle}>{item.name}</div>
                        <div style={styles.alertText}>
                          Current stock: {item.quantity} | Threshold: {item.threshold}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div style={styles.sidebarSection}>
              {/* Low Stock Summary */}
              <div style={styles.mainSection}>
                <div style={styles.sectionHeader}>
                  <h3 style={{ ...styles.sectionTitle, fontSize: '1.2rem' }}>
                    <FontAwesomeIcon icon="exclamation-circle" style={{ color: '#f39c12' }} /> Low Stock Items
                  </h3>
                </div>
                {lowStockItems.length === 0 ? (
                  <p style={{ color: '#27ae60', textAlign: 'center', padding: '20px' }}>
                    <FontAwesomeIcon icon="check-circle" /> All items well stocked!
                  </p>
                ) : (
                  lowStockItems.slice(0, 5).map(item => (
                    <div key={item.id} style={{ ...styles.alertCard, borderLeftColor: '#f39c12' }}>
                      <FontAwesomeIcon icon="exclamation-triangle" style={{ ...styles.alertIcon, color: '#f39c12' }} />
                      <div style={styles.alertContent}>
                        <div style={styles.alertTitle}>{item.name}</div>
                        <div style={styles.alertText}>
                          Stock: {item.quantity} | Min: {item.threshold}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== DRUGS DATABASE SECTION ===== */}
        {activeSection === 'drugs' && (
          <div>
            <div style={styles.mainSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  <FontAwesomeIcon icon="pills" style={{ color: '#2ecc71' }} /> Drugs Database
                </h2>
                <span style={{ color: '#7f8c8d' }}>{filteredDrugs.length} drugs available</span>
              </div>

              {/* Search and Filter */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Search drugs..."
                    value={drugSearchQuery}
                    onChange={(e) => setDrugSearchQuery(e.target.value)}
                    style={{
                      ...styles.searchInput,
                      flex: 1,
                      minWidth: '200px'
                    }}
                  />
                </div>

                {/* Category Tabs */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {drugCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedDrugCategory(cat)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        background: selectedDrugCategory === cat 
                          ? 'linear-gradient(135deg, #2ecc71, #27ae60)' 
                          : '#f8f9fa',
                        color: selectedDrugCategory === cat ? 'white' : '#7f8c8d',
                        transition: 'all 0.3s'
                      }}
                    >
                      {cat === 'all' ? 'All' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drugs Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px'
              }}>
                {filteredDrugs.map((drug, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDrugForAdd(drug)}
                    style={{
                      background: 'white',
                      borderRadius: '14px',
                      padding: '16px',
                      cursor: 'pointer',
                      border: '2px solid #e9ecef',
                      transition: 'all 0.3s',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2ecc71';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 204, 113, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e9ecef';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      fontSize: '1.3rem'
                    }}>
                      <FontAwesomeIcon icon="pills" style={{ color: '#27ae60' }} />
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '6px',
                      lineHeight: '1.3'
                    }}>
                      {drug.name}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#95a5a6',
                      fontStyle: 'italic',
                      marginBottom: '10px'
                    }}>
                      {drug.generic}
                    </div>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      background: '#e8f5e9',
                      color: '#27ae60',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {drug.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyDashboard;