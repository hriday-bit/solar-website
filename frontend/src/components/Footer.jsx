import { motion } from 'framer-motion';

const QUICK_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Why Choose Us', href: '#why-us' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

const PRODUCTS_LIST = [
  'Solar Panels (Mono/Poly)',
  'Tubular Batteries',
  'Lithium Batteries',
  'Solar Inverters / PCUs',
  'Charge Controllers',
  'Complete Solar Systems',
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container" style={{ padding: '4rem 1.5rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', paddingBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF8A00, #F5A623)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', flexShrink: 0,
              }}>☀️</div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: '#fff', lineHeight: 1.2 }}>RISHABH ENTERPRISES</p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>UTL Solar</p>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
              Authorized dealer of UTL Solar products in Dadri, UP. Supplying and installing solar panels, batteries, inverters and complete systems since 2016.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {/* Social icons placeholder */}
              {[
                { label: 'WhatsApp', icon: '💬', href: 'https://wa.me/919873403889?text=Hi%2C%20I%27m%20interested%20in%20solar%20panels%2Fbatteries' },
                { label: 'Phone', icon: '📞', href: 'tel:+919873403889' },
              ].map(s => (
                <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer" aria-label={s.label}
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,138,0,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1.25rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FF8A00'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                  >
                    <span style={{ color: '#FF8A00', fontSize: '0.7rem' }}>▶</span> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1.25rem' }}>
              Our Products
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PRODUCTS_LIST.map(p => (
                <li key={p}>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#27AE60', fontSize: '0.7rem' }}>✓</span> {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1.25rem' }}>
              Contact Info
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }}>📍</span>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  In front of Vishal Mega Mart &amp; Petrol Pump,<br />
                  Railway Road, Dadri,<br />
                  Uttar Pradesh 203207
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>📞</span>
                <a href="tel:+919873403889" style={{ color: 'var(--solar-orange)', fontSize: '0.95rem', fontWeight: 600 }}>
                  +91 98734 03889
                </a>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💬</span>
                <a href="https://wa.me/919873403889?text=Hi%2C%20I%27m%20interested%20in%20solar%20panels%2Fbatteries"
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: '#25D366', fontSize: '0.9rem', fontWeight: 600 }}>
                  WhatsApp Now
                </a>
              </div>
            </div>

            {/* Rating badge */}
            <div style={{
              marginTop: '1.5rem', background: 'rgba(255,138,0,0.12)', border: '1px solid rgba(255,138,0,0.25)',
              borderRadius: '12px', padding: '0.75rem 1rem', display: 'inline-flex', gap: '0.5rem', alignItems: 'center',
            }}>
              <span style={{ color: '#F59E0B', fontSize: '1.1rem' }}>★★★★★</span>
              <span style={{ color: '#fff', fontSize: '0.85rem', fontFamily: 'Poppins', fontWeight: 600 }}>5-Star Rated</span>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Copyright */}
        <div style={{ paddingBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
            © {year} Rishabh Enterprises UTL Solar. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
            Authorized UTL Solar Dealer | Railway Road, Dadri, UP
          </p>
        </div>
      </div>
    </footer>
  );
}
