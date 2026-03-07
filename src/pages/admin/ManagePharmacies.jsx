import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ManagePharmacies = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [pharmacies, setPharmacies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    status: 'active'
  });

  // Check if user is admin - if not, redirect
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/');
    }
  }, [user, navigate]);

  // Load pharmacies
  useEffect(() => {
    const saved = localStorage.getItem('pharmacies');
    if (saved) {
      setPharmacies(JSON.parse(saved));
    } else {
      // Default data
      const defaultData = [
        { id: 1, name: "Pharmacie du Centre", location: "Melen", phone: "677 88 99 00", status: "active" },
        { id: 2, name: "Pharmacie du Soleil", location: "Mvog-Mbi", phone: "699 77 88 11", status: "active" },
        { id: 3, name: "Pharmacie d'Obili", location: "Obili", phone: "655 44 33 22", status: "pending" },
        { id: 4, name: "Pharmacie Emia", location: "Emia", phone: "622 33 44 55", status: "active" },
        { id: 5, name: "Pharmacie d'Oza", location: "Oza", phone: "677 22 33 44", status: "inactive" }
      ];
      setPharmacies(defaultData);
      localStorage.setItem('pharmacies', JSON.stringify(defaultData));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (pharmacies.length > 0) {
      localStorage.setItem('pharmacies', JSON.stringify(pharmacies));
    }
  }, [pharmacies]);

  // Form handlers
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', phone: '', status: 'active' });
    setEditingId(null);
    setShowForm(false);
  };

  // CREATE
  const handleAdd = () => {
    if (!formData.name || !formData.location) {
      alert('Please fill in name and location');
      return;
    }

    const newPharmacy = {
      id: pharmacies.length + 1,
      ...formData
    };

    setPharmacies([...pharmacies, newPharmacy]);
    resetForm();
    alert('✅ Pharmacy added successfully!');
  };

  // UPDATE - Select
  const handleEdit = (pharmacy) => {
    setFormData({
      name: pharmacy.name,
      location: pharmacy.location,
      phone: pharmacy.phone,
      status: pharmacy.status
    });
    setEditingId(pharmacy.id);
    setShowForm(true);
  };

  // UPDATE - Save
  const handleUpdate = () => {
    const updated = pharmacies.map(p => 
      p.id === editingId ? { ...p, ...formData } : p
    );
    
    setPharmacies(updated);
    resetForm();
    alert('✅ Pharmacy updated successfully!');
  };

  // DELETE
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const filtered = pharmacies.filter(p => p.id !== id);
      setPharmacies(filtered);
      alert('✅ Pharmacy deleted successfully!');
    }
  };

  // Toggle status
  const handleToggleStatus = (id) => {
    const updated = pharmacies.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    );
    setPharmacies(updated);
  };

  // If not admin, show nothing while redirecting
  if (!user || user.role !== 'admin') {
    return <div style={{textAlign: 'center', padding: '50px'}}>Redirecting...</div>;
  }

  // Styles
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      color: '#2ecc71',
      margin: 0
    },
    addButton: {
      background: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    form: {
      background: '#f9f9f9',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      border: '1px solid #ddd'
    },
    formTitle: {
      marginTop: 0,
      color: '#333'
    },
    inputGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#555'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px',
      background: 'white'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end'
    },
    saveButton: {
      background: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    cancelButton: {
      background: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    th: {
      background: '#2ecc71',
      color: 'white',
      padding: '12px',
      textAlign: 'left'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    actionBtn: {
      padding: '5px 10px',
      margin: '0 3px',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    editBtn: {
      background: '#f39c12',
      color: 'white'
    },
    deleteBtn: {
      background: '#e74c3c',
      color: 'white'
    },
    toggleBtn: {
      background: '#3498db',
      color: 'white'
    },
    statsBox: {
      marginTop: '20px',
      padding: '15px',
      background: '#f9f9f9',
      borderRadius: '5px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏥 Manage Pharmacies (Admin Only)</h1>
        <button 
          style={styles.addButton}
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? '✕ Close' : '+ Add Pharmacy'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={styles.form}>
          <h3 style={styles.formTitle}>
            {editingId ? '✏️ Edit Pharmacy' : '➕ Add New Pharmacy'}
          </h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Pharmacy Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter pharmacy name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter location"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter phone number"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.cancelButton} onClick={resetForm}>
              Cancel
            </button>
            <button 
              style={styles.saveButton}
              onClick={editingId ? handleUpdate : handleAdd}
            >
              {editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Pharmacies Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.map(p => (
              <tr key={p.id}>
                <td style={styles.td}>{p.id}</td>
                <td style={styles.td}><strong>{p.name}</strong></td>
                <td style={styles.td}>{p.location}</td>
                <td style={styles.td}>{p.phone}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: p.status === 'active' ? '#d4edda' : 
                                   p.status === 'pending' ? '#fff3cd' : '#f8d7da',
                    color: p.status === 'active' ? '#155724' : 
                           p.status === 'pending' ? '#856404' : '#721c24'
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button 
                    style={{...styles.actionBtn, ...styles.editBtn}}
                    onClick={() => handleEdit(p)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    style={{...styles.actionBtn, ...styles.toggleBtn}}
                    onClick={() => handleToggleStatus(p.id)}
                  >
                    {p.status === 'active' ? '🔴 Deactivate' : '🟢 Activate'}
                  </button>
                  <button 
                    style={{...styles.actionBtn, ...styles.deleteBtn}}
                    onClick={() => handleDelete(p.id, p.name)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsBox}>
        <p><strong>📊 Summary:</strong> Total: {pharmacies.length} | Active: {pharmacies.filter(p => p.status === 'active').length} | Pending: {pharmacies.filter(p => p.status === 'pending').length} | Inactive: {pharmacies.filter(p => p.status === 'inactive').length}</p>
      </div>
    </div>
  );
};

export default ManagePharmacies;