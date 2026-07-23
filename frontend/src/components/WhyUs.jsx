import { motion } from 'framer-motion';

const WHY_US_ITEMS = [
  {
    icon: '✅',
    title: 'Genuine UTL Products',
    description: 'Every product we sell is 100% original and sourced directly from UTL Solar — India\'s most trusted solar brand. No fakes, no substitutes.',
  },
  {
    icon: '🔧',
    title: 'Expert Installation',
    description: 'Our trained technicians handle the entire installation professionally — from site survey and design to wiring, mounting, and testing.',
  },
  {
    icon: '🛡️',
    title: 'After-Sales Service & Warranty',
    description: 'We stand behind every installation. Full product warranty, AMC options, and a dedicated service team available for post-installation support.',
  },
  {
    icon: '💰',
    title: 'Affordable Pricing & EMI',
    description: 'Competitive market pricing with flexible EMI options available. We also assist with government subsidy applications to reduce your upfront cost.',
  },
  {
    icon: '🏠',
    title: 'Trusted Local Dealer',
    description: 'Proudly serving Dadri, Greater Noida, Bulandshahr and neighbouring areas. We know the local grid conditions and customize solutions accordingly.',
  },
  {
    icon: '📋',
    title: 'Free Site Survey & Quote',
    description: 'Get a free, no-obligation rooftop assessment and accurate quote. We help you understand exactly how much you\'ll save before you commit.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

export default function WhyUs() {
  return (
    <section id="why-us" className="section-pad" style={{
      background: 'linear-gradient(160deg, #F0F4FF 0%, #F9FAFB 50%, #FFF8F0 100%)',
    }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>
            🌟 Why Choose Us
          </div>
          <h2 className="section-heading">Why Thousands Choose Rishabh Enterprises</h2>
          <div style={{ marginTop: '0.5rem' }} />
          <p className="section-subtext" style={{ margin: '1.25rem auto 0', textAlign: 'center' }}>
            We're more than a dealer — we're your long-term solar partner.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}
        >
          {WHY_US_ITEMS.map(item => (
            <motion.div key={item.title} variants={cardVariants}>
              <div className="why-card">
                <div className="why-icon-wrap" style={{ fontSize: '1.8rem' }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy-dark)', marginBottom: '0.5rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            marginTop: '3.5rem',
            background: 'linear-gradient(135deg, #0B3D91, #14213D)',
            borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'center',
            boxShadow: '0 16px 48px rgba(11,61,145,0.2)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌞</div>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#fff', marginBottom: '0.75rem' }}>
            Ready to Switch to Solar?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto 1.75rem', fontSize: '1rem' }}>
            Get a free consultation and custom quote for your home or business today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+919873403889" className="btn-primary">
              📞 Call Now
            </a>
            <a href="https://wa.me/919873403889?text=Hi%2C%20I%27m%20interested%20in%20a%20free%20solar%20quote"
              target="_blank" rel="noopener noreferrer" className="btn-secondary">
              💬 WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
