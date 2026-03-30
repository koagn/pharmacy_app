import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ac1 from '../../image_logo/ac1.png';
import ac2 from '../../image_logo/ac2.png';
import ac3 from '../../image_logo/ac3.png';
import ac4 from '../../image_logo/ac4.png';
import ac5 from '../../image_logo/ac5.png';
import ac6 from '../../image_logo/ac6.png';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 1500);
  };

  const openPostDetail = (post) => {
    setSelectedPost(post);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    },
    hero: {
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      padding: '80px 20px',
      textAlign: 'center'
    },
    heroTitle: {
      fontSize: '3rem',
      marginBottom: '20px',
      fontWeight: 'bold'
    },
    heroSubtitle: {
      fontSize: '1.3rem',
      marginBottom: '40px',
      opacity: 0.9
    },
    heroButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    button: {
      padding: '15px 30px',
      fontSize: '1.1rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s ease'
    },
    primaryButton: {
      background: 'white',
      color: '#2ecc71'
    },
    secondaryButton: {
      background: 'transparent',
      color: 'white',
      border: '2px solid white'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 20px'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '50px',
      fontWeight: 'bold'
    },
    blogGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '30px'
    },
    blogCard: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, boxShadow 0.3s ease',
      cursor: 'pointer'
    },
    blogImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    blogContent: {
      padding: '20px'
    },
    blogTitle: {
      fontSize: '1.4rem',
      color: '#2c3e50',
      marginBottom: '10px',
      fontWeight: 'bold'
    },
    blogText: {
      color: '#7f8c8d',
      lineHeight: '1.6'
    },
    cardButton: {
      marginTop: '15px',
      padding: '10px 14px',
      border: 'none',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: 'white',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'transform 0.2s ease',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      maxWidth: '700px',
      width: '100%',
      maxHeight: '80vh',
      overflow: 'auto',
      padding: '30px',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '2rem',
      cursor: 'pointer',
      color: '#7f8c8d',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalImage: {
      width: '100%',
      height: '300px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    modalTitle: {
      fontSize: '2rem',
      color: '#2c3e50',
      marginBottom: '15px',
      fontWeight: 'bold'
    },
    modalText: {
      color: '#555',
      lineHeight: '1.8',
      fontSize: '1.1rem'
    },
    modalInfo: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '20px'
    },
    infoTitle: {
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '10px'
    },
    infoText: {
      color: '#666',
      lineHeight: '1.6'
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      marginTop: '60px'
    },
    featureCard: {
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease'
    },
    featureIcon: {
      fontSize: '3rem',
      marginBottom: '15px'
    },
    featureTitle: {
      fontSize: '1.3rem',
      color: '#2c3e50',
      marginBottom: '10px',
      fontWeight: 'bold'
    },
    featureText: {
      color: '#7f8c8d',
      lineHeight: '1.6'
    },
    footer: {
      background: '#2c3e50',
      color: 'white',
      textAlign: 'center',
      padding: '40px 20px',
      marginTop: '60px'
    },
    footerTitle: {
      fontSize: '1.5rem',
      marginBottom: '10px'
    },
    footerText: {
      opacity: 0.8,
      lineHeight: '1.6'
    }
  };

  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Generic vs Brand-Name Medications',
      excerpt: 'Learn the key differences between generic and brand-name drugs, and why both are equally effective.',
      content: 'Generic medications contain the same active ingredients as their brand-name counterparts and are equally safe and effective. The main differences are price, appearance, and inactive ingredients. Generic drugs go through rigorous FDA approval process to ensure they meet the same standards as brand-name medications.',
      image: ac1,
      category: 'Education',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'How to Properly Store Your Medications',
      excerpt: 'Proper storage is crucial for maintaining medication effectiveness and safety.',
      content: 'Most medications should be stored in a cool, dry place away from direct sunlight. Avoid storing medications in bathrooms or kitchens where humidity is high. Always keep medications in their original containers and out of reach of children and pets.',
      image: ac2,
      category: 'Health Tips',
      readTime: '4 min read'
    },
    {
      id: 3,
      title: 'The Importance of Medication Adherence',
      excerpt: 'Why taking your medications as prescribed is essential for your health.',
      content: 'Medication adherence means taking your medications exactly as prescribed by your healthcare provider. Skipping doses or stopping early can reduce effectiveness and potentially worsen your condition. Set reminders and use pill organizers to help you stay on track.',
      image: ac3,
      category: 'Health Tips',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Common Drug Interactions to Avoid',
      excerpt: 'Understanding how different medications can interact and affect each other.',
      content: 'Some medications can interact with each other, with food, or with alcohol. These interactions can either increase or decrease the effectiveness of your medications, or cause unexpected side effects. Always inform your pharmacist about all medications you are taking.',
      image: ac4,
      category: 'Safety',
      readTime: '7 min read'
    },
    {
      id: 5,
      title: 'Managing Chronic Conditions with Daily Medication',
      excerpt: 'Tips for living well while managing chronic health conditions.',
      content: 'Living with a chronic condition requires ongoing management and a strong partnership with your healthcare team. Take your medications consistently, attend regular check-ups, and don\'t hesitate to discuss any concerns or side effects with your doctor or pharmacist.',
      image: ac5,
      category: 'Chronic Care',
      readTime: '8 min read'
    },
    {
      id: 6,
      title: 'The Role of Pharmacists in Healthcare',
      excerpt: 'Discover how pharmacists are more than just medication dispensers.',
      content: 'Pharmacists are highly trained healthcare professionals who play a crucial role in your health. They can answer questions about medications, check for interactions, provide immunizations, and offer valuable health advice. Don\'t hesitate to ask your pharmacist for guidance.',
      image: ac6,
      category: 'Healthcare',
      readTime: '5 min read'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}><FontAwesomeIcon icon="prescription-bottle-alt" /> Welcome to PharmaLocator</h1>
        <p style={styles.heroSubtitle}>
          Your trusted platform for finding medicines and pharmacies in Cameroon
        </p>
        <div style={styles.heroButtons}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => handleNavigation('/pharmacies')}
          >
            <FontAwesomeIcon icon="hospital" /> Find Pharmacies
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => handleNavigation('/login')}
          >
            <FontAwesomeIcon icon="user-md" /> Pharmacist Login
          </button>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div style={styles.content}>
        <h2 style={styles.sectionTitle}><FontAwesomeIcon icon="book-medical" /> Health Encyclopedia</h2>
        
        <div style={styles.blogGrid}>
          {blogPosts.map(post => (
            <div 
              key={post.id}
              style={styles.blogCard}
              onClick={() => openPostDetail(post)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
              <img src={post.image} alt={post.title} style={styles.blogImage} />
              <div style={styles.blogContent}>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: '#e8f5e9',
                  color: '#27ae60',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  marginBottom: '10px',
                  fontWeight: '600'
                }}>
                  {post.category}
                </div>
                <h3 style={styles.blogTitle}>{post.title}</h3>
                <p style={styles.blogText}>{post.excerpt}</p>
                <button style={styles.cardButton}>
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div style={styles.features}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}><FontAwesomeIcon icon="search" style={{ color: '#2ecc71' }} /></div>
            <h3 style={styles.featureTitle}>Find Medicines</h3>
            <p style={styles.featureText}>
              Search for available medicines across pharmacies in Yaoundé
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}><FontAwesomeIcon icon="hospital" style={{ color: '#3498db' }} /></div>
            <h3 style={styles.featureTitle}>Locate Pharmacies</h3>
            <p style={styles.featureText}>
              Find pharmacies near you with their contact information
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}><FontAwesomeIcon icon="clock" style={{ color: '#e74c3c' }} /></div>
            <h3 style={styles.featureTitle}>24/7 Pharmacies</h3>
            <p style={styles.featureText}>
              Find on-duty pharmacies available at any time
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}><FontAwesomeIcon icon="mobile-alt" style={{ color: '#9b59b6' }} /></div>
            <h3 style={styles.featureTitle}>Easy Access</h3>
            <p style={styles.featureText}>
              Access pharmacy information from anywhere, anytime
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <h3 style={styles.footerTitle}><FontAwesomeIcon icon="map-marker-alt" /> PharmaLocator Cameroon</h3>
        <p style={styles.footerText}>
          Helping you find medicines and pharmacies across Cameroon
        </p>
        <p style={{ marginTop: '20px', opacity: 0.6 }}>
          © 2024 PharmaLocator. All rights reserved.
        </p>
      </div>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div style={styles.modalOverlay} onClick={closePostDetail}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={closePostDetail}>×</button>
            <img src={selectedPost.image} alt={selectedPost.title} style={styles.modalImage} />
            <div style={{ 
              display: 'inline-block',
              padding: '6px 14px',
              background: '#e8f5e9',
              color: '#27ae60',
              borderRadius: '15px',
              fontSize: '0.85rem',
              marginBottom: '15px',
              fontWeight: '600'
            }}>
              {selectedPost.category}
            </div>
            <h2 style={styles.modalTitle}>{selectedPost.title}</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
              <FontAwesomeIcon icon="book-open" /> {selectedPost.readTime}
            </p>
            <p style={styles.modalText}>{selectedPost.content}</p>
            <div style={styles.modalInfo}>
              <h4 style={styles.infoTitle}><FontAwesomeIcon icon="lightbulb" /> Key Takeaway</h4>
              <p style={styles.infoText}>
                Always consult with your healthcare provider or pharmacist about any medication questions or concerns you may have.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
