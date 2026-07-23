import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function StarRating({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/reviews`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load reviews');
        return res.json();
      })
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section id="reviews" className="section-pad" style={{ background: 'var(--bg-offwhite)' }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>
            💬 Customer Reviews
          </div>
          <h2 className="section-heading">What Our Customers Say</h2>
          <div style={{ marginTop: '0.5rem' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
            <span style={{ color: '#F59E0B', fontSize: '1.5rem', letterSpacing: '2px' }}>★★★★★</span>
            <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', color: 'var(--navy-dark)' }}>
              5.0 / 5.0
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rated by 500+ customers</span>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading reviews...
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Could not load reviews. Backend may not be running.
          </div>
        )}

        {/* Review Cards */}
        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
          >
            {reviews.map(review => (
              <motion.div key={review.id} variants={cardVariants}>
                <div className="review-card">
                  <StarRating rating={review.rating} />
                  <p style={{ color: 'var(--text-charcoal)', fontSize: '0.95rem', lineHeight: 1.7, margin: '1rem 0', fontStyle: 'italic' }}>
                    "{review.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #F3F4F6', paddingTop: '1rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--navy-deep), var(--solar-amber))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem',
                      flexShrink: 0,
                    }}>
                      {review.reviewer_name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.95rem', color: 'var(--navy-dark)' }}>
                        {review.reviewer_name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        📍 {review.location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            Join hundreds of satisfied customers. Get your free quote today!
          </p>
          <a href="#contact" className="btn-primary">Get Free Quote →</a>
        </motion.div>
      </div>
    </section>
  );
}
