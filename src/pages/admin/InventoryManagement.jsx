import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InventoryManagement = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    pharmacyId: '',
    drugName: '',
    category: '',
    quantity: '',
    price: '',
    expiryDate: '',
    threshold: '',
    batchNumber: ''
  });

  // Load data on mount
  useEffect(() => {
    loadPharmacies();
    loadInventory();
  }, []);

  const loadPharmacies = () => {
    const savedPharmacies = localStorage.getItem('pharmacies');
    if (savedPharmacies) {
      setPharmacies(JSON.parse(savedPharmacies));
    }
  };

  const loadInventory = () => {
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      // Default inventory data
      const defaultInventory = [
        { id: 1, pharmacyId: 1, pharmacyName: "Pharmacie du Centre", drugName: "Paracetamol 500mg", category: "Pain Relief", quantity: 150, price: 500, expiryDate: "2024-12-31", threshold: 20, batchNumber: "BATCH001", status: "active" },
        { id: 2, pharmacyId: 1, pharmacyName: "Pharmacie du Centre", drugName: "Amoxicillin 250mg", category: "Antibiotics", quantity: 80, price: 1200, expiryDate: "2024-10-15", threshold: 15, batchNumber: "BATCH002", status: "active" },
        { id: 3, pharmacyId: 2, pharmacyName: "Pharmacie du Soleil", drugName: "Ibuprofen 400mg", category: "Pain Relief", quantity: 45, price: 800, expiryDate: "2024-11-30", threshold: 25, batchNumber: "BATCH003", status: "low" },
        { id: 4, pharmacyId: 2, pharmacyName: "Pharmacie du Soleil", drugName: "Metformin 850mg", category: "Diabetes", quantity: 12, price: 600, expiryDate: "2024-09-20", threshold: 10, batchNumber: "BATCH004", status: "critical" },
        { id: 5, pharmacyId: 3, pharmacyName: "Pharmacie d'Obili", drugName: "Omeprazole 20mg", category: "Gastric", quantity: 90, price: 750, expiryDate: "2024-08-15", threshold: 20, batchNumber: "BATCH005", status: "active" },
        { id: 6, pharmacyId: 3, pharmacyName: "Pharmacie d'Obili", drugName: "Aspirin 100mg", category: "Pain Relief", quantity: 200, price: 300, expiryDate: "2024-05-15", threshold: 30, batchNumber: "BATCH006", status: "active" },
        { id: 7, pharmacyId: 4, pharmacyName: "Pharmacie Emia", drugName: "Vitamin C 1000mg", category: "Vitamins", quantity: 65, price: 1500, expiryDate: "2024-05-30", threshold: 25, batchNumber: "BATCH007", status: "active" },
        { id: 8, pharmacyId: 4, pharmacyName: "Pharmacie Emia", drugName: "Cetirizine 10mg", category: "Allergy", quantity: 8, price: 450, expiryDate: "2024-04-20", threshold: 20, batchNumber: "BATCH008", status: "low" }
      ];
      setInventory(defaultInventory);
      localStorage.setItem('inventory', JSON.stringify(defaultInventory));
    }
  };

  // Filter inventory based on pharmacy and search
  const filteredInventory = inventory.filter(item => {
    const matchesPharmacy = selectedPharmacy === 'all' || item.pharmacyId === parseInt(selectedPharmacy);
    const matchesSearch = item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPharmacy && matchesSearch;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle add new inventory item
  const handleAddItem = () => {
    const selectedPharmacyObj = pharmacies.find(p => p.id === parseInt(formData.pharmacyId));
    
    const newItem = {
      id: inventory.length + 1,
      ...formData,
      pharmacyName: selectedPharmacyObj?.name || 'Unknown',
      status: formData.quantity < formData.threshold ? 'low' : 'active',
      quantity: parseInt(formData.quantity),
      price: parseInt(formData.price),
      threshold: parseInt(formData.threshold)
    };

    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    
    // Reset form
    setFormData({
      pharmacyId: '',
      drugName: '',
      category: '',
      quantity: '',
      price: '',
      expiryDate: '',
      threshold: '',
      batchNumber: ''
    });
    setShowAddForm(false);
    alert('Item added successfully!');
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      pharmacyId: item.pharmacyId,
      drugName: item.drugName,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      expiryDate: item.expiryDate,
      threshold: item.threshold,
      batchNumber: item.batchNumber
    });
    setShowAddForm(true);
  };

  // Handle update item
  const handleUpdateItem = () => {
    const selectedPharmacyObj = pharmacies.find(p => p.id === parseInt(formData.pharmacyId));
    
    const updatedInventory = inventory.map(item => 
      item.id === editingItem.id ? {
        ...item,
        ...formData,
        pharmacyName: selectedPharmacyObj?.name || item.pharmacyName,
        status: formData.quantity < formData.threshold ? 'low' : 'active',
        quantity: parseInt(formData.quantity),
        price: parseInt(formData.price),
        threshold: parseInt(formData.threshold)
      } : item
    );

    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    
    // Reset
    setEditingItem(null);
    setFormData({
      pharmacyId: '',
      drugName: '',
      category: '',
      quantity: '',
      price: '',
      expiryDate: '',
      threshold: '',
      batchNumber: ''
    });
    setShowAddForm(false);
    alert('Item updated successfully!');
  };

  // Handle delete item
  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedInventory = inventory.filter(item => item.id !== id);
      setInventory(updatedInventory);
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      alert('Item deleted successfully!');
    }
  };

  // Handle bulk action
  const handleBulkAction = (action) => {
    if (action === 'export') {
      // Export to CSV
      const csv = [
        ['ID', 'Pharmacy', 'Drug Name', 'Category', 'Quantity', 'Price', 'Expiry Date', 'Threshold', 'Batch Number'],
        ...filteredInventory.map(item => [
          item.id, item.pharmacyName, item.drugName, item.category, 
          item.quantity, item.price, item.expiryDate, item.threshold, item.batchNumber
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory.csv';
      a.click();
    } else if (action === 'lowstock') {
      setSearchTerm('');
      setSelectedPharmacy('all');
      // Filter to show only low stock items
      const lowStockItems = inventory.filter(item => item.quantity < item.threshold);
      alert(`Found ${lowStockItems.length} items with low stock`);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f0fe 100%)',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      margin: 0
    },
    addButton: {
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    filtersContainer: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    searchInput: {
      flex: 2,
      padding: '12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      minWidth: '250px'
    },
    select: {
      flex: 1,
      padding: '12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      minWidth: '200px'
    },
    actionButton: {
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: '500'
    },
    formContainer: {
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      marginBottom: '30px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    formTitle: {
      fontSize: '1.5rem',
      color: '#2c3e50',
      marginBottom: '20px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    label: {
      fontSize: '0.9rem',
      color: '#7f8c8d',
      fontWeight: '500'
    },
    input: {
      padding: '10px',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      fontSize: '1rem'
    },
    formButtons: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'flex-end'
    },
    submitButton: {
      background: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    cancelButton: {
      background: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    tableContainer: {
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #2ecc71',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#2c3e50'
    },
    td: {
      padding: '15px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '0.95rem'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: '500',
      display: 'inline-block'
    },
    editBtn: {
      background: '#f39c12',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '5px',
      fontSize: '0.85rem'
    },
    deleteBtn: {
      background: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.85rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#2ecc71',
      marginBottom: '5px'
    },
    statLabel: {
      color: '#7f8c8d',
      fontSize: '0.9rem'
    }
  };

  // Calculate stats
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockItems = inventory.filter(item => item.quantity < item.threshold).length;
  const expiringSoon = inventory.filter(item => {
    const daysLeft = Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft < 30 && daysLeft > 0;
  }).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Inventory Management</h1>
        <button style={styles.addButton} onClick={() => {
          setEditingItem(null);
          setFormData({
            pharmacyId: '',
            drugName: '',
            category: '',
            quantity: '',
            price: '',
            expiryDate: '',
            threshold: '',
            batchNumber: ''
          });
          setShowAddForm(!showAddForm);
        }}>
          {showAddForm ? '✕ Close' : '+ Add New Item'}
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalItems}</div>
          <div style={styles.statLabel}>Total Items</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{lowStockItems}</div>
          <div style={styles.statLabel}>Low Stock Items</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{expiringSoon}</div>
          <div style={styles.statLabel}>Expiring Soon</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalValue.toLocaleString()} FCFA</div>
          <div style={styles.statLabel}>Total Value</div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>
            {editingItem ? '✏️ Edit Inventory Item' : '➕ Add New Inventory Item'}
          </h2>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pharmacy *</label>
              <select
                name="pharmacyId"
                value={formData.pharmacyId}
                onChange={handleInputChange}
                style={styles.input}
                required
              >
                <option value="">Select Pharmacy</option>
                {pharmacies.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Drug Name *</label>
              <input
                type="text"
                name="drugName"
                value={formData.drugName}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="e.g., Paracetamol 500mg"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={styles.input}
                required
              >
                <option value="">Select Category</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Gastric">Gastric</option>
                <option value="Vitamins">Vitamins</option>
                <option value="Allergy">Allergy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price (FCFA) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Low Stock Threshold *</label>
              <input
                type="number"
                name="threshold"
                value={formData.threshold}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="20"
                min="1"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Batch Number *</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="e.g., BATCH001"
                required
              />
            </div>
          </div>

          <div style={styles.formButtons}>
            <button 
              style={styles.cancelButton}
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
              }}
            >
              Cancel
            </button>
            <button 
              style={styles.submitButton}
              onClick={editingItem ? handleUpdateItem : handleAddItem}
            >
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <input
          type="text"
          placeholder="🔍 Search by drug name, category, or batch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        
        <select
          value={selectedPharmacy}
          onChange={(e) => setSelectedPharmacy(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Pharmacies</option>
          {pharmacies.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <button 
          style={{...styles.actionButton, background: '#3498db', color: 'white'}}
          onClick={() => handleBulkAction('export')}
        >
           Export CSV
        </button>
        
        <button 
          style={{...styles.actionButton, background: '#e74c3c', color: 'white'}}
          onClick={() => handleBulkAction('lowstock')}
        >
           Low Stock
        </button>
      </div>

      {/* Inventory Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Pharmacy</th>
              <th style={styles.th}>Drug Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Expiry Date</th>
              <th style={styles.th}>Batch</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => {
              const daysLeft = Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
              const isLowStock = item.quantity < item.threshold;
              const isExpiringSoon = daysLeft < 30 && daysLeft > 0;
              
              let statusColor = '#2ecc71';
              let statusText = 'In Stock';
              
              if (isLowStock) {
                statusColor = '#e74c3c';
                statusText = 'Low Stock';
              } else if (isExpiringSoon) {
                statusColor = '#f39c12';
                statusText = 'Expiring Soon';
              }

              return (
                <tr key={item.id}>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>{item.pharmacyName}</td>
                  <td style={styles.td}>{item.drugName}</td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={{...styles.td, fontWeight: 'bold', color: isLowStock ? '#e74c3c' : '#2c3e50'}}>
                    {item.quantity}
                  </td>
                  <td style={styles.td}>{item.price.toLocaleString()} FCFA</td>
                  <td style={{...styles.td, color: isExpiringSoon ? '#f39c12' : '#2c3e50'}}>
                    {item.expiryDate} {isExpiringSoon && ''}
                  </td>
                  <td style={styles.td}>{item.batchNumber}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: statusColor + '20',
                      color: statusColor
                    }}>
                      {statusText}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button 
                      style={styles.editBtn}
                      onClick={() => handleEditItem(item)}
                    >
                      Edit
                    </button>
                    <button 
                      style={styles.deleteBtn}
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredInventory.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px', color: '#7f8c8d'}}>
            No inventory items found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;