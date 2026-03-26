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
      background: 'radial-gradient(circle at top, rgba(255,255,255,0.6), rgba(255,255,255,0)), linear-gradient(135deg, #3a8dff 0%, #0fccb5 100%)',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      color: '#1b1f3b'
    },
    header: {
      background: 'rgba(255,255,255,0.92)',
      padding: '30px',
      borderRadius: '15px',
      marginBottom: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.5)',
      backdropFilter: 'blur(10px)'
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
      background: 'rgba(255,255,255,0.95)',
      padding: '25px',
      borderRadius: '18px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      border: '1px solid rgba(0,0,0,0.08)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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
      border: '1px solid rgba(255,255,255,0.55)',
      background: 'rgba(255,255,255,0.4)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      flex: 1,
      minWidth: '120px',
      transition: 'transform 0.2s ease, background 0.2s ease',
      color: '#1b1f3b',
      backdropFilter: 'blur(4px)'
    },
    activeTab: {
      background: 'rgba(255,255,255,0.9)',
      color: '#2c3e50',
      boxShadow: '0 10px 25px rgba(0,0,0,0.12)'
    },
    sectionCard: {
      background: 'rgba(255,255,255,0.85)',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '20px',
      boxShadow: '0 12px 25px rgba(0,0,0,0.08)',
      border: '1px solid rgba(255,255,255,0.55)',
      backdropFilter: 'blur(8px)'
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
        <div
        style={styles.statCard}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 18px 35px rgba(0,0,0,0.18)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)'; }}
      >
        <div style={styles.statIcon}></div>
        <div>
          <div style={styles.statValue}>{stats.totalPharmacies}</div>
          <div style={styles.statLabel}>Total Pharmacies</div>
        </div>
      </div>
        <div
          style={styles.statCard}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 18px 35px rgba(0,0,0,0.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)'; }}
        >
          <div style={styles.statIcon}></div>
          <div>
            <div style={styles.statValue}>{stats.totalUsers}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
        </div>
        <div
          style={styles.statCard}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 18px 35px rgba(0,0,0,0.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)'; }}
        >
          <div style={styles.statIcon}></div>
          <div>
            <div style={styles.statValue}>{stats.totalDrugs}</div>
            <div style={styles.statLabel}>Total Drugs</div>
          </div>
        </div>
        <div
          style={styles.statCard}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 18px 35px rgba(0,0,0,0.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)'; }}
        >
          <div style={styles.statIcon}></div>
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
             Manage Pharmacies
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/admin/users')}>
            👥 Manage Users
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/admin/inventory')}>
             Manage Inventory
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/admin/reports')}>
             View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;