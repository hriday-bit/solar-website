import { motion } from 'framer-motion';

// Gallery items with solar installation descriptions (placeholder colored panels)
const GALLERY_ITEMS = [
  { id: 1, label: 'Rooftop Installation – Dadri', color: 'linear-gradient(135deg, #1a3a6e, #0B3D91)', emoji: '🏠' },
  { id: 2, label: 'Commercial Solar Plant', color: 'linear-gradient(135deg, #7A3500, #FF8A00)', emoji: '🏭' },
  { id: 3, label: 'Agricultural Solar Pump', color: 'linear-gradient(135deg, #1a5c36, #27AE60)', emoji: '🌾' },
  { id: 4, label: 'Off-Grid Battery Setup', color: 'linear-gradient(135deg, #3d1a7a, #8B5CF6)', emoji: '🔋' },
  { id: 5, label: 'Solar Panel Array – 5kW', color: 'linear-gradient(135deg, #0B3D91, #2563EB)', emoji: '⚡' },
  { id: 6, label: 'UTL PCU Installation', color: 'linear-gradient(135deg, #5c3a00, #F5A623)', emoji: '🔌' },
  { id: 7, label: 'Net Metering Setup', color: 'linear-gradient(135deg, #14213D, #0B3D91)', emoji: '📊' },
  { id: 8, label: 'Solar Water Heater', color: 'linear-gradient(135deg, #7A0000, #DC2626)', emoji: '♨️' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Gallery() {
  return (
    <section id="gallery" className="section-pad" style={{
      background: 'linear-gradient(160deg, #F0F4FF 0%, #F9FAFB 100%)',
    }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>
            📸 Project Gallery
          </div>
          <h2 className="section-heading">Our Installation Work</h2>
          <div style={{ marginTop: '0.5rem' }} />
          <p className="section-subtext" style={{ margin: '1.25rem auto 0', textAlign: 'center' }}>
            A glimpse of solar installations we've completed across Dadri and surrounding regions.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}
        >
          {GALLERY_ITEMS.map(item => (
            <motion.div key={item.id} variants={itemVariants}>
              <div className="gallery-img" style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative', aspectRatio: '4/3', cursor: 'pointer' }}>
                {/* Placeholder solar visual */}
                <div style={{
                  width: '100%', height: '100%', background: item.color,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '0.75rem', transition: 'transform 0.4s ease',
                  position: 'relative',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {/* Solar panel grid overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px)',
                  }} />
                  <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))', zIndex: 1 }}>{item.emoji}</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontFamily: 'Poppins', fontWeight: 500, textAlign: 'center', padding: '0 1rem', zIndex: 1 }}>
                    {item.label}
                  </span>
                </div>
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(11,61,145,0.85) 0%, transparent 60%)',
                  opacity: 0, transition: 'opacity 0.3s ease',
                  display: 'flex', alignItems: 'flex-end', padding: '1rem',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <span style={{ color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem' }}>
                    {item.label}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            Want to see your home powered by solar? Let's make it happen.
          </p>
          <a href="https://wa.me/919873403889?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20solar%20installation%20for%20my%20home"
            target="_blank" rel="noopener noreferrer" className="btn-primary">
            💬 Request a Site Visit
          </a>
        </motion.div>
      </div>
    </section>
  );
}
