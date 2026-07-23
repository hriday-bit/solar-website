import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const PRODUCT_ICONS = {
  solar_panel_mono: '🔆', solar_panel_poly: '☀️', battery_tubular: '🔋',
  battery_lithium: '⚡', inverter: '🔌', charge_controller: '🎛️',
  system_ongrid: '🏭', system_offgrid: '🏕️', system_hybrid: '🌐',
};

const WA_URL = 'https://wa.me/919873403889?text=Hi%2C%20I%27m%20interested%20in%20solar%20panels%2Fbatteries%20%E2%80%94%20please%20share%20details%20and%20pricing.';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.like_count || 0);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liked || liking) return;
    setLiking(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/${product.id}/like`, { method: 'POST' });
      const data = await res.json();
      setLikeCount(data.like_count);
      setLiked(true);
    } catch { }
    setLiking(false);
  };

  return (
    <motion.div variants={cardVariants} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="product-card" style={{ position: 'relative' }}>
        {/* Best Seller Badge */}
        {product.is_featured && (
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'linear-gradient(135deg, #FF8A00, #F5A623)',
            color: '#fff', fontSize: '0.7rem', fontFamily: 'Poppins', fontWeight: 700,
            padding: '0.25rem 0.65rem', borderRadius: '50px', letterSpacing: '0.04em',
            boxShadow: '0 4px 12px rgba(255,138,0,0.4)',
          }}>
            ⭐ Best Seller
          </div>
        )}

        <div className="category-badge">{product.category}</div>
        <div className="product-icon-wrap">
          <span>{PRODUCT_ICONS[product.icon_key] || '☀️'}</span>
        </div>
        <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy-dark)', marginBottom: '0.75rem' }}>
          {product.name}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, flexGrow: 1, marginBottom: '1.25rem' }}>
          {product.description}
        </p>
        {product.price && (
          <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: 'var(--solar-amber)', marginBottom: '1rem' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ alignSelf: 'flex-start', flex: 1, justifyContent: 'center', textAlign: 'center' }}>
            💬 Enquire Now
          </a>
          <button
            onClick={handleLike}
            title="I'm Interested"
            style={{
              padding: '0.6rem 0.9rem', borderRadius: '50px', border: `1.5px solid ${liked ? '#EF4444' : '#E5E7EB'}`,
              background: liked ? '#FEF2F2' : '#F9FAFB', cursor: liked ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem',
              color: liked ? '#EF4444' : '#9CA3AF',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            {liked ? '❤️' : '🤍'} {likeCount > 0 ? likeCount : ''}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then(res => { if (!res.ok) throw new Error('Failed to load products'); return res.json(); })
      .then(data => { setProducts(data || []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <section id="products" className="section-pad" style={{ background: 'var(--bg-offwhite)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>🛒 Our Products</div>
          <h2 className="section-heading">Quality Solar Products</h2>
          <div style={{ marginTop: '0.5rem' }} />
          <p className="section-subtext" style={{ margin: '1.25rem auto 0', textAlign: 'center' }}>
            From individual components to complete solar systems — everything you need to go solar, all under one roof.
          </p>
        </motion.div>

        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}><div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div><p>Loading products...</p></div>}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#FEF2F2', borderRadius: '16px', border: '1px solid #FCA5A5', color: '#B91C1C', maxWidth: '500px', margin: '0 auto' }}>
            <p style={{ fontWeight: 600 }}>Couldn't load products</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Make sure the backend server is running at <code>{API_BASE}</code></p>
          </div>
        )}

        {!loading && !error && (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.75rem' }}>
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }} style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Need help choosing the right system?</p>
            <a href="tel:+919873403889" className="btn-primary" style={{ fontSize: '1rem' }}>📞 Talk to an Expert</a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
