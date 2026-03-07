import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for admin
  const stats = {
    totalPharmacies: 25,
    totalUsers: 1240,
    totalDrugs: 3450,
    pendingApprovals: 3,
    todaySales: 1250000,
    activePharmacists: 48
  };

  const pendingApprovals = [
    { id: 1, name: "Pharmacie d'Obili", manager: 'Dr. Claire Essomba', requestDate: '2024-02-01' },
    { id: 2, name: 'Pharmacie Mvog-Mbi', manager: 'Dr. Martine Obama', requestDate: '2024-02-03' }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      marginBottom: '30px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    headerTitle: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      margin: '0 0 10px 0'
    },
    headerSubtitle: {
      fontSize: '1.1rem',
      color: '#7f8c8d',
      margin: 0
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    statIcon: {
      fontSize: '2.5rem',
      background: '#f0f0f0',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statValue: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#2c3e50'
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#7f8c8d'
    },
    tabsContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      background: 'white',
      padding: '10px',
      borderRadius: '10px',
      flexWrap: 'wrap'
    },
    tab: {
      padding: '12px 20px',
      border: 'none',
      background: 'transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      flex: 1,
      minWidth: '100px'
    },
    activeTab: {
      background: '#667eea',
      color: 'white'
    },
    sectionCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: '#2c3e50',
      margin: '0 0 20px 0'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      textAlign: 'left',
      padding: '12px',
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #667eea'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: '500'
    },
    approveBtn: {
      background: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '5px'
    },
    rejectBtn: {
      background: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginTop: '20px'
    },
    actionBtn: {
      background: 'white',
      border: '2px solid #667eea',
      color: '#667eea',
      padding: '15px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <p style={styles.headerSubtitle}>Welcome back, {user?.name || 'Admin'}! Manage pharmacies, users, and system settings</p>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏥</div>
          <div>
            <div style={styles.statValue}>{stats.totalPharmacies}</div>
            <div style={styles.statLabel}>Total Pharmacies</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <div style={styles.statValue}>{stats.totalUsers}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💊</div>
          <div>
            <div style={styles.statValue}>{stats.totalDrugs}</div>
            <div style={styles.statLabel}>Total Drugs</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div>
            <div style={styles.statValue}>{stats.pendingApprovals}</div>
            <div style={styles.statLabel}>Pending Approvals</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabsContainer}>
        <button 
          style={{...styles.tab, ...(activeTab === 'overview' && styles.activeTab)}}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'pharmacies' && styles.activeTab)}}
          onClick={() => {
            setActiveTab('pharmacies');
            navigate('/admin/pharmacies');
          }}
        >
          Pharmacies
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'users' && styles.activeTab)}}
          onClick={() => {
            setActiveTab('users');
            navigate('/admin/users');
          }}
        >
          Users
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'inventory' && styles.activeTab)}}
          onClick={() => {
            setActiveTab('inventory');
            navigate('/admin/inventory');
          }}
        >
          Inventory
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'reports' && styles.activeTab)}}
          onClick={() => {
            setActiveTab('reports');
            navigate('/admin/reports');
          }}
        >
          Reports
        </button>
      </div>

      {/* Content - Only show overview when on dashboard */}
      {activeTab === 'overview' && (
        <>
          {/* Pending Approvals */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionTitle}>⏳ Pending Pharmacy Approvals</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Pharmacy Name</th>
                  <th style={styles.tableHeader}>Manager</th>
                  <th style={styles.tableHeader}>Request Date</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map(item => (
                  <tr key={item.id}>
                    <td style={styles.tableCell}>{item.name}</td>
                    <td style={styles.tableCell}>{item.manager}</td>
                    <td style={styles.tableCell}>{item.requestDate}</td>
                    <td style={styles.tableCell}>
                      <button style={styles.approveBtn}>✓ Approve</button>
                      <button style={styles.rejectBtn}>✗ Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Quick Actions - ALWAYS VISIBLE */}
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionButtons}>
          <button style={styles.actionBtn} onClick={() => navigate('/admin/pharmacies')}>
            🏥 Manage Pharmacies
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/admin/users')}>
            👥 Manage Users
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/admin/inventory')}>
            📦 Manage Inventory
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/admin/reports')}>
            📊 View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;