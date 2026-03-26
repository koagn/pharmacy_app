import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const styles = {
    footer: {
      background: 'linear-gradient(135deg, #2c3e50, #34495e)',
      color: 'white',
      padding: '40px 0 20px',
      marginTop: 'auto',
      fontFamily: 'Arial, sans-serif'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px'
    },
    section: {
      marginBottom: '20px'
    },
    title: {
      fontSize: '1.2rem',
      marginBottom: '15px',
      color: '#2ecc71'
    },
    link: {
      display: 'block',
      color: '#ecf0f1',
      textDecoration: 'none',
      marginBottom: '8px',
      fontSize: '0.9rem',
      transition: 'color 0.3s ease',
      cursor: 'pointer'
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px',
      fontSize: '0.9rem',
      color: '#ecf0f1'
    },
    copyright: {
      textAlign: 'center',
      paddingTop: '20px',
      marginTop: '20px',
      borderTop: '1px solid #46637f',
      fontSize: '0.85rem',
      color: '#bdc3c7'
    },
    socialLinks: {
      display: 'flex',
      gap: '15px',
      marginTop: '10px'
    },
    socialIcon: {
      fontSize: '1.2rem',
      cursor: 'pointer',
      color: '#ecf0f1',
      transition: 'color 0.3s ease'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* About Section */}
        <div style={styles.section}>
          <h3 style={styles.title}>Smart Pharmacy Locator</h3>
          <p style={{ color: '#ecf0f1', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Your trusted platform for finding medicines and locating nearby pharmacies. 
            We help you save time and get the medication you need, when you need it.
          </p>
          
        </div>

        {/* Quick Links */}
        <div style={styles.section}>
          <h3 style={styles.title}>Quick Links</h3>
          <a href="/" style={styles.link}>Home</a>
          <a href="/pharmacies" style={styles.link}>Find Pharmacies</a>
          <a href="/about" style={styles.link}>About Us</a>
          <a href="/contact" style={styles.link}>Contact</a>
          <a href="/faq" style={styles.link}>FAQ</a>
        </div>

        {/* For Pharmacists */}
        <div style={styles.section}>
          <h3 style={styles.title}>For Pharmacists</h3>
          <a href="/pharmacy/login" style={styles.link}>Pharmacist Login</a>
          <a href="/pharmacy/register" style={styles.link}>Register Your Pharmacy</a>
          <a href="/pharmacy/dashboard" style={styles.link}>Dashboard</a>
          <a href="/pharmacy/support" style={styles.link}>Support</a>
        </div>

        {/* Contact Info */}
        <div style={styles.section}>
          <h3 style={styles.title}>Contact Us</h3>
          <div style={styles.contactItem}>
            <span></span>
            <span>Yaoundé, Cameroon</span>
          </div>
          <div style={styles.contactItem}>
            <span></span>
            <span>+237 6 70 83 40 19</span>
          </div>
          <div style={styles.contactItem}>
            <span></span>
            <span>lilianmartin810@gmail.com</span>
          </div>
          <div style={styles.contactItem}>
            <span></span>
            <span>Mon - Fri: 8:00 - 18:00</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={styles.copyright}>
        <p>© {currentYear} Smart Pharmacy Locator. All rights reserved.</p>
        <p style={{ marginTop: '5px', fontSize: '0.8rem' }}>
          Lilian tech - 2026
        </p>
      </div>
    </footer>
  );
};

export default Footer;