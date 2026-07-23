import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'About', href: 'about' },
  { label: 'Products', href: 'products' },
  { label: 'Why Us', href: 'why-us' },
  { label: 'Reviews', href: 'reviews' },
  { label: 'Gallery', href: 'gallery' },
  { label: 'Contact', href: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver — keeps hash & active link in sync as the user scrolls
  useEffect(() => {
    const sectionIds = NAV_LINKS.map(l => l.href);
    const observers = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
            // Update the URL hash silently without triggering a page jump
            history.replaceState(null, '', `#${id}`);
          }
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Smooth-scroll on nav link click and force-set hash
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update hash immediately so it doesn't bounce back to a previous section
      history.replaceState(null, '', `#${sectionId}`);
      setActiveSection(sectionId);
    }
    setDrawerOpen(false);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const linkStyle = (id) => ({
    fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.9rem',
    color: activeSection === id ? '#FF8A00' : 'rgba(255,255,255,0.9)',
    padding: '0.5rem 0.9rem',
    borderRadius: '8px', transition: 'all 0.2s ease',
    display: 'block', textDecoration: 'none',
    background: activeSection === id ? 'rgba(255,138,0,0.12)' : 'transparent',
  });

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo + Name */}
          <a href="#hero" onClick={e => handleNavClick(e, 'hero')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF8A00, #F5A623)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(255,138,0,0.4)',
              flexShrink: 0,
            }}>
              ☀️
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: '#fff', lineHeight: 1.2 }}>
                RISHABH ENTERPRISES
              </p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                UTL Solar Authorized Dealer
              </p>
            </div>
          </a>

          {/* Desktop Links */}
          <ul style={{ display: 'flex', gap: '0.25rem', listStyle: 'none', alignItems: 'center' }}
            className="desktop-nav">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={`#${link.href}`}
                  style={linkStyle(link.href)}
                  onClick={e => handleNavClick(e, link.href)}
                  onMouseEnter={e => { if (activeSection !== link.href) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { if (activeSection !== link.href) e.currentTarget.style.background = 'transparent'; }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="tel:+919873403889" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem' }}>
                📞 Call Now
              </a>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            id="hamburger-btn"
            onClick={() => setDrawerOpen(true)}
            className="hamburger-btn"
            aria-label="Open menu"
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px', padding: '0.6rem', cursor: 'pointer',
              display: 'none', flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center',
              width: '44px', height: '44px',
            }}
          >
            <span style={{ width: '20px', height: '2px', background: '#fff', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '20px', height: '2px', background: '#fff', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '20px', height: '2px', background: '#fff', borderRadius: '2px', display: 'block' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              className="drawer-overlay open"
              onClick={closeDrawer}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
              key="drawer"
              style={{
                position: 'fixed', top: 0, right: 0, height: '100vh', width: '280px',
                background: 'linear-gradient(180deg, #0B3D91, #14213D)',
                zIndex: 2000, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
              }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>Menu</span>
                <button onClick={closeDrawer} aria-label="Close menu"
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', color: '#fff', fontSize: '1.2rem' }}>
                  ✕
                </button>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.li key={link.href}
                    initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 + 0.1 }}>
                    <a href={`#${link.href}`} onClick={e => handleNavClick(e, link.href)}
                      style={{
                        fontFamily: 'Poppins', fontWeight: 500,
                        color: activeSection === link.href ? '#FF8A00' : 'rgba(255,255,255,0.9)',
                        padding: '0.85rem 1rem', display: 'block', borderRadius: '10px', fontSize: '1rem',
                        transition: 'background 0.2s', textDecoration: 'none',
                        background: activeSection === link.href ? 'rgba(255,138,0,0.15)' : 'transparent',
                      }}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="tel:+919873403889" className="btn-primary" style={{ justifyContent: 'center', textAlign: 'center' }}>
                  📞 Call Now
                </a>
                <a href="https://wa.me/919873403889?text=Hi%2C%20I'm%20interested%20in%20solar%20panels%2Fbatteries"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    background: '#25D366', color: '#fff', fontFamily: 'Poppins', fontWeight: 600,
                    padding: '0.75rem 1.75rem', borderRadius: '50px', textAlign: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    textDecoration: 'none',
                  }}>
                  💬 WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
