import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUp({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const STATS = [
  { value: 8, suffix: '+', label: 'Years in Business', icon: '📅' },
  { value: 500, suffix: '+', label: 'Happy Customers', icon: '😊' },
  { value: 450, suffix: '+', label: 'Installations Done', icon: '🏠' },
  { value: 5, suffix: '★', label: 'Customer Rating', icon: '⭐' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function About() {
  return (
    <section id="about" style={{ background: 'linear-gradient(135deg, #0B3D91, #14213D)', padding: '5rem 0' }}>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ color: 'var(--solar-orange)', justifyContent: 'center' }}>
              ⚡ About Us
            </div>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#ffffff', marginBottom: '1rem' }}>
              Dadri's Most Trusted Solar Experts
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.8 }}>
              Rishabh Enterprises UTL Solar is an <strong style={{ color: 'var(--solar-orange)' }}>authorized UTL dealer</strong> serving
              Dadri, Greater Noida, Bulandshahr and surrounding areas. We offer genuine solar products with professional
              installation, government subsidy assistance, and comprehensive after-sales service.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <div className="stat-card">
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: 'var(--solar-orange)', lineHeight: 1.1 }}>
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', fontWeight: 500, marginTop: '0.25rem' }}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact strip */}
          <motion.div variants={itemVariants} style={{ marginTop: '3rem', textAlign: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px', padding: '1.5rem 2rem', display: 'inline-flex',
              flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>
                <span style={{ fontSize: '1.4rem' }}>📍</span>
                <div>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#fff' }}>Find Us</div>
                  <div style={{ fontSize: '0.85rem' }}>In front of Vishal Mega Mart, Railway Road, Dadri, UP 203207</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>
                <span style={{ fontSize: '1.4rem' }}>📞</span>
                <div>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#fff' }}>Call Us</div>
                  <a href="tel:+919873403889" style={{ fontSize: '0.9rem', color: 'var(--solar-orange)', fontWeight: 600 }}>
                    +91 98734 03889
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
