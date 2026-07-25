import { useState } from 'react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const MAP_SRC = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.553!2d77.5518!3d28.5506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceec000000001%3A0xabc123!2sRailway%20Rd%2C%20Dadri%2C%20Uttar%20Pradesh%20203207!5e0!3m2!1sen!2sin!4v1692000000000!5m2!1sen!2sin`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [feedback, setFeedback] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    // Phone number validation (must have at least 10 digits)
    const digitsOnly = form.phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setStatus('error');
      setFeedback('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setFeedback(data.message);
        setForm({ name: '', phone: '', message: '' });
      } else {
        setStatus('error');
        const detail = data?.detail;
        if (Array.isArray(detail)) {
          setFeedback(detail.map(d => d.msg).join(', '));
        } else {
          setFeedback(detail || 'Something went wrong. Please try again.');
        }
      }
    } catch {
      setStatus('error');
      setFeedback('Could not connect to server. Please call us directly at +91 98734 03889.');
    }
  };

  return (
    <section id="contact" className="section-pad" style={{ background: 'var(--bg-offwhite)' }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>
            📬 Get in Touch
          </div>
          <h2 className="section-heading">Contact Us</h2>
          <div style={{ marginTop: '0.5rem' }} />
          <p className="section-subtext" style={{ margin: '1.25rem auto 0', textAlign: 'center' }}>
            Reach out for a free consultation, product pricing, or to schedule a site visit.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem 2rem', boxShadow: '0 4px 32px rgba(11,61,145,0.10)' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.3rem', color: 'var(--navy-dark)', marginBottom: '1.75rem' }}>
                Send Us a Message
              </h3>
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="contact-name" style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-charcoal)', marginBottom: '0.5rem' }}>
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="contact-input"
                    minLength={2}
                    maxLength={100}
                  />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="contact-phone" style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-charcoal)', marginBottom: '0.5rem' }}>
                    Phone Number *
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Your mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    className="contact-input"
                    minLength={7}
                    maxLength={20}
                  />
                </div>
                <div style={{ marginBottom: '1.75rem' }}>
                  <label htmlFor="contact-message" style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-charcoal)', marginBottom: '0.5rem' }}>
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your requirements (e.g., 3kW rooftop system for a 3BHK house)"
                    value={form.message}
                    onChange={handleChange}
                    className="contact-input"
                    style={{ resize: 'vertical', minHeight: '110px' }}
                    minLength={5}
                    maxLength={1000}
                  />
                </div>

                {/* Feedback */}
                {status === 'success' && (
                  <div style={{
                    background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '12px',
                    padding: '1rem 1.25rem', marginBottom: '1.25rem', color: '#065F46', fontSize: '0.9rem',
                    display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                  }}>
                    <span>✅</span> <span>{feedback}</span>
                  </div>
                )}
                {status === 'error' && (
                  <div style={{
                    background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px',
                    padding: '1rem 1.25rem', marginBottom: '1.25rem', color: '#B91C1C', fontSize: '0.9rem',
                    display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                  }}>
                    <span>❌</span> <span>{feedback}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="contact-submit-btn"
                  disabled={status === 'loading'}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1 }}>
                  {status === 'loading' ? '⏳ Sending...' : '📨 Send Message'}
                </button>
              </form>

              {/* Direct contact */}
              <div style={{ marginTop: '1.75rem', paddingTop: '1.75rem', borderTop: '1px solid #F3F4F6' }}>
                <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-charcoal)', marginBottom: '0.75rem' }}>
                  Or reach us directly:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <a href="tel:+919873403889" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--navy-dark)', fontSize: '0.9rem', fontWeight: 600 }}>
                    📞 <span>+91 98734 03889</span>
                  </a>
                  <a
                    href="https://wa.me/919873403889?text=Hi%2C%20I%27m%20interested%20in%20solar%20panels%2Fbatteries"
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#25D366', fontSize: '0.9rem', fontWeight: 600 }}>
                    💬 <span>WhatsApp Chat</span>
                  </a>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    📍 <span>In front of Vishal Mega Mart & Petrol Pump, Railway Road, Dadri, UP 203207</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 32px rgba(11,61,145,0.12)', border: '1px solid rgba(11,61,145,0.08)' }}>
              <iframe
                title="Rishabh Enterprises UTL Solar Location"
                src={MAP_SRC}
                width="100%"
                height="460"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem', marginTop: '1rem',
              boxShadow: '0 2px 16px rgba(11,61,145,0.08)', border: '1px solid rgba(11,61,145,0.06)',
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>📍</span>
              <div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--navy-dark)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  Rishabh Enterprises UTL Solar
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  In front of Vishal Mega Mart &amp; Petrol Pump,<br />
                  Railway Road, Dadri,<br />
                  Uttar Pradesh 203207
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
