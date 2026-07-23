import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: 'easeOut' } }),
};

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      {/* Decorative sun rays */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '550px', height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,200,50,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-10%', width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,138,0,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '7rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '760px' }}>
          {/* 5-star badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <div className="five-star-badge" style={{ marginBottom: '1.75rem' }}>
              <span style={{ color: '#F59E0B', fontSize: '1rem' }}>★★★★★</span>
              5-Star Rated Business in Dadri
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={0.15}
            style={{
              fontFamily: 'Poppins', fontWeight: 900, color: '#ffffff',
              fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.15, marginBottom: '1.25rem',
            }}
          >
            Powering Homes with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF8A00, #FFD700)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Clean Solar Energy
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
            style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: '2.5rem', maxWidth: '580px', lineHeight: 1.7 }}>
            Authorized UTL Solar dealer in Dadri, UP. We supply & install solar panels, batteries, inverters, and complete solar systems — with expert guidance and after-sales support.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.45}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <a href="tel:+919873403889" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              📞 Call Now
            </a>
            <a
              href="https://wa.me/919873403889?text=Hi%2C%20I'm%20interested%20in%20solar%20panels%2Fbatteries%20%E2%80%94%20please%20share%20a%20free%20quote"
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              💬 Get Free Quote
            </a>
          </motion.div>

          {/* Quick Trust Badges */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.6}
            style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: '🏆', label: 'Authorized UTL Dealer' },
              { icon: '⚡', label: '500+ Installations' },
              { icon: '🛡️', label: 'Warranty Assured' },
            ].map(badge => (
              <div key={badge.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500,
              }}>
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
        <span>Scroll down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' }}
        />
      </motion.div>
    </section>
  );
}
