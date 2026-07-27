import { motion } from 'framer-motion';

const GALLERY_ITEMS = [
  { id: 1, label: 'Rooftop Installation – Dadri', img: '/gallery/rooftop.jpg' },
  { id: 2, label: 'Commercial Solar Plant',        img: '/gallery/commercial.jpg' },
  { id: 3, label: 'Agricultural Solar Pump',       img: '/gallery/agricultural.jpg' },
  { id: 4, label: 'Off-Grid Battery Setup',        img: '/gallery/battery.jpg' },
  { id: 5, label: 'Solar Panel Array – 5kW',       img: '/gallery/array5kw.jpg' },
  { id: 6, label: 'UTL PCU Installation',          img: '/gallery/pcu.jpg' },
  { id: 7, label: 'Net Metering Setup',            img: '/gallery/netmeter.jpg' },
  { id: 8, label: 'Solar Water Heater',            img: '/gallery/heater.jpg' },
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
              <div style={{
                borderRadius: '16px', overflow: 'hidden',
                position: 'relative', aspectRatio: '4/3',
                cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}>
                {/* Real Photo */}
                <img
                  src={item.img}
                  alt={item.label}
                  loading="lazy"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                {/* Label overlay at bottom */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(11,61,145,0.92) 0%, transparent 100%)',
                  padding: '2rem 1rem 0.85rem',
                  pointerEvents: 'none',
                }}>
                  <span style={{
                    color: '#fff', fontFamily: 'Poppins',
                    fontWeight: 600, fontSize: '0.9rem',
                  }}>
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
