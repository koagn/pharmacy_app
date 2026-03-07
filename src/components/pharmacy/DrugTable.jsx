import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DrugTable = ({ drugs, onEdit, onDelete, onReorder }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterCategory, setFilterCategory] = useState('all');

  // Get unique categories for filter
  const categories = ['all', ...new Set(drugs.map(drug => drug.category))];

  // Sort and filter drugs
  const processedDrugs = drugs
    .filter(drug => filterCategory === 'all' || drug.category === filterCategory)
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getStatusColor = (quantity, threshold) => {
    if (quantity === 0) return '#e74c3c'; // Red - Out of stock
    if (quantity < threshold) return '#f39c12'; // Orange - Low stock
    return '#2ecc71'; // Green - In stock
  };

  const getStatusText = (quantity, threshold) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < threshold) return 'Low Stock';
    return 'In Stock';
  };

  const styles = {
    container: {
      background: 'white',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '15px'
    },
    title: {
      fontSize: '1.3rem',
      color: '#2c3e50',
      margin: 0
    },
    filterContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    filterLabel: {
      fontSize: '0.9rem',
      color: '#7f8c8d'
    },
    filterSelect: {
      padding: '8px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      fontSize: '0.9rem',
      cursor: 'pointer'
    },
    tableContainer: {
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #2ecc71',
      color: '#2c3e50',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      userSelect: 'none'
    },
    thContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    sortIcon: {
      fontSize: '0.8rem',
      color: '#7f8c8d'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '0.95rem'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: '500',
      display: 'inline-block'
    },
    actions: {
      display: 'flex',
      gap: '5px',
      flexWrap: 'wrap'
    },
    actionBtn: {
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      transition: 'opacity 0.3s ease'
    },
    editBtn: {
      background: '#f39c12',
      color: 'white'
    },
    deleteBtn: {
      background: '#e74c3c',
      color: 'white'
    },
    reorderBtn: {
      background: '#3498db',
      color: 'white'
    },
    stockIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    stockDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      display: 'inline-block'
    },
    footer: {
      marginTop: '20px',
      padding: '15px',
      background: '#f8f9fa',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px'
    },
    stats: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    },
    statItem: {
      fontSize: '0.9rem',
      color: '#2c3e50'
    },
    statValue: {
      fontWeight: 'bold',
      color: '#2ecc71',
      marginLeft: '5px'
    },
    pagination: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    pageBtn: {
      padding: '5px 10px',
      border: '1px solid #e0e0e0',
      background: 'white',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

  // Calculate stats
  const totalDrugs = drugs.length;
  const totalValue = drugs.reduce((sum, drug) => sum + (drug.quantity * drug.price), 0);
  const lowStockCount = drugs.filter(drug => drug.quantity < drug.threshold).length;
  const outOfStockCount = drugs.filter(drug => drug.quantity === 0).length;

  return (
    <div style={styles.container}>
      {/* Header with Filters */}
      <div style={styles.header}>
        <h3 style={styles.title}>Drug Inventory</h3>
        
        <div style={styles.filterContainer}>
          <span style={styles.filterLabel}>Filter by Category:</span>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={styles.filterSelect}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => requestSort('name')}>
                <div style={styles.thContent}>
                  Drug Name
                  {sortConfig.key === 'name' && (
                    <span style={styles.sortIcon}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th style={styles.th} onClick={() => requestSort('category')}>
                <div style={styles.thContent}>
                  Category
                  {sortConfig.key === 'category' && (
                    <span style={styles.sortIcon}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th style={styles.th} onClick={() => requestSort('quantity')}>
                <div style={styles.thContent}>
                  Stock
                  {sortConfig.key === 'quantity' && (
                    <span style={styles.sortIcon}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th style={styles.th} onClick={() => requestSort('price')}>
                <div style={styles.thContent}>
                  Price
                  {sortConfig.key === 'price' && (
                    <span style={styles.sortIcon}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th style={styles.th} onClick={() => requestSort('expiryDate')}>
                <div style={styles.thContent}>
                  Expiry Date
                  {sortConfig.key === 'expiryDate' && (
                    <span style={styles.sortIcon}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedDrugs.map(drug => (
              <tr key={drug.id}>
                <td style={styles.td}>
                  <strong>{drug.name}</strong>
                  {drug.genericName && (
                    <div style={{fontSize: '0.8rem', color: '#7f8c8d'}}>
                      {drug.genericName}
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  <span style={{
                    background: '#f0f0f0',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                  }}>
                    {drug.category}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.stockIndicator}>
                    <span style={{
                      ...styles.stockDot,
                      backgroundColor: getStatusColor(drug.quantity, drug.threshold)
                    }} />
                    <span style={{
                      color: getStatusColor(drug.quantity, drug.threshold),
                      fontWeight: 'bold'
                    }}>
                      {drug.quantity}
                    </span>
                    <span style={{fontSize: '0.8rem', color: '#7f8c8d'}}>
                      / {drug.threshold}
                    </span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{fontWeight: 'bold'}}>
                    {drug.price.toLocaleString()} FCFA
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    color: new Date(drug.expiryDate) < new Date() ? '#e74c3c' : '#2c3e50'
                  }}>
                    {drug.expiryDate}
                    {new Date(drug.expiryDate) < new Date() && ' ⚠️'}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(drug.quantity, drug.threshold) + '20',
                    color: getStatusColor(drug.quantity, drug.threshold)
                  }}>
                    {getStatusText(drug.quantity, drug.threshold)}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    {onEdit && (
                      <button 
                        style={{...styles.actionBtn, ...styles.editBtn}}
                        onClick={() => onEdit(drug)}
                      >
                        Edit
                      </button>
                    )}
                    {onReorder && (
                      <button 
                        style={{...styles.actionBtn, ...styles.reorderBtn}}
                        onClick={() => onReorder(drug)}
                      >
                        Reorder
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                        onClick={() => onDelete(drug.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {processedDrugs.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px', color: '#7f8c8d'}}>
            No drugs found in inventory.
          </div>
        )}
      </div>

      {/* Footer with Stats */}
      <div style={styles.footer}>
        <div style={styles.stats}>
          <span style={styles.statItem}>
            Total Items: <span style={styles.statValue}>{totalDrugs}</span>
          </span>
          <span style={styles.statItem}>
            Total Value: <span style={styles.statValue}>{totalValue.toLocaleString()} FCFA</span>
          </span>
          <span style={styles.statItem}>
            Low Stock: <span style={{...styles.statValue, color: '#f39c12'}}>{lowStockCount}</span>
          </span>
          <span style={styles.statItem}>
            Out of Stock: <span style={{...styles.statValue, color: '#e74c3c'}}>{outOfStockCount}</span>
          </span>
        </div>
        
        <div style={styles.pagination}>
          <span style={{color: '#7f8c8d'}}>
            Showing {processedDrugs.length} of {drugs.length} items
          </span>
        </div>
      </div>
    </div>
  );
};

export default DrugTable;