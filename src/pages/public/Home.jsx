import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      borderRadius: '16px',
      maxWidth: '600px',
      width: '100%',
      padding: '30px',
      boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
      position: 'relative',
    },
    modalClose: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#7f8c8d',
    },
    modalTitle: {
      fontSize: '1.8rem',
      marginBottom: '15px',
      color: '#2c3e50',
      fontWeight: '700',
    },
    modalText: {
      color: '#34495e',
      lineHeight: '1.6',
      marginBottom: '20px',
    }
  };

  const blogPosts = [
    {
      image: ac1,
      title: 'Understanding Common Medications',
      text: 'Learn about the most prescribed drugs, their uses, side effects, and how to take them safely. Knowledge is key to better health management.',
      details: 'This article breaks down the most common drug classes, how they work in the body, and what to look for when taking them. We also highlight best practices for adherence and when to seek medical help.'
    },
    {
      image: ac2,
      title: 'The Future of Pharmacy Technology',
      text: 'Explore how digital innovations are revolutionizing pharmacy services, from online prescriptions to AI-powered drug discovery.',
      details: 'From telehealth consults to blockchain for prescription security, technology is reshaping the pharmacy experience. Learn what’s next and how patients can benefit from these advances.'
    },
    {
      image: ac3,
      title: 'Nutrition and Drug Interactions',
      text: 'Discover how your diet can affect medication effectiveness and learn about foods that may interact with common drugs.',
      details: 'Certain foods can change how medications are absorbed or metabolized. This guide covers common interactions (e.g., grapefruit, dairy, leafy greens) and practical tips to stay safe.'
    },
    {
      image: ac4,
      title: 'Mental Health Medications Guide',
      text: 'A comprehensive overview of psychiatric medications, their mechanisms, and the importance of professional medical guidance.',
      details: 'Mental health medications span many classes like SSRIs, mood stabilizers, and anxiolytics. Learn how they work, common side effects, and why regular monitoring matters.'
    },
    {
      image: ac5,
      title: 'Generic vs Brand Name Drugs',
      text: 'Understanding the differences, cost savings, and FDA regulations surrounding generic medications in modern healthcare.',
      details: 'Generics contain the same active ingredients as brand-name drugs but at a lower cost. This article explains how they are approved, why they are safe, and when brand names may still be preferable.'
    },
    {
      image: ac6,
      title: 'Preventive Healthcare and Vaccines',
      text: 'Stay informed about vaccination schedules, preventive medications, and how they contribute to long-term health.',
      details: 'Prevention is the cornerstone of good health. Learn about vaccine schedules, boosters, and lifestyle steps that support long-term wellness.'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Your Health, Our Priority</h1>
        <p style={styles.heroSubtitle}>
          Discover comprehensive information about medications, health tips, and pharmacy services in our modern health encyclopedia.
        </p>
        <div style={styles.heroButtons}>
          <button 
            style={{...styles.button, ...styles.primaryButton}}
            onClick={() => handleNavigation('/pharmacies')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Find Pharmacies
          </button>
          <button 
            style={{...styles.button, ...styles.secondaryButton}}
            onClick={() => handleNavigation('/login')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Login
          </button>
          <button 
            style={{...styles.button, ...styles.secondaryButton}}
            onClick={() => handleNavigation('/register')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Register
          </button>
        </div>
      </div>

      {/* Blog/Encyclopedia Section */}
      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Health & Drug Encyclopedia</h2>
        <div style={styles.blogGrid}>
          {blogPosts.map((post, index) => (
            <div 
              key={index} 
              style={styles.blogCard}
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
                <h3 style={styles.blogTitle}>{post.title}</h3>
                <p style={styles.blogText}>{post.text}</p>
                <button
                  style={styles.cardButton}
                  onClick={() => openPostDetail(post)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Read more
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPost && (
          <div style={styles.modalOverlay} onClick={closePostDetail}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button style={styles.modalClose} onClick={closePostDetail} aria-label="Close">
                ×
              </button>
              <h2 style={styles.modalTitle}>{selectedPost.title}</h2>
              <p style={styles.modalText}>{selectedPost.details}</p>
              <button
                style={{ ...styles.cardButton, width: '100%' }}
                onClick={closePostDetail}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;